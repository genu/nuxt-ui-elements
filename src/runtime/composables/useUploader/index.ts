import mitt from "mitt"
import { computed, readonly, ref } from "vue"
import type {
  PluginFn,
  UploaderEvents,
  UploadFile,
  UploadOptions,
  UploadStatus,
  PluginLifecycleStage,
  FileError,
  ValidationHook,
  ProcessingHook,
  SetupHook,
  PluginContext,
  UploadFn,
  GetRemoteFileFn,
} from "./types"
import { ValidatorAllowedFileTypes, ValidatorMaxfileSize, ValidatorMaxFiles } from "./validators"
import { PluginThumbnailGenerator, PluginImageCompressor } from "./plugins"

/**
 * Get file extension from filename
 */
function getExtension(fullFileName: string): string {
  const lastDot = fullFileName.lastIndexOf(".")

  if (lastDot === -1 || lastDot === fullFileName.length - 1) {
    throw new Error("Invalid file name")
  }

  return fullFileName.slice(lastDot + 1).toLocaleLowerCase()
}

const defaultOptions: UploadOptions = {
  plugins: [],
  maxFileSize: false,
  allowedFileTypes: false,
  maxFiles: false,
  thumbnails: false,
  imageCompression: false,
  autoProceed: false,
}

export const useUploader = <TUploadResult = any>(_options: UploadOptions = {}) => {
  const options = { ...defaultOptions, ..._options }
  const files = ref<UploadFile<TUploadResult>[]>([])
  const emitter = mitt<UploaderEvents<TUploadResult>>()
  const status = ref<UploadStatus>("waiting")

  let uploadFn: UploadFn = async () => {
    throw new Error("No uploader configured")
  }

  let getRemoteFileFn: GetRemoteFileFn = async () => {
    throw new Error("Function to get remote file not configured")
  }

  const totalProgress = computed(() => {
    if (files.value.length === 0) return 0
    const sum = files.value.reduce((acc, file) => acc + file.progress.percentage, 0)

    return Math.round(sum / files.value.length)
  })

  /**
   * Utilities
   */

  const addPlugin = <TOptions>(fn: PluginFn<TOptions>, pluginOptions: TOptions) => {
    const plugin = fn({ files: files.value, options }, pluginOptions)

    options.plugins?.push(plugin)
  }

  /**
   * Add built-in plugins based on options
   */

  // Validators - only add if explicitly configured
  if (options.maxFiles !== false && options.maxFiles !== undefined) {
    addPlugin(ValidatorMaxFiles, { maxFiles: options.maxFiles })
  }

  if (options.maxFileSize !== false && options.maxFileSize !== undefined) {
    addPlugin(ValidatorMaxfileSize, { maxFileSize: options.maxFileSize })
  }

  if (options.allowedFileTypes !== false && options.allowedFileTypes !== undefined && options.allowedFileTypes.length > 0) {
    addPlugin(ValidatorAllowedFileTypes, { allowedFileTypes: options.allowedFileTypes })
  }

  // Processors - only add if explicitly enabled
  if (options.thumbnails !== false && options.thumbnails !== undefined) {
    const thumbOpts = options.thumbnails === true ? {} : options.thumbnails || {}
    addPlugin(PluginThumbnailGenerator, {
      width: thumbOpts.width ?? 128,
      height: thumbOpts.height ?? 128,
      quality: thumbOpts.quality ?? 1,
    })
  }

  if (options.imageCompression !== false && options.imageCompression !== undefined) {
    const compressionOpts = options.imageCompression === true ? {} : options.imageCompression || {}
    addPlugin(PluginImageCompressor, {
      maxWidth: compressionOpts.maxWidth ?? 1920,
      maxHeight: compressionOpts.maxHeight ?? 1920,
      quality: compressionOpts.quality ?? 0.85,
      outputFormat: compressionOpts.outputFormat ?? "auto",
      minSizeToCompress: compressionOpts.minSizeToCompress ?? 100000,
      preserveMetadata: compressionOpts.preserveMetadata ?? true,
    })
  }

  /**
   * Default events
   */

  emitter.on("upload:progress", ({ file, progress }) => {
    updateFile(file.id, { progress: { percentage: progress } })
  })

  /**
   * Callbacks
   */

  const updateFile = (fileId: string, updatedFile: Partial<UploadFile<TUploadResult>>) => {
    files.value = files.value.map((file) => (file.id === fileId ? ({ ...file, ...updatedFile } as UploadFile) : file))
  }

  /**
   * Upload function called for each file.
   *
   * @param fn - The function to call when uploading a file. This function receives a file and a progress callback.
   *             It should return a promise that resolves with the upload URL of the uploaded file.
   *             @example
   *             const uploadFn: UploadFn = async (file, onProgress) => {
   *               // Perform the upload and call onProgress with the upload progress percentage
   *               onProgress(50); // 50% progress
   *               return "https://example.com/uploaded-file-url"; // Return the upload URL
   *             }
   * @returns void
   */
  const onUpload = (fn: UploadFn<TUploadResult>) => {
    uploadFn = fn
  }

  /**
   * @param fn - The function to call when generating a remote preview URL for a file.
   */
  const onGetRemoteFile = (fn: GetRemoteFileFn) => {
    getRemoteFileFn = fn
  }

  const initializeExistingFiles = async (initialFiles: Array<Partial<UploadFile>>) => {
    const initializedfiles = await Promise.all(
      initialFiles.map(async (file) => {
        // If file.id is empty or undefined, skip this file because we can't get the remote file attributes
        if (!file.id) return null

        const { mimeType, size, remoteUrl } = await getRemoteFileFn(file.id!)

        const existingFile: UploadFile = {
          ...file,
          id: file.id!,
          name: file.id!,
          data: new Blob(),
          status: "complete",
          progress: { percentage: 100 },
          meta: {},
          size,
          mimeType,
          remoteUrl,
        }

        const processedFile = await runPluginStage("process", existingFile)

        // If there was a processing error, skip this file
        if (!processedFile) return null

        return processedFile
      }),
    )

    // Filter out files that failed to initialize
    const filteredFiles = initializedfiles.filter((f) => f !== null) as UploadFile[]

    files.value = [...filteredFiles]
  }

  const addFile = async (file: File) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const extension = getExtension(file.name)

    const uploadFile: UploadFile = {
      id: `${id}.${extension}`,
      progress: {
        percentage: 0,
      },
      name: file.name,
      size: file.size,
      status: "waiting",
      mimeType: file.type,
      data: file,
      meta: {
        extension,
      },
    }

    // Before add (includes validation)
    const validatedFile = await runPluginStage("validate", uploadFile)
    if (!validatedFile) return null

    // After add hooks
    const processedFile = await runPluginStage("process", validatedFile)

    if (!processedFile) return null

    // If we got here, all hooks passed
    files.value.push(processedFile)
    emitter.emit("file:added", processedFile)

    if (options.autoProceed) {
      upload()
    }

    return processedFile
  }

  const addFiles = (newFiles: File[]) => {
    return Promise.all(newFiles.map((file) => addFile(file)))
  }

  const removeFile = (fileId: string) => {
    const file = files.value.find((f) => f.id === fileId)
    if (!file) return

    files.value = files.value.filter((f) => f.id !== fileId)
    emitter.emit("file:removed", file as Readonly<UploadFile<TUploadResult>>)
  }

  const removeFiles = (fileIds: string[]) => {
    const removedFiles = files.value.filter((f) => fileIds.includes(f.id))
    files.value = files.value.filter((f) => !fileIds.includes(f.id))

    removedFiles.forEach((file) => {
      emitter.emit("file:removed", file as Readonly<UploadFile<TUploadResult>>)
    })

    return removedFiles
  }

  const clearFiles = () => {
    const allFiles = [...files.value]
    files.value = []

    allFiles.forEach((file) => {
      emitter.emit("file:removed", file as Readonly<UploadFile<TUploadResult>>)
    })

    return allFiles
  }

  const reorderFile = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) {
      if (import.meta.dev) {
        console.warn("Cannot reorder file to the same index")
      }
      return
    }

    if (oldIndex < 0 || oldIndex >= files.value.length || newIndex < 0 || newIndex >= files.value.length) {
      if (import.meta.dev) {
        console.warn(`Cannot reorder file from ${oldIndex} to ${newIndex} since it is out of bounds`)
      }

      return
    }

    const filesCopy = [...files.value]
    const [movedFile] = filesCopy.splice(oldIndex, 1)
    filesCopy.splice(newIndex, 0, movedFile!)

    files.value = filesCopy

    emitter.emit("files:reorder", { oldIndex, newIndex })
  }

  const getFile = (fileId: string) => {
    return files.value.find((f) => f.id === fileId)
  }

  const upload = async () => {
    const filesToUpload = files.value.filter((f) => f.status === "waiting")

    emitter.emit("upload:start", filesToUpload as Array<Readonly<UploadFile<TUploadResult>>>)

    for (const file of filesToUpload) {
      try {
        // Upload
        updateFile(file.id, { status: "uploading" })

        const onProgress = (progress: number) => {
          updateFile(file.id, { progress: { percentage: progress } })
          emitter.emit("upload:progress", { file, progress } as {
            file: Readonly<UploadFile<TUploadResult>>
            progress: number
          })
        }
        const uploadResult = await uploadFn(file, onProgress)

        updateFile(file.id, { status: "complete", uploadResult })
      } catch (err) {
        const error = {
          message: err instanceof Error ? err.message : "Unknown upload error",
          details: {
            fileName: file.name,
            fileSize: file.size,
            timestamp: new Date().toISOString(),
          },
        }
        updateFile(file.id, { status: "error", error })
        emitter.emit("file:error", { file, error } as { file: Readonly<UploadFile<TUploadResult>>; error: FileError })
      }
    }

    const completed = files.value.filter((f) => f.status === "complete")
    emitter.emit("upload:complete", completed as Array<Required<Readonly<UploadFile<TUploadResult>>>>)
  }

  const reset = () => {
    files.value = []
  }

  // Add this helper function before runPluginStage
  const callPluginHook = async (
    hook: ValidationHook | ProcessingHook | SetupHook,
    stage: PluginLifecycleStage,
    file: UploadFile | undefined,
    context: PluginContext,
  ) => {
    switch (stage) {
      case "validate":
        await (hook as ValidationHook)(file!, context)
        return file!
      case "process":
      case "complete":
        if (!file) throw new Error("File is required for this hook type")

        await (hook as ProcessingHook)(file, context)

        return file
      default:
        return file
    }
  }

  // Replace the existing runPluginStage function
  async function runPluginStage(stage: PluginLifecycleStage, file?: UploadFile) {
    if (!options.plugins) return file

    const context = { files: files.value, options }
    let currentFile = file

    for (const plugin of options.plugins) {
      const hook = plugin.hooks[stage]
      if (hook) {
        try {
          const result = await callPluginHook(hook, stage, currentFile, context)

          if (!result) continue

          if (currentFile && "id" in result) {
            currentFile = result as UploadFile
          }
        } catch (error) {
          if (currentFile) {
            emitter.emit("file:error", { file: currentFile, error: error as FileError })
          }
          console.error(`Plugin ${plugin.id} ${stage} hook error:`, error)
          return null
        }
      }
    }

    return currentFile
  }

  return {
    // State
    files: readonly(files),
    totalProgress,

    // Core Methods
    addFiles,
    addFile,
    onGetRemoteFile,
    onUpload,
    removeFile,
    removeFiles,
    clearFiles,
    reorderFile,
    getFile,
    upload,
    reset,
    status,
    updateFile,
    initializeExistingFiles,

    // Utilities
    addPlugin,

    // Events
    on: emitter.on,
  }
}

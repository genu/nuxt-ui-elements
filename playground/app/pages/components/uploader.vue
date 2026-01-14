<script setup lang="ts">
  import type { UploadFile } from "#ui-elements"
  import {
    PluginAzureDataLake,
    ValidatorMaxFiles,
    ValidatorMaxFileSize,
    ValidatorAllowedFileTypes,
    PluginThumbnailGenerator,
    PluginImageCompressor,
  } from "#ui-elements"

  // Storage mode toggle
  const useStoragePlugin = ref(false)

  // Configuration state
  const config = ref({
    maxFiles: 5,
    maxFileSize: 100 * 1024 * 1024, // 100MB (to support videos)
    allowedFileTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"],
    thumbnails: true,
    imageCompression: false,
    autoProceed: false,
    thumbnailMaxWidth: 200,
    thumbnailMaxHeight: 200,
    videoCaptureTime: 1,
  })

  // Create uploader with new storage/processing plugin separation
  const createUploader = () => {
    const processingPlugins = []

    // Validators
    if (config.value.maxFiles) {
      processingPlugins.push(ValidatorMaxFiles({ maxFiles: config.value.maxFiles }))
    }

    if (config.value.maxFileSize) {
      processingPlugins.push(ValidatorMaxFileSize({ maxFileSize: config.value.maxFileSize }))
    }

    if (config.value.allowedFileTypes.length > 0) {
      processingPlugins.push(ValidatorAllowedFileTypes({ allowedFileTypes: config.value.allowedFileTypes }))
    }

    // Thumbnails (with improved API)
    if (config.value.thumbnails) {
      processingPlugins.push(
        PluginThumbnailGenerator({
          maxWidth: config.value.thumbnailMaxWidth,
          maxHeight: config.value.thumbnailMaxHeight,
          quality: 0.7,
          videoCaptureTime: config.value.videoCaptureTime,
        }),
      )
    }

    // Image Compression
    if (config.value.imageCompression) {
      processingPlugins.push(
        PluginImageCompressor({
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.85,
          outputFormat: "auto",
          minSizeToCompress: 100000,
          preserveMetadata: true,
        }),
      )
    }

    // Storage plugin (NEW: separate from processing plugins)
    const storagePlugin = useStoragePlugin.value
      ? PluginAzureDataLake({
          sasURL: "mock://azure-storage",
          path: "uploads/playground",
          metadata: { source: "playground" },
          retries: 3,
          retryDelay: 1000,
        })
      : undefined

    return useUploadManager({
      autoProceed: config.value.autoProceed,
      storage: storagePlugin, // NEW: separate storage option
      plugins: processingPlugins,
    })
  }

  // Initialize uploader
  let uploader = createUploader()
  let { files, totalProgress, addFiles, removeFile, clearFiles, upload, onUpload, on } = uploader

  // Recreate uploader when config changes
  watch([useStoragePlugin, () => config.value.thumbnails, () => config.value.imageCompression], () => {
    uploader = createUploader()
    const newUploader = uploader
    files = newUploader.files
    totalProgress = newUploader.totalProgress
    addFiles = newUploader.addFiles
    removeFile = newUploader.removeFile
    clearFiles = newUploader.clearFiles
    upload = newUploader.upload
    onUpload = newUploader.onUpload
    on = newUploader.on

    setupUploader()
  })

  // Configure upload handler (only used when storage plugin is disabled)
  const setupUploader = () => {
    if (!useStoragePlugin.value) {
      onUpload(async (file: UploadFile, onProgress: (progress: number) => void) => {
        // Simulate upload with progress
        return new Promise((resolve) => {
          let progress = 0
          const interval = setInterval(() => {
            progress += 10
            onProgress(progress)

            if (progress >= 100) {
              clearInterval(interval)
              resolve({ url: `https://example.com/uploads/${file.id}` })
            }
          }, 200)
        })
      })
    }

    setupEventListeners()
  }

  // Get toast for notifications
  const toast = useToast()

  // Setup event listeners
  const setupEventListeners = () => {
    on("file:added", (file) => {
      console.log(`✅ File added: ${file.name} (${formatFileSize(file.size)})`)
      if (file.meta.thumbnail) {
        console.log(`📸 Thumbnail generated for ${file.name}`)
      }
    })

    on("file:removed", (file) => {
      console.log(`🗑️ File removed: ${file.name}`)
    })

    on("file:error", ({ file, error }) => {
      console.error(`❌ Error with ${file.name}:`, error.message)

      // Show toast notification for validation errors
      toast.add({
        title: "File Error",
        description: `${file.name}: ${error.message}`,
        color: "error",
        timeout: 5000,
      })
    })

    on("upload:start", () => {
      console.log("🚀 Upload started")
    })

    on("upload:complete", (files) => {
      console.log("✨ Upload complete:", files.length, "files")
    })

    // Image compression events
    on("image-compressor:start", (payload: any) => {
      console.log("[Compression] Started for", payload.file.name)
    })

    on("image-compressor:complete", (payload: any) => {
      console.log("[Compression] ✅ Completed", payload.file.name, payload.compressionRatio + "% saved")
    })

    on("image-compressor:skip", (payload: any) => {
      console.log("[Compression] ⏭️ Skipped", payload.file.name, "-", payload.reason)
    })
  }

  setupUploader()

  // File input handler
  const fileInput = ref<HTMLInputElement>()

  const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
      const fileCount = input.files.length
      const addedFiles = await addFiles(Array.from(input.files))

      // Show summary toast
      const failedCount = fileCount - addedFiles.length
      if (failedCount === 0 && addedFiles.length > 0) {
        toast.add({
          title: "Files Added",
          description: `Successfully added ${addedFiles.length} file${addedFiles.length > 1 ? "s" : ""}`,
          color: "success",
          timeout: 3000,
        })
      } else if (failedCount > 0 && addedFiles.length > 0) {
        toast.add({
          title: "Partial Success",
          description: `Added ${addedFiles.length} file${addedFiles.length > 1 ? "s" : ""}, ${failedCount} failed`,
          color: "warning",
          timeout: 3000,
        })
      }
    }
    // Reset input to allow selecting the same file again
    if (input) input.value = ""
  }

  const triggerFileSelect = () => {
    fileInput.value?.click()
  }

  // Utility functions
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + (sizes[i] ?? "Bytes")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "neutral"
      case "uploading":
        return "primary"
      case "complete":
        return "success"
      case "error":
        return "error"
      default:
        return "neutral"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting":
        return "i-heroicons-clock"
      case "uploading":
        return "i-heroicons-arrow-up-tray"
      case "complete":
        return "i-heroicons-check-circle"
      case "error":
        return "i-heroicons-x-circle"
      default:
        return "i-heroicons-document"
    }
  }

  const getCompressionInfo = (file: UploadFile) => {
    if (file.meta.compressed && typeof file.meta.compressionRatio === "number") {
      const saved = file.meta.compressionRatio
      return `Compressed: ${saved}% smaller`
    }
    return null
  }

  const handleRemoveFile = (fileId: string) => {
    removeFile(fileId)
  }

  const clearAllFiles = () => {
    clearFiles()
  }

  const startUpload = () => {
    upload()
  }

  // Available file types for testing
  const fileTypePresets = [
    { label: "Images Only", value: ["image/jpeg", "image/png", "image/webp"] },
    { label: "Images + GIF", value: ["image/jpeg", "image/png", "image/webp", "image/gif"] },
    { label: "Images + Videos", value: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"] },
    { label: "Videos Only", value: ["video/mp4", "video/webm", "video/quicktime"] },
    { label: "Documents", value: ["application/pdf", "application/msword", "text/plain"] },
    { label: "All Files", value: [] },
  ]

  const selectedPreset = ref(2) // Images + Videos by default
  const applyPreset = (index: number) => {
    selectedPreset.value = index
    const preset = fileTypePresets[index]
    if (preset) {
      config.value.allowedFileTypes = preset.value
    }
  }
</script>

<template>
  <div class="p-6 space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Uploader Playground</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Test the useUploader composable with different configurations</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Configuration Panel -->
      <UCard class="lg:col-span-1">
        <template #header>
          <h2 class="font-semibold">Configuration</h2>
        </template>

        <div class="space-y-4">
          <!-- Max Files -->
          <div>
            <label class="block text-sm font-medium mb-2">Max Files</label>
            <UInput v-model.number="config.maxFiles" type="number" min="0" placeholder="Unlimited" />
          </div>

          <!-- Max File Size -->
          <div>
            <label class="block text-sm font-medium mb-2">Max File Size (MB)</label>
            <UInput
              type="number"
              min="0"
              step="0.1"
              :model-value="config.maxFileSize / 1024 / 1024"
              @update:model-value="(val: number | null) => (config.maxFileSize = val ? val * 1024 * 1024 : 0)" />
          </div>

          <!-- File Type Presets -->
          <div>
            <label class="block text-sm font-medium mb-2">Allowed File Types</label>
            <USelectMenu
              :model-value="selectedPreset"
              :options="fileTypePresets.map((p, i) => ({ label: p.label, value: i }))"
              value-attribute="value"
              @update:model-value="(val) => applyPreset(val as number)" />
          </div>

          <!-- Thumbnails -->
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <UCheckbox v-model="config.thumbnails" />
              <span class="text-sm font-medium">Generate Thumbnails</span>
            </label>
            <div v-if="config.thumbnails" class="ml-6 space-y-2">
              <div>
                <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max Width (px)</label>
                <UInput v-model.number="config.thumbnailMaxWidth" type="number" min="50" max="500" size="sm" />
              </div>
              <div>
                <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max Height (px)</label>
                <UInput v-model.number="config.thumbnailMaxHeight" type="number" min="50" max="500" size="sm" />
              </div>
              <div>
                <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Video Capture Time (s)</label>
                <UInput
v-model.number="config.videoCaptureTime"
type="number"
min="0"
max="10"
step="0.5"
size="sm" />
              </div>
            </div>
          </div>

          <!-- Image Compression -->
          <div>
            <label class="flex items-center gap-2">
              <UCheckbox v-model="config.imageCompression" />
              <span class="text-sm font-medium">Enable Image Compression</span>
            </label>
          </div>

          <!-- Auto Proceed -->
          <div>
            <label class="flex items-center gap-2">
              <UCheckbox v-model="config.autoProceed" />
              <span class="text-sm font-medium">Auto Upload</span>
            </label>
          </div>

          <!-- Storage Plugin -->
          <div class="pt-4 border-t dark:border-gray-700">
            <label class="flex items-center gap-2">
              <UCheckbox v-model="useStoragePlugin" />
              <span class="text-sm font-medium">Use Azure Storage Plugin (Mock)</span>
            </label>
            <p class="text-xs text-gray-500 mt-1 ml-6">Demonstrates plugin-based storage adapters</p>
          </div>
        </div>
      </UCard>

      <!-- Upload Area & File List -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Upload Area -->
        <UCard>
          <div class="text-center py-12">
            <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />

            <UIcon name="i-heroicons-cloud-arrow-up" class="w-16 h-16 mx-auto text-gray-400 mb-4" />

            <h3 class="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Max {{ config.maxFiles || "∞" }} files, {{ config.maxFileSize ? formatFileSize(config.maxFileSize) : "∞" }} max size
            </p>

            <UButton size="lg" @click="triggerFileSelect"> Select Files </UButton>
          </div>
        </UCard>

        <!-- Progress -->
        <UCard v-if="files.length > 0">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold">Files ({{ files.length }})</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Progress: {{ totalProgress }}%</p>
              </div>
              <div class="flex gap-2">
                <UButton
                  v-if="!config.autoProceed"
                  color="primary"
                  :disabled="files.every((f) => f.status !== 'waiting')"
                  @click="startUpload">
                  Upload All
                </UButton>
                <UButton color="error" variant="soft" @click="clearAllFiles"> Clear All </UButton>
              </div>
            </div>
          </template>

          <!-- File List -->
          <div class="space-y-3">
            <div
              v-for="file in files"
              :key="file.id"
              class="flex items-start gap-4 p-3 border dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <!-- Thumbnail -->
              <div class="shrink-0">
                <img
                  v-if="file.meta.thumbnail"
                  :src="file.meta.thumbnail"
                  class="w-20 h-20 object-cover rounded border dark:border-gray-700"
                  :alt="file.name" />
                <div
                  v-else-if="file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/')"
                  class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center border dark:border-gray-700">
                  <UIcon
                    :name="file.mimeType.startsWith('video/') ? 'i-heroicons-film' : 'i-heroicons-photo'"
                    class="w-10 h-10 text-gray-400" />
                </div>
                <div
                  v-else
                  class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center border dark:border-gray-700">
                  <UIcon name="i-heroicons-document" class="w-10 h-10 text-gray-400" />
                </div>
              </div>

              <!-- File Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <div class="flex-1 min-w-0">
                    <p class="font-medium truncate">{{ file.name }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatFileSize(file.size) }} • {{ file.mimeType }}</p>
                  </div>
                  <UBadge :color="getStatusColor(file.status)" :icon="getStatusIcon(file.status)">
                    {{ file.status }}
                  </UBadge>
                </div>

                <!-- Progress Bar -->
                <div v-if="file.status === 'uploading'" class="mt-2">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs text-gray-600 dark:text-gray-400">{{ file.progress.percentage }}%</span>
                  </div>
                  <UProgress :model-value="file.progress.percentage" />
                </div>

                <div v-else-if="file.status === 'complete'" class="mt-2">
                  <div class="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
                    <span>Upload complete</span>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="file.error" class="mt-2">
                  <UAlert color="error" variant="soft" :title="file.error.message" />
                </div>

                <!-- Meta Info -->
                <div v-if="file.meta.thumbnail || getCompressionInfo(file)" class="mt-2 flex gap-3 text-xs text-gray-500">
                  <span v-if="file.meta.thumbnail" class="flex items-center gap-1">
                    <UIcon name="i-heroicons-photo" class="w-3 h-3" />
                    Thumbnail generated
                  </span>
                  <span v-if="getCompressionInfo(file)" class="flex items-center gap-1">
                    <UIcon name="i-heroicons-archive-box-arrow-down" class="w-3 h-3" />
                    {{ getCompressionInfo(file) }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <UButton icon="i-heroicons-x-mark" color="error" variant="ghost" size="sm" @click="handleRemoveFile(file.id)" />
            </div>
          </div>
        </UCard>

        <!-- Empty State -->
        <UCard v-else>
          <div class="text-center py-8 text-gray-500">No files selected. Click "Select Files" to start.</div>
        </UCard>
      </div>
    </div>

    <!-- Debug Info -->
    <UCard>
      <template #header>
        <h3 class="font-semibold">Debug Info</h3>
      </template>
      <pre class="text-xs overflow-auto">{{
        {
          config,
          files: files.map((f) => ({
            id: f.id,
            name: f.name,
            status: f.status,
            progress: f.progress.percentage,
            meta: f.meta,
          })),
        }
      }}</pre>
    </UCard>
  </div>
</template>

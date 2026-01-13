import type { Emitter } from "mitt"

/**
 * PUBLIC API - Types users commonly need
 * These are exported from the main package
 */

// Core file and upload types
export type FileStatus = "waiting" | "preprocessing" | "uploading" | "postprocessing" | "complete" | "error"
export type UploadStatus = "waiting" | "uploading"

export interface FileProgress {
  percentage: number
}

export interface FileError {
  message: string
  details?: unknown
}

/**
 * File source - indicates where the file originated from
 *
 * - 'local': File selected from user's device
 * - 'storage': File loaded from remote storage (was previously uploaded)
 * - Cloud picker sources: Files picked from cloud providers (future)
 *   - 'instagram': Instagram picker
 *   - 'dropbox': Dropbox picker
 *   - 'google-drive': Google Drive picker
 *   - 'onedrive': OneDrive picker
 *   - ... add more as needed
 */
export type FileSource =
  | 'local'
  | 'storage'
  | 'instagram'
  | 'dropbox'
  | 'google-drive'
  | 'onedrive'

/**
 * Base properties shared by both local and remote upload files
 */
export interface BaseUploadFile<TUploadResult = any> {
  id: string
  name: string
  size: number
  mimeType: string
  status: FileStatus
  preview?: string
  progress: FileProgress
  error?: FileError
  uploadResult?: TUploadResult
  meta: Record<string, unknown>
}

/**
 * Local upload file - originates from user's device
 * Has local data (File/Blob) and may get a remoteUrl after upload
 */
export interface LocalUploadFile<TUploadResult = any> extends BaseUploadFile<TUploadResult> {
  source: 'local'
  data: File | Blob
  remoteUrl?: string  // Set after successful upload
}

/**
 * Remote upload file - originates from remote source (cloud pickers, etc.)
 * Has remoteUrl but no local data
 */
export interface RemoteUploadFile<TUploadResult = any> extends BaseUploadFile<TUploadResult> {
  source: Exclude<FileSource, 'local'>
  data: null
  remoteUrl: string
}

/**
 * Upload file discriminated union
 * Use file.source to narrow the type in your code:
 *
 * @example
 * ```typescript
 * if (file.source === 'local') {
 *   // TypeScript knows: file is LocalUploadFile
 *   URL.createObjectURL(file.data)
 * } else {
 *   // TypeScript knows: file is RemoteUploadFile
 *   console.log(file.remoteUrl)
 * }
 * ```
 */
export type UploadFile<TUploadResult = any> =
  | LocalUploadFile<TUploadResult>
  | RemoteUploadFile<TUploadResult>

// User callback types
export type UploadFn<TUploadResult = any> = (
  file: UploadFile<TUploadResult>,
  onProgress: (progress: number) => void,
) => Promise<TUploadResult>

export type GetRemoteFileFn = (fileId: string) => Promise<MinimumRemoteFileAttributes>

// Configuration
export interface UploadOptions {
  /**
   * Custom plugins to add (in addition to built-in plugins)
   */
  plugins?: Plugin<any, any>[]

  /**
   * Validate maximum number of files
   * - false: disabled
   * - number: enabled with limit
   * @default false
   */
  maxFiles?: false | number

  /**
   * Validate maximum file size in bytes
   * - false: disabled
   * - number: enabled with limit
   * @default false
   */
  maxFileSize?: false | number

  /**
   * Validate allowed file MIME types
   * - false: disabled
   * - string[]: enabled with allowed types
   * @default false
   */
  allowedFileTypes?: false | string[]

  /**
   * Generate thumbnail previews for images/videos
   * - false: disabled
   * - true: enabled with defaults
   * - object: enabled with custom options
   * @default false
   */
  thumbnails?: false | true | ThumbnailOptions

  /**
   * Compress images before upload
   * - false: disabled
   * - true: enabled with defaults
   * - object: enabled with custom options
   * @default false
   */
  imageCompression?: false | true | ImageCompressionOptions

  /**
   * Automatically start upload after files are added
   * @default false
   */
  autoProceed?: boolean
}

export interface ThumbnailOptions {
  width?: number
  height?: number
  quality?: number
}

export interface ImageCompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  outputFormat?: "jpeg" | "webp" | "png" | "auto"
  minSizeToCompress?: number
  preserveMetadata?: boolean
}

// Core events (always available)
type CoreUploaderEvents<TUploadResult = any> = {
  "file:added": Readonly<UploadFile<TUploadResult>>
  "file:removed": Readonly<UploadFile<TUploadResult>>
  "file:processing": Readonly<UploadFile<TUploadResult>>
  "file:error": { file: Readonly<UploadFile<TUploadResult>>; error: FileError }
  "upload:start": Array<Readonly<UploadFile<TUploadResult>>>
  "upload:complete": Array<Required<Readonly<UploadFile<TUploadResult>>>>
  "upload:error": FileError
  "upload:progress": { file: Readonly<UploadFile<TUploadResult>>; progress: number }
  "files:reorder": { oldIndex: number; newIndex: number }
}

// Events for listening - only core events are typed, plugins can emit arbitrary events
export type UploaderEvents<TUploadResult = any> = CoreUploaderEvents<TUploadResult>

/**
 * PLUGIN API - Types for building custom plugins
 * Only needed if users want to create custom validators/processors
 */

export type PluginContext<TPluginEvents extends Record<string, any> = Record<string, never>> = {
  files: UploadFile[]
  options: UploadOptions
  /**
   * Emit custom plugin events
   * Events are automatically prefixed with the plugin ID
   */
  emit: <K extends keyof TPluginEvents>(event: K, payload: TPluginEvents[K]) => void
}

export type ValidationHook<TPluginEvents extends Record<string, any> = Record<string, never>> = (
  file: UploadFile,
  context: PluginContext<TPluginEvents>,
) => Promise<true | UploadFile>
export type ProcessingHook<TPluginEvents extends Record<string, any> = Record<string, never>> = (
  file: UploadFile,
  context: PluginContext<TPluginEvents>,
) => Promise<UploadFile>
export type SetupHook<TPluginEvents extends Record<string, any> = Record<string, never>> = (
  context: PluginContext<TPluginEvents>,
) => Promise<void>

/**
 * Storage hooks for handling upload/download/deletion operations
 *
 * Storage plugins MUST return an object containing a `url` property.
 * This URL will be set as the file's `remoteUrl` after successful upload.
 *
 * @example
 * ```typescript
 * upload: async (file, context) => {
 *   // Upload logic...
 *   return {
 *     url: 'https://storage.example.com/file.jpg',  // Required
 *     key: 'uploads/file.jpg',                      // Optional
 *     etag: 'abc123'                                // Optional
 *   }
 * }
 * ```
 */
export type UploadHook<TUploadResult = any, TPluginEvents extends Record<string, any> = Record<string, never>> = (
  file: UploadFile<TUploadResult>,
  context: PluginContext<TPluginEvents> & { onProgress: (progress: number) => void },
) => Promise<TUploadResult & { url: string }>

export type GetRemoteFileHook<TPluginEvents extends Record<string, any> = Record<string, never>> = (
  fileId: string,
  context: PluginContext<TPluginEvents>,
) => Promise<MinimumRemoteFileAttributes>

export type RemoveHook<TPluginEvents extends Record<string, any> = Record<string, never>> = (
  file: UploadFile,
  context: PluginContext<TPluginEvents>,
) => Promise<void>

export type PluginLifecycleStage = "validate" | "process" | "upload" | "complete"

export type PluginHooks<TUploadResult = any, TPluginEvents extends Record<string, any> = Record<string, never>> = {
  validate?: ValidationHook<TPluginEvents>
  process?: ProcessingHook<TPluginEvents>
  upload?: UploadHook<TUploadResult, TPluginEvents>
  getRemoteFile?: GetRemoteFileHook<TPluginEvents>
  remove?: RemoveHook<TPluginEvents>
  complete?: ProcessingHook<TPluginEvents>
}

export interface Plugin<TUploadResult = any, TPluginEvents extends Record<string, any> = Record<string, never>> {
  id: string
  hooks: PluginHooks<TUploadResult, TPluginEvents>
  options?: UploadOptions
  events?: TPluginEvents
}

/**
 * Define an uploader plugin with type safety, context access, and custom events.
 * This is the universal plugin factory for all plugin types (storage, validators, processors).
 *
 * Hooks receive context as a parameter, making it clear when context is available.
 * Context includes current files, options, and an emit function for custom events.
 *
 * @example Basic Plugin
 * ```typescript
 * export const ValidatorMaxFiles = defineUploaderPlugin<ValidatorOptions>((options) => ({
 *   id: 'validator-max-files',
 *   hooks: {
 *     validate: async (file, context) => {
 *       if (context.files.length >= options.maxFiles) {
 *         throw { message: 'Too many files' }
 *       }
 *       return file
 *     }
 *   }
 * }))
 * ```
 *
 * @example Plugin with Custom Events
 * ```typescript
 * type CompressionEvents = {
 *   start: { file: UploadFile; originalSize: number }
 *   complete: { file: UploadFile; savedBytes: number }
 * }
 *
 * export const PluginImageCompressor = defineUploaderPlugin<
 *   ImageCompressorOptions,
 *   CompressionEvents
 * >((options) => ({
 *   id: 'image-compressor',
 *   hooks: {
 *     process: async (file, context) => {
 *       context.emit('start', { file, originalSize: file.size })
 *       // ... compression logic ...
 *       context.emit('complete', { file, savedBytes: 1000 })
 *       return file
 *     }
 *   }
 * }))
 *
 * // Usage - events are automatically prefixed with plugin ID
 * uploader.on('image-compressor:complete', ({ file, savedBytes }) => {
 *   console.log(`Saved ${savedBytes} bytes`)
 * })
 * ```
 */
export function defineUploaderPlugin<TPluginOptions = unknown, TPluginEvents extends Record<string, any> = Record<string, never>>(
  factory: (options: TPluginOptions) => Plugin<any, TPluginEvents>,
): (options: TPluginOptions) => Plugin<any, TPluginEvents> {
  return factory
}

/**
 * INTERNAL TYPES - Not commonly needed by users
 * Kept exported for edge cases but not primary API
 */

export type PreProcessor = (file: UploadFile) => Promise<UploadFile>
export type Uploader = (
  file: Readonly<UploadFile>,
  emiter: Emitter<Pick<UploaderEvents, "upload:error" | "upload:progress">>,
) => Promise<string>
export type Validator = (file: UploadFile) => Promise<boolean | FileError>
export type Processor = (file: UploadFile) => Promise<File | Blob>

export interface UploadBlob {
  blobPath: string
}

type MinimumRemoteFileAttributes = {
  size: number
  mimeType: string
  remoteUrl: string
}

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

export interface UploadFile<TUploadResult = any> {
  id: string
  name: string
  size: number
  mimeType: string
  data: File | Blob
  status: FileStatus
  preview?: string
  progress: FileProgress
  error?: FileError
  uploadResult?: TUploadResult
  isRemote?: boolean
  remoteUrl?: string
  meta: Record<string, unknown>
}

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
  plugins?: Plugin[]

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

// Events for listening
export type UploaderEvents<TUploadResult = any> = {
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

/**
 * PLUGIN API - Types for building custom plugins
 * Only needed if users want to create custom validators/processors
 */

export type PluginContext = {
  files: UploadFile[]
  options: UploadOptions
}

export type ValidationHook = (file: UploadFile, context: PluginContext) => Promise<true | UploadFile>
export type ProcessingHook = (file: UploadFile, context: PluginContext) => Promise<UploadFile>
export type SetupHook = (context: PluginContext) => Promise<void>
export type PluginLifecycleStage = "validate" | "process" | "complete"

export type PluginHooks = {
  validate?: ValidationHook
  process?: ProcessingHook
  complete?: ProcessingHook
}

export interface Plugin {
  id: string
  hooks: PluginHooks
  options?: UploadOptions
}

export type PluginFn<TPluginOptions = unknown> = {
  (context: PluginContext, pluginOptions: TPluginOptions): Plugin
  __pluginOptions?: TPluginOptions
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

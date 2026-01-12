/**
 * Storage Adapter Plugins
 *
 * These plugins handle the actual upload, download, and deletion of files
 * to/from various cloud storage providers.
 *
 * Only ONE storage plugin should be active per uploader instance.
 * If you need multiple storage destinations, create multiple uploader instances.
 */

export { PluginAzureStorage, type AzureStorageOptions, type AzureUploadResult } from "./azure"

// Future storage plugins will be exported here:
// export { PluginS3Storage } from './s3'
// export { PluginCloudinaryStorage } from './cloudinary'
// export { PluginSupabaseStorage } from './supabase'

import { ref } from "vue"
import { defineUploaderPlugin } from "../../types"

// Type-only imports to avoid bundling Azure SDK
type DataLakeDirectoryClient = typeof import("@azure/storage-file-datalake").DataLakeDirectoryClient
type PathHttpHeaders = import("@azure/storage-file-datalake").PathHttpHeaders

export interface AzureStorageOptions {
  /**
   * Static SAS URL for Azure Data Lake Storage
   */
  sasURL?: string

  /**
   * Function to dynamically fetch SAS URL
   * Useful for refreshing tokens or getting them from an API
   */
  getSASUrl?: () => Promise<string>

  /**
   * Optional subdirectory path within the container
   * Will be created if it doesn't exist
   * @example "uploads/images"
   */
  path?: string

  /**
   * Custom metadata to attach to uploaded files
   */
  metadata?: Record<string, string>

  /**
   * Custom HTTP headers for uploaded files
   */
  pathHttpHeaders?: Omit<PathHttpHeaders, "contentType">
}

export interface AzureUploadResult {
  /**
   * Full URL to the uploaded file
   */
  url: string

  /**
   * File name/path in the storage
   */
  blobPath: string
}

export const PluginAzureStorage = defineUploaderPlugin<AzureStorageOptions>((options) => {
  // Lazy import to avoid bundling Azure SDK unless this plugin is used
  let DataLakeDirectoryClient: DataLakeDirectoryClient

  const sasURL = ref(options.sasURL || "")

  // Initialize SAS URL if getSASUrl is provided
  if (options.getSASUrl && !options.sasURL) {
    options.getSASUrl().then((url) => {
      sasURL.value = url
    })
  }

  /**
   * Get file client for a specific blob
   */
  const getFileClient = async (blobName: string) => {
    // Lazy load Azure SDK
    if (!DataLakeDirectoryClient) {
      const module = await import("@azure/storage-file-datalake")
      DataLakeDirectoryClient = module.DataLakeDirectoryClient
    }

    let dir = new DataLakeDirectoryClient(sasURL.value)

    // Navigate to subdirectory if path is specified
    if (options.path) {
      const cleanPath = options.path.replace(/^\/+|\/+$/g, "") // trim leading/trailing slashes
      dir = dir.getSubdirectoryClient(cleanPath)

      // Create directory if it doesn't exist
      try {
        await dir.createIfNotExists()
      } catch (error) {
        // Ignore if already exists
        if (import.meta.dev) {
          console.debug(`Azure directory already exists or couldn't be created: ${cleanPath}`, error)
        }
      }
    }

    return dir.getFileClient(blobName)
  }

  return {
    id: "azure-storage",
    hooks: {
      /**
       * Upload file to Azure Blob Storage
       */
      async upload(file, context) {
        const fileClient = await getFileClient(file.id)

        await fileClient.upload(file.data, {
          metadata: {
            ...options.metadata,
            mimeType: file.mimeType,
            size: String(file.size),
            originalName: file.name,
          },
          pathHttpHeaders: {
            ...options.pathHttpHeaders,
            contentType: file.mimeType,
          },
          onProgress: ({ loadedBytes }: { loadedBytes: number }) => {
            const uploadedPercentage = Math.round((loadedBytes / file.size) * 100)
            context.onProgress(uploadedPercentage)
          },
        })

        return {
          url: fileClient.url,
          blobPath: fileClient.name,
        } satisfies AzureUploadResult
      },

      /**
       * Get remote file metadata from Azure
       */
      async getRemoteFile(fileId, _context) {
        const fileClient = await getFileClient(fileId)
        const properties = await fileClient.getProperties()

        return {
          size: properties.contentLength || 0,
          mimeType: properties.contentType || "application/octet-stream",
          remoteUrl: fileClient.url,
        }
      },

      /**
       * Delete file from Azure Blob Storage
       */
      async remove(file, _context) {
        const fileClient = await getFileClient(file.id)
        await fileClient.deleteIfExists()
      },
    },
  }
})

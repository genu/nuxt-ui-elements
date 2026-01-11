import type { PluginFn } from "../types"

interface ValidatorDuplicateFileOptions {
  /**
   * Whether to allow duplicate files
   * @default false
   */
  allowDuplicates?: boolean
  /**
   * Custom error message for duplicates
   */
  errorMessage?: string
}

/**
 * Prevents uploading duplicate files based on name, size, and last modified date.
 * Useful for preventing accidental double-uploads in social media scheduling.
 *
 * @example
 * ```ts
 * const uploader = useUpload()
 * uploader.addPlugin(ValidatorDuplicateFile, {
 *   allowDuplicates: false,
 *   errorMessage: 'This file has already been added'
 * })
 * ```
 */
export const ValidatorDuplicateFile: PluginFn<ValidatorDuplicateFileOptions> = ({ files }, options) => {
  const { allowDuplicates = false, errorMessage = "This file has already been added" } = options

  return {
    id: "validator-duplicate-file",
    hooks: {
      validate: async (file) => {
        if (allowDuplicates) {
          return file
        }

        // Check for duplicates based on name, size, and lastModified
        const isDuplicate = files.some((existingFile) => {
          const sameSize = existingFile.size === file.size
          const sameName = existingFile.name === file.name

          // For File objects, also check lastModified if available
          let sameDate = true
          if (file.data instanceof File && existingFile.data instanceof File) {
            sameDate = existingFile.data.lastModified === file.data.lastModified
          }

          return sameSize && sameName && sameDate
        })

        if (isDuplicate) {
          throw { message: errorMessage, details: { fileName: file.name } }
        }

        return file
      },
    },
  }
}

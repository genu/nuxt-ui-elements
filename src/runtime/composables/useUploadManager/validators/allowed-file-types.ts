import { defineUploaderPlugin } from "../types"

interface ValidatorAllowedFileTypesOptions {
  allowedFileTypes?: string[]
}

export const ValidatorAllowedFileTypes = defineUploaderPlugin<ValidatorAllowedFileTypesOptions>((options) => {
  return {
    id: "validator-allowed-file-types",
    hooks: {
      validate: async (file, _context) => {
        if (
          (options.allowedFileTypes && options.allowedFileTypes.includes(file.mimeType)) ||
          (options.allowedFileTypes && options.allowedFileTypes.length) === 0
        )
          return file

        throw { message: `File type ${file.mimeType} is not allowed` }
      },
    },
  }
})

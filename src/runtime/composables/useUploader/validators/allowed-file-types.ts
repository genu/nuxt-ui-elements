import type { PluginFn } from "../types"

interface ValidatorAllowedFileTypesOptions {
  allowedFileTypes?: string[]
}

export const ValidatorAllowedFileTypes: PluginFn<ValidatorAllowedFileTypesOptions> = (_, options) => {
  return {
    id: "validator-allowed-file-types",
    hooks: {
      validate: async (file) => {
        if (
          (options.allowedFileTypes && options.allowedFileTypes.includes(file.mimeType)) ||
          (options.allowedFileTypes && options.allowedFileTypes.length) === 0
        )
          return file

        throw { message: `File type ${file.mimeType} is not allowed` }
      },
    },
  }
}

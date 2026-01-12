import { defineUploaderPlugin } from "../types"

interface ValidatorMaxFilesOptions {
  maxFiles?: number
}

export const ValidatorMaxFiles = defineUploaderPlugin<ValidatorMaxFilesOptions>((options) => {
  return {
    id: "validator-max-files",
    hooks: {
      validate: async (file, context) => {
        if (
          (options.maxFiles && options.maxFiles !== Infinity && context.files.length < options.maxFiles) ||
          (options.maxFiles && options.maxFiles === Infinity)
        )
          return file

        throw { message: `Maximum number of files (${options.maxFiles}) exceeded` }
      },
    },
  }
})

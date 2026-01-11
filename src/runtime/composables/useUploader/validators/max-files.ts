import type { PluginFn } from "../types"

interface ValidatorMaxFilesOptions {
  maxFiles?: number
}

export const ValidatorMaxFiles: PluginFn<ValidatorMaxFilesOptions> = ({ files }, options) => {
  return {
    id: "validator-max-files",
    hooks: {
      validate: async (file) => {
        if (
          (options.maxFiles && options.maxFiles !== Infinity && files.length < options.maxFiles) ||
          (options.maxFiles && options.maxFiles === Infinity)
        )
          return file

        throw { message: `Maximum number of files (${options.maxFiles}) exceeded` }
      },
    },
  }
}

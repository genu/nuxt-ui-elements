import { defineUploaderPlugin } from "../types"

interface ValidatorMaxfileSizeOptions {
  maxFileSize?: number
}

export const ValidatorMaxfileSize = defineUploaderPlugin<ValidatorMaxfileSizeOptions>((options) => {
  return {
    id: "validator-max-file-size",
    hooks: {
      validate: async (file, _context) => {
        if (
          (options.maxFileSize && options.maxFileSize !== Infinity && file.size <= options.maxFileSize) ||
          (options.maxFileSize && options.maxFileSize === Infinity)
        )
          return file

        throw { message: `File size exceeds the maximum limit of ${options.maxFileSize} bytes` }
      },
    },
  }
})

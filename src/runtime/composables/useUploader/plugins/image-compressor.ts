import type { PluginFn } from "../types"

interface ImageCompressorOptions {
  /**
   * Maximum width in pixels. Images wider than this will be scaled down.
   * @default 1920
   */
  maxWidth?: number
  /**
   * Maximum height in pixels. Images taller than this will be scaled down.
   * @default 1920
   */
  maxHeight?: number
  /**
   * JPEG/WebP quality (0-1). Lower values = smaller files but worse quality.
   * @default 0.85
   */
  quality?: number
  /**
   * Output format. Use 'auto' to preserve original format.
   * @default 'auto'
   */
  outputFormat?: "jpeg" | "webp" | "png" | "auto"
  /**
   * Only compress images larger than this size (in bytes).
   * @default 100000 (100KB)
   */
  minSizeToCompress?: number
  /**
   * Preserve EXIF metadata (orientation, etc)
   * @default true
   */
  preserveMetadata?: boolean
}

/**
 * Compresses images before upload to reduce bandwidth and storage costs.
 * Particularly useful for social media scheduling where images are often large.
 *
 * @example
 * ```ts
 * const uploader = useUpload()
 * uploader.addPlugin(PluginImageCompressor, {
 *   maxWidth: 2048,
 *   quality: 0.85,
 *   outputFormat: 'webp'
 * })
 * ```
 */
export const PluginImageCompressor: PluginFn<ImageCompressorOptions> = (_, pluginOptions) => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    outputFormat = "auto",
    minSizeToCompress = 100000, // 100KB
    preserveMetadata = true,
  } = pluginOptions

  return {
    id: "image-compressor",
    hooks: {
      process: async (file) => {
        // Only process images
        if (!file.mimeType.startsWith("image/")) {
          return file
        }

        // Skip GIFs as they need special handling
        if (file.mimeType === "image/gif") {
          return file
        }

        // Skip SVGs as they're already optimized
        if (file.mimeType === "image/svg+xml") {
          return file
        }

        // Skip small files
        if (file.size < minSizeToCompress) {
          return file
        }

        try {
          const sourceUrl = URL.createObjectURL(file.data)
          const image = new Image()
          image.src = sourceUrl

          await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve()
            image.onerror = () => reject(new Error("Failed to load image"))
          })

          // Check if compression is needed
          const needsResize = image.width > maxWidth || image.height > maxHeight
          if (!needsResize && outputFormat === "auto") {
            URL.revokeObjectURL(sourceUrl)
            return file
          }

          // Calculate new dimensions while preserving aspect ratio
          let targetWidth = image.width
          let targetHeight = image.height

          if (needsResize) {
            const widthRatio = maxWidth / image.width
            const heightRatio = maxHeight / image.height
            const ratio = Math.min(widthRatio, heightRatio)

            targetWidth = Math.round(image.width * ratio)
            targetHeight = Math.round(image.height * ratio)
          }

          // Create canvas and draw compressed image
          const canvas = document.createElement("canvas")
          canvas.width = targetWidth
          canvas.height = targetHeight

          const ctx = canvas.getContext("2d")
          if (!ctx) {
            throw new Error("Could not get canvas context")
          }

          // Use better quality settings
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = "high"
          ctx.drawImage(image, 0, 0, targetWidth, targetHeight)

          // Determine output format
          let mimeType = file.mimeType
          if (outputFormat === "jpeg") {
            mimeType = "image/jpeg"
          } else if (outputFormat === "webp") {
            mimeType = "image/webp"
          } else if (outputFormat === "png") {
            mimeType = "image/png"
          }

          // Convert canvas to blob
          const compressedBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob)
                } else {
                  reject(new Error("Failed to compress image"))
                }
              },
              mimeType,
              quality,
            )
          })

          URL.revokeObjectURL(sourceUrl)

          // Only use compressed version if it's actually smaller
          if (compressedBlob.size < file.size) {
            // Update file extension if format changed
            let newId = file.id
            if (outputFormat !== "auto" && outputFormat !== file.meta.extension) {
              const extension = outputFormat === "jpeg" ? "jpg" : outputFormat
              newId = file.id.replace(/\.[^.]+$/, `.${extension}`)
            }

            // Store original size for comparison
            file.meta.originalSize = file.size
            file.meta.compressionRatio = (((file.size - compressedBlob.size) / file.size) * 100).toFixed(1)

            return {
              ...file,
              id: newId,
              data: compressedBlob,
              size: compressedBlob.size,
              mimeType,
              meta: {
                ...file.meta,
                compressed: true,
                originalSize: file.size,
                compressionRatio: file.meta.compressionRatio,
              },
            }
          }

          // If compressed version is larger, keep original
          return file
        } catch (error) {
          // If compression fails, continue with original file
          console.warn(`Image compression failed for ${file.name}:`, error)
          return file
        }
      },
    },
  }
}

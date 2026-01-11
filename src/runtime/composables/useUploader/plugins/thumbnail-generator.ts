import type { PluginFn } from "../types"

interface ThumbnailGeneratorOptions {
  width?: number
  height?: number
  quality?: number
}

export const PluginThumbnailGenerator: PluginFn<ThumbnailGeneratorOptions> = (_options, pluginOptions) => {
  return {
    id: "thumbnail-generator",
    hooks: {
      process: async (file) => {
        const { width = 100, height = 100, quality = 0.7 } = pluginOptions

        const sourceUrl = file.isRemote ? file.remoteUrl! : URL.createObjectURL(file.data)

        if (file.mimeType.startsWith("image/")) {
          const image = new Image()
          image.crossOrigin = "anonymous" // Required for remote images
          image.src = sourceUrl

          await new Promise((resolve) => {
            image.onload = resolve
          })

          const aspectRatio = image.width / image.height
          let targetWidth = width
          let targetHeight = height

          if (aspectRatio > 1) {
            targetHeight = width / aspectRatio
          } else {
            targetWidth = height * aspectRatio
          }

          const canvas = document.createElement("canvas")
          canvas.width = targetWidth
          canvas.height = targetHeight

          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(image, 0, 0, targetWidth, targetHeight)
            const thumbnailPreviewUrl = canvas.toDataURL("image/jpeg", quality)
            file.preview = thumbnailPreviewUrl
          }
        } else if (file.mimeType.startsWith("video/")) {
          const video = document.createElement("video")
          video.src = sourceUrl
          video.crossOrigin = "anonymous" // Required for remote videos
          video.currentTime = 1 // Seek to 1 second to avoid black frames

          await new Promise((resolve) => {
            video.onloadeddata = () => {
              video.onseeked = resolve
              video.currentTime = 1
            }
          })

          const aspectRatio = video.videoWidth / video.videoHeight
          let targetWidth = width
          let targetHeight = height

          if (aspectRatio > 1) {
            targetHeight = width / aspectRatio
          } else {
            targetWidth = height * aspectRatio
          }

          const canvas = document.createElement("canvas")
          canvas.width = targetWidth
          canvas.height = targetHeight

          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(video, 0, 0, targetWidth, targetHeight)
            const thumbnailPreviewUrl = canvas.toDataURL("image/jpeg", quality)
            file.preview = thumbnailPreviewUrl
          }
        }

        return file
      },
    },
  }
}

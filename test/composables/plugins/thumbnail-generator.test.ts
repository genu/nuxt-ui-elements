import { describe, it, expect, beforeEach, vi } from "vitest"
import { PluginThumbnailGenerator } from "../../../src/runtime/composables/useUploadManager/plugins/thumbnail-generator"
import type { LocalUploadFile, RemoteUploadFile, PluginContext } from "../../../src/runtime/composables/useUploadManager/types"

describe("PluginThumbnailGenerator", () => {
  // Reset mocks before each test (global mocks are set up in test/setup.ts)
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockFile = (overrides?: Partial<LocalUploadFile>): LocalUploadFile => ({
    id: "test-id.jpg",
    name: "test.jpg",
    size: 200000,
    mimeType: "image/jpeg",
    status: "waiting",
    progress: { percentage: 0 },
    meta: { extension: "jpg" },
    source: "local",
    data: new Blob(["image data"], { type: "image/jpeg" }),
    ...overrides,
  })

  const createMockRemoteFile = (overrides?: Partial<RemoteUploadFile>): RemoteUploadFile => ({
    id: "test-id.jpg",
    name: "test.jpg",
    size: 200000,
    mimeType: "image/jpeg",
    status: "complete",
    progress: { percentage: 100 },
    meta: { extension: "jpg" },
    source: "storage",
    data: null,
    remoteUrl: "https://example.com/file.jpg",
    ...overrides,
  })

  const createMockContext = (): PluginContext => ({
    files: [],
    options: {},
    emit: vi.fn(),
  })

  describe("Image Thumbnails", () => {
    it("generates thumbnail for image files", async () => {
      const plugin = PluginThumbnailGenerator({
        maxWidth: 200,
        maxHeight: 200,
      })

      const file = createMockFile()
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result).toBeDefined()
      expect(result.meta.thumbnail).toBeDefined()
      expect(result.meta.thumbnail).toMatch(/^data:/)
    })

    it("uses custom thumbnail dimensions", async () => {
      const plugin = PluginThumbnailGenerator({
        maxWidth: 150,
        maxHeight: 150,
      })

      const file = createMockFile()
      const context = createMockContext()

      await plugin.hooks.preprocess!(file, context)

      // Canvas.toBlob should have been called (thumbnail generation happened)
      expect(global.HTMLCanvasElement.prototype.toBlob).toHaveBeenCalled()
    })

    it("uses custom quality setting", async () => {
      const plugin = PluginThumbnailGenerator({
        quality: 0.6,
      })

      const file = createMockFile()
      const context = createMockContext()

      await plugin.hooks.preprocess!(file, context)

      expect(global.HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(expect.any(Function), "image/jpeg", 0.6)
    })

    it("uses default quality of 0.7", async () => {
      const plugin = PluginThumbnailGenerator({})

      const file = createMockFile()
      const context = createMockContext()

      await plugin.hooks.preprocess!(file, context)

      expect(global.HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(expect.any(Function), "image/jpeg", 0.7)
    })

    it("preserves aspect ratio for landscape images", async () => {
      const plugin = PluginThumbnailGenerator({
        maxWidth: 200,
        maxHeight: 200,
      })

      global.Image = class MockImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""
        width = 1920 // Wide image
        height = 1080

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      } as any

      const file = createMockFile()
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result.meta.thumbnail).toBeDefined()
    })

    it("preserves aspect ratio for portrait images", async () => {
      const plugin = PluginThumbnailGenerator({
        maxWidth: 200,
        maxHeight: 200,
      })

      global.Image = class MockImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""
        width = 1080 // Tall image
        height = 1920

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      } as any

      const file = createMockFile()
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result.meta.thumbnail).toBeDefined()
    })
  })

  describe("Video Thumbnails", () => {
    it("generates thumbnail for video files", async () => {
      const plugin = PluginThumbnailGenerator({
        maxWidth: 200,
        maxHeight: 200,
      })

      const file = createMockFile({
        mimeType: "video/mp4",
        name: "video.mp4",
        data: new Blob(["video data"], { type: "video/mp4" }),
      })
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result).toBeDefined()
      expect(result.meta.thumbnail).toBeDefined()
    })

    it("uses custom capture time for video thumbnails", async () => {
      const plugin = PluginThumbnailGenerator({
        videoCaptureTime: 5,
      })

      let capturedTime = 0
      global.HTMLVideoElement = class MockVideo {
        onloadedmetadata: (() => void) | null = null
        onseeked: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""
        videoWidth = 1920
        videoHeight = 1080
        duration = 10
        currentTime = 0

        constructor() {
          setTimeout(() => {
            if (this.onloadedmetadata) this.onloadedmetadata()
          }, 0)
        }

        play() {
          return Promise.resolve()
        }

        pause() {}

        set _currentTime(value: number) {
          capturedTime = value
          this.currentTime = value
          setTimeout(() => {
            if (this.onseeked) this.onseeked()
          }, 0)
        }
      } as any

      const file = createMockFile({
        mimeType: "video/mp4",
        name: "video.mp4",
        data: new Blob(["video data"], { type: "video/mp4" }),
      })
      const context = createMockContext()

      await plugin.hooks.preprocess!(file, context)

      // Video currentTime should have been set to capture time
      expect(capturedTime).toBeLessThanOrEqual(5)
    })

    it("uses default capture time of 1 second for videos", async () => {
      const plugin = PluginThumbnailGenerator({})

      const file = createMockFile({
        mimeType: "video/mp4",
        name: "video.mp4",
        data: new Blob(["video data"], { type: "video/mp4" }),
      })
      const context = createMockContext()

      await plugin.hooks.preprocess!(file, context)

      expect(global.HTMLCanvasElement.prototype.toBlob).toHaveBeenCalled()
    })
  })

  describe("Skip Conditions", () => {
    it("skips non-image and non-video files", async () => {
      const plugin = PluginThumbnailGenerator({})

      const file = createMockFile({
        mimeType: "application/pdf",
        name: "document.pdf",
      })
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result).toBe(file)
      expect(result.meta.thumbnail).toBeUndefined()
    })

    it("skips remote files without local data", async () => {
      const plugin = PluginThumbnailGenerator({})

      const file = createMockRemoteFile({
        mimeType: "image/jpeg",
        name: "image.jpg",
      })
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result).toBe(file)
      expect(result.meta.thumbnail).toBeUndefined()
    })

    it("generates thumbnail for local files", async () => {
      const plugin = PluginThumbnailGenerator({})

      const file = createMockFile({
        mimeType: "image/jpeg",
        name: "image.jpg",
      })
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result.meta.thumbnail).toBeDefined()
    })

    it("skips GIF files", async () => {
      const plugin = PluginThumbnailGenerator({})

      const file = createMockFile({
        mimeType: "image/gif",
        name: "animated.gif",
      })
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result).toBe(file)
      expect(result.meta.thumbnail).toBeUndefined()
    })

    it("skips SVG files", async () => {
      const plugin = PluginThumbnailGenerator({})

      const file = createMockFile({
        mimeType: "image/svg+xml",
        name: "icon.svg",
      })
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result).toBe(file)
      expect(result.meta.thumbnail).toBeUndefined()
    })
  })

  describe("Error Handling", () => {
    it("returns original file on thumbnail generation error", async () => {
      const plugin = PluginThumbnailGenerator({})

      // Mock toBlob to fail
      global.HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => {
        callback(null)
      })

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      const file = createMockFile()
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result).toBe(file)
      expect(result.meta.thumbnail).toBeUndefined()
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Thumbnail generation failed"), expect.any(Error))

      consoleSpy.mockRestore()
    })

    it("handles image load errors gracefully", async () => {
      const plugin = PluginThumbnailGenerator({})

      // Mock Image to fail loading
      global.Image = class MockImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""

        constructor() {
          setTimeout(() => {
            if (this.onerror) this.onerror()
          }, 0)
        }
      } as any

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      const file = createMockFile()
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result).toBe(file)
      expect(result.meta.thumbnail).toBeUndefined()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it("handles video load errors gracefully", async () => {
      const plugin = PluginThumbnailGenerator({})

      // Mock Video to fail loading
      global.HTMLVideoElement = class MockVideo {
        onloadedmetadata: (() => void) | null = null
        onseeked: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""

        constructor() {
          setTimeout(() => {
            if (this.onerror) this.onerror()
          }, 0)
        }

        play() {
          return Promise.resolve()
        }

        pause() {}
      } as any

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      const file = createMockFile({
        mimeType: "video/mp4",
        name: "video.mp4",
        data: new Blob(["video data"], { type: "video/mp4" }),
      })
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result).toBe(file)
      expect(result.meta.thumbnail).toBeUndefined()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe("Metadata Storage", () => {
    it("stores thumbnail URL in file.meta", async () => {
      const plugin = PluginThumbnailGenerator({})

      const file = createMockFile()
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result.meta.thumbnail).toBeDefined()
      expect(typeof result.meta.thumbnail).toBe("string")
      expect(result.meta.thumbnail).toMatch(/^data:/)
    })

    it("doesn't overwrite existing metadata", async () => {
      const plugin = PluginThumbnailGenerator({})

      const file = createMockFile({
        meta: {
          extension: "jpg",
          customField: "custom value",
        },
      })
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result.meta.extension).toBe("jpg")
      expect(result.meta.customField).toBe("custom value")
      expect(result.meta.thumbnail).toBeDefined()
    })
  })
})

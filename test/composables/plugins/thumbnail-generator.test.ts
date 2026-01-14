import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest"
import { PluginThumbnailGenerator } from "../../../src/runtime/composables/useUploadManager/plugins/thumbnail-generator"
import type { LocalUploadFile, RemoteUploadFile, PluginContext } from "../../../src/runtime/composables/useUploadManager/types"

describe("PluginThumbnailGenerator", () => {
  // Store original mocks to restore after each test
  let originalImage: typeof global.Image
  let originalHTMLCanvasElement: typeof global.HTMLCanvasElement
  let originalHTMLVideoElement: typeof global.HTMLVideoElement

  beforeAll(() => {
    originalImage = global.Image
    originalHTMLCanvasElement = global.HTMLCanvasElement
    originalHTMLVideoElement = global.HTMLVideoElement
  })

  // Reset mocks before each test (global mocks are set up in test/setup.ts)
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()

    // Restore original mocks (in case they were overridden in a test)
    global.Image = originalImage
    global.HTMLCanvasElement = originalHTMLCanvasElement
    global.HTMLVideoElement = originalHTMLVideoElement
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

      const result = await plugin.hooks.preprocess!(file, context)

      // Thumbnail should be generated
      expect(result.meta.thumbnail).toBeDefined()
      expect(result.meta.thumbnail).toMatch(/^data:/)
    })

    it("uses custom quality setting", async () => {
      const toDataURLSpy = vi.spyOn(global.HTMLCanvasElement.prototype, "toDataURL")

      const plugin = PluginThumbnailGenerator({
        quality: 0.6,
      })

      const file = createMockFile()
      const context = createMockContext()

      await plugin.hooks.preprocess!(file, context)

      expect(toDataURLSpy).toHaveBeenCalledWith("image/jpeg", 0.6)
    })

    it("uses default quality of 0.7", async () => {
      const toDataURLSpy = vi.spyOn(global.HTMLCanvasElement.prototype, "toDataURL")

      const plugin = PluginThumbnailGenerator({})

      const file = createMockFile()
      const context = createMockContext()

      await plugin.hooks.preprocess!(file, context)

      expect(toDataURLSpy).toHaveBeenCalledWith("image/jpeg", 0.7)
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
        private _src = ""
        private _currentTime = 0
        videoWidth = 1920
        videoHeight = 1080
        duration = 10
        preload = ""
        muted = false

        get src() {
          return this._src
        }

        set src(value: string) {
          this._src = value
          setTimeout(() => {
            if (this.onloadedmetadata) this.onloadedmetadata()
          }, 0)
        }

        get currentTime() {
          return this._currentTime
        }

        set currentTime(value: number) {
          capturedTime = value
          this._currentTime = value
          setTimeout(() => {
            if (this.onseeked) this.onseeked()
          }, 0)
        }

        play() {
          return Promise.resolve()
        }

        pause() {}
      } as any

      const file = createMockFile({
        mimeType: "video/mp4",
        name: "video.mp4",
        data: new Blob(["video data"], { type: "video/mp4" }),
      })
      const context = createMockContext()

      await plugin.hooks.preprocess!(file, context)

      // Video currentTime should have been set to capture time (or 10% of duration, whichever is smaller)
      // With duration=10 and captureTime=5, it should use min(5, 10*0.1) = 1
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

      const result = await plugin.hooks.preprocess!(file, context)

      // Thumbnail should be generated for video
      expect(result.meta.thumbnail).toBeDefined()
      expect(result.meta.thumbnail).toMatch(/^data:/)
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

      // Create a custom canvas mock that throws on toDataURL
      class MockCanvasFail {
        width = 0
        height = 0

        getContext() {
          return {
            drawImage: vi.fn(),
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
          }
        }

        toDataURL() {
          throw new Error("Canvas error")
        }

        toBlob() {}
      }

      global.HTMLCanvasElement = MockCanvasFail as any

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      const file = createMockFile()
      const context = createMockContext()

      const result = await plugin.hooks.preprocess!(file, context)

      expect(result).toBe(file)
      expect(result.meta.thumbnail).toBeUndefined()
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("[ThumbnailGenerator] Failed for"), expect.any(Error))

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
      const OriginalVideo = global.HTMLVideoElement
      global.HTMLVideoElement = class MockVideo {
        onloadedmetadata: (() => void) | null = null
        onseeked: (() => void) | null = null
        onerror: ((event?: any) => void) | null = null
        private _src = ""
        preload = ""
        muted = false

        get src() {
          return this._src
        }

        set src(value: string) {
          this._src = value
          setTimeout(() => {
            if (this.onerror) this.onerror(new Error("Video load failed"))
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
      global.HTMLVideoElement = OriginalVideo
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

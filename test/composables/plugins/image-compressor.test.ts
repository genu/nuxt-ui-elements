import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest"
import { PluginImageCompressor } from "../../../src/runtime/composables/useUploadManager/plugins/image-compressor"
import type { LocalUploadFile, UploadFile, PluginContext } from "../../../src/runtime/composables/useUploadManager/types"

// Define the event types for the plugin
type ImageCompressorEvents = {
  start: { file: UploadFile; originalSize: number }
  complete: { file: UploadFile; originalSize: number; compressedSize: number; savedBytes: number }
  skip: { file: UploadFile; reason: string }
}

describe("PluginImageCompressor", () => {
  // Store original mocks to restore after each test
  let originalImage: typeof global.Image
  let originalHTMLCanvasElement: typeof global.HTMLCanvasElement

  beforeAll(() => {
    originalImage = global.Image
    originalHTMLCanvasElement = global.HTMLCanvasElement
  })

  // Reset mocks before each test (global mocks are set up in test/setup.ts)
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()

    // Restore original mocks (in case they were overridden in a test)
    global.Image = originalImage
    global.HTMLCanvasElement = originalHTMLCanvasElement
  })

  const createMockFile = (overrides?: Partial<LocalUploadFile>): LocalUploadFile => ({
    id: "test-id.jpg",
    name: "test.jpg",
    size: 200000, // 200KB - above default threshold
    mimeType: "image/jpeg",
    status: "waiting",
    progress: { percentage: 0 },
    meta: { extension: "jpg" },
    source: "local",
    data: new Blob(["image data"], { type: "image/jpeg" }),
    ...overrides,
  })

  const createMockRemoteFile = (): UploadFile => ({
    id: "test-id.jpg",
    name: "test.jpg",
    size: 200000,
    mimeType: "image/jpeg",
    status: "complete",
    progress: { percentage: 100 },
    meta: { extension: "jpg" },
    source: "storage",
    data: null,
    remoteUrl: "https://example.com/image.jpg",
  })

  const createMockContext = (): PluginContext<ImageCompressorEvents> => ({
    files: [],
    options: {},
    emit: vi.fn(),
  })

  describe("Compression Logic", () => {
    it("compresses large image files", async () => {
      const plugin = PluginImageCompressor({
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
      })

      const file = createMockFile({ size: 500000 }) // 500KB
      const context = createMockContext()

      const result = await plugin.hooks.process!(file, context)

      expect(result).toBeDefined()
      expect(context.emit).toHaveBeenCalledWith("start", {
        file,
        originalSize: file.size,
      })
    })

    it("skips non-image files", async () => {
      const plugin = PluginImageCompressor({})
      const file = createMockFile({
        mimeType: "video/mp4",
        name: "video.mp4",
      })
      const context = createMockContext()

      const result = await plugin.hooks.process!(file, context)

      expect(result).toBe(file)
      expect(context.emit).not.toHaveBeenCalled()
    })

    it("skips remote files", async () => {
      const plugin = PluginImageCompressor({})
      const file = createMockRemoteFile()
      const context = createMockContext()

      const result = await plugin.hooks.process!(file, context)

      expect(result).toBe(file)
      expect(context.emit).toHaveBeenCalledWith("skip", {
        file,
        reason: "Remote file, no local data to compress",
      })
    })

    it("skips GIF files", async () => {
      const plugin = PluginImageCompressor({})
      const file = createMockFile({
        mimeType: "image/gif",
        name: "animated.gif",
      })
      const context = createMockContext()

      const result = await plugin.hooks.process!(file, context)

      expect(result).toBe(file)
      expect(context.emit).toHaveBeenCalledWith("skip", {
        file,
        reason: "GIF format not supported",
      })
    })

    it("skips SVG files", async () => {
      const plugin = PluginImageCompressor({})
      const file = createMockFile({
        mimeType: "image/svg+xml",
        name: "icon.svg",
      })
      const context = createMockContext()

      const result = await plugin.hooks.process!(file, context)

      expect(result).toBe(file)
      expect(context.emit).toHaveBeenCalledWith("skip", {
        file,
        reason: "SVG already optimized",
      })
    })

    it("skips files below minSizeToCompress threshold", async () => {
      const plugin = PluginImageCompressor({
        minSizeToCompress: 100000, // 100KB
      })
      const file = createMockFile({ size: 50000 }) // 50KB
      const context = createMockContext()

      const result = await plugin.hooks.process!(file, context)

      expect(result).toBe(file)
      expect(context.emit).toHaveBeenCalledWith("skip", {
        file,
        reason: expect.stringContaining("below minimum threshold"),
      })
    })
  })

  describe("Output Format", () => {
    it("preserves original format when outputFormat is auto", async () => {
      let capturedMimeType: string | undefined
      let capturedQuality: number | undefined

      // Create a large image mock that needs resizing (so compression runs)
      global.Image = class MockLargeImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""
        width = 3000 // Larger than default maxWidth of 1920
        height = 2000

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      } as any

      // Create a canvas mock that captures the toBlob arguments
      class MockCanvasWithCapture {
        width = 0
        height = 0

        getContext() {
          return {
            drawImage: vi.fn(),
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
          }
        }

        toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: number) {
          capturedMimeType = type
          capturedQuality = quality
          const blob = new Blob(["compressed"], { type: type || "image/png" })
          // Make it smaller than original to pass compression check
          Object.defineProperty(blob, "size", { value: 50000 })
          setTimeout(() => callback(blob), 0)
        }

        toDataURL() {
          return "data:image/png;base64,mock"
        }
      }

      global.HTMLCanvasElement = MockCanvasWithCapture as any

      const plugin = PluginImageCompressor({
        outputFormat: "auto",
      })
      const file = createMockFile({ mimeType: "image/png", name: "test.png" })
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(capturedMimeType).toBe("image/png")
      expect(capturedQuality).toBe(0.85)
    })

    it("converts to JPEG when outputFormat is jpeg", async () => {
      let capturedMimeType: string | undefined

      class MockCanvasWithCapture {
        width = 0
        height = 0

        getContext() {
          return {
            drawImage: vi.fn(),
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
          }
        }

        toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: number) {
          capturedMimeType = type
          const blob = new Blob(["compressed"], { type: type || "image/jpeg" })
          Object.defineProperty(blob, "size", { value: 50000 })
          setTimeout(() => callback(blob), 0)
        }

        toDataURL() {
          return "data:image/jpeg;base64,mock"
        }
      }

      global.HTMLCanvasElement = MockCanvasWithCapture as any

      const plugin = PluginImageCompressor({
        outputFormat: "jpeg",
      })
      const file = createMockFile({ mimeType: "image/png", name: "test.png" })
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(capturedMimeType).toBe("image/jpeg")
    })

    it("converts to WebP when outputFormat is webp", async () => {
      let capturedMimeType: string | undefined

      class MockCanvasWithCapture {
        width = 0
        height = 0

        getContext() {
          return {
            drawImage: vi.fn(),
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
          }
        }

        toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: number) {
          capturedMimeType = type
          const blob = new Blob(["compressed"], { type: type || "image/webp" })
          Object.defineProperty(blob, "size", { value: 50000 })
          setTimeout(() => callback(blob), 0)
        }

        toDataURL() {
          return "data:image/webp;base64,mock"
        }
      }

      global.HTMLCanvasElement = MockCanvasWithCapture as any

      const plugin = PluginImageCompressor({
        outputFormat: "webp",
      })
      const file = createMockFile()
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(capturedMimeType).toBe("image/webp")
    })
  })

  describe("Quality Settings", () => {
    it("uses custom quality setting", async () => {
      let capturedQuality: number | undefined

      // Create a large image mock that needs resizing
      global.Image = class MockLargeImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""
        width = 3000
        height = 2000

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      } as any

      class MockCanvasWithCapture {
        width = 0
        height = 0

        getContext() {
          return {
            drawImage: vi.fn(),
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
          }
        }

        toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: number) {
          capturedQuality = quality
          const blob = new Blob(["compressed"], { type: type || "image/jpeg" })
          Object.defineProperty(blob, "size", { value: 50000 })
          setTimeout(() => callback(blob), 0)
        }

        toDataURL() {
          return "data:image/jpeg;base64,mock"
        }
      }

      global.HTMLCanvasElement = MockCanvasWithCapture as any

      const plugin = PluginImageCompressor({
        quality: 0.5,
      })
      const file = createMockFile()
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(capturedQuality).toBe(0.5)
    })

    it("uses default quality of 0.85", async () => {
      let capturedQuality: number | undefined

      // Create a large image mock that needs resizing
      global.Image = class MockLargeImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""
        width = 3000
        height = 2000

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      } as any

      class MockCanvasWithCapture {
        width = 0
        height = 0

        getContext() {
          return {
            drawImage: vi.fn(),
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
          }
        }

        toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: number) {
          capturedQuality = quality
          const blob = new Blob(["compressed"], { type: type || "image/jpeg" })
          Object.defineProperty(blob, "size", { value: 50000 })
          setTimeout(() => callback(blob), 0)
        }

        toDataURL() {
          return "data:image/jpeg;base64,mock"
        }
      }

      global.HTMLCanvasElement = MockCanvasWithCapture as any

      const plugin = PluginImageCompressor({})
      const file = createMockFile()
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(capturedQuality).toBe(0.85)
    })
  })

  describe("Event Emission", () => {
    it("emits start event with original size", async () => {
      const plugin = PluginImageCompressor({})
      const file = createMockFile({ size: 300000 })
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(context.emit).toHaveBeenCalledWith("start", {
        file,
        originalSize: 300000,
      })
    })

    it("emits complete event when compression succeeds", async () => {
      // Create a large image mock that needs resizing
      global.Image = class MockLargeImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""
        width = 3000
        height = 2000

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      } as any

      // Create a canvas mock that returns smaller blob
      class MockCanvasSmaller {
        width = 0
        height = 0

        getContext() {
          return {
            drawImage: vi.fn(),
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
          }
        }

        toBlob(callback: (blob: Blob | null) => void, type?: string) {
          const blob = new Blob(["compressed"], { type: type || "image/jpeg" })
          Object.defineProperty(blob, "size", { value: 100000 })
          setTimeout(() => callback(blob), 0)
        }

        toDataURL() {
          return "data:image/jpeg;base64,mock"
        }
      }

      global.HTMLCanvasElement = MockCanvasSmaller as any

      const plugin = PluginImageCompressor({})
      const file = createMockFile({ size: 300000 })
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(context.emit).toHaveBeenCalledWith("complete", {
        file,
        originalSize: 300000,
        compressedSize: 100000,
        savedBytes: 200000,
      })
    })

    it("emits skip event when compressed version is larger", async () => {
      // Create a large image mock that needs resizing
      global.Image = class MockLargeImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""
        width = 3000
        height = 2000

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      } as any

      // Create a canvas mock that returns larger blob
      class MockCanvasLarger {
        width = 0
        height = 0

        getContext() {
          return {
            drawImage: vi.fn(),
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
          }
        }

        toBlob(callback: (blob: Blob | null) => void, type?: string) {
          const blob = new Blob(["compressed"], { type: type || "image/jpeg" })
          Object.defineProperty(blob, "size", { value: 150000 })
          setTimeout(() => callback(blob), 0)
        }

        toDataURL() {
          return "data:image/jpeg;base64,mock"
        }
      }

      global.HTMLCanvasElement = MockCanvasLarger as any

      const plugin = PluginImageCompressor({})
      const file = createMockFile({ size: 100000 })
      const context = createMockContext()

      const result = await plugin.hooks.process!(file, context)

      expect(result).toBe(file)
      expect(context.emit).toHaveBeenCalledWith("skip", {
        file,
        reason: "Compressed version larger than original",
      })
    })
  })

  describe("Error Handling", () => {
    it("returns original file on compression error", async () => {
      // Create a large image mock that needs resizing
      global.Image = class MockLargeImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""
        width = 3000
        height = 2000

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      } as any

      // Create a canvas mock that fails toBlob
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

        toBlob(callback: (blob: Blob | null) => void) {
          setTimeout(() => callback(null), 0)
        }

        toDataURL() {
          return "data:image/jpeg;base64,mock"
        }
      }

      global.HTMLCanvasElement = MockCanvasFail as any

      const plugin = PluginImageCompressor({})
      const file = createMockFile()
      const context = createMockContext()

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      const result = await plugin.hooks.process!(file, context)

      expect(result).toBe(file)
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Image compression failed"), expect.any(Error))

      consoleSpy.mockRestore()
    })

    it("handles image load errors gracefully", async () => {
      const plugin = PluginImageCompressor({})
      const file = createMockFile()
      const context = createMockContext()

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

      const result = await plugin.hooks.process!(file, context)

      expect(result).toBe(file)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe("Metadata Preservation", () => {
    it("stores compression metadata in file.meta", async () => {
      // Create a large image mock that needs resizing
      global.Image = class MockLargeImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ""
        width = 3000
        height = 2000

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      } as any

      // Create a canvas mock that returns smaller blob
      class MockCanvasSmaller {
        width = 0
        height = 0

        getContext() {
          return {
            drawImage: vi.fn(),
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
          }
        }

        toBlob(callback: (blob: Blob | null) => void, type?: string) {
          const blob = new Blob(["compressed"], { type: type || "image/jpeg" })
          Object.defineProperty(blob, "size", { value: 100000 })
          setTimeout(() => callback(blob), 0)
        }

        toDataURL() {
          return "data:image/jpeg;base64,mock"
        }
      }

      global.HTMLCanvasElement = MockCanvasSmaller as any

      const plugin = PluginImageCompressor({})
      const file = createMockFile({ size: 300000 })
      const context = createMockContext()

      const result = await plugin.hooks.process!(file, context)

      expect(result.meta.compressed).toBe(true)
      expect(result.meta.originalSize).toBe(300000)
      expect(result.meta.compressionRatio).toBeDefined()
    })
  })
})

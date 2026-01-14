import { describe, it, expect, beforeEach, vi } from "vitest"
import { PluginImageCompressor } from "../../../src/runtime/composables/useUploadManager/plugins/image-compressor"
import type { LocalUploadFile, UploadFile, PluginContext } from "../../../src/runtime/composables/useUploadManager/types"

// Define the event types for the plugin
type ImageCompressorEvents = {
  start: { file: UploadFile; originalSize: number }
  complete: { file: UploadFile; originalSize: number; compressedSize: number; savedBytes: number }
  skip: { file: UploadFile; reason: string }
}

describe("PluginImageCompressor", () => {
  // Reset mocks before each test (global mocks are set up in test/setup.ts)
  beforeEach(() => {
    vi.clearAllMocks()
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
      const plugin = PluginImageCompressor({
        outputFormat: "auto",
      })
      const file = createMockFile({ mimeType: "image/png", name: "test.png" })
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(global.HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        "image/png",
        0.85
      )
    })

    it("converts to JPEG when outputFormat is jpeg", async () => {
      const plugin = PluginImageCompressor({
        outputFormat: "jpeg",
      })
      const file = createMockFile({ mimeType: "image/png", name: "test.png" })
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(global.HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        "image/jpeg",
        0.85
      )
    })

    it("converts to WebP when outputFormat is webp", async () => {
      const plugin = PluginImageCompressor({
        outputFormat: "webp",
      })
      const file = createMockFile()
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(global.HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        "image/webp",
        0.85
      )
    })
  })

  describe("Quality Settings", () => {
    it("uses custom quality setting", async () => {
      const plugin = PluginImageCompressor({
        quality: 0.5,
      })
      const file = createMockFile()
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(global.HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(String),
        0.5
      )
    })

    it("uses default quality of 0.85", async () => {
      const plugin = PluginImageCompressor({})
      const file = createMockFile()
      const context = createMockContext()

      await plugin.hooks.process!(file, context)

      expect(global.HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(String),
        0.85
      )
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
      const plugin = PluginImageCompressor({})
      const file = createMockFile({ size: 300000 })
      const context = createMockContext()

      // Mock toBlob to return smaller blob
      global.HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => {
        const blob = new Blob(["compressed"], { type: "image/jpeg" })
        Object.defineProperty(blob, "size", { value: 100000 })
        callback(blob)
      })

      await plugin.hooks.process!(file, context)

      expect(context.emit).toHaveBeenCalledWith("complete", {
        file,
        originalSize: 300000,
        compressedSize: 100000,
        savedBytes: 200000,
      })
    })

    it("emits skip event when compressed version is larger", async () => {
      const plugin = PluginImageCompressor({})
      const file = createMockFile({ size: 100000 })
      const context = createMockContext()

      // Mock toBlob to return larger blob
      global.HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => {
        const blob = new Blob(["compressed"], { type: "image/jpeg" })
        Object.defineProperty(blob, "size", { value: 150000 })
        callback(blob)
      })

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
      const plugin = PluginImageCompressor({})
      const file = createMockFile()
      const context = createMockContext()

      // Mock toBlob to fail
      global.HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => {
        callback(null)
      })

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      const result = await plugin.hooks.process!(file, context)

      expect(result).toBe(file)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Image compression failed"),
        expect.any(Error)
      )

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
      const plugin = PluginImageCompressor({})
      const file = createMockFile({ size: 300000 })
      const context = createMockContext()

      // Mock toBlob to return smaller blob
      global.HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => {
        const blob = new Blob(["compressed"], { type: "image/jpeg" })
        Object.defineProperty(blob, "size", { value: 100000 })
        callback(blob)
      })

      const result = await plugin.hooks.process!(file, context)

      expect(result.meta.compressed).toBe(true)
      expect(result.meta.originalSize).toBe(300000)
      expect(result.meta.compressionRatio).toBeDefined()
    })
  })
})

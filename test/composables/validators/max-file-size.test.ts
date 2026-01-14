import { describe, it, expect, vi } from "vitest"
import { ValidatorMaxFileSize } from "../../../src/runtime/composables/useUploadManager/validators/max-file-size"
import type { LocalUploadFile, PluginContext } from "../../../src/runtime/composables/useUploadManager/types"

describe("ValidatorMaxFileSize", () => {
  const createMockFile = (overrides?: Partial<LocalUploadFile>): LocalUploadFile => ({
    id: "test-id",
    name: "test.jpg",
    size: 100000, // 100KB default
    mimeType: "image/jpeg",
    status: "waiting",
    progress: { percentage: 0 },
    meta: { extension: "jpg" },
    source: "local",
    data: new Blob(["test data"], { type: "image/jpeg" }),
    ...overrides,
  })

  const createMockContext = (): PluginContext => ({
    files: [],
    options: {},
    emit: vi.fn(),
  })

  describe("Validation Logic", () => {
    it("allows file when size is below maxFileSize", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 200000, // 200KB
      })

      const file = createMockFile({ size: 100000 }) // 100KB
      const context = createMockContext()

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("allows file when size equals maxFileSize", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 100000, // 100KB
      })

      const file = createMockFile({ size: 100000 }) // 100KB
      const context = createMockContext()

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("throws error when size exceeds maxFileSize", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 50000, // 50KB
      })

      const file = createMockFile({ size: 100000 }) // 100KB
      const context = createMockContext()

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: "File size exceeds the maximum limit of 50000 bytes",
      })
    })

    it("allows all files when maxFileSize is Infinity", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: Infinity,
      })

      const context = createMockContext()

      const smallFile = createMockFile({ size: 1000 })
      const largeFile = createMockFile({ size: 1000000000 }) // 1GB

      expect(await plugin.hooks.validate!(smallFile, context)).toBe(smallFile)
      expect(await plugin.hooks.validate!(largeFile, context)).toBe(largeFile)
    })

    it("allows all files when maxFileSize is undefined", async () => {
      const plugin = ValidatorMaxFileSize({})

      const context = createMockContext()

      const smallFile = createMockFile({ size: 1000 })
      const largeFile = createMockFile({ size: 1000000000 }) // 1GB

      expect(await plugin.hooks.validate!(smallFile, context)).toBe(smallFile)
      expect(await plugin.hooks.validate!(largeFile, context)).toBe(largeFile)
    })
  })

  describe("Common File Size Scenarios", () => {
    it("validates small files (< 1MB)", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 1024 * 1024, // 1MB
      })

      const context = createMockContext()

      const file100KB = createMockFile({ size: 100 * 1024 })
      const file500KB = createMockFile({ size: 500 * 1024 })
      const file999KB = createMockFile({ size: 999 * 1024 })

      expect(await plugin.hooks.validate!(file100KB, context)).toBe(file100KB)
      expect(await plugin.hooks.validate!(file500KB, context)).toBe(file500KB)
      expect(await plugin.hooks.validate!(file999KB, context)).toBe(file999KB)
    })

    it("validates medium files (1MB - 10MB)", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 10 * 1024 * 1024, // 10MB
      })

      const context = createMockContext()

      const file1MB = createMockFile({ size: 1 * 1024 * 1024 })
      const file5MB = createMockFile({ size: 5 * 1024 * 1024 })
      const file9MB = createMockFile({ size: 9 * 1024 * 1024 })

      expect(await plugin.hooks.validate!(file1MB, context)).toBe(file1MB)
      expect(await plugin.hooks.validate!(file5MB, context)).toBe(file5MB)
      expect(await plugin.hooks.validate!(file9MB, context)).toBe(file9MB)
    })

    it("validates large files (10MB - 100MB)", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 100 * 1024 * 1024, // 100MB
      })

      const context = createMockContext()

      const file10MB = createMockFile({ size: 10 * 1024 * 1024 })
      const file50MB = createMockFile({ size: 50 * 1024 * 1024 })
      const file99MB = createMockFile({ size: 99 * 1024 * 1024 })

      expect(await plugin.hooks.validate!(file10MB, context)).toBe(file10MB)
      expect(await plugin.hooks.validate!(file50MB, context)).toBe(file50MB)
      expect(await plugin.hooks.validate!(file99MB, context)).toBe(file99MB)
    })

    it("rejects files exceeding common size limits", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 5 * 1024 * 1024, // 5MB
      })

      const context = createMockContext()

      const file6MB = createMockFile({ size: 6 * 1024 * 1024 })
      const file10MB = createMockFile({ size: 10 * 1024 * 1024 })

      await expect(plugin.hooks.validate!(file6MB, context)).rejects.toEqual({
        message: `File size exceeds the maximum limit of ${5 * 1024 * 1024} bytes`,
      })

      await expect(plugin.hooks.validate!(file10MB, context)).rejects.toEqual({
        message: `File size exceeds the maximum limit of ${5 * 1024 * 1024} bytes`,
      })
    })
  })

  describe("Edge Cases", () => {
    it("allows zero-byte files when maxFileSize is greater than zero", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 100000,
      })

      const file = createMockFile({ size: 0 })
      const context = createMockContext()

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("handles maxFileSize of 1 byte", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 1,
      })

      const context = createMockContext()

      const file0Bytes = createMockFile({ size: 0 })
      const file1Byte = createMockFile({ size: 1 })
      const file2Bytes = createMockFile({ size: 2 })

      expect(await plugin.hooks.validate!(file0Bytes, context)).toBe(file0Bytes)
      expect(await plugin.hooks.validate!(file1Byte, context)).toBe(file1Byte)
      await expect(plugin.hooks.validate!(file2Bytes, context)).rejects.toEqual({
        message: "File size exceeds the maximum limit of 1 bytes",
      })
    })

    it("handles very large maxFileSize values", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: Number.MAX_SAFE_INTEGER,
      })

      const file = createMockFile({ size: 1000000000 }) // 1GB
      const context = createMockContext()

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("provides accurate error message with byte count", async () => {
      const maxSize = 123456
      const plugin = ValidatorMaxFileSize({
        maxFileSize: maxSize,
      })

      const file = createMockFile({ size: maxSize + 1 })
      const context = createMockContext()

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: `File size exceeds the maximum limit of ${maxSize} bytes`,
      })
    })
  })

  describe("Boundary Conditions", () => {
    it("rejects file that is exactly 1 byte over limit", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 100000,
      })

      const file = createMockFile({ size: 100001 })
      const context = createMockContext()

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: "File size exceeds the maximum limit of 100000 bytes",
      })
    })

    it("accepts file that is exactly 1 byte under limit", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 100000,
      })

      const file = createMockFile({ size: 99999 })
      const context = createMockContext()

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("correctly handles boundary at exact maxFileSize", async () => {
      const plugin = ValidatorMaxFileSize({
        maxFileSize: 100000,
      })

      const context = createMockContext()

      const fileUnder = createMockFile({ size: 99999 })
      const fileExact = createMockFile({ size: 100000 })
      const fileOver = createMockFile({ size: 100001 })

      expect(await plugin.hooks.validate!(fileUnder, context)).toBe(fileUnder)
      expect(await plugin.hooks.validate!(fileExact, context)).toBe(fileExact)
      await expect(plugin.hooks.validate!(fileOver, context)).rejects.toEqual({
        message: "File size exceeds the maximum limit of 100000 bytes",
      })
    })
  })

  describe("Plugin Configuration", () => {
    it("has correct plugin id", () => {
      const plugin = ValidatorMaxFileSize({})
      expect(plugin.id).toBe("validator-max-file-size")
    })

    it("only provides validate hook", () => {
      const plugin = ValidatorMaxFileSize({})
      expect(plugin.hooks.validate).toBeDefined()
      expect(plugin.hooks.preprocess).toBeUndefined()
      expect(plugin.hooks.process).toBeUndefined()
      expect(plugin.hooks.complete).toBeUndefined()
    })
  })
})

import { describe, it, expect, vi } from "vitest"
import { ValidatorMaxFiles } from "../../../src/runtime/composables/useUploadManager/validators/max-files"
import type { LocalUploadFile, PluginContext } from "../../../src/runtime/composables/useUploadManager/types"

describe("ValidatorMaxFiles", () => {
  const createMockFile = (overrides?: Partial<LocalUploadFile>): LocalUploadFile => ({
    id: "test-id",
    name: "test.jpg",
    size: 100000,
    mimeType: "image/jpeg",
    status: "waiting",
    progress: { percentage: 0 },
    meta: { extension: "jpg" },
    source: "local",
    data: new Blob(["test data"], { type: "image/jpeg" }),
    ...overrides,
  })

  const createMockContext = (fileCount: number = 0): PluginContext => ({
    files: Array.from({ length: fileCount }, (_, i) =>
      createMockFile({ id: `file-${i}`, name: `file-${i}.jpg` })
    ),
    options: {},
    emit: vi.fn(),
  })

  describe("Validation Logic", () => {
    it("allows file when current count is below maxFiles", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 5,
      })

      const file = createMockFile()
      const context = createMockContext(3) // 3 existing files

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("allows file when adding would equal maxFiles", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 5,
      })

      const file = createMockFile()
      const context = createMockContext(4) // 4 existing files, adding 1 more = 5 total

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("throws error when current count equals maxFiles", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 5,
      })

      const file = createMockFile()
      const context = createMockContext(5) // Already at max

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: "Maximum number of files (5) exceeded",
      })
    })

    it("throws error when current count exceeds maxFiles", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 5,
      })

      const file = createMockFile()
      const context = createMockContext(6) // Already over max

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: "Maximum number of files (5) exceeded",
      })
    })

    it("allows all files when maxFiles is Infinity", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: Infinity,
      })

      const file = createMockFile()
      const context = createMockContext(1000) // Many existing files

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("allows all files when maxFiles is undefined", async () => {
      const plugin = ValidatorMaxFiles({})

      const file = createMockFile()
      const context = createMockContext(1000) // Many existing files

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })
  })

  describe("Common Scenarios", () => {
    it("validates single file limit", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 1,
      })

      const file = createMockFile()

      // First file should be allowed
      const emptyContext = createMockContext(0)
      expect(await plugin.hooks.validate!(file, emptyContext)).toBe(file)

      // Second file should be rejected
      const oneFileContext = createMockContext(1)
      await expect(plugin.hooks.validate!(file, oneFileContext)).rejects.toEqual({
        message: "Maximum number of files (1) exceeded",
      })
    })

    it("validates small file limits (2-10 files)", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 3,
      })

      const file = createMockFile()

      expect(await plugin.hooks.validate!(file, createMockContext(0))).toBe(file)
      expect(await plugin.hooks.validate!(file, createMockContext(1))).toBe(file)
      expect(await plugin.hooks.validate!(file, createMockContext(2))).toBe(file)
      await expect(plugin.hooks.validate!(file, createMockContext(3))).rejects.toEqual({
        message: "Maximum number of files (3) exceeded",
      })
    })

    it("validates medium file limits (10-100 files)", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 50,
      })

      const file = createMockFile()

      expect(await plugin.hooks.validate!(file, createMockContext(0))).toBe(file)
      expect(await plugin.hooks.validate!(file, createMockContext(25))).toBe(file)
      expect(await plugin.hooks.validate!(file, createMockContext(49))).toBe(file)
      await expect(plugin.hooks.validate!(file, createMockContext(50))).rejects.toEqual({
        message: "Maximum number of files (50) exceeded",
      })
    })

    it("validates large file limits (100+ files)", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 1000,
      })

      const file = createMockFile()

      expect(await plugin.hooks.validate!(file, createMockContext(0))).toBe(file)
      expect(await plugin.hooks.validate!(file, createMockContext(500))).toBe(file)
      expect(await plugin.hooks.validate!(file, createMockContext(999))).toBe(file)
      await expect(plugin.hooks.validate!(file, createMockContext(1000))).rejects.toEqual({
        message: "Maximum number of files (1000) exceeded",
      })
    })
  })

  describe("Edge Cases", () => {
    it("allows first file when maxFiles is 1 and no files exist", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 1,
      })

      const file = createMockFile()
      const context = createMockContext(0)

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("handles maxFiles of 0 correctly", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 0,
      })

      const file = createMockFile()
      const context = createMockContext(0)

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: "Maximum number of files (0) exceeded",
      })
    })

    it("handles very large maxFiles values", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: Number.MAX_SAFE_INTEGER,
      })

      const file = createMockFile()
      const context = createMockContext(1000000)

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("provides accurate error message with count", async () => {
      const maxFiles = 42
      const plugin = ValidatorMaxFiles({
        maxFiles,
      })

      const file = createMockFile()
      const context = createMockContext(maxFiles)

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: `Maximum number of files (${maxFiles}) exceeded`,
      })
    })
  })

  describe("Boundary Conditions", () => {
    it("rejects when exactly at limit", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 5,
      })

      const file = createMockFile()
      const context = createMockContext(5)

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: "Maximum number of files (5) exceeded",
      })
    })

    it("accepts when exactly one below limit", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 5,
      })

      const file = createMockFile()
      const context = createMockContext(4)

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("correctly handles boundary at exact maxFiles", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 5,
      })

      const file = createMockFile()

      expect(await plugin.hooks.validate!(file, createMockContext(0))).toBe(file)
      expect(await plugin.hooks.validate!(file, createMockContext(1))).toBe(file)
      expect(await plugin.hooks.validate!(file, createMockContext(2))).toBe(file)
      expect(await plugin.hooks.validate!(file, createMockContext(3))).toBe(file)
      expect(await plugin.hooks.validate!(file, createMockContext(4))).toBe(file)
      await expect(plugin.hooks.validate!(file, createMockContext(5))).rejects.toEqual({
        message: "Maximum number of files (5) exceeded",
      })
    })

    it("rejects when one over limit", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 5,
      })

      const file = createMockFile()
      const context = createMockContext(6)

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: "Maximum number of files (5) exceeded",
      })
    })
  })

  describe("Context Files Array", () => {
    it("validates against actual files array length", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 3,
      })

      const file = createMockFile()

      // Context with actual file objects
      const context = {
        files: [
          createMockFile({ id: "1", name: "file1.jpg" }),
          createMockFile({ id: "2", name: "file2.jpg" }),
        ],
        options: {},
        emit: vi.fn(),
      }

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("respects context.files array even if malformed", async () => {
      const plugin = ValidatorMaxFiles({
        maxFiles: 2,
      })

      const file = createMockFile()

      // Context with actual files that reach limit
      const context = {
        files: [
          createMockFile({ id: "1", name: "file1.jpg" }),
          createMockFile({ id: "2", name: "file2.jpg" }),
        ],
        options: {},
        emit: vi.fn(),
      }

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: "Maximum number of files (2) exceeded",
      })
    })
  })

  describe("Plugin Configuration", () => {
    it("has correct plugin id", () => {
      const plugin = ValidatorMaxFiles({})
      expect(plugin.id).toBe("validator-max-files")
    })

    it("only provides validate hook", () => {
      const plugin = ValidatorMaxFiles({})
      expect(plugin.hooks.validate).toBeDefined()
      expect(plugin.hooks.preprocess).toBeUndefined()
      expect(plugin.hooks.process).toBeUndefined()
      expect(plugin.hooks.complete).toBeUndefined()
    })
  })
})

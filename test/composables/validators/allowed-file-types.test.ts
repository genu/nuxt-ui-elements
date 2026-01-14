import { describe, it, expect, vi } from "vitest"
import { ValidatorAllowedFileTypes } from "../../../src/runtime/composables/useUploadManager/validators/allowed-file-types"
import type { LocalUploadFile, PluginContext } from "../../../src/runtime/composables/useUploadManager/types"

describe("ValidatorAllowedFileTypes", () => {
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

  const createMockContext = (): PluginContext => ({
    files: [],
    options: {},
    emit: vi.fn(),
  })

  describe("Validation Logic", () => {
    it("allows file when mimeType is in allowedFileTypes list", async () => {
      const plugin = ValidatorAllowedFileTypes({
        allowedFileTypes: ["image/jpeg", "image/png", "video/mp4"],
      })

      const file = createMockFile({ mimeType: "image/jpeg" })
      const context = createMockContext()

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })

    it("allows multiple different file types from the list", async () => {
      const plugin = ValidatorAllowedFileTypes({
        allowedFileTypes: ["image/jpeg", "image/png", "video/mp4"],
      })

      const context = createMockContext()

      const jpegFile = createMockFile({ mimeType: "image/jpeg" })
      const pngFile = createMockFile({ mimeType: "image/png" })
      const videoFile = createMockFile({ mimeType: "video/mp4" })

      expect(await plugin.hooks.validate!(jpegFile, context)).toBe(jpegFile)
      expect(await plugin.hooks.validate!(pngFile, context)).toBe(pngFile)
      expect(await plugin.hooks.validate!(videoFile, context)).toBe(videoFile)
    })

    it("throws error when mimeType is not in allowedFileTypes list", async () => {
      const plugin = ValidatorAllowedFileTypes({
        allowedFileTypes: ["image/jpeg", "image/png"],
      })

      const file = createMockFile({ mimeType: "video/mp4" })
      const context = createMockContext()

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: "File type video/mp4 is not allowed",
      })
    })

    it("allows all files when allowedFileTypes is empty array", async () => {
      const plugin = ValidatorAllowedFileTypes({
        allowedFileTypes: [],
      })

      const context = createMockContext()

      const jpegFile = createMockFile({ mimeType: "image/jpeg" })
      const pdfFile = createMockFile({ mimeType: "application/pdf" })
      const videoFile = createMockFile({ mimeType: "video/mp4" })

      expect(await plugin.hooks.validate!(jpegFile, context)).toBe(jpegFile)
      expect(await plugin.hooks.validate!(pdfFile, context)).toBe(pdfFile)
      expect(await plugin.hooks.validate!(videoFile, context)).toBe(videoFile)
    })

    it("allows all files when allowedFileTypes is undefined", async () => {
      const plugin = ValidatorAllowedFileTypes({})

      const context = createMockContext()

      const jpegFile = createMockFile({ mimeType: "image/jpeg" })
      const pdfFile = createMockFile({ mimeType: "application/pdf" })
      const videoFile = createMockFile({ mimeType: "video/mp4" })

      expect(await plugin.hooks.validate!(jpegFile, context)).toBe(jpegFile)
      expect(await plugin.hooks.validate!(pdfFile, context)).toBe(pdfFile)
      expect(await plugin.hooks.validate!(videoFile, context)).toBe(videoFile)
    })
  })

  describe("Common MIME Types", () => {
    it("validates common image formats", async () => {
      const plugin = ValidatorAllowedFileTypes({
        allowedFileTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
      })

      const context = createMockContext()

      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "image/jpeg" }), context)).toBeDefined()
      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "image/png" }), context)).toBeDefined()
      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "image/gif" }), context)).toBeDefined()
      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "image/webp" }), context)).toBeDefined()
      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "image/svg+xml" }), context)).toBeDefined()
    })

    it("validates common video formats", async () => {
      const plugin = ValidatorAllowedFileTypes({
        allowedFileTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
      })

      const context = createMockContext()

      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "video/mp4" }), context)).toBeDefined()
      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "video/webm" }), context)).toBeDefined()
      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "video/ogg" }), context)).toBeDefined()
      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "video/quicktime" }), context)).toBeDefined()
    })

    it("validates common document formats", async () => {
      const plugin = ValidatorAllowedFileTypes({
        allowedFileTypes: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ],
      })

      const context = createMockContext()

      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "application/pdf" }), context)).toBeDefined()
      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "application/msword" }), context)).toBeDefined()
      expect(
        await plugin.hooks.validate!(
          createMockFile({
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          }),
          context,
        ),
      ).toBeDefined()
      expect(await plugin.hooks.validate!(createMockFile({ mimeType: "text/plain" }), context)).toBeDefined()
    })

    it("rejects disallowed formats", async () => {
      const plugin = ValidatorAllowedFileTypes({
        allowedFileTypes: ["image/jpeg", "image/png"],
      })

      const context = createMockContext()

      await expect(plugin.hooks.validate!(createMockFile({ mimeType: "application/pdf" }), context)).rejects.toEqual({
        message: "File type application/pdf is not allowed",
      })

      await expect(plugin.hooks.validate!(createMockFile({ mimeType: "video/mp4" }), context)).rejects.toEqual({
        message: "File type video/mp4 is not allowed",
      })
    })
  })

  describe("Edge Cases", () => {
    it("is case-sensitive for MIME types", async () => {
      const plugin = ValidatorAllowedFileTypes({
        allowedFileTypes: ["image/jpeg"],
      })

      const file = createMockFile({ mimeType: "IMAGE/JPEG" })
      const context = createMockContext()

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: "File type IMAGE/JPEG is not allowed",
      })
    })

    it("requires exact MIME type match", async () => {
      const plugin = ValidatorAllowedFileTypes({
        allowedFileTypes: ["image/jpeg"],
      })

      const file = createMockFile({ mimeType: "image/jpg" })
      const context = createMockContext()

      await expect(plugin.hooks.validate!(file, context)).rejects.toEqual({
        message: "File type image/jpg is not allowed",
      })
    })

    it("handles unusual but valid MIME types", async () => {
      const plugin = ValidatorAllowedFileTypes({
        allowedFileTypes: ["application/x-custom-type"],
      })

      const file = createMockFile({ mimeType: "application/x-custom-type" })
      const context = createMockContext()

      const result = await plugin.hooks.validate!(file, context)

      expect(result).toBe(file)
    })
  })

  describe("Plugin Configuration", () => {
    it("has correct plugin id", () => {
      const plugin = ValidatorAllowedFileTypes({})
      expect(plugin.id).toBe("validator-allowed-file-types")
    })

    it("only provides validate hook", () => {
      const plugin = ValidatorAllowedFileTypes({})
      expect(plugin.hooks.validate).toBeDefined()
      expect(plugin.hooks.preprocess).toBeUndefined()
      expect(plugin.hooks.process).toBeUndefined()
      expect(plugin.hooks.complete).toBeUndefined()
    })
  })
})

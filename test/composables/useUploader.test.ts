import { describe, it, expect, vi, beforeEach } from "vitest"
import { useUploader } from "../../src/runtime/composables/useUploader"

describe("useUploader", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("initializes with default state", () => {
    const { files, totalProgress, status } = useUploader()

    expect(files.value).toEqual([])
    expect(totalProgress.value).toBe(0)
    expect(status.value).toBe("waiting")
  })

  it("adds files correctly with generated IDs", async () => {
    const { addFile, files } = useUploader()
    const file = new File(["content"], "test.png", { type: "image/png" })

    await addFile(file)

    expect(files.value).toHaveLength(1)
    const addedFile = files.value[0]
    expect(addedFile!.name).toBe("test.png")
    expect(addedFile!.status).toBe("waiting")
    expect(addedFile!.id).toMatch(/\.png$/) // ID ends with extension
    expect(addedFile!.meta.extension).toBe("png")
  })

  it("removes files correctly", async () => {
    const { addFile, removeFile, files } = useUploader()
    const file = new File(["content"], "test.png", { type: "image/png" })
    const addedFile = await addFile(file)

    expect(files.value).toHaveLength(1)

    if (addedFile) {
      removeFile(addedFile.id)
    }

    expect(files.value).toHaveLength(0)
  })

  it("clears all files", async () => {
    const { addFile, clearFiles, files } = useUploader()
    await addFile(new File(["1"], "1.png", { type: "image/png" }))
    await addFile(new File(["2"], "2.png", { type: "image/png" }))

    expect(files.value).toHaveLength(2)

    clearFiles()
    expect(files.value).toHaveLength(0)
  })

  it("reorders files correctly", async () => {
    const { addFile, reorderFile, files } = useUploader()
    await addFile(new File(["1"], "1.png", { type: "image/png" })) // Index 0
    await addFile(new File(["2"], "2.png", { type: "image/png" })) // Index 1

    expect(files.value[0]!.name).toBe("1.png")

    reorderFile(0, 1)

    expect(files.value[0]!.name).toBe("2.png")
    expect(files.value[1]!.name).toBe("1.png")
  })

  it("handles successful upload flow", async () => {
    const { addFile, upload, onUpload, files } = useUploader()
    const file = new File(["content"], "test.png", { type: "image/png" })
    await addFile(file)

    // Mock upload function
    const mockUploadImpl = vi.fn(async (file, onProgress) => {
      onProgress(50)
      return "https://example.com/uploads/test.png"
    })

    onUpload(mockUploadImpl)

    const uploadPromise = upload()

    // Status updates during upload are async, but we can await the promise
    await uploadPromise

    expect(mockUploadImpl).toHaveBeenCalled()
    expect(files.value[0]!.status).toBe("complete")
    expect(files.value[0]!.progress.percentage).toBe(50) // Note: implementation doesn't auto-set to 100 on complete in the loop shown, just sets status
    expect(files.value[0]!.uploadResult).toBe("https://example.com/uploads/test.png")
  })

  it("handles upload errors", async () => {
    const { addFile, upload, onUpload, files } = useUploader()
    const file = new File(["content"], "test.png", { type: "image/png" })
    await addFile(file)

    const errorMsg = "Network Error"
    onUpload(async () => {
      throw new Error(errorMsg)
    })

    await upload()

    expect(files.value[0]!.status).toBe("error")
    expect(files.value[0]!.error).toBeDefined()
    expect(files.value[0]!.error?.message).toBe(errorMsg)
  })

  it("calculates total progress correctly", async () => {
    const { addFile, onUpload, upload, totalProgress } = useUploader()
    await addFile(new File(["1"], "1.png", { type: "image/png" }))
    await addFile(new File(["2"], "2.png", { type: "image/png" }))

    onUpload(async (file, onProgress) => {
      // Just set different progress for different files
      if (file.name === "1.png") onProgress(100)
      if (file.name === "2.png") onProgress(0)
    })

    await upload()

    // (100 + 0) / 2 = 50
    expect(totalProgress.value).toBe(50)
  })

  it("initializes existing remote files", async () => {
    const { initializeExistingFiles, onGetRemoteFile, files } = useUploader()

    const remoteInfo = {
      mimeType: "image/jpeg",
      size: 1024,
      remoteUrl: "https://example.com/existing.jpg",
    }

    onGetRemoteFile(async (_id) => remoteInfo)

    await initializeExistingFiles([{ id: "existing-id" }])

    expect(files.value).toHaveLength(1)
    const file = files.value[0]
    expect(file!.status).toBe("complete")
    expect(file!.remoteUrl).toBe(remoteInfo.remoteUrl)
    expect(file!.progress.percentage).toBe(100)
  })
})

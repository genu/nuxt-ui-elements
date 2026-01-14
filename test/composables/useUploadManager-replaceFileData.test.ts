import { describe, it, expect, vi, beforeEach } from "vitest"
import { useUploadManager } from "../../src/runtime/composables/useUploadManager"
import type { UploadFile } from "../../src/runtime/composables/useUploadManager/types"

describe("useUploadManager - replaceFileData", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should replace file data and clear metadata", async () => {
    const { addFiles, replaceFileData, getFile, updateFile, files } = useUploadManager()

    // Add initial file
    const originalFile = new File(["original content"], "test.txt", {
      type: "text/plain",
    })
    await addFiles([originalFile])
    const fileId = files.value[0].id

    // Add some metadata to simulate preprocessing
    updateFile(fileId, {
      meta: { thumbnail: "data:image/png;base64,abc123", custom: "value" },
    })

    // Replace the file data
    const newBlob = new Blob(["new content"], { type: "text/plain" })
    await replaceFileData(fileId, newBlob, "edited.txt")

    // Verify the file was updated
    const updatedFile = getFile(fileId)
    expect(updatedFile.name).toBe("edited.txt")
    expect(updatedFile.size).toBe(11) // "new content"
    expect(updatedFile.status).toBe("waiting")
    expect(updatedFile.progress?.percentage).toBe(0)
    expect(updatedFile.remoteUrl).toBeUndefined()
    expect(updatedFile.meta).toEqual({}) // Metadata should be cleared
  })

  it("should cleanup object URLs when replacing file", async () => {
    const { addFiles, replaceFileData, getFileURL, files } = useUploadManager()

    // Add file with image data
    const originalFile = new File(["fake image data"], "image.jpg", {
      type: "image/jpeg",
    })
    await addFiles([originalFile])
    const fileId = files.value[0].id

    // Get object URL (creates cache entry)
    const originalUrl = await getFileURL(fileId)
    expect(originalUrl).toBeTruthy()

    // Spy on URL.revokeObjectURL
    const revokeURLSpy = vi.spyOn(URL, "revokeObjectURL")

    // Replace file data
    const newBlob = new Blob(["new image data"], { type: "image/jpeg" })
    await replaceFileData(fileId, newBlob)

    // Verify old URL was revoked
    expect(revokeURLSpy).toHaveBeenCalledWith(originalUrl)

    // Get new object URL - should be different
    const newUrl = await getFileURL(fileId)
    expect(newUrl).toBeTruthy()
    expect(newUrl).not.toBe(originalUrl)

    revokeURLSpy.mockRestore()
  })

  it("should emit file:replaced event", async () => {
    const uploader = useUploadManager()
    const { addFiles, replaceFileData, getFile, files, on, upload, updateFile, initializeExistingFiles } = uploader

    // Add initial file
    const originalFile = new File(["content"], "test.txt", {
      type: "text/plain",
    })
    await addFiles([originalFile])
    const fileId = files.value[0].id

    // Listen for event
    const replacedListener = vi.fn()
    on("file:replaced", replacedListener)

    // Replace file data
    const newBlob = new Blob(["new"], { type: "text/plain" })
    await replaceFileData(fileId, newBlob)

    // Verify event was emitted
    expect(replacedListener).toHaveBeenCalledTimes(1)
    const emittedFile = replacedListener.mock.calls[0][0] as UploadFile
    expect(emittedFile.id).toBe(fileId)
    expect(emittedFile.size).toBe(3) // "new"
  })

  it("should maintain backwards compatibility with file:added event", async () => {
    const uploader = useUploadManager()
    const { addFiles, replaceFileData, getFile, files, on, upload, updateFile, initializeExistingFiles } = uploader

    const originalFile = new File(["content"], "test.txt", {
      type: "text/plain",
    })
    await addFiles([originalFile])
    const fileId = files.value[0].id

    // Listen for both events
    const replacedListener = vi.fn()
    const addedListener = vi.fn()
    on("file:replaced", replacedListener)
    on("file:added", addedListener)

    // Clear the added listener call from initial addFiles
    addedListener.mockClear()

    // Replace file data
    const newBlob = new Blob(["new"], { type: "text/plain" })
    await replaceFileData(fileId, newBlob)

    // Both events should be emitted
    expect(replacedListener).toHaveBeenCalledTimes(1)
    expect(addedListener).toHaveBeenCalledTimes(1)
  })

  it("should respect autoProceed setting by default", async () => {
    const mockUpload = vi.fn().mockResolvedValue("https://example.com/uploaded.txt")
    const { addFiles, replaceFileData, files, onUpload } = useUploadManager({
      autoProceed: true,
    })
    onUpload(mockUpload)

    const file = new File(["content"], "test.txt", { type: "text/plain" })
    await addFiles([file])
    await vi.waitFor(() => mockUpload.mock.calls.length > 0) // Wait for autoProceed upload
    mockUpload.mockClear() // Clear the auto-upload from addFiles

    const fileId = files.value[0].id
    const newBlob = new Blob(["edited"], { type: "text/plain" })

    // Replace without specifying shouldAutoUpload - should use autoProceed
    await replaceFileData(fileId, newBlob)

    // Wait for upload to be triggered
    await vi.waitFor(() => mockUpload.mock.calls.length > 0)

    // Upload should have been called
    expect(mockUpload).toHaveBeenCalledTimes(1)
  })

  it("should NOT auto-upload when autoProceed is false", async () => {
    const mockUpload = vi.fn().mockResolvedValue("https://example.com/uploaded.txt")
    const { addFiles, replaceFileData, files, onUpload } = useUploadManager({
      autoProceed: false,
    })
    onUpload(mockUpload)

    const file = new File(["content"], "test.txt", { type: "text/plain" })
    await addFiles([file])
    const fileId = files.value[0].id
    const newBlob = new Blob(["edited"], { type: "text/plain" })

    // Replace without specifying shouldAutoUpload
    await replaceFileData(fileId, newBlob)

    // Give it a small delay to ensure upload doesn't get called
    await new Promise((resolve) => setTimeout(resolve, 10))

    // Upload should NOT have been called
    expect(mockUpload).not.toHaveBeenCalled()
  })

  it("should allow override of autoProceed with shouldAutoUpload parameter", async () => {
    const mockUpload = vi.fn().mockResolvedValue("https://example.com/uploaded.txt")
    const { addFiles, replaceFileData, files, onUpload } = useUploadManager({
      autoProceed: true, // Auto-upload enabled
    })
    onUpload(mockUpload)

    const file = new File(["content"], "test.txt", { type: "text/plain" })
    await addFiles([file])
    await vi.waitFor(() => mockUpload.mock.calls.length > 0) // Wait for autoProceed upload
    mockUpload.mockClear()

    const fileId = files.value[0].id
    const newBlob = new Blob(["edited"], { type: "text/plain" })

    // Explicitly disable auto-upload despite autoProceed being true
    await replaceFileData(fileId, newBlob, undefined, false)

    // Give it a small delay to ensure upload doesn't get called
    await new Promise((resolve) => setTimeout(resolve, 10))

    // Upload should NOT have been called
    expect(mockUpload).not.toHaveBeenCalled()
  })

  it("should support batch editing workflow", async () => {
    const mockUpload = vi.fn().mockResolvedValue("https://example.com/uploaded.txt")
    const { addFiles, replaceFileData, files, upload, onUpload } = useUploadManager({
      autoProceed: false, // Disable auto-upload for cleaner test
    })
    onUpload(mockUpload)

    // Add multiple files
    const filesToAdd = [
      new File(["content1"], "file1.txt", { type: "text/plain" }),
      new File(["content2"], "file2.txt", { type: "text/plain" }),
      new File(["content3"], "file3.txt", { type: "text/plain" }),
    ]
    await addFiles(filesToAdd)

    const fileIds = files.value.map((f) => f.id)

    // Edit all files without auto-uploading
    for (const fileId of fileIds) {
      const newBlob = new Blob(["edited"], { type: "text/plain" })
      await replaceFileData(fileId, newBlob, undefined, false) // Explicitly disable auto-upload
    }

    // Give it a small delay to ensure no uploads happen
    await new Promise((resolve) => setTimeout(resolve, 10))

    // No uploads should have happened yet
    expect(mockUpload).not.toHaveBeenCalled()

    // Manually trigger upload for all
    await upload()

    // Now upload should have been called (once per file = 3 times)
    expect(mockUpload.mock.calls.length).toBeGreaterThan(0)
  })

  it("should preserve file ID after replacement", async () => {
    const uploader = useUploadManager()
    const { addFiles, replaceFileData, getFile, files, on, upload, updateFile, initializeExistingFiles } = uploader

    const file = new File(["content"], "test.txt", { type: "text/plain" })
    await addFiles([file])
    const originalId = files.value[0].id

    const newBlob = new Blob(["new"], { type: "text/plain" })
    await replaceFileData(originalId, newBlob)

    // ID should remain the same
    const updatedFile = getFile(originalId)
    expect(updatedFile.id).toBe(originalId)
  })

  it("should reset status to waiting for re-upload", async () => {
    const mockUpload = vi.fn().mockResolvedValue("https://example.com/uploaded.txt")
    const { addFiles, replaceFileData, getFile, files, upload, onUpload } = useUploadManager({
      autoProceed: false,
    })
    onUpload(mockUpload)

    const file = new File(["content"], "test.txt", { type: "text/plain" })
    await addFiles([file])
    const fileId = files.value[0].id

    // Upload the file
    await upload()

    // Verify file is in complete state
    let uploadedFile = getFile(fileId)
    expect(uploadedFile.status).toBe("complete")
    expect(uploadedFile.uploadResult).toBe("https://example.com/uploaded.txt")

    // Replace the file data
    const newBlob = new Blob(["edited"], { type: "text/plain" })
    await replaceFileData(fileId, newBlob)

    // Status should be reset to waiting
    uploadedFile = getFile(fileId)
    expect(uploadedFile.status).toBe("waiting")
    expect(uploadedFile.remoteUrl).toBeUndefined()
    expect(uploadedFile.progress?.percentage).toBe(0)
  })

  it("should use new filename when provided", async () => {
    const uploader = useUploadManager()
    const { addFiles, replaceFileData, getFile, files, on, upload, updateFile, initializeExistingFiles } = uploader

    const file = new File(["content"], "original.txt", { type: "text/plain" })
    await addFiles([file])
    const fileId = files.value[0].id

    const newBlob = new Blob(["new"], { type: "text/plain" })
    await replaceFileData(fileId, newBlob, "renamed.txt")

    const updatedFile = getFile(fileId)
    expect(updatedFile.name).toBe("renamed.txt")
  })

  it("should preserve original filename when not provided", async () => {
    const uploader = useUploadManager()
    const { addFiles, replaceFileData, getFile, files, on, upload, updateFile, initializeExistingFiles } = uploader

    const file = new File(["content"], "original.txt", { type: "text/plain" })
    await addFiles([file])
    const fileId = files.value[0].id

    const newBlob = new Blob(["new"], { type: "text/plain" })
    await replaceFileData(fileId, newBlob)

    const updatedFile = getFile(fileId)
    expect(updatedFile.name).toBe("original.txt")
  })

  it("should throw error if file not found", async () => {
    const uploader = useUploadManager()
    const { addFiles, replaceFileData, getFile, files, on, upload, updateFile, initializeExistingFiles } = uploader

    const newBlob = new Blob(["new"], { type: "text/plain" })

    await expect(
      uploader.replaceFileData("non-existent-id", newBlob)
    ).rejects.toThrow("File not found")
  })

  it("should convert remote file to local file", async () => {
    // Mock the getRemoteFile function
    const mockGetRemoteFile = vi.fn().mockResolvedValue({
      mimeType: "text/plain",
      size: 100,
      remoteUrl: "https://example.com/remote.txt",
    })

    const { onGetRemoteFile, replaceFileData, getFile, files, initializeExistingFiles } = useUploadManager()
    onGetRemoteFile(mockGetRemoteFile)

    // Add a remote file with ID
    await initializeExistingFiles([{
      id: "remote-file-123",
    }])

    expect(files.value).toHaveLength(1)
    const fileId = files.value[0].id
    const remoteFile = getFile(fileId)
    expect(remoteFile.source).toBe("storage")
    expect(remoteFile.data).toBeNull()

    // Replace with local data
    const newBlob = new Blob(["local content"], { type: "text/plain" })
    await replaceFileData(fileId, newBlob)

    // Should now be a local file
    const localFile = getFile(fileId)
    expect(localFile.source).toBe("local")
    expect(localFile.data).toBe(newBlob)
    expect(localFile.remoteUrl).toBeUndefined()
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { useUploadManager } from "../../src/runtime/composables/useUploadManager"
import { PluginAzureDataLake } from "../../src/runtime/composables/useUploadManager/plugins/storage/azure-datalake"
import type { UploadFile, UploadOptions } from "../../src/runtime/composables/useUploadManager/types"
import * as AzureMocks from "./mocks/azure-storage"

// Mock the dynamic import of @azure/storage-file-datalake
vi.mock("@azure/storage-file-datalake", async () => {
  const mocks = await import("./mocks/azure-storage")
  return {
    DataLakeDirectoryClient: mocks.DataLakeDirectoryClient,
  }
})

describe("useUploadManager", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("initializes with default state", () => {
    const { files, totalProgress, status } = useUploadManager()

    expect(files.value).toEqual([])
    expect(totalProgress.value).toBe(0)
    expect(status.value).toBe("waiting")
  })

  it("adds files correctly with generated IDs", async () => {
    const { addFile, files } = useUploadManager()
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
    const { addFile, removeFile, files } = useUploadManager()
    const file = new File(["content"], "test.png", { type: "image/png" })
    const addedFile = await addFile(file)

    expect(files.value).toHaveLength(1)

    if (addedFile) {
      removeFile(addedFile.id)
    }

    expect(files.value).toHaveLength(0)
  })

  it("clears all files", async () => {
    const { addFile, clearFiles, files } = useUploadManager()
    await addFile(new File(["1"], "1.png", { type: "image/png" }))
    await addFile(new File(["2"], "2.png", { type: "image/png" }))

    expect(files.value).toHaveLength(2)

    clearFiles()
    expect(files.value).toHaveLength(0)
  })

  it("reorders files correctly", async () => {
    const { addFile, reorderFile, files } = useUploadManager()
    await addFile(new File(["1"], "1.png", { type: "image/png" })) // Index 0
    await addFile(new File(["2"], "2.png", { type: "image/png" })) // Index 1

    expect(files.value[0]!.name).toBe("1.png")

    reorderFile(0, 1)

    expect(files.value[0]!.name).toBe("2.png")
    expect(files.value[1]!.name).toBe("1.png")
  })

  it("handles successful upload flow", async () => {
    const { addFile, upload, onUpload, files } = useUploadManager()
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
    const { addFile, upload, onUpload, files } = useUploadManager()
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
    const { addFile, onUpload, upload, totalProgress } = useUploadManager()
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
    const { initializeExistingFiles, onGetRemoteFile, files } = useUploadManager()

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

  describe("File Data Access Methods", () => {
    it("getFileData returns blob for local files", async () => {
      const { addFile, getFileData } = useUploadManager()
      const file = new File(["test content"], "test.txt", { type: "text/plain" })
      const addedFile = await addFile(file)

      const blob = await getFileData(addedFile!.id)

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.size).toBe(file.size)
      expect(blob.type).toBe(file.type)
    })

    it("getFileData throws for non-existent file", async () => {
      const { getFileData } = useUploadManager()

      await expect(getFileData("non-existent")).rejects.toThrow("File not found")
    })

    it("getFileURL returns object URL for local files", async () => {
      const { addFile, getFileURL } = useUploadManager()
      const file = new File(["content"], "test.png", { type: "image/png" })
      const addedFile = await addFile(file)

      const url = await getFileURL(addedFile!.id)

      expect(url).toMatch(/^blob:/)
    })

    it("getFileURL returns remote URL for remote files", async () => {
      const { initializeExistingFiles, onGetRemoteFile, getFileURL } = useUploadManager()

      onGetRemoteFile(async (_id) => ({
        mimeType: "image/jpeg",
        size: 1024,
        remoteUrl: "https://example.com/image.jpg",
      }))

      await initializeExistingFiles([{ id: "remote-id" }])
      const url = await getFileURL("remote-id")

      expect(url).toBe("https://example.com/image.jpg")
    })

    it("getFileURL caches object URLs and doesn't create duplicates", async () => {
      const { addFile, getFileURL } = useUploadManager()
      const file = new File(["content"], "test.png", { type: "image/png" })
      const addedFile = await addFile(file)

      const url1 = await getFileURL(addedFile!.id)
      const url2 = await getFileURL(addedFile!.id)

      expect(url1).toBe(url2)
    })

    it("getFileStream returns readable stream", async () => {
      const { addFile, getFileStream } = useUploadManager()
      const file = new File(["test content"], "test.txt", { type: "text/plain" })
      const addedFile = await addFile(file)

      const stream = await getFileStream(addedFile!.id)

      expect(stream).toBeInstanceOf(ReadableStream)
    })

    it("replaceFileData replaces file content and marks as waiting", async () => {
      const { addFile, replaceFileData, files } = useUploadManager()
      const file = new File(["original"], "test.txt", { type: "text/plain" })
      const addedFile = await addFile(file)

      const newBlob = new Blob(["replaced content"])
      await replaceFileData(addedFile!.id, newBlob, "new-name.txt")

      const updatedFile = files.value[0]
      expect(updatedFile!.name).toBe("new-name.txt")
      expect(updatedFile!.size).toBe(newBlob.size)
      expect(updatedFile!.status).toBe("waiting")
      expect(updatedFile!.source).toBe("local")
    })
  })

  describe("Memory Management", () => {
    it("cleans up object URLs when file is removed", async () => {
      const { addFile, getFileURL, removeFile } = useUploadManager()
      const file = new File(["content"], "test.png", { type: "image/png" })
      const addedFile = await addFile(file)

      const url = await getFileURL(addedFile!.id)
      expect(url).toMatch(/^blob:/)

      // Spy on URL.revokeObjectURL
      const revokeSpy = vi.spyOn(URL, "revokeObjectURL")

      await removeFile(addedFile!.id)

      expect(revokeSpy).toHaveBeenCalledWith(url)
      revokeSpy.mockRestore()
    })

    it("cleans up all object URLs when clearFiles is called", async () => {
      const { addFile, getFileURL, clearFiles } = useUploadManager()
      const file1 = new File(["content1"], "test1.png", { type: "image/png" })
      const file2 = new File(["content2"], "test2.png", { type: "image/png" })
      const added1 = await addFile(file1)
      const added2 = await addFile(file2)

      await getFileURL(added1!.id)
      await getFileURL(added2!.id)

      const revokeSpy = vi.spyOn(URL, "revokeObjectURL")

      clearFiles()

      expect(revokeSpy).toHaveBeenCalledTimes(2)
      revokeSpy.mockRestore()
    })

    it("cleans up object URLs when reset is called", async () => {
      const { addFile, getFileURL, reset } = useUploadManager()
      const file = new File(["content"], "test.png", { type: "image/png" })
      const addedFile = await addFile(file)

      await getFileURL(addedFile!.id)

      const revokeSpy = vi.spyOn(URL, "revokeObjectURL")

      reset()

      expect(revokeSpy).toHaveBeenCalled()
      revokeSpy.mockRestore()
    })
  })

  describe("Error Handling", () => {
    it("addFile throws when validation fails", async () => {
      const { addFile } = useUploadManager({
        maxFileSize: 100, // Very small limit
      })
      const file = new File(["a".repeat(200)], "large.txt", { type: "text/plain" })

      await expect(addFile(file)).rejects.toThrow()
    })

    it("getFile throws for non-existent file", () => {
      const { getFile } = useUploadManager()

      expect(() => getFile("non-existent")).toThrow("File not found")
    })

    it("handles upload errors gracefully", async () => {
      const { addFile, upload, onUpload, files } = useUploadManager()
      const file = new File(["content"], "test.txt", { type: "text/plain" })
      await addFile(file)

      onUpload(async () => {
        throw new Error("Network error")
      })

      await upload()

      const uploadedFile = files.value[0]
      expect(uploadedFile!.status).toBe("error")
      expect(uploadedFile!.error?.message).toBe("Network error")
    })
  })

  describe("Event System", () => {
    it("emits file:added event when file is added", async () => {
      const { addFile, on } = useUploadManager()
      const handler = vi.fn()
      on("file:added", handler)

      const file = new File(["content"], "test.txt", { type: "text/plain" })
      await addFile(file)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "test.txt",
          status: "waiting",
        }),
      )
    })

    it("emits file:removed event when file is removed", async () => {
      const { addFile, removeFile, on } = useUploadManager()
      const handler = vi.fn()
      on("file:removed", handler)

      const file = new File(["content"], "test.txt", { type: "text/plain" })
      const addedFile = await addFile(file)
      await removeFile(addedFile!.id)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it("emits upload:start and upload:complete events", async () => {
      const { addFile, upload, onUpload, on } = useUploadManager()
      const startHandler = vi.fn()
      const completeHandler = vi.fn()
      on("upload:start", startHandler)
      on("upload:complete", completeHandler)

      const file = new File(["content"], "test.txt", { type: "text/plain" })
      await addFile(file)

      onUpload(async () => ({ url: "https://example.com/uploaded.txt" }))
      await upload()

      expect(startHandler).toHaveBeenCalledTimes(1)
      expect(completeHandler).toHaveBeenCalledTimes(1)
    })
  })

  describe("PluginAzureDataLake", () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    const createMockFile = (id = "test-id", name = "test.png"): UploadFile => ({
      id,
      name,
      data: new Blob(["test"], { type: "image/png" }),
      size: 4,
      mimeType: "image/png",
      status: "uploading",
      progress: { percentage: 0 },
      meta: {},
      source: "local",
    })

    const mockContext = {
      files: [] as UploadFile[],
      options: {} as UploadOptions,
      emit: vi.fn(),
      onProgress: vi.fn(),
    }

    it("should initialize with static SAS URL", async () => {
      const storage = PluginAzureDataLake({ sasURL: "https://example.com/sas" })
      const { upload } = storage.hooks

      if (!upload) throw new Error("Upload hook not defined")
      await upload(createMockFile(), mockContext)

      expect(AzureMocks.MockDataLakeDirectoryClientConstructor).toHaveBeenCalledWith("https://example.com/sas")
    })

    it("should fetch SAS URL if getSASUrl is provided", async () => {
      const getSASUrl = vi.fn().mockResolvedValue("https://example.com/sas-dynamic?se=2099-01-01")
      const plugin = PluginAzureDataLake({ getSASUrl })
      const { upload } = plugin.hooks

      // Wait for the initial promise in the plugin setup to resolve
      await new Promise(process.nextTick)

      if (!upload) throw new Error("Upload hook not defined")
      await upload(createMockFile(), mockContext)

      expect(getSASUrl).toHaveBeenCalled()
      expect(AzureMocks.MockDataLakeDirectoryClientConstructor).toHaveBeenCalledWith("https://example.com/sas-dynamic?se=2099-01-01")
    })

    it("should refresh expired SAS token", async () => {
      // Generate an expired date (1 hour ago)
      const expiredDate = new Date()
      expiredDate.setHours(expiredDate.getHours() - 1)
      const expiredSAS = `https://example.com/sas?se=${expiredDate.toISOString()}`

      // Generate a valid future date
      const futureDate = new Date()
      futureDate.setHours(futureDate.getHours() + 1)
      const validSAS = `https://example.com/sas?se=${futureDate.toISOString()}`

      const getSASUrl = vi
        .fn()
        .mockResolvedValueOnce(expiredSAS) // First call (init) returns expired
        .mockResolvedValueOnce(validSAS) // Second call (refresh) returns valid

      const plugin = PluginAzureDataLake({
        getSASUrl,
        // Force initial SAS to normally be expired if we passed it directly,
        // but here we are simulating getSASUrl returning an expired one first.
      })

      // Allow initial fetch to happen
      await new Promise(process.nextTick)

      const { upload } = plugin.hooks
      if (!upload) throw new Error("Upload hook not defined")
      await upload(createMockFile(), mockContext)

      // Should have called twice: once on init, once on upload because the first one was expired
      expect(getSASUrl).toHaveBeenCalledTimes(2)
      // The client should differ to using the VALID one
      expect(AzureMocks.MockDataLakeDirectoryClientConstructor).toHaveBeenLastCalledWith(validSAS)
    })

    it("should NOT refresh valid SAS token", async () => {
      // Generate a valid future date
      const futureDate = new Date()
      futureDate.setHours(futureDate.getHours() + 1)
      const validSAS = `https://example.com/sas?se=${futureDate.toISOString()}`

      const getSASUrl = vi.fn().mockResolvedValue(validSAS)

      const plugin = PluginAzureDataLake({ getSASUrl })

      // Allow initial fetch
      await new Promise(process.nextTick)

      const { upload } = plugin.hooks
      if (!upload) throw new Error("Upload hook not defined")
      await upload(createMockFile(), mockContext)

      // Should have called once on init.
      // Initialization calls it, and upload checks it. Since it's valid, it shouldn't call again.
      // Wait, the plugin structure calls init:
      // if (options.getSASUrl && !options.sasURL) { options.getSASUrl().then(...) }
      // And inside getFileClient:
      // if (options.getSASUrl && isTokenExpired(sasURL.value))

      expect(getSASUrl).toHaveBeenCalledTimes(1)
    })

    it("should create subdirectory if path provided", async () => {
      const plugin = PluginAzureDataLake({
        sasURL: "https://example.com/sas",
        path: "uploads/images",
      })

      if (!plugin.hooks.upload) throw new Error("Upload hook not defined")
      await plugin.hooks.upload(createMockFile(), mockContext)

      expect(AzureMocks.mockDataLakeDirectoryClient.getSubdirectoryClient).toHaveBeenCalledWith("uploads/images")
      expect(AzureMocks.mockCreateIfNotExists).toHaveBeenCalled()
    })

    it("should NOT create subdirectory if autoCreateDirectory is false", async () => {
      const plugin = PluginAzureDataLake({
        sasURL: "https://example.com/sas",
        path: "uploads/images",
        autoCreateDirectory: false,
      })

      if (!plugin.hooks.upload) throw new Error("Upload hook not defined")
      await plugin.hooks.upload(createMockFile(), mockContext)

      expect(AzureMocks.mockDataLakeDirectoryClient.getSubdirectoryClient).toHaveBeenCalled()
      expect(AzureMocks.mockCreateIfNotExists).not.toHaveBeenCalled()
    })

    it("should cache directory creation to avoid redundant calls", async () => {
      const plugin = PluginAzureDataLake({
        sasURL: "https://example.com/sas",
        path: "uploads/images",
      })

      const { upload } = plugin.hooks
      if (!upload) throw new Error("Upload hook not defined")

      // First upload
      await upload(createMockFile("1"), mockContext)
      // Second upload
      await upload(createMockFile("2"), mockContext)

      expect(AzureMocks.mockCreateIfNotExists).toHaveBeenCalledTimes(1)
    })

    it("should upload file with correct metadata and headers", async () => {
      const plugin = PluginAzureDataLake({
        sasURL: "https://example.com/sas",
        metadata: { custom: "value" },
      })

      const file = createMockFile()
      if (!plugin.hooks.upload) throw new Error("Upload hook not defined")
      await plugin.hooks.upload(file, mockContext)

      expect(AzureMocks.mockUpload).toHaveBeenCalledWith(
        file.data,
        expect.objectContaining({
          metadata: expect.objectContaining({
            custom: "value",
            mimeType: "image/png",
            originalName: "test.png",
          }),
          pathHttpHeaders: expect.objectContaining({
            contentType: "image/png",
          }),
        }),
      )
    })

    it("should report progress during upload", async () => {
      const plugin = PluginAzureDataLake({ sasURL: "https://example.com/sas" })

      // Intercept the onProgress passed to Azure SDK and call it
      AzureMocks.mockUpload.mockImplementationOnce((data, options) => {
        options.onProgress({ loadedBytes: 2 }) // 50% of size 4
      })

      if (!plugin.hooks.upload) throw new Error("Upload hook not defined")
      await plugin.hooks.upload(createMockFile(), mockContext)

      expect(mockContext.onProgress).toHaveBeenCalledWith(50)
    })

    it("should remove file correctly", async () => {
      const plugin = PluginAzureDataLake({ sasURL: "https://example.com/sas" })
      const { remove } = plugin.hooks

      if (!remove) throw new Error("Remove hook not defined")
      await remove(createMockFile(), mockContext)

      expect(AzureMocks.mockDeleteIfExists).toHaveBeenCalled()
    })

    it("should get remote file attributes", async () => {
      const plugin = PluginAzureDataLake({ sasURL: "https://example.com/sas" })
      const { getRemoteFile } = plugin.hooks

      AzureMocks.mockGetProperties.mockResolvedValueOnce({
        contentLength: 1024,
        contentType: "image/jpeg",
      })

      if (!getRemoteFile) throw new Error("GetRemoteFile hook not defined")
      const result = await getRemoteFile("test-id", mockContext)

      expect(result).toEqual({
        size: 1024,
        mimeType: "image/jpeg",
        remoteUrl: "https://mock-storage.blob.core.windows.net/container/path/file.png",
      })
    })

    it("should handle Azure errors gracefully with retries", async () => {
      // Use real timers for this test since we need async operations to complete
      vi.useRealTimers()

      const plugin = PluginAzureDataLake({
        sasURL: "https://example.com/sas",
        retries: 2,
        retryDelay: 10, // Short delay for testing
      })
      const { upload } = plugin.hooks

      const error = new Error("Azure Error")
      // Mock to fail all retry attempts
      AzureMocks.mockUpload.mockRejectedValue(error)

      if (!upload) throw new Error("Upload hook not defined")

      // With retries, the error message will be wrapped
      await expect(upload(createMockFile(), mockContext)).rejects.toThrow(/failed after \d+ attempts/)

      // Verify it attempted retries (1 initial + 2 retries = 3 total attempts)
      expect(AzureMocks.mockUpload).toHaveBeenCalledTimes(3)
    })
  })
})

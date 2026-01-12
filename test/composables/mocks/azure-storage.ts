import { vi } from "vitest"

export const mockUpload = vi.fn()
export const mockGetProperties = vi.fn()
export const mockDeleteIfExists = vi.fn()
export const mockCreateIfNotExists = vi.fn()

export const mockFileClient = {
  upload: mockUpload,
  getProperties: mockGetProperties,
  deleteIfExists: mockDeleteIfExists,
  url: "https://mock-storage.blob.core.windows.net/container/path/file.png",
  name: "path/file.png",
}

export const mockSubdirectoryClient = {
  createIfNotExists: mockCreateIfNotExists,
  getFileClient: vi.fn(() => mockFileClient),
}

export const mockDataLakeDirectoryClient = {
  getSubdirectoryClient: vi.fn(() => mockSubdirectoryClient),
  getFileClient: vi.fn(() => mockFileClient),
}

export const MockDataLakeDirectoryClientConstructor = vi.fn(function () {
  return mockDataLakeDirectoryClient
})

// Export alias to match the SDK export name if needed, mainly for clarity
export const DataLakeDirectoryClient = MockDataLakeDirectoryClientConstructor

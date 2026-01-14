---
title: useUploadManager
description: A comprehensive file upload management composable with plugin support.
category: composable
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/your-username/nuxt-ui-elements/blob/main/src/runtime/composables/useUploadManager/index.ts
---

## Usage

The `useUploadManager` composable provides a powerful, plugin-based system for managing file uploads with validation, processing, and storage.

```vue
<script setup lang="ts">
  const uploader = useUploadManager({
    maxFiles: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ["image/*", "video/*"],
    thumbnails: true,
    imageCompression: true,
  })

  const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
      await uploader.addFiles(Array.from(input.files))
    }
  }
</script>

<template>
  <div>
    <input type="file" multiple @change="handleFileSelect" />

    <div v-for="file in uploader.files" :key="file.id">
      <img v-if="file.preview" :src="file.preview" />
      <span>{{ file.name }} - {{ file.status }}</span>
      <button @click="uploader.removeFile(file.id)">Remove</button>
    </div>

    <button @click="uploader.upload()">Upload</button>
  </div>
</template>
```

## Options

| Option             | Type                            | Default     | Description                                   |
| ------------------ | ------------------------------- | ----------- | --------------------------------------------- |
| `storage`          | `StoragePlugin`                 | `undefined` | Storage plugin for uploading files            |
| `plugins`          | `ProcessingPlugin[]`            | `[]`        | Additional processing plugins                 |
| `maxFiles`         | `number \| false`               | `false`     | Maximum number of files allowed               |
| `maxFileSize`      | `number \| false`               | `false`     | Maximum file size in bytes                    |
| `allowedFileTypes` | `string[] \| false`             | `false`     | Allowed MIME types (supports wildcards)       |
| `thumbnails`       | `boolean \| ThumbnailOptions`   | `false`     | Enable thumbnail generation                   |
| `imageCompression` | `boolean \| CompressionOptions` | `false`     | Enable image compression                      |
| `autoProceed`      | `boolean`                       | `false`     | Automatically start upload after adding files |

### Thumbnail Options

```ts
interface ThumbnailOptions {
  width?: number // Default: 128
  height?: number // Default: 128
  quality?: number // Default: 1
}
```

### Compression Options

```ts
interface CompressionOptions {
  maxWidth?: number // Default: 1920
  maxHeight?: number // Default: 1920
  quality?: number // Default: 0.85
  outputFormat?: "auto" | "jpeg" | "png" | "webp"
  minSizeToCompress?: number // Default: 100KB
  preserveMetadata?: boolean // Default: true
}
```

## Returns

| Property/Method | Type                                       | Description                        |
| --------------- | ------------------------------------------ | ---------------------------------- |
| `files`         | `Ref<UploadFile[]>`                        | Reactive array of files (readonly) |
| `totalProgress` | `ComputedRef<number>`                      | Overall upload progress (0-100)    |
| `status`        | `Ref<UploadStatus>`                        | Current upload status              |
| `addFile`       | `(file: File) => Promise<UploadFile>`      | Add a single file                  |
| `addFiles`      | `(files: File[]) => Promise<UploadFile[]>` | Add multiple files                 |
| `removeFile`    | `(fileId: string) => Promise<void>`        | Remove a file by ID                |
| `removeFiles`   | `(fileIds: string[]) => void`              | Remove multiple files              |
| `clearFiles`    | `() => void`                               | Remove all files                   |
| `reorderFile`   | `(oldIndex, newIndex) => void`             | Reorder files                      |
| `getFile`       | `(fileId: string) => UploadFile`           | Get a file by ID                   |
| `upload`        | `() => Promise<void>`                      | Start uploading                    |
| `reset`         | `() => void`                               | Reset to initial state             |
| `on`            | `(event, handler) => void`                 | Subscribe to events                |

### File Data Access Methods

| Method                             | Description                                 |
| ---------------------------------- | ------------------------------------------- |
| `getFileData(fileId)`              | Get file data as Blob (loads into memory)   |
| `getFileURL(fileId)`               | Get object URL for file (memory efficient)  |
| `getFileStream(fileId)`            | Get file as ReadableStream (most efficient) |
| `replaceFileData(fileId, newData)` | Replace file data (for editing)             |
| `initializeExistingFiles(files)`   | Load existing files from storage            |

## File Object

Each file in the `files` array has this structure:

```ts
interface UploadFile {
  id: string
  name: string
  size: number
  mimeType: string
  status: "waiting" | "preprocessing" | "uploading" | "postprocessing" | "complete" | "error"
  progress: { percentage: number }
  preview?: string // Thumbnail or preview URL
  remoteUrl?: string // URL after upload
  uploadResult?: any // Result from storage plugin
  error?: FileError // Error details if status is 'error'
  source: "local" | "storage" | string
  meta: Record<string, any>
}
```

## Events

Subscribe to events using the `on` method:

```ts
const uploader = useUploadManager()

// Core events
uploader.on("file:added", (file) => console.log("Added:", file.name))
uploader.on("file:removed", (file) => console.log("Removed:", file.name))
uploader.on("file:error", ({ file, error }) => console.error(error))
uploader.on("file:replaced", (file) => console.log("Replaced:", file.name))

uploader.on("upload:start", (files) => console.log("Starting upload..."))
uploader.on("upload:progress", ({ file, progress }) => console.log(`${progress}%`))
uploader.on("upload:complete", (files) => console.log("Upload complete!"))

uploader.on("files:reorder", ({ oldIndex, newIndex }) => console.log("Reordered"))

// Plugin-specific events (prefixed with plugin ID)
uploader.on("thumbnail-generator:generated", (data) => console.log("Thumbnail ready"))
uploader.on("image-compressor:compressed", (data) => console.log("Image compressed"))
```

## Plugins

### Built-in Validators

Validators are automatically added based on options:

- **MaxFiles** - Limits the number of files
- **MaxFileSize** - Limits individual file size
- **AllowedFileTypes** - Restricts file types

### Built-in Processors

- **ThumbnailGenerator** - Creates preview thumbnails for images/videos
- **ImageCompressor** - Compresses images before upload

### Storage Plugins

Storage plugins handle the actual upload to your backend:

```ts
import { PluginAzureDataLake } from "nuxt-ui-elements/runtime/composables/useUploadManager/plugins"

const uploader = useUploadManager({
  storage: PluginAzureDataLake({
    accountName: "your-account",
    fileSystemName: "your-container",
  }),
})
```

## Examples

### Basic File Upload

```vue
<script setup lang="ts">
  const uploader = useUploadManager({
    maxFiles: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ["image/*"],
  })

  const onFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement
    if (input.files?.length) {
      await uploader.addFiles(Array.from(input.files))
    }
  }

  const startUpload = () => {
    uploader.upload()
  }
</script>

<template>
  <div>
    <input type="file" multiple accept="image/*" @change="onFileChange" />

    <div v-for="file in uploader.files" :key="file.id" class="flex items-center gap-2">
      <img v-if="file.preview" :src="file.preview" class="w-12 h-12 object-cover" />
      <div>
        <p>{{ file.name }}</p>
        <p v-if="file.status === 'uploading'">{{ file.progress.percentage }}%</p>
        <p v-if="file.status === 'error'" class="text-red-500">{{ file.error?.message }}</p>
      </div>
      <button @click="uploader.removeFile(file.id)">Remove</button>
    </div>

    <p>Total Progress: {{ uploader.totalProgress }}%</p>
    <button @click="startUpload" :disabled="!uploader.files.length">Upload All</button>
  </div>
</template>
```

### Image Editing

Replace file data after editing (e.g., cropping):

```ts
const uploader = useUploadManager()

async function cropImage(fileId: string, cropArea: CropArea) {
  // Get the original file data
  const blob = await uploader.getFileData(fileId)

  // Apply cropping
  const croppedBlob = await applyCrop(blob, cropArea)

  // Replace with cropped version (will regenerate thumbnail)
  await uploader.replaceFileData(fileId, croppedBlob, "cropped-image.jpg")
}
```

### Custom Upload Function

If you're not using a storage plugin, provide your own upload function:

```ts
const uploader = useUploadManager()

uploader.onUpload(async (file, onProgress) => {
  const formData = new FormData()
  formData.append("file", file.data as Blob)

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  const result = await response.json()
  return result // Will be stored in file.uploadResult
})
```

### Drag and Drop

```vue
<script setup lang="ts">
  const uploader = useUploadManager()
  const isDragging = ref(false)

  const handleDrop = async (e: DragEvent) => {
    isDragging.value = false
    const files = e.dataTransfer?.files
    if (files?.length) {
      await uploader.addFiles(Array.from(files))
    }
  }
</script>

<template>
  <div
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @drop.prevent="handleDrop"
    :class="{ 'bg-primary/10': isDragging }"
    class="border-2 border-dashed p-8 text-center">
    Drop files here
  </div>
</template>
```

<script setup lang="ts">
  import type { UploadFile } from "#ui-elements"

  const toast = useToast()

  // Configuration state
  const config = ref({
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ["image/jpeg", "image/png", "image/webp"],
    thumbnails: true,
    imageCompression: false,
    autoProceed: false,
  })

  // Create uploader with reactive config
  const { files, totalProgress, addFiles, removeFile, clearFiles, upload, onUpload, on } = useUploader({
    maxFiles: config.value.maxFiles || false,
    maxFileSize: config.value.maxFileSize || false,
    allowedFileTypes: config.value.allowedFileTypes.length > 0 ? config.value.allowedFileTypes : false,
    thumbnails: config.value.thumbnails,
    imageCompression: config.value.imageCompression,
    autoProceed: config.value.autoProceed,
  })

  // Configure upload handler
  onUpload(async (file: UploadFile, onProgress: (progress: number) => void) => {
    // Simulate upload with progress
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        onProgress(progress)

        if (progress >= 100) {
          clearInterval(interval)
          resolve(`https://example.com/uploads/${file.id}`)
        }
      }, 200)
    })
  })

  // Setup event listeners
  on("file:added", (file) => {
    toast.add({
      title: "File added",
      description: `${file.name} (${formatFileSize(file.size)})`,
      color: "primary",
    })
  })

  on("file:error", ({ file, error }) => {
    toast.add({
      title: "Upload error",
      description: `${file.name}: ${error.message}`,
      color: "error",
    })
  })

  on("upload:complete", (files) => {
    toast.add({
      title: "Upload complete",
      description: `${files.length} file(s) uploaded successfully`,
      color: "success",
    })
  })

  // File input handler
  const fileInput = ref<HTMLInputElement>()

  const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
      await addFiles(Array.from(input.files))
    }
  }

  const triggerFileSelect = () => {
    fileInput.value?.click()
  }

  // Utility functions
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + (sizes[i] ?? "Bytes")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "neutral"
      case "uploading":
        return "primary"
      case "complete":
        return "success"
      case "error":
        return "error"
      default:
        return "neutral"
    }
  }

  const getCompressionInfo = (file: UploadFile) => {
    if (file.meta.compressed && typeof file.meta.compressionRatio === "number") {
      return `Compressed: ${file.meta.compressionRatio}% saved`
    }
    return null
  }

  const handleRemoveFile = (fileId: string) => {
    removeFile(fileId)
  }

  const clearAllFiles = () => {
    clearFiles()
  }

  const startUpload = () => {
    upload()
  }

  // Available file types for testing
  const fileTypePresets = [
    { label: "Images", value: ["image/jpeg", "image/png", "image/webp"] },
    { label: "Images + GIF", value: ["image/jpeg", "image/png", "image/webp", "image/gif"] },
    { label: "Documents", value: ["application/pdf", "application/msword"] },
    { label: "Videos", value: ["video/mp4", "video/webm"] },
    { label: "All Files", value: [] },
  ]

  const selectedPreset = ref(0)
  const applyPreset = (index: number) => {
    selectedPreset.value = index
    const preset = fileTypePresets[index]
    if (preset) {
      config.value.allowedFileTypes = preset.value
    }
  }
</script>

<template>
  <div class="p-6 space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Uploader Playground</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Test the useUploader composable with different configurations</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Configuration Panel -->
      <UCard class="lg:col-span-1">
        <template #header>
          <h2 class="font-semibold">Configuration</h2>
        </template>

        <div class="space-y-4">
          <!-- Max Files -->
          <div>
            <label class="block text-sm font-medium mb-2">Max Files</label>
            <UInput v-model.number="config.maxFiles" type="number" min="0" placeholder="Unlimited" />
          </div>

          <!-- Max File Size -->
          <div>
            <label class="block text-sm font-medium mb-2">Max File Size (MB)</label>
            <UInput
              type="number"
              min="0"
              step="0.1"
              :model-value="config.maxFileSize / 1024 / 1024"
              @update:model-value="(val: number | null) => (config.maxFileSize = val ? val * 1024 * 1024 : 0)" />
          </div>

          <!-- File Type Presets -->
          <div>
            <label class="block text-sm font-medium mb-2">Allowed File Types</label>
            <USelectMenu
              :model-value="selectedPreset"
              :options="fileTypePresets.map((p, i) => ({ label: p.label, value: i }))"
              value-attribute="value"
              @update:model-value="(val) => applyPreset(val as number)" />
          </div>

          <!-- Thumbnails -->
          <div>
            <label class="flex items-center gap-2">
              <UCheckbox v-model="config.thumbnails" />
              <span class="text-sm font-medium">Generate Thumbnails</span>
            </label>
          </div>

          <!-- Image Compression -->
          <div>
            <label class="flex items-center gap-2">
              <UCheckbox v-model="config.imageCompression" />
              <span class="text-sm font-medium">Enable Image Compression</span>
            </label>
          </div>

          <!-- Auto Proceed -->
          <div>
            <label class="flex items-center gap-2">
              <UCheckbox v-model="config.autoProceed" />
              <span class="text-sm font-medium">Auto Upload</span>
            </label>
          </div>
        </div>
      </UCard>

      <!-- Upload Area & File List -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Upload Area -->
        <UCard>
          <div class="text-center py-12">
            <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />

            <UIcon name="i-heroicons-cloud-arrow-up" class="w-16 h-16 mx-auto text-gray-400 mb-4" />

            <h3 class="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Max {{ config.maxFiles || "∞" }} files, {{ config.maxFileSize ? formatFileSize(config.maxFileSize) : "∞" }} max size
            </p>

            <UButton size="lg" @click="triggerFileSelect"> Select Files </UButton>
          </div>
        </UCard>

        <!-- Progress -->
        <UCard v-if="files.length > 0">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold">Files ({{ files.length }})</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Progress: {{ totalProgress }}%</p>
              </div>
              <div class="flex gap-2">
                <UButton
                  v-if="!config.autoProceed"
                  color="primary"
                  :disabled="files.every((f) => f.status !== 'waiting')"
                  @click="startUpload">
                  Upload All
                </UButton>
                <UButton color="error" variant="soft" @click="clearAllFiles"> Clear All </UButton>
              </div>
            </div>
          </template>

          <!-- File List -->
          <div class="space-y-3">
            <div v-for="file in files" :key="file.id" class="flex items-start gap-4 p-3 border dark:border-gray-700 rounded-lg">
              <!-- Thumbnail -->
              <div class="shrink-0">
                <img v-if="file.preview" :src="file.preview" class="w-16 h-16 object-cover rounded" :alt="file.name" />
                <div v-else class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                  <UIcon name="i-heroicons-document" class="w-8 h-8 text-gray-400" />
                </div>
              </div>

              <!-- File Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <div class="flex-1 min-w-0">
                    <p class="font-medium truncate">{{ file.name }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatFileSize(file.size) }} • {{ file.mimeType }}</p>
                  </div>
                  <UBadge :color="getStatusColor(file.status)">
                    {{ file.status }}
                  </UBadge>
                </div>

                <!-- Progress Bar -->
                <div v-if="file.status === 'uploading' || file.status === 'complete'" class="mt-2">
                  <UProgress :model-value="file.progress.percentage" />
                </div>

                <!-- Error Message -->
                <div v-if="file.error" class="mt-2">
                  <UAlert color="error" variant="soft" :title="file.error.message" />
                </div>

                <!-- Meta Info -->
                <div v-if="getCompressionInfo(file)" class="mt-2 text-xs text-gray-500">
                  <span>{{ getCompressionInfo(file) }}</span>
                </div>
              </div>

              <!-- Actions -->
              <UButton icon="i-heroicons-x-mark" color="error" variant="ghost" size="sm" @click="handleRemoveFile(file.id)" />
            </div>
          </div>
        </UCard>

        <!-- Empty State -->
        <UCard v-else>
          <div class="text-center py-8 text-gray-500">No files selected. Click "Select Files" to start.</div>
        </UCard>
      </div>
    </div>

    <!-- Debug Info -->
    <UCard>
      <template #header>
        <h3 class="font-semibold">Debug Info</h3>
      </template>
      <pre class="text-xs overflow-auto">{{
        {
          config,
          files: files.map((f) => ({
            id: f.id,
            name: f.name,
            status: f.status,
            progress: f.progress.percentage,
            meta: f.meta,
          })),
        }
      }}</pre>
    </UCard>
  </div>
</template>

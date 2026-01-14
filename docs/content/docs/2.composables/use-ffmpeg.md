---
title: useFFMpeg
description: A composable for video conversion using FFmpeg WASM.
category: composable
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/your-username/nuxt-ui-elements/blob/main/src/runtime/composables/useFFMpeg.ts
  - label: FFmpeg WASM
    icon: i-lucide-external-link
    to: https://ffmpegwasm.netlify.app/
---

## Usage

The `useFFMpeg` composable provides video conversion capabilities using FFmpeg compiled to WebAssembly. This allows you to convert videos entirely in the browser without server-side processing.

```vue
<script setup lang="ts">
const ffmpeg = useFFMpeg({
  inputUrl: videoUrl.value
})

await ffmpeg.load()
const converted = await ffmpeg.convert(['-preset', 'ultrafast'])
ffmpeg.unload()
</script>
```

::warning
FFmpeg WASM requires SharedArrayBuffer, which needs specific HTTP headers (COOP/COEP) to be enabled on your server.
::

## Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `inputUrl` | `string` | Yes | URL of the video to convert |
| `convertOptions` | `string[]` | No | Default FFmpeg conversion options |

## Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `status` | `Ref<'paused' \| 'converting' \| 'success' \| 'error'>` | Current conversion status |
| `progress` | `Ref<number>` | Conversion progress in seconds |
| `convertedFile` | `Ref<File \| undefined>` | The converted file after success |
| `load` | `() => Promise<void>` | Load FFmpeg (downloads WASM) |
| `unload` | `() => void` | Unload FFmpeg to free memory |
| `convert` | `(options: string[]) => Promise<File>` | Start conversion |
| `onConvertSuccess` | `(callback) => void` | Register success callback |

## Example

### Basic Video Conversion

```vue
<script setup lang="ts">
const videoUrl = ref('')
const isLoading = ref(false)

const ffmpeg = useFFMpeg({
  inputUrl: videoUrl.value
})

// Register success callback
ffmpeg.onConvertSuccess((file) => {
  console.log('Converted file:', file.name, file.size)
})

async function convertVideo() {
  isLoading.value = true

  try {
    // Load FFmpeg WASM (first time downloads ~30MB)
    await ffmpeg.load()

    // Convert to MP4
    const result = await ffmpeg.convert([
      '-preset', 'ultrafast',
      '-crf', '28'
    ])

    // Create download link
    const url = URL.createObjectURL(result)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.mp4'
    a.click()
  } finally {
    ffmpeg.unload()
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <input v-model="videoUrl" placeholder="Video URL" />

    <div v-if="ffmpeg.status === 'converting'">
      Converting... {{ ffmpeg.progress }}s processed
    </div>

    <div v-if="ffmpeg.status === 'error'" class="text-red-500">
      Conversion failed
    </div>

    <button @click="convertVideo" :disabled="isLoading || !videoUrl">
      Convert to MP4
    </button>
  </div>
</template>
```

### With Progress Bar

```vue
<script setup lang="ts">
const ffmpeg = useFFMpeg({
  inputUrl: '/path/to/video.avi'
})

const videoDuration = ref(60) // seconds

const progressPercent = computed(() => {
  if (videoDuration.value === 0) return 0
  return Math.min(100, (ffmpeg.progress.value / videoDuration.value) * 100)
})
</script>

<template>
  <div>
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div
        class="bg-primary h-2.5 rounded-full transition-all"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>
    <p class="text-sm text-muted">{{ progressPercent.toFixed(1) }}%</p>
  </div>
</template>
```

## FFmpeg Options

The `convert` method accepts FFmpeg command-line options. Common options:

### Quality/Speed Presets

```ts
// Faster conversion, larger file
ffmpeg.convert(['-preset', 'ultrafast'])

// Slower conversion, smaller file
ffmpeg.convert(['-preset', 'slow'])
```

### Constant Rate Factor (CRF)

```ts
// Higher quality (larger file)
ffmpeg.convert(['-crf', '18'])

// Lower quality (smaller file)
ffmpeg.convert(['-crf', '28'])
```

### Video Codec

```ts
// Use H.264 codec
ffmpeg.convert(['-c:v', 'libx264'])

// Copy without re-encoding (fastest)
ffmpeg.convert(['-c', 'copy'])
```

## Server Configuration

For FFmpeg WASM to work, your server must send these headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

### Nuxt Configuration

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp'
        }
      }
    }
  }
})
```

## Notes

- FFmpeg WASM is loaded from a CDN (unpkg.com) by default
- First load downloads approximately 30MB of WASM files
- Conversion happens entirely in the browser
- Memory usage can be high for large videos
- Always call `unload()` when done to free memory

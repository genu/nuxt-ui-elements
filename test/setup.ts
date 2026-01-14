import { vi, beforeEach } from "vitest"

// Create mock classes
class MockHTMLCanvasElement {
  width = 0
  height = 0

  getContext() {
    return {
      drawImage: vi.fn(),
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    }
  }

  toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: number) {
    const blob = new Blob(["mock-canvas-data"], { type: type || "image/png" })
    setTimeout(() => callback(blob), 0)
  }

  toDataURL(type?: string, quality?: number) {
    // Return a mock data URL
    return `data:${type || "image/png"};base64,mockBase64Data`
  }
}

class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  private _src = ""
  width = 1920
  height = 1080

  get src() {
    return this._src
  }

  set src(value: string) {
    this._src = value
    // Trigger onload after src is set
    Promise.resolve().then(() => {
      if (this.onload) this.onload()
    })
  }
}

class MockHTMLVideoElement {
  onloadedmetadata: (() => void) | null = null
  onseeked: (() => void) | null = null
  onerror: (() => void) | null = null
  private _src = ""
  private _currentTime = 0
  videoWidth = 1920
  videoHeight = 1080
  duration = 10
  preload = ""
  muted = false

  get src() {
    return this._src
  }

  set src(value: string) {
    this._src = value
    // Trigger onloadedmetadata after src is set
    Promise.resolve().then(() => {
      if (this.onloadedmetadata) this.onloadedmetadata()
    })
  }

  get currentTime() {
    return this._currentTime
  }

  set currentTime(value: number) {
    this._currentTime = value
    // Trigger onseeked after currentTime is set
    Promise.resolve().then(() => {
      if (this.onseeked) this.onseeked()
    })
  }

  play() {
    return Promise.resolve()
  }

  pause() {}
}

// Set up global mocks
if (!global.HTMLCanvasElement) {
  global.HTMLCanvasElement = MockHTMLCanvasElement as any
}

if (!global.Image) {
  global.Image = MockImage as any
}

if (!global.HTMLVideoElement) {
  global.HTMLVideoElement = MockHTMLVideoElement as any
}

// Mock URL APIs
if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = vi.fn((blob: Blob) => `blob:mock-${Math.random()}`)
}

if (!global.URL.revokeObjectURL) {
  global.URL.revokeObjectURL = vi.fn()
}

// Mock document.createElement
if (!global.document) {
  global.document = {
    createElement(tagName: string) {
      if (tagName === "canvas") {
        return new MockHTMLCanvasElement()
      }
      if (tagName === "img") {
        return new MockImage()
      }
      if (tagName === "video") {
        return new MockHTMLVideoElement()
      }
      return {}
    },
  } as any
}

// Set up spies on prototype methods before each test
beforeEach(() => {
  // Spy on HTMLCanvasElement.prototype methods
  vi.spyOn(global.HTMLCanvasElement.prototype, "getContext")
  vi.spyOn(global.HTMLCanvasElement.prototype, "toBlob")
})

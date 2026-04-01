interface ThemeOptions {
  theme: {
    colors: string[]
  }
}

export default (_options: ThemeOptions) => ({
  slots: {
    root: "",
    grid: "grid",
    item: "overflow-hidden rounded-lg cursor-pointer transition-opacity hover:opacity-80",
    image: "w-full h-full object-cover",
    overlay: "fixed inset-0 z-50 bg-black/80 flex items-center justify-center",
    lightbox: "relative w-full h-full p-4 sm:p-8",
    lightboxImage: "object-contain max-h-full max-w-full mx-auto",
    close: "absolute top-4 right-4 z-10",
    counter: "absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm",
  },
  variants: {
    columns: {
      1: { grid: "grid-cols-1" },
      2: { grid: "grid-cols-2" },
      3: { grid: "grid-cols-3" },
      4: { grid: "grid-cols-4" },
      5: { grid: "grid-cols-5" },
      6: { grid: "grid-cols-6" },
    },
    gap: {
      xs: { grid: "gap-1" },
      sm: { grid: "gap-2" },
      md: { grid: "gap-4" },
      lg: { grid: "gap-6" },
    },
    ratio: {
      square: { item: "aspect-square" },
      video: { item: "aspect-video" },
      auto: {},
    },
    layout: {
      grid: {},
      masonry: {},
    },
  },
  defaultVariants: {
    columns: 3,
    gap: "sm",
    ratio: "square",
    layout: "grid",
  },
})

interface ThemeOptions {
  theme: {
    colors: string[]
  }
}

export default (_options: ThemeOptions) => ({
  slots: {
    root: "flex flex-wrap gap-2",
    item: [
      "relative inline-flex items-center justify-center cursor-pointer select-none",
      "transition-all duration-200",
      "focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ],
  },
  variants: {
    orientation: {
      horizontal: {
        root: "flex-row",
      },
      vertical: {
        root: "flex-col",
      },
    },
    disabled: {
      true: {
        item: "cursor-not-allowed opacity-50",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

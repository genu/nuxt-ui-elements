interface ThemeOptions {
  theme: {
    colors: string[]
  }
}

export default (_options: ThemeOptions) => ({
  slots: {
    root: "",
  },
  variants: {
    pattern: {
      dots: "",
      lines: "",
    },
  },
  defaultVariants: {
    pattern: "dots",
  },
})

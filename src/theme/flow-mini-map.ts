interface ThemeOptions {
  theme: {
    colors: string[]
  }
}

export default (_options: ThemeOptions) => ({
  slots: {
    root: "border border-accented rounded-lg shadow-sm overflow-hidden",
  },
  variants: {},
  defaultVariants: {},
})

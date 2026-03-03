interface ThemeOptions {
  theme: {
    colors: string[]
  }
}

export default (_options: ThemeOptions) => ({
  slots: {
    root: "bg-default border border-accented rounded-lg shadow-sm overflow-hidden",
    button: "p-2 hover:bg-elevated transition-colors border-b border-accented last:border-b-0",
  },
  variants: {},
  defaultVariants: {},
})

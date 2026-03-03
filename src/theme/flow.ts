interface ThemeOptions {
  theme: {
    colors: string[]
  }
}

export default (_options: ThemeOptions) => ({
  slots: {
    root: "w-full h-[500px] relative",
    wrapper: "",
  },
  variants: {},
  defaultVariants: {},
})

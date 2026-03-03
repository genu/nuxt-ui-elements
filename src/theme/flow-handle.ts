interface ThemeOptions {
  theme: {
    colors: string[]
  }
}

export default (options: ThemeOptions) => ({
  slots: {
    root: [
      "!size-3 !rounded-full !border-2 !bg-default",
      "transition-colors duration-150",
    ],
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ""])),
      neutral: "",
    },
    connected: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    // Default state: colored border, fill on hover
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      class: {
        root: `!border-${color} hover:!bg-${color}`,
      },
    })),
    {
      color: "neutral",
      class: {
        root: "!border-accented hover:!bg-inverted",
      },
    },

    // Connected state: filled with color
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      connected: true,
      class: {
        root: `!bg-${color}`,
      },
    })),
    {
      color: "neutral",
      connected: true,
      class: {
        root: "!bg-inverted",
      },
    },
  ],
  defaultVariants: {
    color: "primary",
    connected: false,
  },
})

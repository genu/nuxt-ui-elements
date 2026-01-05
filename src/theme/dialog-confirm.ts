interface ThemeOptions {
  theme: {
    colors: string[]
  }
}

export default (options: ThemeOptions) => ({
  slots: {
    content: "divide-y-0 bg-default ring-0",
    header: "relative flex items-center gap-1.5 p-4 sm:px-6 min-h-16",
    icon: "shrink-0 mt-1 size-6",
    title: "text-lg font-semibold",
    description: "text-sm opacity-90",
    body: "p-2 sm:p-5 sm:pt-0",
    footer: "justify-end gap-3",
    close: "",
  },
  variants: {
    size: {
      sm: {
        content: "sm:max-w-md",
      },
      md: {
        content: "sm:max-w-3xl",
      },
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ""])),
      neutral: "",
    },
    variant: {
      solid: "",
      outline: "",
    },
  },
  compoundVariants: [
    // Solid variants - dynamically generated for all theme colors
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: "solid",
      class: {
        content: `bg-${color} text-inverted`,
        close: "!text-white hover:bg-white/10 active:bg-white/20",
      },
    })),
    {
      color: "neutral",
      variant: "solid",
      class: {
        content: "text-inverted bg-inverted",
        close: "!text-white hover:bg-white/10 active:bg-white/20",
      },
    },

    // Outline variants - dynamically generated for all theme colors
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: "outline",
      class: {
        content: `bg-gradient-to-b from-${color}/5 to-${color}/5 bg-default text-${color} !ring !ring-inset !ring-${color}`,
      },
    })),
    {
      color: "neutral",
      variant: "outline",
      class: {
        content: "text-highlighted bg-elevated !ring !ring-inset !ring-accented",
      },
    },
  ],
  defaultVariants: {
    color: "primary",
    variant: "solid",
    size: "sm",
  },
})

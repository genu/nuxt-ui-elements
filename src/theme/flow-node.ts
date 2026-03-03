interface ThemeOptions {
  theme: {
    colors: string[]
  }
}

export default (options: ThemeOptions) => ({
  slots: {
    root: [
      "rounded-lg border px-4 py-3 shadow-sm",
      "transition-all duration-200",
      "min-w-[150px]",
    ],
    label: "text-sm font-medium",
    content: "text-xs mt-1 opacity-80",
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ""])),
      neutral: "",
    },
    variant: {
      solid: "",
      outline: "",
      soft: "",
      subtle: "",
    },
    selected: {
      true: {
        root: "ring-2 ring-offset-2 ring-offset-default",
      },
      false: "",
    },
  },
  compoundVariants: [
    // Solid variants
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: "solid",
      class: {
        root: `bg-${color} text-inverted border-${color}`,
      },
    })),
    {
      color: "neutral",
      variant: "solid",
      class: {
        root: "bg-inverted text-inverted border-inverted",
      },
    },

    // Outline variants
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: "outline",
      class: {
        root: `bg-default border-${color} text-${color}`,
      },
    })),
    {
      color: "neutral",
      variant: "outline",
      class: {
        root: "bg-default border-accented text-highlighted",
      },
    },

    // Soft variants
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: "soft",
      class: {
        root: `bg-${color}/10 border-${color}/20 text-${color}`,
      },
    })),
    {
      color: "neutral",
      variant: "soft",
      class: {
        root: "bg-elevated border-accented text-highlighted",
      },
    },

    // Subtle variants
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: "subtle",
      class: {
        root: `bg-${color}/5 border-transparent text-${color}`,
      },
    })),
    {
      color: "neutral",
      variant: "subtle",
      class: {
        root: "bg-elevated/50 border-transparent text-highlighted",
      },
    },

    // Selected + color ring
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      selected: true,
      class: {
        root: `ring-${color}`,
      },
    })),
    {
      color: "neutral",
      selected: true,
      class: {
        root: "ring-accented",
      },
    },
  ],
  defaultVariants: {
    color: "primary",
    variant: "outline",
    selected: false,
  },
})

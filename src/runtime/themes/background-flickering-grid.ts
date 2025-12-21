const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'] as const;

export default {
  slots: {
    base: "w-full h-full absolute inset-0 pointer-events-none",
    canvas: "w-full h-full block",
  },
  variants: {
    color: {
      primary: "",
      secondary: "",
      success: "",
      info: "",
      warning: "",
      error: "",
      neutral: "",
    },
    variant: {
      subtle: "",
      soft: "",
      solid: "",
    },
  },
  compoundVariants: [
    // Generate variants for each color + variant combination
    ...colors.flatMap(color => [
      {
        color,
        variant: 'subtle' as const,
        class: {
          canvas: `[.bg-${color}-50_&]:_[--grid-end-color:theme(colors.${color}.50)] [.bg-${color}-100_&]:_[--grid-start-color:theme(colors.${color}.100)] [.bg-${color}-200_&]:_[--grid-flicker-color:theme(colors.${color}.200)]`,
        },
      },
      {
        color,
        variant: 'soft' as const,
        class: {
          canvas: `[.bg-${color}-100_&]:_[--grid-end-color:theme(colors.${color}.100)] [.bg-${color}-200_&]:_[--grid-start-color:theme(colors.${color}.200)] [.bg-${color}-300_&]:_[--grid-flicker-color:theme(colors.${color}.300)]`,
        },
      },
      {
        color,
        variant: 'solid' as const,
        class: {
          canvas: `[.bg-${color}-200_&]:_[--grid-end-color:theme(colors.${color}.200)] [.bg-${color}-400_&]:_[--grid-start-color:theme(colors.${color}.400)] [.bg-${color}-500_&]:_[--grid-flicker-color:theme(colors.${color}.500)]`,
        },
      },
    ]),
    // Neutral variants (using gray)
    {
      color: 'neutral' as const,
      variant: 'subtle' as const,
      class: {
        canvas: "[.bg-gray-50_&]:_[--grid-end-color:theme(colors.gray.50)] [.bg-gray-100_&]:_[--grid-start-color:theme(colors.gray.100)] [.bg-gray-200_&]:_[--grid-flicker-color:theme(colors.gray.200)]",
      },
    },
    {
      color: 'neutral' as const,
      variant: 'soft' as const,
      class: {
        canvas: "[.bg-gray-100_&]:_[--grid-end-color:theme(colors.gray.100)] [.bg-gray-200_&]:_[--grid-start-color:theme(colors.gray.200)] [.bg-gray-300_&]:_[--grid-flicker-color:theme(colors.gray.300)]",
      },
    },
    {
      color: 'neutral' as const,
      variant: 'solid' as const,
      class: {
        canvas: "[.bg-gray-200_&]:_[--grid-end-color:theme(colors.gray.200)] [.bg-gray-400_&]:_[--grid-start-color:theme(colors.gray.400)] [.bg-gray-500_&]:_[--grid-flicker-color:theme(colors.gray.500)]",
      },
    },
  ],
  defaultVariants: {
    color: "neutral" as const,
    variant: "subtle" as const,
  },
};

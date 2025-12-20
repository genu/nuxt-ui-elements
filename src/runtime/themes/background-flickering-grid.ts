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
    // Primary color variants
    {
      color: "primary" as const,
      variant: "subtle" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-primary-100)] [--grid-end-color:var(--color-primary-50)] [--grid-flicker-color:var(--color-primary-200)] dark:[--grid-start-color:var(--color-primary-950)] dark:[--grid-end-color:var(--color-primary-900)] dark:[--grid-flicker-color:var(--color-primary-800)]",
      },
    },
    {
      color: "primary" as const,
      variant: "soft" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-primary-200)] [--grid-end-color:var(--color-primary-100)] [--grid-flicker-color:var(--color-primary-300)] dark:[--grid-start-color:var(--color-primary-900)] dark:[--grid-end-color:var(--color-primary-800)] dark:[--grid-flicker-color:var(--color-primary-700)]",
      },
    },
    {
      color: "primary" as const,
      variant: "solid" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-primary-400)] [--grid-end-color:var(--color-primary-200)] [--grid-flicker-color:var(--color-primary-500)] dark:[--grid-start-color:var(--color-primary-700)] dark:[--grid-end-color:var(--color-primary-600)] dark:[--grid-flicker-color:var(--color-primary-500)]",
      },
    },
    // Secondary color variants
    {
      color: "secondary" as const,
      variant: "subtle" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-secondary-100)] [--grid-end-color:var(--color-secondary-50)] [--grid-flicker-color:var(--color-secondary-200)] dark:[--grid-start-color:var(--color-secondary-950)] dark:[--grid-end-color:var(--color-secondary-900)] dark:[--grid-flicker-color:var(--color-secondary-800)]",
      },
    },
    {
      color: "secondary" as const,
      variant: "soft" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-secondary-200)] [--grid-end-color:var(--color-secondary-100)] [--grid-flicker-color:var(--color-secondary-300)] dark:[--grid-start-color:var(--color-secondary-900)] dark:[--grid-end-color:var(--color-secondary-800)] dark:[--grid-flicker-color:var(--color-secondary-700)]",
      },
    },
    {
      color: "secondary" as const,
      variant: "solid" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-secondary-400)] [--grid-end-color:var(--color-secondary-200)] [--grid-flicker-color:var(--color-secondary-500)] dark:[--grid-start-color:var(--color-secondary-700)] dark:[--grid-end-color:var(--color-secondary-600)] dark:[--grid-flicker-color:var(--color-secondary-500)]",
      },
    },
    // Success color variants
    {
      color: "success" as const,
      variant: "subtle" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-success-100)] [--grid-end-color:var(--color-success-50)] [--grid-flicker-color:var(--color-success-200)] dark:[--grid-start-color:var(--color-success-950)] dark:[--grid-end-color:var(--color-success-900)] dark:[--grid-flicker-color:var(--color-success-800)]",
      },
    },
    {
      color: "success" as const,
      variant: "soft" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-success-200)] [--grid-end-color:var(--color-success-100)] [--grid-flicker-color:var(--color-success-300)] dark:[--grid-start-color:var(--color-success-900)] dark:[--grid-end-color:var(--color-success-800)] dark:[--grid-flicker-color:var(--color-success-700)]",
      },
    },
    {
      color: "success" as const,
      variant: "solid" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-success-400)] [--grid-end-color:var(--color-success-200)] [--grid-flicker-color:var(--color-success-500)] dark:[--grid-start-color:var(--color-success-700)] dark:[--grid-end-color:var(--color-success-600)] dark:[--grid-flicker-color:var(--color-success-500)]",
      },
    },
    // Info color variants
    {
      color: "info" as const,
      variant: "subtle" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-info-100)] [--grid-end-color:var(--color-info-50)] [--grid-flicker-color:var(--color-info-200)] dark:[--grid-start-color:var(--color-info-950)] dark:[--grid-end-color:var(--color-info-900)] dark:[--grid-flicker-color:var(--color-info-800)]",
      },
    },
    {
      color: "info" as const,
      variant: "soft" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-info-200)] [--grid-end-color:var(--color-info-100)] [--grid-flicker-color:var(--color-info-300)] dark:[--grid-start-color:var(--color-info-900)] dark:[--grid-end-color:var(--color-info-800)] dark:[--grid-flicker-color:var(--color-info-700)]",
      },
    },
    {
      color: "info" as const,
      variant: "solid" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-info-400)] [--grid-end-color:var(--color-info-200)] [--grid-flicker-color:var(--color-info-500)] dark:[--grid-start-color:var(--color-info-700)] dark:[--grid-end-color:var(--color-info-600)] dark:[--grid-flicker-color:var(--color-info-500)]",
      },
    },
    // Warning color variants
    {
      color: "warning" as const,
      variant: "subtle" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-warning-100)] [--grid-end-color:var(--color-warning-50)] [--grid-flicker-color:var(--color-warning-200)] dark:[--grid-start-color:var(--color-warning-950)] dark:[--grid-end-color:var(--color-warning-900)] dark:[--grid-flicker-color:var(--color-warning-800)]",
      },
    },
    {
      color: "warning" as const,
      variant: "soft" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-warning-200)] [--grid-end-color:var(--color-warning-100)] [--grid-flicker-color:var(--color-warning-300)] dark:[--grid-start-color:var(--color-warning-900)] dark:[--grid-end-color:var(--color-warning-800)] dark:[--grid-flicker-color:var(--color-warning-700)]",
      },
    },
    {
      color: "warning" as const,
      variant: "solid" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-warning-400)] [--grid-end-color:var(--color-warning-200)] [--grid-flicker-color:var(--color-warning-500)] dark:[--grid-start-color:var(--color-warning-700)] dark:[--grid-end-color:var(--color-warning-600)] dark:[--grid-flicker-color:var(--color-warning-500)]",
      },
    },
    // Error color variants
    {
      color: "error" as const,
      variant: "subtle" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-error-100)] [--grid-end-color:var(--color-error-50)] [--grid-flicker-color:var(--color-error-200)] dark:[--grid-start-color:var(--color-error-950)] dark:[--grid-end-color:var(--color-error-900)] dark:[--grid-flicker-color:var(--color-error-800)]",
      },
    },
    {
      color: "error" as const,
      variant: "soft" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-error-200)] [--grid-end-color:var(--color-error-100)] [--grid-flicker-color:var(--color-error-300)] dark:[--grid-start-color:var(--color-error-900)] dark:[--grid-end-color:var(--color-error-800)] dark:[--grid-flicker-color:var(--color-error-700)]",
      },
    },
    {
      color: "error" as const,
      variant: "solid" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-error-400)] [--grid-end-color:var(--color-error-200)] [--grid-flicker-color:var(--color-error-500)] dark:[--grid-start-color:var(--color-error-700)] dark:[--grid-end-color:var(--color-error-600)] dark:[--grid-flicker-color:var(--color-error-500)]",
      },
    },
    // Neutral variants
    {
      color: "neutral" as const,
      variant: "subtle" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-gray-100)] [--grid-end-color:var(--color-gray-50)] [--grid-flicker-color:var(--color-gray-200)] dark:[--grid-start-color:var(--color-gray-950)] dark:[--grid-end-color:var(--color-gray-900)] dark:[--grid-flicker-color:var(--color-gray-800)]",
      },
    },
    {
      color: "neutral" as const,
      variant: "soft" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-gray-200)] [--grid-end-color:var(--color-gray-100)] [--grid-flicker-color:var(--color-gray-300)] dark:[--grid-start-color:var(--color-gray-900)] dark:[--grid-end-color:var(--color-gray-800)] dark:[--grid-flicker-color:var(--color-gray-700)]",
      },
    },
    {
      color: "neutral" as const,
      variant: "solid" as const,
      class: {
        canvas:
          "[--grid-start-color:var(--color-gray-400)] [--grid-end-color:var(--color-gray-200)] [--grid-flicker-color:var(--color-gray-500)] dark:[--grid-start-color:var(--color-gray-700)] dark:[--grid-end-color:var(--color-gray-600)] dark:[--grid-flicker-color:var(--color-gray-500)]",
      },
    },
  ],
  defaultVariants: {
    color: "neutral" as const,
    variant: "subtle" as const,
  },
};

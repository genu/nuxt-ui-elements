export type GradientDirection =
  | "left-right"
  | "right-left"
  | "top-bottom"
  | "bottom-top"
  | "in-out"
  | "out-in";

/**
 * Calculate gradient intensity for a position based on direction
 * @param x - X coordinate (0-1)
 * @param y - Y coordinate (0-1)
 * @param direction - Gradient direction
 * @returns Intensity value (0-1)
 */
export function calculateGradientIntensity(
  x: number,
  y: number,
  direction: GradientDirection,
): number {
  switch (direction) {
    case "left-right":
      return x;
    case "right-left":
      return 1 - x;
    case "top-bottom":
      return y;
    case "bottom-top":
      return 1 - y;
    case "in-out": {
      const dx = x - 0.5;
      const dy = y - 0.5;
      return Math.sqrt(dx * dx + dy * dy) * Math.sqrt(2);
    }
    case "out-in": {
      const dx = x - 0.5;
      const dy = y - 0.5;
      return 1 - Math.sqrt(dx * dx + dy * dy) * Math.sqrt(2);
    }
    default:
      return 0;
  }
}

/**
 * Generate CSS repeating linear gradient from colors
 * @param colors - Array of RGB color strings
 * @param angle - Gradient angle in degrees
 * @returns CSS repeating-linear-gradient string
 */
export function createRepeatingGradient(colors: string[], angle: number = 100): string {
  const stops = colors
    .map((color, i) => {
      const position = 10 + i * 5;
      return `${color} ${position}%`;
    })
    .join(",");
  return `repeating-linear-gradient(${angle}deg,${stops})`;
}

/**
 * Composable for gradient utilities
 */
export function useGradient() {
  return {
    calculateGradientIntensity,
    createRepeatingGradient,
  };
}

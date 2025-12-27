import { parse } from "culori";
import { getThemeColor } from "./useThemeColors";
import colors from "tailwindcss/colors";

/**
 * Nuxt UI semantic colors
 */
const SEMANTIC_COLORS = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "error",
  "neutral",
] as const;

export type SemanticColor = (typeof SEMANTIC_COLORS)[number];

/**
 * Tailwind color names
 */
type TailwindColorName = keyof typeof colors;

/**
 * Tailwind color shades
 */
type TailwindShade =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950";

/**
 * Tailwind color format: colorName-shade (e.g., 'blue-500', 'red-600')
 */
export type TailwindColor = `${TailwindColorName}-${TailwindShade}`;

/**
 * Supported color input formats
 */
export type ColorInput = SemanticColor | TailwindColor | (string & {});

/**
 * Get a Tailwind default color value from the colors export
 */
function getTailwindDefaultColor(colorName: string, shade: number): string | null {
  const colorObj = colors[colorName as keyof typeof colors];
  if (colorObj && typeof colorObj === "object" && !Array.isArray(colorObj)) {
    return (colorObj as Record<string, string>)[shade.toString()] || null;
  }
  return null;
}

/**
 * Check if a color string is a Nuxt UI semantic color
 */
function isSemanticColor(color: string): color is SemanticColor {
  return SEMANTIC_COLORS.includes(color as SemanticColor);
}

/**
 * Check if a color string is a direct color value (hex, rgb, oklch, etc.)
 */
function isDirectColor(color: string): boolean {
  return (
    color.startsWith("#") ||
    color.startsWith("rgb") ||
    color.startsWith("hsl") ||
    color.startsWith("oklch") ||
    color.startsWith("lab") ||
    color.startsWith("lch")
  );
}

/**
 * Resolve a color input to an actual color value
 * Supports:
 * - Nuxt UI semantic colors: 'primary', 'secondary', etc.
 * - Tailwind colors: 'blue-500', 'red-600', etc.
 * - Direct color values: '#3b82f6', 'oklch(0.6 0.15 250)', etc.
 *
 * @param colorInput - The color string to resolve
 * @param fallback - Fallback color if resolution fails (default: 'neutral')
 * @returns The resolved color value
 */
export function resolveColor(
  colorInput: string | undefined,
  fallback: SemanticColor = "neutral",
): string {
  // Handle undefined/empty
  if (!colorInput || colorInput.trim() === "") {
    return getThemeColor(fallback, 500);
  }

  const color = colorInput.trim();

  // 1. Check if it's a direct color value (hex, rgb, oklch, etc.)
  if (isDirectColor(color)) {
    // Validate with culori
    const parsed = parse(color);
    if (parsed) {
      return color;
    }
    // Invalid color format, fall through to fallback
    console.warn(`[resolveColor] Invalid color format: "${color}"`);
  }

  // 2. Check if it's a Nuxt UI semantic color
  if (isSemanticColor(color)) {
    return getThemeColor(color, 500);
  }

  // 3. Check if it's a Tailwind color format (e.g., 'blue-500', 'red-600')
  const tailwindColorMatch = color.match(/^([a-z]+)-(\d{2,3})$/);
  if (tailwindColorMatch) {
    const [, colorName, shade] = tailwindColorMatch;
    if (colorName && shade) {
      // Try Nuxt UI format: --ui-color-red-500
      if (typeof document !== "undefined") {
        const resolvedColor = getThemeColor(colorName, parseInt(shade));
        if (resolvedColor !== "oklch(50% 0 0)") {
          return resolvedColor;
        }
      }

      // Fallback to Tailwind's default color palette
      const defaultColor = getTailwindDefaultColor(colorName, parseInt(shade));
      if (defaultColor) {
        return defaultColor;
      }
    }
  }

  // 4. Fallback - warn and use default
  console.warn(
    `[resolveColor] Could not resolve color: "${colorInput}". ` +
      `Supported formats: Nuxt UI semantic colors ('primary', 'secondary', etc.), ` +
      `Tailwind colors ('blue-500', 'red-600', etc.), ` +
      `or direct color values ('#3b82f6', 'oklch(...)', 'rgb(...)'). ` +
      `Falling back to "${fallback}".`,
  );
  return getThemeColor(fallback, 500);
}

/**
 * Resolve a color and ensure it returns an OKLCH string
 * Useful when you need consistent color space for manipulation
 */
export function resolveColorAsOklch(
  colorInput: string | undefined,
  fallback: SemanticColor = "neutral",
): string {
  const resolved = resolveColor(colorInput, fallback);

  // If it's already from getThemeColor, it's likely OKLCH
  if (isSemanticColor(colorInput || "")) {
    return resolved;
  }

  // Otherwise return as-is (might be any format)
  return resolved;
}

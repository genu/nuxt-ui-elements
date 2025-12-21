import { converter, parse, formatCss } from "culori";

const toOklch = converter("oklch");
const toRgb = converter("rgb");

/**
 * Parse OKLCH string to extract L, C, H components
 * @deprecated Use culori.parse instead
 */
export function parseOklch(oklchStr: string): { l: number; c: number; h: number } | null {
  const parsed = parse(oklchStr);
  if (!parsed) return null;
  const oklch = toOklch(parsed);
  if (!oklch) return null;
  return {
    l: (oklch.l ?? 0) * 100, // Convert 0-1 to 0-100%
    c: oklch.c ?? 0,
    h: oklch.h ?? 0,
  };
}

/**
 * Create OKLCH string from L, C, H components
 */
export function createOklch(l: number, c: number, h: number): string {
  return formatCss({ mode: 'oklch', l: l / 100, c, h });
}

/**
 * Adjust the lightness of a color while preserving chroma and hue
 * Accepts any valid CSS color string
 */
export function adjustLightness(colorStr: string, targetLightness: number): string {
  const parsed = parse(colorStr);
  if (!parsed) return colorStr;
  
  const oklch = toOklch(parsed);
  if (!oklch) return colorStr;
  
  oklch.l = targetLightness / 100;
  
  return formatCss(oklch);
}

/**
 * Adjust the chroma (saturation) of a color while preserving lightness and hue
 */
export function adjustChroma(colorStr: string, targetChroma: number): string {
  const parsed = parse(colorStr);
  if (!parsed) return colorStr;
  
  const oklch = toOklch(parsed);
  if (!oklch) return colorStr;
  
  oklch.c = targetChroma;
  
  return formatCss(oklch);
}

/**
 * Adjust the hue of a color while preserving lightness and chroma
 */
export function adjustHue(colorStr: string, targetHue: number): string {
  const parsed = parse(colorStr);
  if (!parsed) return colorStr;
  
  const oklch = toOklch(parsed);
  if (!oklch) return colorStr;
  
  oklch.h = targetHue;
  
  return formatCss(oklch);
}

/**
 * Adjust all components of a color
 */
export function adjustOklch(
  colorStr: string,
  adjustments: { l?: number; c?: number; h?: number }
): string {
  const parsed = parse(colorStr);
  if (!parsed) return colorStr;
  
  const oklch = toOklch(parsed);
  if (!oklch) return colorStr;
  
  if (adjustments.l !== undefined) oklch.l = adjustments.l / 100;
  if (adjustments.c !== undefined) oklch.c = adjustments.c;
  if (adjustments.h !== undefined) oklch.h = adjustments.h;
  
  return formatCss(oklch);
}

/**
 * Convert color to RGB string for canvas rendering
 */
export function oklchToRgb(colorString: string): string {
  const parsed = parse(colorString);
  if (!parsed) return "rgb(255, 255, 255)";

  const rgb = toRgb(parsed);
  if (!rgb) return "rgb(255, 255, 255)";

  // Clamp values to 0-255 range
  const r = Math.max(0, Math.min(255, Math.round((rgb.r ?? 0) * 255)));
  const g = Math.max(0, Math.min(255, Math.round((rgb.g ?? 0) * 255)));
  const b = Math.max(0, Math.min(255, Math.round((rgb.b ?? 0) * 255)));
  const a = rgb.alpha ?? 1;

  // Return rgba if alpha is not 1, otherwise rgb
  return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
}

/**
 * Get the base color from Nuxt UI theme for a given color name and shade
 * @param colorName - The semantic color name (e.g., 'primary', 'error', 'success')
 * @param shade - The color shade (50-950), defaults to 500
 */
export function getThemeColor(colorName: string, shade: number = 500): string {
  if (typeof document === "undefined") return "oklch(50% 0 0)";

  const styles = getComputedStyle(document.documentElement);

  // Try Nuxt UI v3 format first
  let colorValue = styles.getPropertyValue(`--ui-color-${colorName}-${shade}`).trim();

  // Fallback to Nuxt UI v2 format
  if (!colorValue) {
    colorValue = styles.getPropertyValue(`--color-${colorName}-${shade}`).trim();
  }

  return colorValue || "oklch(50% 0 0)";
}

/**
 * Get multiple shades of a color by adjusting lightness
 * Useful for creating gradients or multi-tone effects
 */
export function getColorShades(
  colorName: string,
  lightnessValues: number[]
): string[] {
  const baseColor = getThemeColor(colorName, 500);
  return lightnessValues.map(lightness => adjustLightness(baseColor, lightness));
}

/**
 * Get multiple shades and convert to RGB
 */
export function getColorShadesRgb(
  colorName: string,
  lightnessValues: number[]
): string[] {
  const shades = getColorShades(colorName, lightnessValues);
  return shades.map(oklchToRgb);
}

/**
 * Create a color palette with custom adjustments
 * Returns RGB strings ready for canvas use
 */
export function createColorPalette(
  colorName: string,
  adjustments: Array<{ l?: number; c?: number; h?: number }>
): string[] {
  const baseColor = getThemeColor(colorName, 500);
  return adjustments.map(adj => {
    const adjusted = adjustOklch(baseColor, adj);
    return oklchToRgb(adjusted);
  });
}

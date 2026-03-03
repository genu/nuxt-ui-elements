import { describe, it, expect } from "vitest"
import flowTheme from "../../src/theme/flow"
import flowNodeTheme from "../../src/theme/flow-node"
import flowHandleTheme from "../../src/theme/flow-handle"
import flowBackgroundTheme from "../../src/theme/flow-background"
import flowControlsTheme from "../../src/theme/flow-controls"
import flowMiniMapTheme from "../../src/theme/flow-mini-map"

const defaultColors = ["primary", "secondary", "success", "info", "warning", "error"]
const defaultOptions = { theme: { colors: defaultColors } }

describe("Flow Themes", () => {
  describe("flow", () => {
    const theme = flowTheme(defaultOptions)

    it("has root and wrapper slots", () => {
      expect(theme.slots).toHaveProperty("root")
      expect(theme.slots).toHaveProperty("wrapper")
    })

    it("root slot contains sizing classes", () => {
      expect(theme.slots.root).toContain("w-full")
      expect(theme.slots.root).toContain("relative")
    })
  })

  describe("flow-node", () => {
    const theme = flowNodeTheme(defaultOptions)

    it("has root, label, and content slots", () => {
      expect(theme.slots).toHaveProperty("root")
      expect(theme.slots).toHaveProperty("label")
      expect(theme.slots).toHaveProperty("content")
    })

    it("root slot includes base styling", () => {
      const rootClasses = Array.isArray(theme.slots.root) ? theme.slots.root.join(" ") : theme.slots.root
      expect(rootClasses).toContain("rounded-lg")
      expect(rootClasses).toContain("border")
      expect(rootClasses).toContain("shadow-sm")
    })

    describe("variants", () => {
      it("has color variants for all theme colors plus neutral", () => {
        const colorKeys = Object.keys(theme.variants.color)
        for (const color of defaultColors) {
          expect(colorKeys).toContain(color)
        }
        expect(colorKeys).toContain("neutral")
      })

      it("has solid, outline, soft, and subtle variant options", () => {
        const variantKeys = Object.keys(theme.variants.variant)
        expect(variantKeys).toEqual(["solid", "outline", "soft", "subtle"])
      })

      it("has selected variant with true and false options", () => {
        expect(theme.variants.selected).toHaveProperty("true")
        expect(theme.variants.selected).toHaveProperty("false")
      })

      it("selected true adds ring classes", () => {
        expect(theme.variants.selected.true.root).toContain("ring-2")
        expect(theme.variants.selected.true.root).toContain("ring-offset-2")
      })
    })

    describe("compoundVariants", () => {
      it("generates solid compound variants for each theme color", () => {
        for (const color of defaultColors) {
          const match = theme.compoundVariants.find(
            (cv: any) => cv.color === color && cv.variant === "solid",
          )
          expect(match).toBeDefined()
          expect(match.class.root).toContain(`bg-${color}`)
          expect(match.class.root).toContain("text-inverted")
          expect(match.class.root).toContain(`border-${color}`)
        }
      })

      it("generates outline compound variants for each theme color", () => {
        for (const color of defaultColors) {
          const match = theme.compoundVariants.find(
            (cv: any) => cv.color === color && cv.variant === "outline",
          )
          expect(match).toBeDefined()
          expect(match.class.root).toContain("bg-default")
          expect(match.class.root).toContain(`border-${color}`)
          expect(match.class.root).toContain(`text-${color}`)
        }
      })

      it("generates soft compound variants for each theme color", () => {
        for (const color of defaultColors) {
          const match = theme.compoundVariants.find(
            (cv: any) => cv.color === color && cv.variant === "soft",
          )
          expect(match).toBeDefined()
          expect(match.class.root).toContain(`bg-${color}/10`)
          expect(match.class.root).toContain(`border-${color}/20`)
          expect(match.class.root).toContain(`text-${color}`)
        }
      })

      it("generates subtle compound variants for each theme color", () => {
        for (const color of defaultColors) {
          const match = theme.compoundVariants.find(
            (cv: any) => cv.color === color && cv.variant === "subtle",
          )
          expect(match).toBeDefined()
          expect(match.class.root).toContain(`bg-${color}/5`)
          expect(match.class.root).toContain("border-transparent")
          expect(match.class.root).toContain(`text-${color}`)
        }
      })

      it("generates selected ring compound variants for each theme color", () => {
        for (const color of defaultColors) {
          const match = theme.compoundVariants.find(
            (cv: any) => cv.color === color && cv.selected === true,
          )
          expect(match).toBeDefined()
          expect(match.class.root).toContain(`ring-${color}`)
        }
      })

      it("includes neutral fallback for all variant types", () => {
        const neutralSolid = theme.compoundVariants.find(
          (cv: any) => cv.color === "neutral" && cv.variant === "solid",
        )
        expect(neutralSolid).toBeDefined()
        expect(neutralSolid.class.root).toContain("bg-inverted")

        const neutralOutline = theme.compoundVariants.find(
          (cv: any) => cv.color === "neutral" && cv.variant === "outline",
        )
        expect(neutralOutline).toBeDefined()
        expect(neutralOutline.class.root).toContain("bg-default")
        expect(neutralOutline.class.root).toContain("border-accented")

        const neutralSoft = theme.compoundVariants.find(
          (cv: any) => cv.color === "neutral" && cv.variant === "soft",
        )
        expect(neutralSoft).toBeDefined()
        expect(neutralSoft.class.root).toContain("bg-elevated")

        const neutralSubtle = theme.compoundVariants.find(
          (cv: any) => cv.color === "neutral" && cv.variant === "subtle",
        )
        expect(neutralSubtle).toBeDefined()
        expect(neutralSubtle.class.root).toContain("border-transparent")

        const neutralSelected = theme.compoundVariants.find(
          (cv: any) => cv.color === "neutral" && cv.selected === true,
        )
        expect(neutralSelected).toBeDefined()
        expect(neutralSelected.class.root).toContain("ring-accented")
      })

      it("generates the correct total number of compound variants", () => {
        // For each of 4 variant types: 6 colors + 1 neutral = 7 each = 28
        // Plus selected: 6 colors + 1 neutral = 7
        // Total: 35
        expect(theme.compoundVariants).toHaveLength(35)
      })
    })

    describe("defaultVariants", () => {
      it("defaults to primary color", () => {
        expect(theme.defaultVariants.color).toBe("primary")
      })

      it("defaults to outline variant", () => {
        expect(theme.defaultVariants.variant).toBe("outline")
      })

      it("defaults to not selected", () => {
        expect(theme.defaultVariants.selected).toBe(false)
      })
    })

    describe("custom colors", () => {
      it("generates variants for custom color sets", () => {
        const customTheme = flowNodeTheme({
          theme: { colors: ["brand", "accent"] },
        })

        const colorKeys = Object.keys(customTheme.variants.color)
        expect(colorKeys).toContain("brand")
        expect(colorKeys).toContain("accent")
        expect(colorKeys).toContain("neutral")
        expect(colorKeys).not.toContain("primary")
      })

      it("handles empty color array", () => {
        const emptyTheme = flowNodeTheme({
          theme: { colors: [] },
        })

        // Should still have neutral
        expect(Object.keys(emptyTheme.variants.color)).toEqual(["neutral"])
        // Compound variants should only have neutral entries (5 total: solid, outline, soft, subtle, selected)
        expect(emptyTheme.compoundVariants).toHaveLength(5)
      })
    })
  })

  describe("flow-handle", () => {
    const theme = flowHandleTheme(defaultOptions)

    it("has a root slot with handle styling", () => {
      const rootClasses = Array.isArray(theme.slots.root) ? theme.slots.root.join(" ") : theme.slots.root
      expect(rootClasses).toContain("!rounded-full")
      expect(rootClasses).toContain("!border-2")
    })

    describe("variants", () => {
      it("has color variants for all theme colors plus neutral", () => {
        const colorKeys = Object.keys(theme.variants.color)
        for (const color of defaultColors) {
          expect(colorKeys).toContain(color)
        }
        expect(colorKeys).toContain("neutral")
      })

      it("has connected variant with true and false options", () => {
        expect(theme.variants.connected).toHaveProperty("true")
        expect(theme.variants.connected).toHaveProperty("false")
      })
    })

    describe("compoundVariants", () => {
      it("generates default state compound variants with border color and hover fill", () => {
        for (const color of defaultColors) {
          const match = theme.compoundVariants.find(
            (cv: any) => cv.color === color && cv.connected === undefined,
          )
          expect(match).toBeDefined()
          expect(match.class.root).toContain(`!border-${color}`)
          expect(match.class.root).toContain(`hover:!bg-${color}`)
        }
      })

      it("generates connected state compound variants with filled background", () => {
        for (const color of defaultColors) {
          const match = theme.compoundVariants.find(
            (cv: any) => cv.color === color && cv.connected === true,
          )
          expect(match).toBeDefined()
          expect(match.class.root).toContain(`!bg-${color}`)
        }
      })

      it("includes neutral fallbacks", () => {
        const neutralDefault = theme.compoundVariants.find(
          (cv: any) => cv.color === "neutral" && cv.connected === undefined,
        )
        expect(neutralDefault).toBeDefined()
        expect(neutralDefault.class.root).toContain("!border-accented")

        const neutralConnected = theme.compoundVariants.find(
          (cv: any) => cv.color === "neutral" && cv.connected === true,
        )
        expect(neutralConnected).toBeDefined()
        expect(neutralConnected.class.root).toContain("!bg-inverted")
      })

      it("generates the correct total number of compound variants", () => {
        // Default state: 6 colors + 1 neutral = 7
        // Connected state: 6 colors + 1 neutral = 7
        // Total: 14
        expect(theme.compoundVariants).toHaveLength(14)
      })
    })

    describe("defaultVariants", () => {
      it("defaults to primary color", () => {
        expect(theme.defaultVariants.color).toBe("primary")
      })

      it("defaults to not connected", () => {
        expect(theme.defaultVariants.connected).toBe(false)
      })
    })
  })

  describe("flow-background", () => {
    const theme = flowBackgroundTheme(defaultOptions)

    it("has a root slot", () => {
      expect(theme.slots).toHaveProperty("root")
    })

    it("has dots and lines pattern variants", () => {
      expect(theme.variants.pattern).toHaveProperty("dots")
      expect(theme.variants.pattern).toHaveProperty("lines")
    })

    it("defaults to dots pattern", () => {
      expect(theme.defaultVariants.pattern).toBe("dots")
    })
  })

  describe("flow-controls", () => {
    const theme = flowControlsTheme(defaultOptions)

    it("has root and button slots", () => {
      expect(theme.slots).toHaveProperty("root")
      expect(theme.slots).toHaveProperty("button")
    })

    it("root slot includes container styling", () => {
      expect(theme.slots.root).toContain("bg-default")
      expect(theme.slots.root).toContain("rounded-lg")
      expect(theme.slots.root).toContain("shadow-sm")
    })

    it("button slot includes interactive styling", () => {
      expect(theme.slots.button).toContain("hover:bg-elevated")
      expect(theme.slots.button).toContain("transition-colors")
    })
  })

  describe("flow-mini-map", () => {
    const theme = flowMiniMapTheme(defaultOptions)

    it("has a root slot", () => {
      expect(theme.slots).toHaveProperty("root")
    })

    it("root slot includes container styling", () => {
      expect(theme.slots.root).toContain("border")
      expect(theme.slots.root).toContain("rounded-lg")
      expect(theme.slots.root).toContain("shadow-sm")
    })
  })

  describe("theme index exports", () => {
    it("exports all flow themes from the index", async () => {
      const themes = await import("../../src/theme/index")
      expect(themes).toHaveProperty("flow")
      expect(themes).toHaveProperty("flowNode")
      expect(themes).toHaveProperty("flowHandle")
      expect(themes).toHaveProperty("flowBackground")
      expect(themes).toHaveProperty("flowControls")
      expect(themes).toHaveProperty("flowMiniMap")
    })

    it("all flow theme exports are functions", async () => {
      const themes = await import("../../src/theme/index")
      expect(typeof themes.flow).toBe("function")
      expect(typeof themes.flowNode).toBe("function")
      expect(typeof themes.flowHandle).toBe("function")
      expect(typeof themes.flowBackground).toBe("function")
      expect(typeof themes.flowControls).toBe("function")
      expect(typeof themes.flowMiniMap).toBe("function")
    })
  })
})

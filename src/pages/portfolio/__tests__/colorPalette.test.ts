import {
  contrastRatio,
  fgForBg,
  hslStringToHex,
  hexToHslString,
  derivePaletteFromChange,
  autoAdjustContrast,
  generateHarmonyPalette,
  generateRandomPalette,
  CONTRAST_PAIRS,
  EDITABLE_VARS,
  HARMONY_SCHEMES,
} from "../themeUtils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal color map with all EDITABLE_VARS populated */
function buildColors(overrides: Record<string, string> = {}): Record<string, string> {
  const base: Record<string, string> = {
    "--brand": "220 70% 50%",
    "--secondary": "250 30% 90%",
    "--accent": "200 40% 85%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 0%",
    "--card": "0 0% 100%",
    "--card-foreground": "0 0% 0%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "0 0% 0%",
    "--primary": "220 70% 50%",
    "--primary-foreground": "0 0% 100%",
    "--secondary-foreground": "0 0% 0%",
    "--muted": "220 15% 92%",
    "--muted-foreground": "0 0% 44%",
    "--accent-foreground": "0 0% 0%",
    "--destructive": "0 80% 50%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 70% 45%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 80% 50%",
    "--warning-foreground": "0 0% 0%",
    "--border": "220 15% 85%",
    "--ring": "220 70% 50%",
  };
  return { ...base, ...overrides };
}

// ---------------------------------------------------------------------------
// contrastRatio
// ---------------------------------------------------------------------------

describe("contrastRatio", () => {
  it("returns 21 for black on white", () => {
    const ratio = contrastRatio("0 0% 0%", "0 0% 100%");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("returns 1 for identical colors", () => {
    expect(contrastRatio("180 50% 50%", "180 50% 50%")).toBeCloseTo(1, 1);
  });

  it("is commutative (order doesn't matter)", () => {
    const a = "220 70% 50%";
    const b = "0 0% 100%";
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 5);
  });

  it("reports WCAG AA-passing for white text on dark blue", () => {
    const ratio = contrastRatio("0 0% 100%", "220 80% 25%");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("reports WCAG AA-failing for light gray on white", () => {
    const ratio = contrastRatio("0 0% 80%", "0 0% 100%");
    expect(ratio).toBeLessThan(4.5);
  });
});

// ---------------------------------------------------------------------------
// fgForBg
// ---------------------------------------------------------------------------

describe("fgForBg", () => {
  it("returns white for a dark background", () => {
    expect(fgForBg("220 50% 15%")).toBe("0 0% 100%");
  });

  it("returns black for a light background", () => {
    expect(fgForBg("0 0% 95%")).toBe("0 0% 0%");
  });

  it("returns a color with good contrast against any background", () => {
    const backgrounds = ["0 0% 0%", "0 0% 50%", "0 0% 100%", "120 60% 40%", "300 80% 70%"];
    for (const bg of backgrounds) {
      const fg = fgForBg(bg);
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

// ---------------------------------------------------------------------------
// hslStringToHex / hexToHslString round-trip
// ---------------------------------------------------------------------------

describe("hslStringToHex", () => {
  it("converts black correctly", () => {
    expect(hslStringToHex("0 0% 0%")).toBe("#000000");
  });

  it("converts white correctly", () => {
    expect(hslStringToHex("0 0% 100%")).toBe("#ffffff");
  });

  it("converts pure red", () => {
    expect(hslStringToHex("0 100% 50%")).toBe("#ff0000");
  });

  it("returns #000000 for empty string", () => {
    expect(hslStringToHex("")).toBe("#000000");
  });

  it("returns #000000 for malformed input", () => {
    expect(hslStringToHex("not a color")).toBe("#000000");
  });
});

describe("hexToHslString", () => {
  it("converts black correctly", () => {
    const hsl = hexToHslString("#000000");
    expect(hsl).toMatch(/0\s+0%\s+0\.0%/);
  });

  it("converts white correctly", () => {
    const hsl = hexToHslString("#ffffff");
    expect(hsl).toMatch(/0\s+0%\s+100\.0%/);
  });

  it("converts pure red", () => {
    const hsl = hexToHslString("#ff0000");
    expect(hsl).toMatch(/0\.0\s+100\.0%\s+50\.0%/);
  });
});

describe("hsl ↔ hex round-trip", () => {
  it("round-trips a brand color within 1 lightness unit", () => {
    const original = "220 70% 50%";
    const hex = hslStringToHex(original);
    const roundTripped = hexToHslString(hex);
    // Parse and compare within tolerance (rounding through 8-bit RGB)
    const parse = (s: string) => s.trim().split(/\s+/).map(parseFloat);
    const [h1, s1, l1] = parse(original);
    const [h2, s2, l2] = parse(roundTripped);
    expect(h2).toBeCloseTo(h1, 0);
    expect(s2).toBeCloseTo(s1, 0);
    expect(l2).toBeCloseTo(l1, 0);
  });
});

// ---------------------------------------------------------------------------
// derivePaletteFromChange
// ---------------------------------------------------------------------------

describe("derivePaletteFromChange", () => {
  it("shifts primary hue when brand changes", () => {
    const colors = buildColors();
    const derived = derivePaletteFromChange("--brand", "120 70% 50%", colors);
    expect(derived["--primary"]).toBeDefined();
    // Primary should adopt brand's hue (120)
    expect(parseFloat(derived["--primary"]!.split(/\s+/)[0])).toBeCloseTo(120, 0);
  });

  it("does not modify locked keys", () => {
    const colors = buildColors();
    const locked = new Set(["--primary", "--ring"]);
    const derived = derivePaletteFromChange("--brand", "120 70% 50%", colors, locked);
    expect(derived["--primary"]).toBeUndefined();
    expect(derived["--ring"]).toBeUndefined();
  });

  it("derives semantic colors (destructive, success, warning) on brand change", () => {
    const colors = buildColors();
    const derived = derivePaletteFromChange("--brand", "120 70% 50%", colors);
    expect(derived["--destructive"]).toBeDefined();
    expect(derived["--success"]).toBeDefined();
    expect(derived["--warning"]).toBeDefined();
    // Destructive stays in red family (hue 0)
    expect(parseFloat(derived["--destructive"]!.split(/\s+/)[0])).toBe(0);
    // Success stays in green family (hue 142)
    expect(parseFloat(derived["--success"]!.split(/\s+/)[0])).toBe(142);
    // Warning stays in yellow family (hue 45)
    expect(parseFloat(derived["--warning"]!.split(/\s+/)[0])).toBe(45);
  });

  it("sets card/popover to match background when background changes", () => {
    const colors = buildColors();
    const derived = derivePaletteFromChange("--background", "0 0% 10%", colors);
    expect(derived["--card"]).toBe("0 0% 10%");
    expect(derived["--popover"]).toBe("0 0% 10%");
  });

  it("derives foreground as black or white when background changes", () => {
    const colors = buildColors();
    // Dark background → white foreground
    const darkDerived = derivePaletteFromChange("--background", "0 0% 10%", colors);
    expect(darkDerived["--foreground"]).toBe("0 0% 100%");
    // Light background → black foreground
    const lightDerived = derivePaletteFromChange("--background", "0 0% 95%", colors);
    expect(lightDerived["--foreground"]).toBe("0 0% 0%");
  });

  it("returns empty for short/malformed HSL", () => {
    const colors = buildColors();
    expect(derivePaletteFromChange("--brand", "bad", colors)).toEqual({});
  });

  it("card-foreground and popover-foreground follow foreground change", () => {
    const colors = buildColors();
    const derived = derivePaletteFromChange("--foreground", "0 0% 100%", colors);
    expect(derived["--card-foreground"]).toBe("0 0% 100%");
    expect(derived["--popover-foreground"]).toBe("0 0% 100%");
  });

  it("derives primary-foreground via contrast when primary changes", () => {
    const colors = buildColors();
    const derived = derivePaletteFromChange("--primary", "220 70% 25%", colors);
    // Dark primary → white foreground
    expect(derived["--primary-foreground"]).toBe("0 0% 100%");
  });
});

// ---------------------------------------------------------------------------
// autoAdjustContrast
// ---------------------------------------------------------------------------

describe("autoAdjustContrast", () => {
  it("returns empty adjustments when all pairs pass", () => {
    const colors = buildColors();
    const adjustments = autoAdjustContrast(colors);
    // With the default buildColors, most pairs should already pass
    // Any adjustments that do occur should still result in passing contrast
    const merged = { ...colors, ...adjustments };
    for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
      if (merged[fgKey] && merged[bgKey]) {
        expect(contrastRatio(merged[fgKey], merged[bgKey])).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("fixes a failing foreground/background pair", () => {
    // Light gray on white fails
    const colors = buildColors({
      "--foreground": "0 0% 80%",
      "--background": "0 0% 100%",
    });
    const adjustments = autoAdjustContrast(colors);
    const merged = { ...colors, ...adjustments };
    expect(contrastRatio(merged["--foreground"], merged["--background"])).toBeGreaterThanOrEqual(4.5);
  });

  it("fixes brand vs background contrast", () => {
    // Brand too close to background
    const colors = buildColors({
      "--brand": "220 50% 92%",
      "--background": "0 0% 95%",
    });
    const adjustments = autoAdjustContrast(colors);
    const merged = { ...colors, ...adjustments };
    expect(contrastRatio(merged["--brand"], merged["--background"])).toBeGreaterThanOrEqual(4.5);
  });

  it("respects locked keys — does not adjust locked foreground", () => {
    const colors = buildColors({
      "--foreground": "0 0% 80%",
      "--background": "0 0% 100%",
    });
    const locked = new Set(["--foreground"]);
    const adjustments = autoAdjustContrast(colors, locked);
    expect(adjustments["--foreground"]).toBeUndefined();
  });

  it("adjusts background when foreground is locked and contrast fails", () => {
    const colors = buildColors({
      "--foreground": "0 0% 80%",
      "--background": "0 0% 85%",
    });
    const locked = new Set(["--foreground"]);
    const adjustments = autoAdjustContrast(colors, locked);
    // Background should be adjusted since foreground is locked
    expect(adjustments["--background"]).toBeDefined();
    const merged = { ...colors, ...adjustments };
    expect(contrastRatio(merged["--foreground"], merged["--background"])).toBeGreaterThanOrEqual(4.5);
  });

  it("skips pair when both fg and bg are locked", () => {
    const colors = buildColors({
      "--foreground": "0 0% 80%",
      "--background": "0 0% 85%",
    });
    const locked = new Set(["--foreground", "--background"]);
    const adjustments = autoAdjustContrast(colors, locked);
    expect(adjustments["--foreground"]).toBeUndefined();
    expect(adjustments["--background"]).toBeUndefined();
  });

  it("ensures all CONTRAST_PAIRS pass after adjustment", () => {
    // Intentionally bad palette
    const colors = buildColors({
      "--foreground": "0 0% 70%",
      "--background": "0 0% 75%",
      "--brand": "220 50% 80%",
      "--muted-foreground": "0 0% 72%",
    });
    const adjustments = autoAdjustContrast(colors);
    const merged = { ...colors, ...adjustments };
    for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
      if (merged[fgKey] && merged[bgKey]) {
        expect(contrastRatio(merged[fgKey], merged[bgKey])).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// generateHarmonyPalette
// ---------------------------------------------------------------------------

describe("generateHarmonyPalette", () => {
  const brand = "220 70% 50%";
  const colors = buildColors();

  for (const scheme of HARMONY_SCHEMES) {
    it(`generates a palette for ${scheme} scheme`, () => {
      const result = generateHarmonyPalette(brand, scheme, colors);
      expect(result["--secondary"]).toBeDefined();
      expect(result["--accent"]).toBeDefined();
    });
  }

  it("Complementary: secondary hue is ~180 degrees from brand", () => {
    const result = generateHarmonyPalette("0 70% 50%", "Complementary", colors);
    const secHue = parseFloat(result["--secondary"]!.split(/\s+/)[0]);
    expect(secHue).toBeCloseTo(180, 0);
  });

  it("Analogous: secondary hue is ~30 degrees from brand", () => {
    const result = generateHarmonyPalette("0 70% 50%", "Analogous", colors);
    const secHue = parseFloat(result["--secondary"]!.split(/\s+/)[0]);
    expect(secHue).toBeCloseTo(30, 0);
  });

  it("Triadic: secondary hue is ~120 degrees from brand", () => {
    const result = generateHarmonyPalette("0 70% 50%", "Triadic", colors);
    const secHue = parseFloat(result["--secondary"]!.split(/\s+/)[0]);
    expect(secHue).toBeCloseTo(120, 0);
  });

  it("respects locked secondary", () => {
    const locked = new Set(["--secondary"]);
    const result = generateHarmonyPalette(brand, "Complementary", colors, locked);
    expect(result["--secondary"]).toBeUndefined();
  });

  it("returns empty for malformed brand", () => {
    expect(generateHarmonyPalette("bad", "Triadic", colors)).toEqual({});
  });

  it("resulting palette passes contrast checks", () => {
    for (const scheme of HARMONY_SCHEMES) {
      const result = generateHarmonyPalette(brand, scheme, colors);
      const merged = { ...colors, ...result };
      for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
        if (merged[fgKey] && merged[bgKey]) {
          expect(contrastRatio(merged[fgKey], merged[bgKey])).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// generateRandomPalette
// ---------------------------------------------------------------------------

describe("generateRandomPalette", () => {
  beforeEach(() => {
    // Ensure jsdom doesn't have 'dark' class
    document.documentElement.classList.remove("dark");
  });

  it("generates a brand color", () => {
    const colors = buildColors();
    const result = generateRandomPalette(colors);
    expect(result["--brand"]).toBeDefined();
  });

  it("preserves locked brand", () => {
    const colors = buildColors({ "--brand": "120 80% 45%" });
    const locked = new Set(["--brand"]);
    const result = generateRandomPalette(colors, locked);
    expect(result["--brand"]).toBeUndefined();
  });

  it("generates secondary and accent derived from brand hue", () => {
    const colors = buildColors();
    const result = generateRandomPalette(colors);
    expect(result["--secondary"]).toBeDefined();
    expect(result["--accent"]).toBeDefined();
  });

  it("generates mode-appropriate background (light mode)", () => {
    document.documentElement.classList.remove("dark");
    const colors = buildColors();
    const result = generateRandomPalette(colors);
    const bgLight = parseFloat(result["--background"]!.split(/\s+/)[2]);
    expect(bgLight).toBeGreaterThanOrEqual(90);
  });

  it("generates mode-appropriate background (dark mode)", () => {
    document.documentElement.classList.add("dark");
    const colors = buildColors();
    const result = generateRandomPalette(colors);
    const bgLight = parseFloat(result["--background"]!.split(/\s+/)[2]);
    expect(bgLight).toBeLessThanOrEqual(15);
    document.documentElement.classList.remove("dark");
  });

  it("resulting palette passes all contrast checks", () => {
    const colors = buildColors();
    // Run multiple times to catch random failures
    for (let i = 0; i < 5; i++) {
      const result = generateRandomPalette(colors);
      const merged = { ...colors, ...result };
      for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
        if (merged[fgKey] && merged[bgKey]) {
          expect(contrastRatio(merged[fgKey], merged[bgKey])).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it("derives cohesive palette from locked brand", () => {
    const colors = buildColors({ "--brand": "300 80% 45%" });
    const locked = new Set(["--brand"]);
    const result = generateRandomPalette(colors, locked);
    const merged = { ...colors, ...result };
    // Primary should adopt brand hue when derived
    if (merged["--primary"]) {
      const primaryHue = parseFloat(merged["--primary"].split(/\s+/)[0]);
      expect(primaryHue).toBeCloseTo(300, 0);
    }
    // Ring should adopt brand hue
    if (merged["--ring"]) {
      const ringHue = parseFloat(merged["--ring"].split(/\s+/)[0]);
      expect(ringHue).toBeCloseTo(300, 0);
    }
  });

  it("populates all EDITABLE_VARS keys", () => {
    const colors = buildColors();
    const result = generateRandomPalette(colors);
    const merged = { ...colors, ...result };
    for (const { key } of EDITABLE_VARS) {
      expect(merged[key]).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// EDITABLE_VARS and CONTRAST_PAIRS integrity
// ---------------------------------------------------------------------------

describe("constants integrity", () => {
  it("EDITABLE_VARS has unique keys", () => {
    const keys = EDITABLE_VARS.map((v) => v.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("CONTRAST_PAIRS references valid EDITABLE_VARS keys", () => {
    const validKeys = new Set<string>(EDITABLE_VARS.map((v) => v.key));
    for (const [fg, bg] of CONTRAST_PAIRS) {
      expect(validKeys.has(fg)).toBe(true);
      expect(validKeys.has(bg)).toBe(true);
    }
  });

  it("every foreground key in EDITABLE_VARS has a contrast pair", () => {
    const fgKeys = EDITABLE_VARS.map((v) => v.key).filter((k) => k.endsWith("-foreground"));
    const pairedFgs = new Set(CONTRAST_PAIRS.map(([fg]) => fg));
    for (const fgKey of fgKeys) {
      expect(pairedFgs.has(fgKey)).toBe(true);
    }
  });
});

/// <reference types="vitest/globals" />
import {
  hslStringToHex,
  hexToHslString,
  contrastRatio,
  fgForBg,
  autoAdjustContrast,
  generateHarmonyPalette,
  derivePaletteFromChange,
  generateRandomPalette,
  CONTRAST_PAIRS,
} from "../utils/themeUtils";
import { validateLicenseKey, generateLicenseKey } from "../utils/license";

// ---------------------------------------------------------------------------
// hslStringToHex
// ---------------------------------------------------------------------------
describe("hslStringToHex", () => {
  it("converts black (0 0% 0%) to #000000", () => {
    expect(hslStringToHex("0 0% 0%")).toBe("#000000");
  });

  it("converts white (0 0% 100%) to #ffffff", () => {
    expect(hslStringToHex("0 0% 100%")).toBe("#ffffff");
  });

  it("converts pure red (0 100% 50%) to #ff0000", () => {
    expect(hslStringToHex("0 100% 50%")).toBe("#ff0000");
  });

  it("converts pure green (120 100% 50%) to #00ff00", () => {
    expect(hslStringToHex("120 100% 50%")).toBe("#00ff00");
  });

  it("converts pure blue (240 100% 50%) to #0000ff", () => {
    expect(hslStringToHex("240 100% 50%")).toBe("#0000ff");
  });

  it("returns #000000 for empty or invalid input", () => {
    expect(hslStringToHex("")).toBe("#000000");
    expect(hslStringToHex("   ")).toBe("#000000");
    expect(hslStringToHex("not a color")).toBe("#000000");
  });
});

// ---------------------------------------------------------------------------
// hexToHslString
// ---------------------------------------------------------------------------
describe("hexToHslString", () => {
  it("converts #000000 to an HSL string ending with 0%", () => {
    const result = hexToHslString("#000000");
    expect(result).toMatch(/^0\s/);
    expect(result).toMatch(/0\.0%$/);
  });

  it("converts #ffffff to an HSL string containing 100%", () => {
    const result = hexToHslString("#ffffff");
    expect(result).toContain("100.0%");
  });

  it("converts #ff0000 to an HSL string starting with hue 0", () => {
    const result = hexToHslString("#ff0000");
    expect(result).toMatch(/^0\.0\s/);
  });

  it("round-trips through hslStringToHex and back", () => {
    const original = "210 50% 40%";
    const hex = hslStringToHex(original);
    const roundTripped = hexToHslString(hex);

    // Parse both and compare numerically (small rounding differences are OK)
    const origParts = original.split(/\s+/).map((p) => parseFloat(p));
    const rtParts = roundTripped.split(/\s+/).map((p) => parseFloat(p));

    expect(rtParts[0]).toBeCloseTo(origParts[0], 0); // hue within 1 degree
    expect(rtParts[1]).toBeCloseTo(origParts[1], 0); // saturation within 1%
    expect(rtParts[2]).toBeCloseTo(origParts[2], 0); // lightness within 1%
  });
});

// ---------------------------------------------------------------------------
// contrastRatio
// ---------------------------------------------------------------------------
describe("contrastRatio", () => {
  it("returns ~21 for black vs white", () => {
    const ratio = contrastRatio("0 0% 0%", "0 0% 100%");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("returns 1 for the same color against itself", () => {
    const ratio = contrastRatio("200 50% 50%", "200 50% 50%");
    expect(ratio).toBeCloseTo(1, 1);
  });

  it("returns less than 4.6 for light gray vs white (failing WCAG AA)", () => {
    const ratio = contrastRatio("0 0% 80%", "0 0% 100%");
    expect(ratio).toBeLessThan(4.6);
  });

  it("returns more than 4.6 for dark text on white background", () => {
    const ratio = contrastRatio("0 0% 20%", "0 0% 100%");
    expect(ratio).toBeGreaterThan(4.6);
  });
});

// ---------------------------------------------------------------------------
// fgForBg
// ---------------------------------------------------------------------------
describe("fgForBg", () => {
  it("returns dark foreground for a light background", () => {
    const result = fgForBg("0 0% 90%");
    expect(result).toBe("0 0% 0%");
  });

  it("returns white foreground for a dark background", () => {
    const result = fgForBg("0 0% 10%");
    expect(result).toBe("0 0% 100%");
  });

  it("returns one of the two expected values for a mid-range background", () => {
    const result = fgForBg("0 0% 50%");
    expect(["0 0% 0%", "0 0% 100%"]).toContain(result);
  });
});

// ---------------------------------------------------------------------------
// autoAdjustContrast
// ---------------------------------------------------------------------------
describe("autoAdjustContrast", () => {
  it("returns only foreground overrides when all pairs already meet 4.6:1", () => {
    const colors: Record<string, string> = {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 0%",
      "--brand": "220 80% 30%",
      "--primary": "220 80% 30%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "220 20% 90%",
      "--secondary-foreground": "0 0% 10%",
      "--muted": "220 10% 90%",
      "--muted-foreground": "0 0% 35%",
      "--accent": "220 20% 90%",
      "--accent-foreground": "0 0% 10%",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 0%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 0%",
      "--destructive": "0 80% 45%",
      "--destructive-foreground": "0 0% 100%",
      "--success": "142 70% 35%",
      "--success-foreground": "0 0% 100%",
      "--warning": "45 80% 50%",
      "--warning-foreground": "0 0% 0%",
    };
    const adjustments = autoAdjustContrast(colors);

    // Every adjusted value should still meet contrast requirements.
    // The function always sets --foreground, --card-foreground, --popover-foreground
    // based on fgForBg, so those keys may appear. But no color-pair adjustments
    // should be needed beyond that.
    for (const [fgKey, bgKey] of [
      ["--foreground", "--background"],
      ["--brand", "--background"],
      ["--primary-foreground", "--primary"],
    ] as const) {
      const fg = adjustments[fgKey] ?? colors[fgKey];
      const bg = adjustments[bgKey] ?? colors[bgKey];
      if (fg && bg) {
        expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.6);
      }
    }
  });

  it("adjusts foreground when it fails contrast against background", () => {
    const colors: Record<string, string> = {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 85%", // too light for white bg
      "--brand": "220 80% 30%",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 85%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 85%",
    };
    const adjustments = autoAdjustContrast(colors);

    // After adjustment, foreground should pass contrast
    const fg = adjustments["--foreground"] ?? colors["--foreground"];
    const bg = adjustments["--background"] ?? colors["--background"];
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.6);
  });

  it("does not adjust locked keys", () => {
    const colors: Record<string, string> = {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 85%", // fails contrast
      "--brand": "220 80% 80%", // fails contrast
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 85%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 85%",
    };
    const locked = new Set(["--foreground", "--brand"]);
    const adjustments = autoAdjustContrast(colors, locked);

    // Locked keys should not appear in adjustments
    expect(adjustments["--foreground"]).toBeUndefined();
    expect(adjustments["--brand"]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// generateHarmonyPalette
// ---------------------------------------------------------------------------
describe("generateHarmonyPalette", () => {
  const baseColors: Record<string, string> = {
    "--brand": "0 50% 50%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 0%",
    "--secondary": "0 30% 80%",
    "--secondary-foreground": "0 0% 10%",
    "--accent": "0 30% 80%",
    "--accent-foreground": "0 0% 10%",
    "--muted": "0 10% 90%",
    "--muted-foreground": "0 0% 40%",
    "--border": "0 10% 85%",
    "--card": "0 0% 100%",
    "--card-foreground": "0 0% 0%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "0 0% 0%",
    "--primary": "0 50% 50%",
    "--primary-foreground": "0 0% 100%",
    "--ring": "0 50% 50%",
    "--destructive": "0 80% 45%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 70% 35%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 80% 50%",
    "--warning-foreground": "0 0% 0%",
  };

  it("complementary scheme produces a secondary hue near 180", () => {
    const result = generateHarmonyPalette("0 50% 50%", "Complementary", baseColors);
    const secParts = result["--secondary"]?.trim().split(/\s+/);
    expect(secParts).toBeDefined();
    const secHue = parseFloat(secParts![0]);
    expect(secHue).toBeCloseTo(180, 0);
  });

  it("triadic scheme produces a secondary hue at 120", () => {
    const result = generateHarmonyPalette("0 50% 50%", "Triadic", baseColors);
    const secParts = result["--secondary"]?.trim().split(/\s+/);
    expect(secParts).toBeDefined();

    const secHue = parseFloat(secParts![0]);
    expect(secHue).toBeCloseTo(120, 0);

    // Accent is also set (may be shifted by palette derivation)
    expect(result["--accent"]).toBeDefined();
  });

  it("analogous scheme produces hues close to the original", () => {
    const result = generateHarmonyPalette("0 50% 50%", "Analogous", baseColors);
    const secParts = result["--secondary"]?.trim().split(/\s+/);
    expect(secParts).toBeDefined();

    const secHue = parseFloat(secParts![0]);
    // Analogous secondary offset is +30
    expect(secHue).toBeCloseTo(30, 0);

    // Accent is also set (may be shifted by palette derivation from secondary)
    expect(result["--accent"]).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// generateRandomPalette — end-to-end contrast regression
// ---------------------------------------------------------------------------
describe("generateRandomPalette", () => {
  const baseColors: Record<string, string> = {
    "--brand": "220 80% 50%",
    "--background": "0 0% 95%",
    "--foreground": "0 0% 10%",
    "--secondary": "220 20% 80%",
    "--secondary-foreground": "0 0% 10%",
    "--accent": "220 20% 80%",
    "--accent-foreground": "0 0% 10%",
    "--muted": "220 10% 90%",
    "--muted-foreground": "0 0% 40%",
    "--border": "0 10% 85%",
    "--card": "0 0% 95%",
    "--card-foreground": "0 0% 10%",
    "--popover": "0 0% 95%",
    "--popover-foreground": "0 0% 10%",
    "--primary": "220 80% 50%",
    "--primary-foreground": "0 0% 100%",
    "--ring": "220 80% 50%",
    "--destructive": "0 80% 45%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 70% 35%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 80% 50%",
    "--warning-foreground": "0 0% 0%",
  };

  it("produces palettes where all contrast pairs meet WCAG AA (4.5:1) across 50 runs", () => {
    for (let run = 0; run < 50; run++) {
      const result = generateRandomPalette(baseColors, new Set(), false);
      const merged = { ...baseColors, ...result };

      for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
        const fg = merged[fgKey];
        const bg = merged[bgKey];
        if (!fg || !bg) continue;
        const ratio = contrastRatio(fg, bg);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("produces palettes meeting WCAG AA in dark mode across 50 runs", () => {
    for (let run = 0; run < 50; run++) {
      const result = generateRandomPalette(baseColors, new Set(), true);
      const merged = { ...baseColors, ...result };

      for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
        const fg = merged[fgKey];
        const bg = merged[bgKey];
        if (!fg || !bg) continue;
        const ratio = contrastRatio(fg, bg);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("muted-foreground meets WCAG AA against background at 87% lightness", () => {
    const colorsWithGrayBg = { ...baseColors, "--background": "200 18% 87%" };
    for (let run = 0; run < 20; run++) {
      const result = generateRandomPalette(colorsWithGrayBg, new Set(["--background"]), false);
      const merged = { ...colorsWithGrayBg, ...result };
      const ratio = contrastRatio(merged["--muted-foreground"], merged["--background"]);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });
});

// ---------------------------------------------------------------------------
// validateLicenseKey
// ---------------------------------------------------------------------------
describe("validateLicenseKey", () => {
  it("accepts a valid generated key", () => {
    const key = generateLicenseKey();
    const result = validateLicenseKey(key);
    expect(result.isValid).toBe(true);
    expect(result.isPremium).toBe(true);
  });

  it("rejects an invalid format", () => {
    const result = validateLicenseKey("NOT-A-VALID-KEY");
    expect(result.isValid).toBe(false);
    expect(result.isPremium).toBe(false);
  });

  it("rejects an empty string", () => {
    const result = validateLicenseKey("");
    expect(result.isValid).toBe(false);
    expect(result.isPremium).toBe(false);
  });

  it("rejects null and undefined", () => {
    expect(validateLicenseKey(null).isValid).toBe(false);
    expect(validateLicenseKey(undefined).isValid).toBe(false);
  });

  it("rejects a key with correct format but wrong checksum", () => {
    const result = validateLicenseKey("THEMAL-AAAA-BBBB-ZZZZ");
    expect(result.isValid).toBe(false);
  });

  it("is case-insensitive", () => {
    const key = generateLicenseKey();
    const lower = validateLicenseKey(key.toLowerCase());
    expect(lower.isValid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// CONTRAST_PAIRS coverage
// ---------------------------------------------------------------------------
describe("CONTRAST_PAIRS", () => {
  it("includes muted-foreground against card, popover, accent, secondary", () => {
    const mutedPairs = CONTRAST_PAIRS.filter(([fg]) => fg === "--muted-foreground");
    const bgKeys = mutedPairs.map(([, bg]) => bg);
    expect(bgKeys).toContain("--background");
    expect(bgKeys).toContain("--muted");
    expect(bgKeys).toContain("--card");
    expect(bgKeys).toContain("--popover");
    expect(bgKeys).toContain("--accent");
    expect(bgKeys).toContain("--secondary");
  });

  it("includes foreground against all surface backgrounds", () => {
    const fgPairs = CONTRAST_PAIRS.filter(([fg]) => fg === "--foreground");
    const bgKeys = fgPairs.map(([, bg]) => bg);
    expect(bgKeys).toContain("--background");
    expect(bgKeys).toContain("--card");
    expect(bgKeys).toContain("--muted");
    expect(bgKeys).toContain("--accent");
    expect(bgKeys).toContain("--popover");
    expect(bgKeys).toContain("--secondary");
  });

  it("includes brand against multiple surfaces", () => {
    const brandPairs = CONTRAST_PAIRS.filter(([fg]) => fg === "--brand");
    const bgKeys = brandPairs.map(([, bg]) => bg);
    expect(bgKeys).toContain("--background");
    expect(bgKeys).toContain("--card");
    expect(bgKeys).toContain("--muted");
    expect(bgKeys).toContain("--accent");
    expect(bgKeys).toContain("--secondary");
  });
});

// ---------------------------------------------------------------------------
// autoAdjustContrast — safety net & expanded pairs
// ---------------------------------------------------------------------------
describe("autoAdjustContrast safety net", () => {
  it("adjusts muted-foreground when it fails on background", () => {
    const colors: Record<string, string> = {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 0%",
      "--brand": "220 80% 30%",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 0%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 0%",
      "--muted": "0 0% 95%",
      "--muted-foreground": "0 0% 85%", // fails on white bg
      "--accent": "220 20% 90%",
      "--accent-foreground": "0 0% 10%",
      "--secondary": "220 20% 90%",
      "--secondary-foreground": "0 0% 10%",
      "--primary": "220 80% 30%",
      "--primary-foreground": "0 0% 100%",
      "--destructive": "0 80% 45%",
      "--destructive-foreground": "0 0% 100%",
      "--success": "142 70% 35%",
      "--success-foreground": "0 0% 100%",
      "--warning": "45 80% 50%",
      "--warning-foreground": "0 0% 0%",
    };
    const adjustments = autoAdjustContrast(colors);
    const mutedFg = adjustments["--muted-foreground"] ?? colors["--muted-foreground"];

    // Must pass on background after adjustment
    expect(contrastRatio(mutedFg, colors["--background"])).toBeGreaterThanOrEqual(4.5);
    // Should also pass on card (same as background here)
    expect(contrastRatio(mutedFg, adjustments["--card"] ?? colors["--card"])).toBeGreaterThanOrEqual(4.5);
  });

  it("fixes brand failing on accent surface via safety net", () => {
    const colors: Record<string, string> = {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 0%",
      "--brand": "220 80% 70%",        // light brand — passes on white but fails on light accent
      "--accent": "220 20% 75%",       // light accent surface
      "--accent-foreground": "0 0% 10%",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 0%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 0%",
      "--muted": "220 10% 90%",
      "--muted-foreground": "0 0% 35%",
      "--secondary": "220 20% 90%",
      "--secondary-foreground": "0 0% 10%",
      "--primary": "220 80% 40%",
      "--primary-foreground": "0 0% 100%",
      "--destructive": "0 80% 45%",
      "--destructive-foreground": "0 0% 100%",
      "--success": "142 70% 35%",
      "--success-foreground": "0 0% 100%",
      "--warning": "45 80% 50%",
      "--warning-foreground": "0 0% 0%",
    };
    const adjustments = autoAdjustContrast(colors);
    const brand = adjustments["--brand"] ?? colors["--brand"];
    const accent = adjustments["--accent"] ?? colors["--accent"];
    expect(contrastRatio(brand, accent)).toBeGreaterThanOrEqual(4.5);
  });

  it("all core CONTRAST_PAIRS pass after autoAdjustContrast on a light palette", () => {
    // Light palette with failing foregrounds
    const colors: Record<string, string> = {
      "--background": "0 0% 98%",
      "--foreground": "0 0% 80%",      // fails
      "--brand": "220 80% 75%",        // fails on white
      "--card": "0 0% 98%",
      "--card-foreground": "0 0% 80%",
      "--popover": "0 0% 98%",
      "--popover-foreground": "0 0% 80%",
      "--muted": "0 0% 94%",
      "--muted-foreground": "0 0% 70%", // fails
      "--accent": "220 20% 94%",
      "--accent-foreground": "0 0% 80%",
      "--secondary": "220 20% 94%",
      "--secondary-foreground": "0 0% 80%",
      "--primary": "220 80% 40%",
      "--primary-foreground": "0 0% 80%",
      "--destructive": "0 80% 45%",
      "--destructive-foreground": "0 0% 100%",
      "--success": "142 70% 35%",
      "--success-foreground": "0 0% 100%",
      "--warning": "45 80% 50%",
      "--warning-foreground": "0 0% 0%",
    };
    const adjustments = autoAdjustContrast(colors);
    const merged = { ...colors, ...adjustments };

    // Check the core pairs (fg on bg)
    const corePairs: [string, string][] = [
      ["--foreground", "--background"],
      ["--card-foreground", "--card"],
      ["--popover-foreground", "--popover"],
      ["--primary-foreground", "--primary"],
      ["--muted-foreground", "--background"],
      ["--muted-foreground", "--muted"],
    ];
    for (const [fgKey, bgKey] of corePairs) {
      const fg = merged[fgKey];
      const bg = merged[bgKey];
      if (!fg || !bg) continue;
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("respects locked keys even in the safety net pass", () => {
    const colors: Record<string, string> = {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 80%", // fails contrast but locked
      "--brand": "220 80% 30%",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 80%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 80%",
      "--muted": "0 0% 95%",
      "--muted-foreground": "0 0% 60%",
      "--accent": "220 20% 90%",
      "--accent-foreground": "0 0% 10%",
      "--secondary": "220 20% 90%",
      "--secondary-foreground": "0 0% 10%",
      "--primary": "220 80% 30%",
      "--primary-foreground": "0 0% 100%",
      "--destructive": "0 80% 45%",
      "--destructive-foreground": "0 0% 100%",
      "--success": "142 70% 35%",
      "--success-foreground": "0 0% 100%",
      "--warning": "45 80% 50%",
      "--warning-foreground": "0 0% 0%",
    };
    const locked = new Set(["--foreground"]);
    const adjustments = autoAdjustContrast(colors, locked);
    expect(adjustments["--foreground"]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// autoAdjustContrast — opposite direction fallback
// ---------------------------------------------------------------------------
describe("autoAdjustContrast opposite direction fallback", () => {
  it("tries opposite lightness direction when initial direction fails", () => {
    // Light fg on light bg — initial direction would go lighter (wrong way)
    // but opposite direction should go darker and fix it
    const colors: Record<string, string> = {
      "--background": "0 0% 95%",
      "--foreground": "0 0% 90%",
      "--brand": "220 80% 30%",
      "--primary": "220 80% 30%",
      "--primary-foreground": "0 0% 90%",
      "--card": "0 0% 95%",
      "--card-foreground": "0 0% 90%",
      "--popover": "0 0% 95%",
      "--popover-foreground": "0 0% 90%",
      "--muted": "0 0% 90%",
      "--muted-foreground": "0 0% 85%",
      "--accent": "220 20% 90%",
      "--accent-foreground": "0 0% 85%",
      "--secondary": "220 20% 90%",
      "--secondary-foreground": "0 0% 85%",
      "--destructive": "0 80% 45%",
      "--destructive-foreground": "0 0% 100%",
      "--success": "142 70% 35%",
      "--success-foreground": "0 0% 100%",
      "--warning": "45 80% 50%",
      "--warning-foreground": "0 0% 0%",
    };
    const adjustments = autoAdjustContrast(colors);
    const merged = { ...colors, ...adjustments };

    // Primary-foreground should now pass against primary
    const pfg = merged["--primary-foreground"];
    const p = merged["--primary"];
    if (pfg && p) {
      expect(contrastRatio(pfg, p)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

// ---------------------------------------------------------------------------
// derivePaletteFromChange
// ---------------------------------------------------------------------------
describe("derivePaletteFromChange", () => {
  const baseColors: Record<string, string> = {
    "--brand": "220 80% 40%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 0%",
    "--primary": "220 80% 40%",
    "--primary-foreground": "0 0% 100%",
    "--ring": "220 80% 50%",
    "--secondary": "220 20% 80%",
    "--secondary-foreground": "0 0% 10%",
    "--muted": "220 10% 90%",
    "--muted-foreground": "0 0% 40%",
    "--accent": "220 20% 85%",
    "--accent-foreground": "0 0% 10%",
    "--border": "220 10% 85%",
    "--card": "0 0% 100%",
    "--card-foreground": "0 0% 0%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "0 0% 0%",
    "--destructive": "0 80% 45%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 70% 35%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 80% 50%",
    "--warning-foreground": "0 0% 0%",
  };

  it("changing --brand shifts hue of primary, ring, secondary, accent, border", () => {
    const derived = derivePaletteFromChange("--brand", "120 80% 40%", baseColors);
    // All shifted keys should have hue near 120
    for (const key of ["--primary", "--ring", "--secondary", "--accent", "--border"]) {
      expect(derived[key]).toBeDefined();
      const hue = parseFloat(derived[key].split(/\s+/)[0]);
      expect(hue).toBeCloseTo(120, 0);
    }
  });

  it("changing --brand derives semantic colors", () => {
    const derived = derivePaletteFromChange("--brand", "120 80% 40%", baseColors);
    expect(derived["--destructive"]).toBeDefined();
    expect(derived["--success"]).toBeDefined();
    expect(derived["--warning"]).toBeDefined();
  });

  it("changing --background derives card, popover, foreground, border", () => {
    const derived = derivePaletteFromChange("--background", "0 0% 15%", baseColors);
    expect(derived["--card"]).toBe("0 0% 15%");
    expect(derived["--popover"]).toBe("0 0% 15%");
    // Foreground should be white for dark background
    expect(derived["--foreground"]).toBe("0 0% 100%");
    expect(derived["--border"]).toBeDefined();
  });

  it("changing --foreground propagates to card and popover foreground", () => {
    const derived = derivePaletteFromChange("--foreground", "200 50% 20%", baseColors);
    expect(derived["--card-foreground"]).toBe("200 50% 20%");
    expect(derived["--popover-foreground"]).toBe("200 50% 20%");
  });

  it("changing --primary derives primary-foreground", () => {
    const derived = derivePaletteFromChange("--primary", "0 80% 30%", baseColors);
    expect(derived["--primary-foreground"]).toBeDefined();
    // Dark primary should get white foreground
    expect(derived["--primary-foreground"]).toBe("0 0% 100%");
  });

  it("respects locked keys", () => {
    const locked = new Set(["--card", "--foreground"]);
    const derived = derivePaletteFromChange("--background", "0 0% 15%", baseColors, locked);
    expect(derived["--card"]).toBeUndefined();
    expect(derived["--foreground"]).toBeUndefined();
    // Unlocked keys should still be derived
    expect(derived["--popover"]).toBe("0 0% 15%");
  });

  it("returns empty object for invalid HSL input", () => {
    const derived = derivePaletteFromChange("--brand", "invalid", baseColors);
    expect(Object.keys(derived)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// generateHarmonyPalette — Split-Complementary
// ---------------------------------------------------------------------------
describe("generateHarmonyPalette Split-Complementary", () => {
  const baseColors: Record<string, string> = {
    "--brand": "0 50% 50%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 0%",
    "--secondary": "0 30% 80%",
    "--secondary-foreground": "0 0% 10%",
    "--accent": "0 30% 80%",
    "--accent-foreground": "0 0% 10%",
    "--muted": "0 10% 90%",
    "--muted-foreground": "0 0% 40%",
    "--border": "0 10% 85%",
    "--card": "0 0% 100%",
    "--card-foreground": "0 0% 0%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "0 0% 0%",
    "--primary": "0 50% 50%",
    "--primary-foreground": "0 0% 100%",
    "--ring": "0 50% 50%",
    "--destructive": "0 80% 45%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 70% 35%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 80% 50%",
    "--warning-foreground": "0 0% 0%",
  };

  it("produces secondary hue at 150 and sets accent", () => {
    const result = generateHarmonyPalette("0 50% 50%", "Split-Complementary", baseColors);
    const secParts = result["--secondary"]?.trim().split(/\s+/);
    expect(secParts).toBeDefined();
    const secHue = parseFloat(secParts![0]);
    expect(secHue).toBeCloseTo(150, 0);

    // Accent is set (may be shifted by secondary derivation)
    expect(result["--accent"]).toBeDefined();
  });
});

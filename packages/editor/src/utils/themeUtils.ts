import storage from "./storage";

export const THEME_COLORS_KEY = "ds-theme-colors";
export const PENDING_COLORS_KEY = "ds-pending-colors";
export const COLOR_HISTORY_KEY = "ds-color-history";
export const CONTRAST_KNOWLEDGE_KEY = "ds-contrast-knowledge";

export interface ContrastCorrection {
  bgHueRange: [number, number];
  bgLightRange: [number, number];
  fgKey: string;
  correctedValue: string;
}

export function saveContrastCorrection(bgHsl: string, fgKey: string, correctedValue: string) {
  const parts = bgHsl.trim().split(/\s+/);
  if (parts.length < 3) return;
  const bgHue = parseFloat(parts[0]);
  const bgLight = parseFloat(parts[2]);
  const hueMargin = 15;
  const lightMargin = 10;

  const corrections = storage.get<ContrastCorrection[]>(CONTRAST_KNOWLEDGE_KEY) || [];

  const existing = corrections.find(c =>
    c.fgKey === fgKey &&
    bgHue >= c.bgHueRange[0] && bgHue <= c.bgHueRange[1] &&
    bgLight >= c.bgLightRange[0] && bgLight <= c.bgLightRange[1]
  );
  if (existing) {
    existing.correctedValue = correctedValue;
  } else {
    corrections.push({
      bgHueRange: [
        Math.max(0, bgHue - hueMargin),
        Math.min(360, bgHue + hueMargin),
      ],
      bgLightRange: [
        Math.max(0, bgLight - lightMargin),
        Math.min(100, bgLight + lightMargin),
      ],
      fgKey,
      correctedValue,
    });
  }

  if (corrections.length > 100) corrections.splice(0, corrections.length - 100);
  storage.set(CONTRAST_KNOWLEDGE_KEY, corrections);
}

export function applyKnownCorrections(bgHsl: string, lockedKeys: Set<string>): Record<string, string> {
  const parts = bgHsl.trim().split(/\s+/);
  if (parts.length < 3) return {};
  const bgHue = parseFloat(parts[0]);
  const bgLight = parseFloat(parts[2]);

  const corrections = storage.get<ContrastCorrection[]>(CONTRAST_KNOWLEDGE_KEY) || [];
  const result: Record<string, string> = {};

  for (const c of corrections) {
    if (lockedKeys.has(c.fgKey)) continue;
    const hueMatch = bgHue >= c.bgHueRange[0] && bgHue <= c.bgHueRange[1];
    const lightMatch = bgLight >= c.bgLightRange[0] && bgLight <= c.bgLightRange[1];
    if (hueMatch && lightMatch) {
      result[c.fgKey] = c.correctedValue;
    }
  }
  return result;
}

export const CONTRAST_PAIRS: [string, string][] = [
  ["--foreground", "--background"],
  ["--brand", "--background"],
  ["--muted-foreground", "--background"],
  ["--primary-foreground", "--primary"],
  ["--secondary-foreground", "--secondary"],
  ["--muted-foreground", "--muted"],
  ["--accent-foreground", "--accent"],
  ["--card-foreground", "--card"],
  ["--popover-foreground", "--popover"],
  ["--destructive-foreground", "--destructive"],
  ["--success-foreground", "--success"],
  ["--warning-foreground", "--warning"],
];

function hslToRgb(hsl: string): [number, number, number] {
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3) return [0, 0, 0];
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [f(0), f(8), f(4)];
}

function luminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function fgForBg(hslBg: string): string {
  const [r, g, b] = hslToRgb(hslBg);
  const bgL = luminance(r, g, b);
  const whiteContrast = (1.0 + 0.05) / (bgL + 0.05);
  const blackContrast = (bgL + 0.05) / (0.0 + 0.05);
  return whiteContrast >= blackContrast ? "0 0% 100%" : "0 0% 0%";
}

export function contrastRatio(hsl1: string, hsl2: string): number {
  const [r1, g1, b1] = hslToRgb(hsl1);
  const [r2, g2, b2] = hslToRgb(hsl2);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export const EDITABLE_VARS = [
  { key: "--brand", label: "Brand Blue" },
  { key: "--secondary", label: "Secondary" },
  { key: "--background", label: "Background" },
  { key: "--foreground", label: "Foreground" },
  { key: "--card", label: "Card" },
  { key: "--card-foreground", label: "Card FG" },
  { key: "--popover", label: "Popover" },
  { key: "--popover-foreground", label: "Popover FG" },
  { key: "--primary", label: "Primary" },
  { key: "--primary-foreground", label: "Primary FG" },
  { key: "--secondary-foreground", label: "Secondary FG" },
  { key: "--muted", label: "Muted" },
  { key: "--muted-foreground", label: "Muted FG" },
  { key: "--accent", label: "Accent" },
  { key: "--accent-foreground", label: "Accent FG" },
  { key: "--destructive", label: "Destructive" },
  { key: "--destructive-foreground", label: "Destructive FG" },
  { key: "--success", label: "Success" },
  { key: "--success-foreground", label: "Success FG" },
  { key: "--warning", label: "Warning" },
  { key: "--warning-foreground", label: "Warning FG" },
  { key: "--border", label: "Border" },
  { key: "--ring", label: "Ring" },
] as const;

export function hslStringToHex(hsl: string): string {
  if (!hsl || !hsl.trim()) return "#000000";
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3 || parts.some((p) => isNaN(parseFloat(p)))) return "#000000";
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function hexToHslString(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return `0 0% ${(l * 100).toFixed(1)}%`;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}

export function persistContrastFixes(fixes: Record<string, string>) {
  if (Object.keys(fixes).length === 0) return;
  const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
  storage.set(PENDING_COLORS_KEY, { ...pending, ...fixes });
  const saved = storage.get<Record<string, string>>(THEME_COLORS_KEY) || {};
  storage.set(THEME_COLORS_KEY, { ...saved, ...fixes });
}

export const derivePaletteFromChange = (
    changedKey: string,
    newHsl: string,
    currentColors: Record<string, string>,
    lockedKeys?: Set<string>,
  ): Record<string, string> => {
    const derived: Record<string, string> = {};
    const locked = lockedKeys ?? new Set<string>();
    const parts = newHsl.trim().split(/\s+/);
    if (parts.length < 3) return derived;
    const newHue = parseFloat(parts[0]);

    const getExisting = (varKey: string): { h: number; s: number; l: number } | null => {
      const val = currentColors[varKey];
      if (!val) return null;
      const p = val.trim().split(/\s+/);
      if (p.length < 3) return null;
      return { h: parseFloat(p[0]), s: parseFloat(p[1]), l: parseFloat(p[2]) };
    };

    const shiftExisting = (varKey: string) => {
      if (locked.has(varKey)) return;
      const existing = getExisting(varKey);
      if (existing) {
        derived[varKey] = `${newHue.toFixed(1)} ${existing.s.toFixed(1)}% ${existing.l.toFixed(1)}%`;
      }
    };

    const deriveSemanticColors = () => {
      const newSat = parseFloat(parts[1]);
      const newLight = parseFloat(parts[2]);

      if (!locked.has("--destructive")) {
        const destSat = Math.min(100, newSat * 1.1);
        const destLight = Math.max(35, Math.min(55, newLight * 0.85));
        derived["--destructive"] = `0 ${destSat.toFixed(1)}% ${destLight.toFixed(1)}%`;
      }
      if (!locked.has("--destructive-foreground")) {
        derived["--destructive-foreground"] = `0 0% 100%`;
      }

      if (!locked.has("--success")) {
        const succSat = Math.min(100, newSat * 0.9);
        const succLight = Math.max(35, Math.min(55, newLight * 0.8));
        derived["--success"] = `142 ${succSat.toFixed(1)}% ${succLight.toFixed(1)}%`;
      }
      if (!locked.has("--success-foreground")) {
        derived["--success-foreground"] = `0 0% 100%`;
      }

      if (!locked.has("--warning")) {
        const warnSat = Math.min(100, newSat * 1.05);
        const warnLight = Math.max(40, Math.min(60, newLight * 0.9));
        derived["--warning"] = `45 ${warnSat.toFixed(1)}% ${warnLight.toFixed(1)}%`;
      }
      if (!locked.has("--warning-foreground")) {
        derived["--warning-foreground"] = `0 0% 0%`;
      }
    };

    const deriveBodyForegrounds = () => {
      const bg = currentColors["--background"];
      if (!bg) return;
      const fgColor = fgForBg(bg);
      if (!locked.has("--foreground")) derived["--foreground"] = fgColor;
      if (!locked.has("--card-foreground")) derived["--card-foreground"] = fgColor;
      if (!locked.has("--popover-foreground")) derived["--popover-foreground"] = fgColor;
      if (!locked.has("--muted-foreground")) {
        const bgParts = bg.trim().split(/\s+/);
        const bgL = parseFloat(bgParts[2]);
        const mutedL = bgL > 50 ? 44 : 65;
        derived["--muted-foreground"] = `0 0% ${mutedL}%`;
      }
    };

    if (changedKey === "--brand") {
      shiftExisting("--primary");
      shiftExisting("--primary-foreground");
      shiftExisting("--ring");
      shiftExisting("--secondary");
      shiftExisting("--secondary-foreground");
      shiftExisting("--muted");
      shiftExisting("--accent");
      shiftExisting("--accent-foreground");
      shiftExisting("--border");
      deriveBodyForegrounds();
      deriveSemanticColors();
    } else if (changedKey === "--secondary") {
      shiftExisting("--secondary-foreground");
      shiftExisting("--accent");
      shiftExisting("--accent-foreground");
      shiftExisting("--muted");
      shiftExisting("--border");
      deriveBodyForegrounds();
      deriveSemanticColors();
    } else if (changedKey === "--accent") {
      shiftExisting("--accent-foreground");
      shiftExisting("--muted");
      shiftExisting("--border");
      deriveSemanticColors();
    } else if (changedKey === "--background") {
      if (!locked.has("--card")) derived["--card"] = newHsl;
      if (!locked.has("--popover")) derived["--popover"] = newHsl;
      const fgColor = fgForBg(newHsl);
      if (!locked.has("--foreground")) derived["--foreground"] = fgColor;
      if (!locked.has("--card-foreground")) derived["--card-foreground"] = fgColor;
      if (!locked.has("--popover-foreground")) derived["--popover-foreground"] = fgColor;
      if (!locked.has("--secondary-foreground")) derived["--secondary-foreground"] = fgForBg(currentColors["--secondary"] || newHsl);
      if (!locked.has("--accent-foreground")) derived["--accent-foreground"] = fgForBg(currentColors["--accent"] || newHsl);
      if (!locked.has("--muted-foreground")) {
        const bgL = parseFloat(newHsl.trim().split(/\s+/)[2]);
        const mutedL = bgL > 50 ? 44 : 65;
        derived["--muted-foreground"] = `0 0% ${mutedL}%`;
      }
      if (!locked.has("--border")) {
        const bgParts = newHsl.trim().split(/\s+/);
        const bgL = parseFloat(bgParts[2]);
        const borderL = bgL > 50 ? Math.max(0, bgL - 9) : Math.min(100, bgL + 12);
        derived["--border"] = `${bgParts[0]} ${(parseFloat(bgParts[1]) * 0.3).toFixed(1)}% ${borderL.toFixed(1)}%`;
      }
    } else if (changedKey === "--foreground") {
      if (!locked.has("--card-foreground")) derived["--card-foreground"] = newHsl;
      if (!locked.has("--popover-foreground")) derived["--popover-foreground"] = newHsl;
    } else if (changedKey === "--primary") {
      if (!locked.has("--primary-foreground")) {
        derived["--primary-foreground"] = fgForBg(newHsl);
      }
    }

    return derived;
  };

export const autoAdjustContrast = (
    newColors: Record<string, string>,
    lockedKeys?: Set<string>,
  ): Record<string, string> => {
    const adjustments: Record<string, string> = {};
    const locked = lockedKeys ?? new Set<string>();
    const working = { ...newColors };

    const parseHsl = (val: string) => {
      const p = val.trim().split(/\s+/);
      if (p.length < 3) return null;
      return { h: parseFloat(p[0]), s: parseFloat(p[1]), l: parseFloat(p[2]) };
    };
    const toHsl = (h: number, s: number, l: number) =>
      `${h} ${s}% ${l}%`;

    let brandVal = working["--brand"];
    const bgVal = working["--background"];
    if (brandVal && bgVal && contrastRatio(brandVal, bgVal) < 4.6) {
      const brandLocked = locked.has("--brand");
      const bgLocked = locked.has("--background");
      if (brandLocked && bgLocked) {
        // Both locked - skip
      } else {
        const bg = parseHsl(bgVal);
        const brand = parseHsl(brandVal);
        if (bg && brand) {
          if (!brandLocked) {
            const brandDir = bg.l > 50 ? -3 : 3;
            let bl = brand.l;
            let adjBrand = toHsl(brand.h, brand.s, bl);
            for (let i = 0; i < 34; i++) {
              bl = Math.max(0, Math.min(100, bl + brandDir));
              adjBrand = toHsl(brand.h, brand.s, bl);
              if (contrastRatio(adjBrand, bgVal) >= 4.6) break;
            }
            if (contrastRatio(adjBrand, bgVal) >= 4.6) {
              adjustments["--brand"] = adjBrand;
              working["--brand"] = adjBrand;
              brandVal = adjBrand;
            } else if (!bgLocked) {
              const bgDir = brand.l > 50 ? -3 : 3;
              let bgL = bg.l;
              let adjBg = toHsl(bg.h, bg.s, bgL);
              for (let i = 0; i < 34; i++) {
                bgL = Math.max(0, Math.min(100, bgL + bgDir));
                adjBg = toHsl(bg.h, bg.s, bgL);
                if (contrastRatio(brandVal, adjBg) >= 4.6) break;
              }
              adjustments["--background"] = adjBg;
              working["--background"] = adjBg;
            }
          } else if (!bgLocked) {
            const bgDir = brand.l > 50 ? -3 : 3;
            let bgL = bg.l;
            let adjBg = toHsl(bg.h, bg.s, bgL);
            for (let i = 0; i < 34; i++) {
              bgL = Math.max(0, Math.min(100, bgL + bgDir));
              adjBg = toHsl(bg.h, bg.s, bgL);
              if (contrastRatio(brandVal, adjBg) >= 4.6) break;
            }
            adjustments["--background"] = adjBg;
            working["--background"] = adjBg;
          }
        }
      }
    }

    for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
      const fgVal = working[fgKey];
      const bgv = working[bgKey];
      if (!fgVal || !bgv) continue;
      if (contrastRatio(fgVal, bgv) >= 4.6) continue;

      const fgLocked = locked.has(fgKey);
      const bgKeyLocked = locked.has(bgKey);
      if (fgLocked && bgKeyLocked) continue;

      const fg = parseHsl(fgVal);
      const bg = parseHsl(bgv);
      if (!fg || !bg) continue;

      let adjusted = fgVal;
      let adjustedBg = bgv;

      if (!fgLocked) {
        const direction = bg.l > 50 ? -3 : 3;
        let l = fg.l;
        adjusted = toHsl(fg.h, fg.s, l);
        for (let i = 0; i < 34; i++) {
          l = Math.max(0, Math.min(100, l + direction));
          adjusted = toHsl(fg.h, fg.s, l);
          if (contrastRatio(adjusted, adjustedBg) >= 4.6) break;
        }

        if (contrastRatio(adjusted, adjustedBg) < 4.6) {
          l = fg.l;
          const oppDir = -direction;
          for (let i = 0; i < 34; i++) {
            l = Math.max(0, Math.min(100, l + oppDir));
            adjusted = toHsl(fg.h, fg.s, l);
            if (contrastRatio(adjusted, adjustedBg) >= 4.6) break;
          }
        }
      }

      if (contrastRatio(adjusted, adjustedBg) < 4.6 && !bgKeyLocked) {
        const refL = fgLocked ? fg.l : parseFloat(adjusted.split(/\s+/)[2]);
        const bgDir = refL > 50 ? -3 : 3;
        let bgL = bg.l;
        let adjBg = toHsl(bg.h, bg.s, bgL);
        for (let i = 0; i < 34; i++) {
          bgL = Math.max(0, Math.min(100, bgL + bgDir));
          adjBg = toHsl(bg.h, bg.s, bgL);
          if (contrastRatio(adjusted, adjBg) >= 4.6) break;
        }
        if (contrastRatio(adjusted, adjBg) >= 4.6) {
          adjustments[bgKey] = adjBg;
          working[bgKey] = adjBg;
          adjustedBg = adjBg;
        }
      }

      if (!fgLocked && adjusted !== fgVal) {
        adjustments[fgKey] = adjusted;
        working[fgKey] = adjusted;
      }
    }

    const finalBg = working["--background"];
    if (finalBg && !locked.has("--foreground")) {
      const bestFg = fgForBg(finalBg);
      adjustments["--foreground"] = bestFg;
      working["--foreground"] = bestFg;
    }
    for (const [fgK, bgK] of [["--card-foreground", "--card"], ["--popover-foreground", "--popover"]] as const) {
      const bgV = working[bgK];
      if (bgV && !locked.has(fgK)) {
        const bestFg = fgForBg(bgV);
        adjustments[fgK] = bestFg;
        working[fgK] = bestFg;
      }
    }
    if (finalBg && !locked.has("--muted-foreground")) {
      const mutedFg = working["--muted-foreground"];
      if (mutedFg && contrastRatio(mutedFg, finalBg) < 4.6) {
        const bgL = parseFloat(finalBg.trim().split(/\s+/)[2]);
        const mutedL = bgL > 50 ? Math.max(0, bgL - 50) : Math.min(100, bgL + 50);
        const fixedMuted = `0 0% ${mutedL}%`;
        if (contrastRatio(fixedMuted, finalBg) >= 4.6) {
          adjustments["--muted-foreground"] = fixedMuted;
          working["--muted-foreground"] = fixedMuted;
        } else {
          adjustments["--muted-foreground"] = fgForBg(finalBg);
          working["--muted-foreground"] = fgForBg(finalBg);
        }
      }
    }

    return adjustments;
};

export const HARMONY_SCHEMES = ['Complementary', 'Analogous', 'Triadic', 'Split-Complementary'] as const;
export type HarmonyScheme = typeof HARMONY_SCHEMES[number];

export const generateHarmonyPalette = (
  brandHsl: string,
  scheme: HarmonyScheme,
  currentColors: Record<string, string>,
  lockedKeys?: Set<string>,
): Record<string, string> => {
  const locked = lockedKeys ?? new Set<string>();
  const parts = brandHsl.trim().split(/\s+/);
  if (parts.length < 3) return {};

  const hue = parseFloat(parts[0]);
  const sat = parseFloat(parts[1]);
  const light = parseFloat(parts[2]);

  let secHueOffset: number;
  let accHueOffset: number;

  switch (scheme) {
    case 'Complementary':
      secHueOffset = 180;
      accHueOffset = 150;
      break;
    case 'Analogous':
      secHueOffset = 30;
      accHueOffset = -30;
      break;
    case 'Triadic':
      secHueOffset = 120;
      accHueOffset = 240;
      break;
    case 'Split-Complementary':
      secHueOffset = 150;
      accHueOffset = 210;
      break;
  }

  const wrap = (h: number) => ((h % 360) + 360) % 360;
  const secHue = wrap(hue + secHueOffset);
  const accHue = wrap(hue + accHueOffset);

  const secSat = Math.min(100, sat * 0.85);
  const secLight = Math.min(95, Math.max(5, light * 1.05));
  const accSat = Math.min(100, sat * 0.9);
  const accLight = Math.min(95, Math.max(5, light * 0.95));

  const secondaryHsl = locked.has('--secondary')
    ? currentColors['--secondary']
    : `${secHue.toFixed(1)} ${secSat.toFixed(1)}% ${secLight.toFixed(1)}%`;
  const accentHsl = locked.has('--accent')
    ? currentColors['--accent']
    : `${accHue.toFixed(1)} ${accSat.toFixed(1)}% ${accLight.toFixed(1)}%`;

  let merged: Record<string, string> = { ...currentColors, '--secondary': secondaryHsl };
  const secDerived = derivePaletteFromChange('--secondary', secondaryHsl, merged, locked);
  merged = { ...merged, ...secDerived, '--accent': accentHsl };
  const accDerived = derivePaletteFromChange('--accent', accentHsl, merged, locked);
  merged = { ...merged, ...accDerived };

  const result: Record<string, string> = {};
  if (!locked.has('--secondary')) result['--secondary'] = secondaryHsl;
  if (!locked.has('--accent')) result['--accent'] = accentHsl;
  Object.assign(result, secDerived, accDerived);

  const bgForKnowledge = currentColors['--background'];
  if (bgForKnowledge) {
    const knownFixes = applyKnownCorrections(bgForKnowledge, locked);
    Object.assign(result, knownFixes);
  }

  const fullColors = { ...currentColors, ...result };
  const adjustments = autoAdjustContrast(fullColors, locked);
  Object.assign(result, adjustments);

  return result;
};

/** Generate a random brand color and derive the full palette, respecting locked keys. */
export const generateRandomPalette = (
  currentColors: Record<string, string>,
  lockedKeys?: Set<string>,
  isDark?: boolean,
): Record<string, string> => {
  const locked = lockedKeys ?? new Set<string>();
  const result: Record<string, string> = {};
  const dark = isDark ?? document.documentElement.classList.contains('dark');

  const hue = Math.random() * 360;
  const sat = 55 + Math.random() * 35;
  const light = dark
    ? 50 + Math.random() * 20
    : 35 + Math.random() * 25;
  const brandHsl = `${hue.toFixed(1)} ${sat.toFixed(1)}% ${light.toFixed(1)}%`;

  if (!locked.has('--brand')) {
    result['--brand'] = brandHsl;
  }

  const activeBrand = locked.has('--brand') ? currentColors['--brand'] : brandHsl;

  const bParts = activeBrand.trim().split(/\s+/);
  const bHue = parseFloat(bParts[0]);
  const bSat = parseFloat(bParts[1]);
  const bLight = parseFloat(bParts[2]);
  const wrap = (h: number) => ((h % 360) + 360) % 360;

  const secOffset = 90 + Math.random() * 180;
  const accOffset = 30 + Math.random() * 120;
  const lightMin = dark ? 40 : 15;
  const lightMax = dark ? 75 : 90;
  const clampLight = (v: number) => Math.min(lightMax, Math.max(lightMin, v));
  const secHsl = `${wrap(bHue + secOffset).toFixed(1)} ${Math.min(100, bSat * (0.7 + Math.random() * 0.3)).toFixed(1)}% ${clampLight(bLight * (0.8 + Math.random() * 0.4)).toFixed(1)}%`;
  const accHsl = `${wrap(bHue + accOffset).toFixed(1)} ${Math.min(100, bSat * (0.7 + Math.random() * 0.3)).toFixed(1)}% ${clampLight(bLight * (0.8 + Math.random() * 0.4)).toFixed(1)}%`;

  if (!locked.has('--secondary')) result['--secondary'] = secHsl;
  if (!locked.has('--accent')) result['--accent'] = accHsl;

  if (!locked.has('--background')) {
    let bgLight: number;
    if (dark) {
      bgLight = 3 + Math.random() * 7;
    } else if (Math.random() < 0.3) {
      // ~30% chance of a dark background in light mode
      bgLight = 5 + Math.random() * 15;
    } else {
      bgLight = 95 + Math.random() * 5;
    }
    result['--background'] = `${wrap(bHue + 20).toFixed(1)} ${(15 + Math.random() * 20).toFixed(1)}% ${bgLight.toFixed(1)}%`;
  }
  const bg = result['--background'] || currentColors['--background'];
  const fgColor = fgForBg(bg);
  if (!locked.has('--foreground')) result['--foreground'] = fgColor;
  if (!locked.has('--card')) result['--card'] = bg;
  if (!locked.has('--popover')) result['--popover'] = bg;
  if (!locked.has('--card-foreground')) result['--card-foreground'] = fgColor;
  if (!locked.has('--popover-foreground')) result['--popover-foreground'] = fgColor;
  if (!locked.has('--muted-foreground')) {
    const bgL = parseFloat(bg.trim().split(/\s+/)[2]);
    const mutedL = bgL > 50 ? 44 : 65;
    result['--muted-foreground'] = `0 0% ${mutedL}%`;
  }
  if (!locked.has('--border')) {
    const bgL = parseFloat(bg.trim().split(/\s+/)[2]);
    const borderLight = bgL < 50 ? 15 + Math.random() * 10 : 85 + Math.random() * 10;
    result['--border'] = `${wrap(bHue + 15).toFixed(1)} ${(15 + Math.random() * 15).toFixed(1)}% ${borderLight.toFixed(1)}%`;
  }
  if (!locked.has('--muted')) {
    const bgL = parseFloat(bg.trim().split(/\s+/)[2]);
    const mutedLight = bgL < 50 ? 12 + Math.random() * 8 : 90 + Math.random() * 8;
    result['--muted'] = `${wrap(bHue + 15).toFixed(1)} ${(15 + Math.random() * 15).toFixed(1)}% ${mutedLight.toFixed(1)}%`;
  }

  let merged = { ...currentColors, ...result };
  const brandDerived = derivePaletteFromChange('--brand', activeBrand, merged, locked);
  Object.assign(result, brandDerived);
  merged = { ...merged, ...brandDerived };
  if (!locked.has('--secondary')) {
    const secDerived = derivePaletteFromChange('--secondary', result['--secondary'] || currentColors['--secondary'], merged, locked);
    Object.assign(result, secDerived);
    merged = { ...merged, ...secDerived };
  }
  if (!locked.has('--accent')) {
    const accDerived = derivePaletteFromChange('--accent', result['--accent'] || currentColors['--accent'], merged, locked);
    Object.assign(result, accDerived);
    merged = { ...merged, ...accDerived };
  }

  const bgForKnowledge = result['--background'] || currentColors['--background'];
  if (bgForKnowledge) {
    const knownFixes = applyKnownCorrections(bgForKnowledge, locked);
    Object.assign(result, knownFixes);
  }

  const fullColors = { ...currentColors, ...result };
  const adjustments = autoAdjustContrast(fullColors, locked);
  Object.assign(result, adjustments);

  return result;
};

export const CARD_STYLE_KEY = "ds-card-style";

export interface CardStyleState {
  preset: "liquid-glass" | "solid" | "gradient" | "border-only" | "custom";
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  borderRadius: number;
  bgType: "solid" | "gradient" | "transparent";
  bgGradientAngle: number;
  borderWidth: number;
  backdropBlur: number;
  bgOpacity: number;
}

export const DEFAULT_CARD_STYLE: CardStyleState = {
  preset: "solid",
  shadowOffsetX: 0,
  shadowOffsetY: 2,
  shadowBlur: 8,
  shadowSpread: 0,
  shadowColor: "rgba(0,0,0,0.1)",
  borderRadius: 12,
  bgType: "solid",
  bgGradientAngle: 135,
  borderWidth: 0,
  backdropBlur: 0,
  bgOpacity: 1,
};

export const CARD_PRESETS: Record<string, Partial<CardStyleState>> = {
  "liquid-glass": {
    preset: "liquid-glass",
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowBlur: 16,
    shadowSpread: 0,
    shadowColor: "rgba(0,0,0,0.08)",
    borderRadius: 16,
    bgType: "solid",
    bgGradientAngle: 135,
    borderWidth: 1,
    backdropBlur: 16,
    bgOpacity: 0.25,
  },
  solid: {
    preset: "solid",
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    shadowBlur: 8,
    shadowSpread: 0,
    shadowColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    bgType: "solid",
    bgGradientAngle: 135,
    borderWidth: 0,
    backdropBlur: 0,
    bgOpacity: 1,
  },
  gradient: {
    preset: "gradient",
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    shadowBlur: 8,
    shadowSpread: 0,
    shadowColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    bgType: "gradient",
    bgGradientAngle: 135,
    borderWidth: 0,
    backdropBlur: 0,
    bgOpacity: 1,
  },
  "border-only": {
    preset: "border-only",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowSpread: 0,
    shadowColor: "rgba(0,0,0,0)",
    borderRadius: 12,
    bgType: "transparent",
    bgGradientAngle: 135,
    borderWidth: 2,
    backdropBlur: 0,
    bgOpacity: 0,
  },
};

export function applyCardStyle(
  state: CardStyleState,
  themeColors: Record<string, string>,
) {
  const root = document.documentElement;

  root.style.setProperty("--card-radius", `${state.borderRadius}px`);

  const shadow =
    state.shadowBlur === 0 && state.shadowOffsetX === 0 && state.shadowOffsetY === 0 && state.shadowSpread === 0
      ? "none"
      : `${state.shadowOffsetX}px ${state.shadowOffsetY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}`;
  root.style.setProperty("--card-shadow", shadow);

  const cardHsl = themeColors["--card"] || "0 0% 100%";
  const brandHsl = themeColors["--brand"] || "220 70% 50%";
  const secondaryHsl = themeColors["--secondary"] || "220 30% 60%";
  const accentHsl = themeColors["--accent"] || "220 50% 55%";

  let bg: string;
  if (state.bgType === "transparent") {
    bg = "transparent";
  } else if (state.bgType === "gradient") {
    bg = `linear-gradient(${state.bgGradientAngle}deg, hsl(${brandHsl}), hsl(${secondaryHsl}), hsl(${accentHsl}))`;
  } else {
    if (state.bgOpacity < 1) {
      const parts = cardHsl.trim().split(/\s+/);
      if (parts.length >= 3) {
        bg = `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, ${state.bgOpacity})`;
      } else {
        bg = `hsl(${cardHsl})`;
      }
    } else {
      bg = `hsl(${cardHsl})`;
    }
  }
  root.style.setProperty("--card-bg", bg);

  const borderColor = themeColors["--border"] || "0 0% 80%";
  const border =
    state.borderWidth > 0
      ? `${state.borderWidth}px solid hsl(${borderColor})`
      : "none";
  root.style.setProperty("--card-border", border);

  const backdrop =
    state.backdropBlur > 0
      ? `blur(${state.backdropBlur}px)`
      : "none";
  root.style.setProperty("--card-backdrop", backdrop);

  storage.set(CARD_STYLE_KEY, state);
}

export function removeCardStyleProperties() {
  const root = document.documentElement;
  for (const prop of ["--card-radius", "--card-shadow", "--card-bg", "--card-border", "--card-backdrop"]) {
    root.style.removeProperty(prop);
  }
}

export function applyStoredCardStyle(themeColors: Record<string, string>): CardStyleState | null {
  const saved = storage.get<CardStyleState>(CARD_STYLE_KEY);
  if (saved) {
    applyCardStyle(saved, themeColors);
    return saved;
  }
  return null;
}

export const TYPOGRAPHY_KEY = "ds-typography-v2";

export interface TypographyState {
  preset: "system" | "modern" | "classic" | "compact" | "editorial" | "custom";
  headingFamily: string;
  bodyFamily: string;
  baseFontSize: number;
  headingWeight: number;
  bodyWeight: number;
  lineHeight: number;
  letterSpacing: number;
  headingLetterSpacing: number;
}

export const DEFAULT_TYPOGRAPHY: TypographyState = {
  preset: "system",
  headingFamily: "system-ui, -apple-system, sans-serif",
  bodyFamily: "system-ui, -apple-system, sans-serif",
  baseFontSize: 17,
  headingWeight: 300,
  bodyWeight: 300,
  lineHeight: 1.5,
  letterSpacing: 0,
  headingLetterSpacing: 0,
};

export const TYPOGRAPHY_PRESETS: Record<string, TypographyState> = {
  system: { ...DEFAULT_TYPOGRAPHY },
  modern: {
    preset: "modern",
    headingFamily: "Roboto, sans-serif",
    bodyFamily: "Roboto, sans-serif",
    baseFontSize: 17,
    headingWeight: 300,
    bodyWeight: 300,
    lineHeight: 1.5,
    letterSpacing: 0,
    headingLetterSpacing: 0,
  },
  classic: {
    preset: "classic",
    headingFamily: "Georgia, serif",
    bodyFamily: "system-ui, sans-serif",
    baseFontSize: 17,
    headingWeight: 700,
    bodyWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0,
    headingLetterSpacing: 0,
  },
  compact: {
    preset: "compact",
    headingFamily: "system-ui, sans-serif",
    bodyFamily: "system-ui, sans-serif",
    baseFontSize: 15,
    headingWeight: 500,
    bodyWeight: 400,
    lineHeight: 1.35,
    letterSpacing: 0,
    headingLetterSpacing: 0,
  },
  editorial: {
    preset: "editorial",
    headingFamily: '"Playfair Display", serif',
    bodyFamily: "Georgia, serif",
    baseFontSize: 19,
    headingWeight: 700,
    bodyWeight: 400,
    lineHeight: 1.55,
    letterSpacing: 0,
    headingLetterSpacing: -0.02,
  },
};

export const FONT_FAMILY_OPTIONS = [
  { label: "System Default", value: "system-ui, -apple-system, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Lato", value: "Lato, sans-serif" },
  { label: "DM Sans", value: '"DM Sans", sans-serif' },
  { label: "Merriweather", value: "Merriweather, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Playfair Display", value: '"Playfair Display", serif' },
  { label: "Space Grotesk", value: '"Space Grotesk", sans-serif' },
  { label: "Courier New", value: '"Courier New", monospace' },
  { label: "Segoe UI", value: '"Segoe UI", sans-serif' },
];

const GOOGLE_FONTS_TO_LOAD: Record<string, string> = {
  "Roboto, sans-serif": "Roboto:wght@300;400;500;700",
  "Inter, sans-serif": "Inter:wght@100;200;300;400;500;600;700;800;900",
  "Lato, sans-serif": "Lato:wght@100;300;400;700;900",
  '"DM Sans", sans-serif': "DM+Sans:wght@300;400;500;600;700",
  "Merriweather, serif": "Merriweather:wght@300;400;700;900",
  '"Playfair Display", serif': "Playfair+Display:wght@400;700",
  '"Space Grotesk", sans-serif': "Space+Grotesk:wght@300;400;500;600;700",
};

export function loadGoogleFont(family: string) {
  const spec = GOOGLE_FONTS_TO_LOAD[family];
  if (!spec) return;
  const id = `gf-${spec.replace(/[^a-zA-Z0-9]/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
  document.head.appendChild(link);
}

// ── Custom Google Fonts ──────────────────────────────────────────────

export interface CustomFontEntry {
  label: string;
  value: string;
  spec: string;
}

const CUSTOM_FONTS_KEY = "ds-custom-fonts";

export function getCustomFonts(): CustomFontEntry[] {
  try {
    const raw = localStorage.getItem(CUSTOM_FONTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomFonts(fonts: CustomFontEntry[]) {
  localStorage.setItem(CUSTOM_FONTS_KEY, JSON.stringify(fonts));
}

export function validateGoogleFont(name: string): Promise<boolean> {
  const encoded = name.trim().replace(/\s+/g, "+");
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400`;
    link.onload = () => { link.remove(); resolve(true); };
    link.onerror = () => { link.remove(); resolve(false); };
    document.head.appendChild(link);
  });
}

export async function addCustomFont(name: string): Promise<CustomFontEntry> {
  const trimmed = name.trim();
  const valid = await validateGoogleFont(trimmed);
  if (!valid) throw new Error(`"${trimmed}" not found on Google Fonts`);

  const encoded = trimmed.replace(/\s+/g, "+");
  const spec = `${encoded}:wght@100;200;300;400;500;600;700;800;900`;
  const value = trimmed.includes(" ")
    ? `"${trimmed}", sans-serif`
    : `${trimmed}, sans-serif`;
  const entry: CustomFontEntry = { label: trimmed, value, spec };

  // Register in runtime map and load
  GOOGLE_FONTS_TO_LOAD[value] = spec;
  loadGoogleFont(value);

  // Persist
  const fonts = getCustomFonts().filter((f) => f.label !== trimmed);
  fonts.push(entry);
  saveCustomFonts(fonts);

  return entry;
}

export function removeCustomFont(label: string) {
  const allFonts = getCustomFonts();
  const removed = allFonts.find((f) => f.label === label);
  if (removed) delete GOOGLE_FONTS_TO_LOAD[removed.value];
  saveCustomFonts(allFonts.filter((f) => f.label !== label));
}

export function initCustomFonts() {
  const fonts = getCustomFonts();
  for (const f of fonts) {
    GOOGLE_FONTS_TO_LOAD[f.value] = f.spec;
    loadGoogleFont(f.value);
  }
}

export function removeGoogleFontLinks() {
  document.querySelectorAll('link[id^="gf-"]').forEach((el) => el.remove());
}

const THEMAL_TYPO_STYLE_ID = "themal-typography";

export function applyTypography(state: TypographyState) {
  const root = document.documentElement;
  // Set CSS custom properties for apps that consume them
  root.style.setProperty("--font-heading", state.headingFamily);
  root.style.setProperty("--font-body", state.bodyFamily);
  root.style.setProperty("--font-size-base", `${state.baseFontSize}px`);
  root.style.setProperty("--font-weight-heading", String(state.headingWeight));
  root.style.setProperty("--font-weight-body", String(state.bodyWeight));
  root.style.setProperty("--line-height", String(state.lineHeight));
  root.style.setProperty("--letter-spacing", `${state.letterSpacing}em`);
  root.style.setProperty("--letter-spacing-heading", `${state.headingLetterSpacing}em`);

  // Inject global styles so typography applies to the entire page
  let styleEl = document.getElementById(THEMAL_TYPO_STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = THEMAL_TYPO_STYLE_ID;
    document.head.appendChild(styleEl);
  }
  /* No !important used here. Custom classes like .ds-h2 override these via
     higher specificity. The body-level rules ensure typography applies
     site-wide when the plugin is used. The .ds-editor rules provide
     specificity within the editor component itself. */
  styleEl.textContent = `
    body {
      font-family: ${state.bodyFamily};
      font-size: ${state.baseFontSize}px;
      font-weight: ${state.bodyWeight};
      line-height: ${state.lineHeight};
      letter-spacing: ${state.letterSpacing}em;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: ${state.headingFamily};
      font-weight: ${state.headingWeight};
      letter-spacing: ${state.headingLetterSpacing}em;
    }
    p, ul, ol, li, a, button, input, select, textarea, label, span {
      font-family: ${state.bodyFamily};
      font-size: ${state.baseFontSize}px;
      font-weight: ${state.bodyWeight};
      line-height: ${state.lineHeight};
    }
    .ds-editor {
      font-family: ${state.bodyFamily};
      font-size: ${state.baseFontSize}px;
      font-weight: ${state.bodyWeight};
      line-height: ${state.lineHeight};
      letter-spacing: ${state.letterSpacing}em;
    }
    .ds-editor h1, .ds-editor h2, .ds-editor h3,
    .ds-editor h4, .ds-editor h5, .ds-editor h6 {
      font-family: ${state.headingFamily};
      font-weight: ${state.headingWeight};
      letter-spacing: ${state.headingLetterSpacing}em;
    }
    .ds-editor p, .ds-editor ul, .ds-editor ol, .ds-editor li,
    .ds-editor a:not(.ds-premium-tooltip a):not(.ds-nav-link),
    .ds-editor button:not(.ds-h2-btn), .ds-editor input, .ds-editor select,
    .ds-editor textarea, .ds-editor label,
    .ds-editor span:not(.ds-premium-tooltip span):not(.ds-h2) {
      font-family: ${state.bodyFamily};
      font-size: ${state.baseFontSize}px;
      font-weight: ${state.bodyWeight};
      line-height: ${state.lineHeight};
    }
  `;

  loadGoogleFont(state.headingFamily);
  loadGoogleFont(state.bodyFamily);
  storage.set(TYPOGRAPHY_KEY, state);
}

export function removeTypographyProperties() {
  const root = document.documentElement;
  for (const prop of [
    "--font-heading", "--font-body", "--font-size-base",
    "--font-weight-heading", "--font-weight-body", "--line-height",
    "--letter-spacing", "--letter-spacing-heading",
  ]) {
    root.style.removeProperty(prop);
  }
  removeGoogleFontLinks();
  const styleEl = document.getElementById(THEMAL_TYPO_STYLE_ID);
  if (styleEl) styleEl.remove();
}

export function applyStoredTypography(): TypographyState | null {
  const saved = storage.get<TypographyState>(TYPOGRAPHY_KEY);
  if (saved) {
    applyTypography(saved);
    return saved;
  }
  return null;
}

export const ALERT_STYLE_KEY = "ds-alert-style";

export interface AlertStyleState {
  preset: "filled" | "soft" | "outline" | "minimal" | "custom";
  borderRadius: number;
  borderWidth: number;
  iconStyle: "circle" | "plain";
  padding: number;
}

export const DEFAULT_ALERT_STYLE: AlertStyleState = {
  preset: "filled",
  borderRadius: 8,
  borderWidth: 0,
  iconStyle: "circle",
  padding: 16,
};

export const ALERT_PRESETS: Record<string, AlertStyleState> = {
  filled: { ...DEFAULT_ALERT_STYLE },
  soft: {
    preset: "soft",
    borderRadius: 8,
    borderWidth: 0,
    iconStyle: "circle",
    padding: 16,
  },
  outline: {
    preset: "outline",
    borderRadius: 8,
    borderWidth: 2,
    iconStyle: "plain",
    padding: 16,
  },
  minimal: {
    preset: "minimal",
    borderRadius: 0,
    borderWidth: 0,
    iconStyle: "plain",
    padding: 16,
  },
};

export function applyAlertStyle(state: AlertStyleState) {
  const root = document.documentElement;
  root.style.setProperty("--alert-radius", `${state.borderRadius}px`);
  root.style.setProperty("--alert-border-width", `${state.borderWidth}px`);
  root.style.setProperty("--alert-padding", `${state.padding}px`);
  storage.set(ALERT_STYLE_KEY, state);
}

export function removeAlertStyleProperties() {
  const root = document.documentElement;
  for (const prop of ["--alert-radius", "--alert-border-width", "--alert-padding"]) {
    root.style.removeProperty(prop);
  }
}

export function applyStoredAlertStyle(): AlertStyleState | null {
  const saved = storage.get<AlertStyleState>(ALERT_STYLE_KEY);
  if (saved) {
    applyAlertStyle(saved);
    return saved;
  }
  return null;
}

export const TOAST_STYLE_KEY = "ds-toast-style";

export type ToastStyleState = AlertStyleState;

export const DEFAULT_TOAST_STYLE: ToastStyleState = {
  preset: "filled",
  borderRadius: 8,
  borderWidth: 0,
  iconStyle: "circle",
  padding: 16,
};

export const TOAST_PRESETS: Record<string, ToastStyleState> = {
  filled: { ...DEFAULT_TOAST_STYLE },
  soft: { preset: "soft", borderRadius: 8, borderWidth: 0, iconStyle: "circle", padding: 16 },
  outline: { preset: "outline", borderRadius: 8, borderWidth: 2, iconStyle: "plain", padding: 16 },
  minimal: { preset: "minimal", borderRadius: 0, borderWidth: 0, iconStyle: "plain", padding: 16 },
};

export function applyToastStyle(state: ToastStyleState) {
  const root = document.documentElement;
  root.style.setProperty("--toast-radius", `${state.borderRadius}px`);
  root.style.setProperty("--toast-border-width", `${state.borderWidth}px`);
  root.style.setProperty("--toast-padding", `${state.padding}px`);
  storage.set(TOAST_STYLE_KEY, state);
}

export function removeToastStyleProperties() {
  const root = document.documentElement;
  for (const prop of ["--toast-radius", "--toast-border-width", "--toast-padding"]) {
    root.style.removeProperty(prop);
  }
}

export function applyStoredToastStyle(): ToastStyleState | null {
  const saved = storage.get<ToastStyleState>(TOAST_STYLE_KEY);
  if (saved) {
    applyToastStyle(saved);
    return saved;
  }
  return null;
}

export const INTERACTION_STYLE_KEY = "ds-interaction-style";

export interface InteractionStyleState {
  preset: "subtle" | "elevated" | "bold" | "custom";
  hoverOpacity: number;
  hoverScale: number;
  activeScale: number;
  transitionDuration: number;
  focusRingWidth: number;
}

export const DEFAULT_INTERACTION_STYLE: InteractionStyleState = {
  preset: "subtle",
  hoverOpacity: 0.85,
  hoverScale: 1,
  activeScale: 0.97,
  transitionDuration: 150,
  focusRingWidth: 2,
};

export const INTERACTION_PRESETS: Record<string, InteractionStyleState> = {
  subtle: { ...DEFAULT_INTERACTION_STYLE },
  elevated: {
    preset: "elevated",
    hoverOpacity: 0.9,
    hoverScale: 1.02,
    activeScale: 0.97,
    transitionDuration: 200,
    focusRingWidth: 2,
  },
  bold: {
    preset: "bold",
    hoverOpacity: 1,
    hoverScale: 1.05,
    activeScale: 0.95,
    transitionDuration: 100,
    focusRingWidth: 3,
  },
};

const THEMAL_INTERACTION_STYLE_ID = "themal-interaction";

export function applyInteractionStyle(state: InteractionStyleState) {
  const root = document.documentElement;
  root.style.setProperty("--hover-opacity", String(state.hoverOpacity));
  root.style.setProperty("--hover-scale", String(state.hoverScale));
  root.style.setProperty("--active-scale", String(state.activeScale));
  root.style.setProperty("--transition-duration", `${state.transitionDuration}ms`);
  root.style.setProperty("--focus-ring-width", `${state.focusRingWidth}px`);
  root.style.setProperty("--focus-ring-color", "hsl(var(--ring))");

  let styleEl = document.getElementById(THEMAL_INTERACTION_STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = THEMAL_INTERACTION_STYLE_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `
    html button, html a, html [role="button"],
    html .ds-editor button, html .ds-editor a, html .ds-editor [role="button"] {
      transition: opacity var(--transition-duration) ease, transform var(--transition-duration) ease;
    }
    html button:hover, html a:hover, html [role="button"]:hover,
    html .ds-editor button:hover, html .ds-editor a:hover, html .ds-editor [role="button"]:hover {
      opacity: var(--hover-opacity);
      transform: scale(var(--hover-scale));
    }
    html button:active, html a:active, html [role="button"]:active,
    html .ds-editor button:active, html .ds-editor a:active, html .ds-editor [role="button"]:active {
      transform: scale(var(--active-scale));
    }
    html button:focus-visible, html a:focus-visible, html [role="button"]:focus-visible,
    html .ds-editor button:focus-visible, html .ds-editor a:focus-visible, html .ds-editor [role="button"]:focus-visible {
      outline: var(--focus-ring-width) solid var(--focus-ring-color);
      outline-offset: 2px;
    }
  `;

  storage.set(INTERACTION_STYLE_KEY, state);
}

export function removeInteractionStyleProperties() {
  const root = document.documentElement;
  for (const prop of [
    "--hover-opacity", "--hover-scale", "--active-scale",
    "--transition-duration", "--focus-ring-width", "--focus-ring-color",
  ]) {
    root.style.removeProperty(prop);
  }
  const styleEl = document.getElementById(THEMAL_INTERACTION_STYLE_ID);
  if (styleEl) styleEl.remove();
}

export function applyStoredInteractionStyle(): InteractionStyleState | null {
  const saved = storage.get<InteractionStyleState>(INTERACTION_STYLE_KEY);
  if (saved) {
    applyInteractionStyle(saved);
    return saved;
  }
  return null;
}

// ── Button Style ──

export const BUTTON_STYLE_KEY = "ds-button-style";

export interface ButtonStyleState {
  paddingX: number;
  paddingY: number;
  fontSize: number;
  fontWeight: number;
  borderRadius: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  borderWidth: number;
}

export const DEFAULT_BUTTON_STYLE: ButtonStyleState = {
  paddingX: 16,
  paddingY: 8,
  fontSize: 14,
  fontWeight: 300,
  borderRadius: 12,
  shadowOffsetX: 0,
  shadowOffsetY: 1,
  shadowBlur: 3,
  shadowSpread: 0,
  shadowColor: "rgba(0,0,0,0.1)",
  borderWidth: 0,
};

export function applyButtonStyle(state: ButtonStyleState) {
  const root = document.documentElement;
  root.style.setProperty("--btn-px", `${state.paddingX}px`);
  root.style.setProperty("--btn-py", `${state.paddingY}px`);
  root.style.setProperty("--btn-font-size", `${state.fontSize}px`);
  root.style.setProperty("--btn-font-weight", String(state.fontWeight));
  root.style.setProperty("--btn-radius", `${state.borderRadius}px`);
  const shadow =
    state.shadowBlur === 0 && state.shadowOffsetX === 0 && state.shadowOffsetY === 0 && state.shadowSpread === 0
      ? "none"
      : `${state.shadowOffsetX}px ${state.shadowOffsetY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}`;
  root.style.setProperty("--btn-shadow", shadow);
  root.style.setProperty("--btn-border-width", `${state.borderWidth}px`);
  storage.set(BUTTON_STYLE_KEY, state);
}

export function removeButtonStyleProperties() {
  const root = document.documentElement;
  for (const prop of ["--btn-px", "--btn-py", "--btn-font-size", "--btn-font-weight", "--btn-radius", "--btn-shadow", "--btn-border-width"]) {
    root.style.removeProperty(prop);
  }
}

export function applyStoredButtonStyle(): ButtonStyleState | null {
  const saved = storage.get<ButtonStyleState>(BUTTON_STYLE_KEY);
  if (saved) {
    applyButtonStyle(saved);
    return saved;
  }
  return null;
}

export function applyStoredThemeColors() {
  const saved = storage.get<Record<string, string>>(THEME_COLORS_KEY);
  if (saved) {
    Object.entries(saved).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
  const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY);
  if (pending) {
    Object.entries(pending).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }

  const applied: Record<string, string> = {};
  EDITABLE_VARS.forEach((v) => {
    const val = document.documentElement.style.getPropertyValue(v.key)?.trim();
    if (val) applied[v.key] = val;
  });
  if (Object.keys(applied).length > 0) {
    const fixes = autoAdjustContrast(applied);
    Object.entries(fixes).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    persistContrastFixes(fixes);
  }

  // Also restore stored typography
  const typo = storage.get<TypographyState>(TYPOGRAPHY_KEY);
  if (typo) {
    applyTypography(typo);
  }
}

// ── Typography Interaction Styles ──

export const TYPO_INTERACTION_STYLE_KEY = "ds-typo-interaction-style";

export interface TypoInteractionStyleState {
  preset: "subtle" | "elevated" | "bold" | "custom";
  linkHoverOpacity: number;
  linkHoverScale: number;
  linkActiveScale: number;
  linkTransitionDuration: number;
  linkUnderline: "always" | "hover" | "none";
  headingHoverOpacity: number;
  headingHoverScale: number;
  headingTransitionDuration: number;
}

export const DEFAULT_TYPO_INTERACTION_STYLE: TypoInteractionStyleState = {
  preset: "subtle",
  linkHoverOpacity: 0.8,
  linkHoverScale: 1,
  linkActiveScale: 0.98,
  linkTransitionDuration: 150,
  linkUnderline: "hover",
  headingHoverOpacity: 1,
  headingHoverScale: 1,
  headingTransitionDuration: 150,
};

export const TYPO_INTERACTION_PRESETS: Record<string, TypoInteractionStyleState> = {
  subtle: { ...DEFAULT_TYPO_INTERACTION_STYLE },
  elevated: {
    preset: "elevated",
    linkHoverOpacity: 0.9,
    linkHoverScale: 1.01,
    linkActiveScale: 0.98,
    linkTransitionDuration: 200,
    linkUnderline: "hover",
    headingHoverOpacity: 0.85,
    headingHoverScale: 1.01,
    headingTransitionDuration: 200,
  },
  bold: {
    preset: "bold",
    linkHoverOpacity: 1,
    linkHoverScale: 1.03,
    linkActiveScale: 0.96,
    linkTransitionDuration: 100,
    linkUnderline: "always",
    headingHoverOpacity: 0.8,
    headingHoverScale: 1.02,
    headingTransitionDuration: 100,
  },
};

const THEMAL_TYPO_INTERACTION_STYLE_ID = "themal-typo-interaction";

export function applyTypoInteractionStyle(state: TypoInteractionStyleState) {
  const root = document.documentElement;
  root.style.setProperty("--link-hover-opacity", String(state.linkHoverOpacity));
  root.style.setProperty("--link-hover-scale", String(state.linkHoverScale));
  root.style.setProperty("--link-active-scale", String(state.linkActiveScale));
  root.style.setProperty("--link-transition-duration", `${state.linkTransitionDuration}ms`);
  root.style.setProperty("--heading-hover-opacity", String(state.headingHoverOpacity));
  root.style.setProperty("--heading-hover-scale", String(state.headingHoverScale));
  root.style.setProperty("--heading-transition-duration", `${state.headingTransitionDuration}ms`);

  let styleEl = document.getElementById(THEMAL_TYPO_INTERACTION_STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = THEMAL_TYPO_INTERACTION_STYLE_ID;
    document.head.appendChild(styleEl);
  }

  const underlineDefault = state.linkUnderline === "always" ? "underline" : "none";
  const underlineHover = state.linkUnderline === "none" ? "none" : "underline";

  styleEl.textContent = `
    html a:not(button):not([role="button"]) {
      text-decoration: ${underlineDefault};
      transition: opacity var(--link-transition-duration) ease, transform var(--link-transition-duration) ease;
    }
    html a:not(button):not([role="button"]):hover {
      opacity: var(--link-hover-opacity);
      transform: scale(var(--link-hover-scale));
      text-decoration: ${underlineHover};
    }
    html a:not(button):not([role="button"]):active {
      transform: scale(var(--link-active-scale));
    }
    html h1, html h2, html h3, html h4, html h5, html h6 {
      transition: opacity var(--heading-transition-duration) ease, transform var(--heading-transition-duration) ease;
    }
    html h1:hover, html h2:hover, html h3:hover, html h4:hover, html h5:hover, html h6:hover {
      opacity: var(--heading-hover-opacity);
      transform: scale(var(--heading-hover-scale));
    }
  `;

  storage.set(TYPO_INTERACTION_STYLE_KEY, state);
}

export function removeTypoInteractionStyleProperties() {
  const root = document.documentElement;
  for (const prop of [
    "--link-hover-opacity", "--link-hover-scale", "--link-active-scale",
    "--link-transition-duration", "--heading-hover-opacity", "--heading-hover-scale",
    "--heading-transition-duration",
  ]) {
    root.style.removeProperty(prop);
  }
  const styleEl = document.getElementById(THEMAL_TYPO_INTERACTION_STYLE_ID);
  if (styleEl) styleEl.remove();
}

export function applyStoredTypoInteractionStyle(): TypoInteractionStyleState | null {
  const saved = storage.get<TypoInteractionStyleState>(TYPO_INTERACTION_STYLE_KEY);
  if (saved) {
    applyTypoInteractionStyle(saved);
    return saved;
  }
  return null;
}

// ── Palette Export ───────────────────────────────────────────────────

function hslStringToRgb255(hsl: string): [number, number, number] {
  const [r, g, b] = hslToRgb(hsl);
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHexStr(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(c => c.toString(16).padStart(2, "0")).join("");
}

const PALETTE_LABELS: Record<string, string> = {
  "--brand": "Brand",
  "--secondary": "Secondary",
  "--accent": "Accent",
  "--background": "Background",
  "--foreground": "Foreground",
  "--primary-foreground": "Primary FG",
  "--secondary-foreground": "Secondary FG",
  "--muted": "Muted",
  "--muted-foreground": "Muted FG",
  "--accent-foreground": "Accent FG",
  "--destructive": "Destructive",
  "--destructive-foreground": "Destructive FG",
  "--success": "Success",
  "--success-foreground": "Success FG",
  "--warning": "Warning",
  "--warning-foreground": "Warning FG",
  "--border": "Border",
};

export function exportPaletteAsText(colors: Record<string, string>, format: "hex" | "rgb" | "rgba"): string {
  const lines: string[] = [];
  for (const [key, label] of Object.entries(PALETTE_LABELS)) {
    const hsl = colors[key];
    if (!hsl) continue;
    const [r, g, b] = hslStringToRgb255(hsl);
    let value: string;
    if (format === "hex") value = rgbToHexStr(r, g, b);
    else if (format === "rgb") value = `rgb(${r}, ${g}, ${b})`;
    else value = `rgba(${r}, ${g}, ${b}, 1)`;
    lines.push(`${label}: ${value}`);
  }
  return lines.join("\n");
}

export function exportPaletteAsSvg(colors: Record<string, string>): string {
  const entries = Object.entries(PALETTE_LABELS).filter(([key]) => colors[key]);
  const swatchSize = 60;
  const gap = 8;
  const labelHeight = 32;
  const cols = Math.min(entries.length, 6);
  const rows = Math.ceil(entries.length / cols);
  const width = cols * (swatchSize + gap) - gap + 20;
  const height = rows * (swatchSize + labelHeight + gap) - gap + 20;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n`;
  svg += `  <rect width="${width}" height="${height}" fill="#ffffff" rx="8"/>\n`;

  entries.forEach(([key, label], i) => {
    const hsl = colors[key];
    if (!hsl) return;
    const [r, g, b] = hslStringToRgb255(hsl);
    const hex = rgbToHexStr(r, g, b);
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 10 + col * (swatchSize + gap);
    const y = 10 + row * (swatchSize + labelHeight + gap);
    svg += `  <rect x="${x}" y="${y}" width="${swatchSize}" height="${swatchSize}" fill="${hex}" rx="6"/>\n`;
    svg += `  <text x="${x + swatchSize / 2}" y="${y + swatchSize + 12}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" fill="#666">${label}</text>\n`;
    svg += `  <text x="${x + swatchSize / 2}" y="${y + swatchSize + 24}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="8" fill="#999">${hex}</text>\n`;
  });

  svg += `</svg>`;
  return svg;
}

export async function exportPaletteAsPng(colors: Record<string, string>): Promise<Blob> {
  const svgStr = exportPaletteAsSvg(colors);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create PNG"));
      }, "image/png");
    };
    img.onerror = reject;
    img.src = "data:image/svg+xml;base64," + btoa(svgStr);
  });
}

export function generateSectionDesignTokens(
  section: "card" | "typography" | "alerts" | "interactions" | "typo-interactions" | "buttons",
  cardStyle: CardStyleState,
  typographyState: TypographyState,
  alertStyle: AlertStyleState,
  interactionStyle: InteractionStyleState,
  typoInteractionStyle: TypoInteractionStyleState,
  buttonStyle?: ButtonStyleState,
): Record<string, unknown> {
  switch (section) {
    case "buttons": {
      const bs = buttonStyle ?? DEFAULT_BUTTON_STYLE;
      return {
        button: {
          paddingX: { $value: `${bs.paddingX}px`, $type: "dimension" },
          paddingY: { $value: `${bs.paddingY}px`, $type: "dimension" },
          fontSize: { $value: `${bs.fontSize}px`, $type: "dimension" },
          fontWeight: { $value: bs.fontWeight, $type: "fontWeight" },
          borderRadius: { $value: `${bs.borderRadius}px`, $type: "dimension" },
          borderWidth: { $value: `${bs.borderWidth}px`, $type: "dimension" },
          shadow: {
            offsetX: { $value: `${bs.shadowOffsetX}px`, $type: "dimension" },
            offsetY: { $value: `${bs.shadowOffsetY}px`, $type: "dimension" },
            blur: { $value: `${bs.shadowBlur}px`, $type: "dimension" },
            spread: { $value: `${bs.shadowSpread}px`, $type: "dimension" },
            color: { $value: bs.shadowColor, $type: "color" },
          },
        },
      };
    }
    case "card":
      return {
        borderRadius: { card: { $value: `${cardStyle.borderRadius}px`, $type: "dimension" } },
        shadow: {
          card: {
            offsetX: { $value: `${cardStyle.shadowOffsetX}px`, $type: "dimension" },
            offsetY: { $value: `${cardStyle.shadowOffsetY}px`, $type: "dimension" },
            blur: { $value: `${cardStyle.shadowBlur}px`, $type: "dimension" },
            spread: { $value: `${cardStyle.shadowSpread}px`, $type: "dimension" },
            color: { $value: cardStyle.shadowColor, $type: "color" },
          },
        },
        borderWidth: { card: { $value: `${cardStyle.borderWidth}px`, $type: "dimension" } },
        backdropBlur: { card: { $value: `${cardStyle.backdropBlur}px`, $type: "dimension" } },
      };
    case "typography":
      return {
        typography: {
          fontFamily: {
            heading: { $value: typographyState.headingFamily, $type: "fontFamily" },
            body: { $value: typographyState.bodyFamily, $type: "fontFamily" },
          },
          fontSize: { base: { $value: `${typographyState.baseFontSize}px`, $type: "dimension" } },
          fontWeight: {
            heading: { $value: typographyState.headingWeight, $type: "fontWeight" },
            body: { $value: typographyState.bodyWeight, $type: "fontWeight" },
          },
          lineHeight: { default: { $value: typographyState.lineHeight, $type: "number" } },
          letterSpacing: {
            body: { $value: `${typographyState.letterSpacing}em`, $type: "dimension" },
            heading: { $value: `${typographyState.headingLetterSpacing}em`, $type: "dimension" },
          },
        },
      };
    case "alerts":
      return {
        borderRadius: { alert: { $value: `${alertStyle.borderRadius}px`, $type: "dimension" } },
        borderWidth: { alert: { $value: `${alertStyle.borderWidth}px`, $type: "dimension" } },
        spacing: { alertPadding: { $value: `${alertStyle.padding}px`, $type: "dimension" } },
      };
    case "interactions":
      return {
        interaction: {
          hoverOpacity: { $value: interactionStyle.hoverOpacity, $type: "number" },
          hoverScale: { $value: interactionStyle.hoverScale, $type: "number" },
          activeScale: { $value: interactionStyle.activeScale, $type: "number" },
          transitionDuration: { $value: `${interactionStyle.transitionDuration}ms`, $type: "duration" },
          focusRingWidth: { $value: `${interactionStyle.focusRingWidth}px`, $type: "dimension" },
        },
      };
    case "typo-interactions":
      return {
        typographyInteraction: {
          link: {
            hoverOpacity: { $value: typoInteractionStyle.linkHoverOpacity, $type: "number" },
            hoverScale: { $value: typoInteractionStyle.linkHoverScale, $type: "number" },
            activeScale: { $value: typoInteractionStyle.linkActiveScale, $type: "number" },
            transitionDuration: { $value: `${typoInteractionStyle.linkTransitionDuration}ms`, $type: "duration" },
            underline: { $value: typoInteractionStyle.linkUnderline, $type: "string" },
          },
          heading: {
            hoverOpacity: { $value: typoInteractionStyle.headingHoverOpacity, $type: "number" },
            hoverScale: { $value: typoInteractionStyle.headingHoverScale, $type: "number" },
            transitionDuration: { $value: `${typoInteractionStyle.headingTransitionDuration}ms`, $type: "duration" },
          },
        },
      };
  }
}

// ── Shareable URL serialization ──────────────────────────────────────

interface SerializedTheme {
  c: Record<string, string>;
  cs: CardStyleState;
  t: TypographyState;
  a: AlertStyleState;
  i: InteractionStyleState;
  ti: TypoInteractionStyleState;
  bs?: ButtonStyleState;
}

export function serializeThemeState(
  colors: Record<string, string>,
  cardStyle: CardStyleState,
  typographyState: TypographyState,
  alertStyle: AlertStyleState,
  interactionStyle: InteractionStyleState,
  typoInteractionStyle: TypoInteractionStyleState,
  buttonStyle?: ButtonStyleState,
): string {
  const data: SerializedTheme = {
    c: colors,
    cs: cardStyle,
    t: typographyState,
    a: alertStyle,
    i: interactionStyle,
    ti: typoInteractionStyle,
    bs: buttonStyle,
  };
  return btoa(JSON.stringify(data));
}

export function deserializeThemeState(hash: string): {
  colors: Record<string, string>;
  cardStyle: CardStyleState;
  typographyState: TypographyState;
  alertStyle: AlertStyleState;
  interactionStyle: InteractionStyleState;
  typoInteractionStyle: TypoInteractionStyleState;
  buttonStyle: ButtonStyleState;
} | null {
  try {
    const json = atob(hash);
    const data: SerializedTheme = JSON.parse(json);
    if (!data.c || !data.cs || !data.t || !data.a || !data.i || !data.ti) return null;
    return {
      colors: data.c,
      cardStyle: data.cs,
      typographyState: data.t,
      alertStyle: data.a,
      interactionStyle: data.i,
      typoInteractionStyle: data.ti,
      buttonStyle: data.bs || { ...DEFAULT_BUTTON_STYLE },
    };
  } catch {
    return null;
  }
}

// ── W3C Design Token Export ──────────────────────────────────────────

export function generateDesignTokens(
  colors: Record<string, string>,
  cardStyle: CardStyleState,
  typographyState: TypographyState,
  alertStyle: AlertStyleState,
  interactionStyle: InteractionStyleState,
): Record<string, unknown> {
  const colorTokens: Record<string, unknown> = {};
  const colorMap: Record<string, string> = {
    "--brand": "brand",
    "--secondary": "secondary",
    "--accent": "accent",
    "--background": "background",
    "--foreground": "foreground",
    "--primary-foreground": "primary-foreground",
    "--secondary-foreground": "secondary-foreground",
    "--muted": "muted",
    "--muted-foreground": "muted-foreground",
    "--accent-foreground": "accent-foreground",
    "--destructive": "destructive",
    "--destructive-foreground": "destructive-foreground",
    "--success": "success",
    "--success-foreground": "success-foreground",
    "--warning": "warning",
    "--warning-foreground": "warning-foreground",
    "--border": "border",
  };

  for (const [cssVar, tokenName] of Object.entries(colorMap)) {
    if (colors[cssVar]) {
      colorTokens[tokenName] = { $value: `hsl(${colors[cssVar]})`, $type: "color" };
    }
  }

  return {
    color: colorTokens,
    typography: {
      fontFamily: {
        heading: { $value: typographyState.headingFamily, $type: "fontFamily" },
        body: { $value: typographyState.bodyFamily, $type: "fontFamily" },
      },
      fontSize: {
        base: { $value: `${typographyState.baseFontSize}px`, $type: "dimension" },
      },
      fontWeight: {
        heading: { $value: typographyState.headingWeight, $type: "fontWeight" },
        body: { $value: typographyState.bodyWeight, $type: "fontWeight" },
      },
      lineHeight: {
        default: { $value: typographyState.lineHeight, $type: "number" },
      },
      letterSpacing: {
        body: { $value: `${typographyState.letterSpacing}em`, $type: "dimension" },
        heading: { $value: `${typographyState.headingLetterSpacing}em`, $type: "dimension" },
      },
    },
    borderRadius: {
      card: { $value: `${cardStyle.borderRadius}px`, $type: "dimension" },
      alert: { $value: `${alertStyle.borderRadius}px`, $type: "dimension" },
    },
    spacing: {
      alertPadding: { $value: `${alertStyle.padding}px`, $type: "dimension" },
    },
    interaction: {
      hoverOpacity: { $value: interactionStyle.hoverOpacity, $type: "number" },
      hoverScale: { $value: interactionStyle.hoverScale, $type: "number" },
      activeScale: { $value: interactionStyle.activeScale, $type: "number" },
      transitionDuration: { $value: `${interactionStyle.transitionDuration}ms`, $type: "duration" },
      focusRingWidth: { $value: `${interactionStyle.focusRingWidth}px`, $type: "dimension" },
    },
  };
}

// ── CSS / SCSS Import ──────────────────────────────────────────────

export interface ParsedCssImport {
  colors: Record<string, string>;
  cardStyle: Partial<CardStyleState>;
  typographyState: Partial<TypographyState>;
  buttonStyle: Partial<ButtonStyleState>;
  interactionStyle: Partial<InteractionStyleState>;
  alertStyle: Partial<AlertStyleState>;
  raw: Record<string, string>; // all extracted vars for display
}

/** Convert a CSS color value (hex, rgb, hsl, oklch, named) to HSL string "H S% L%" */
function colorValueToHsl(value: string): string | null {
  const v = value.trim().toLowerCase();

  // hex
  if (v.startsWith("#")) {
    let hex = v;
    if (hex.length === 4) hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    if (/^#[0-9a-f]{6}$/.test(hex)) return hexToHslString(hex);
    return null;
  }

  // hsl() / hsla() — already in our format
  const hslMatch = v.match(/hsla?\(\s*([\d.]+)[\s,]+([\d.]+)%[\s,]+([\d.]+)%/);
  if (hslMatch) return `${parseFloat(hslMatch[1])} ${parseFloat(hslMatch[2])}% ${parseFloat(hslMatch[3])}%`;

  // bare hsl values like "220 70% 50%"
  const bareHsl = v.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (bareHsl) return `${parseFloat(bareHsl[1])} ${parseFloat(bareHsl[2])}% ${parseFloat(bareHsl[3])}%`;

  // rgb() / rgba()
  const rgbMatch = v.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (rgbMatch) {
    const hex = `#${[rgbMatch[1], rgbMatch[2], rgbMatch[3]].map(n => Math.round(parseFloat(n)).toString(16).padStart(2, "0")).join("")}`;
    return hexToHslString(hex);
  }

  return null;
}

function parseNumericValue(value: string): number | null {
  const match = value.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : null;
}

/** Map of CSS property / variable names to our internal variable keys */
const CSS_VAR_ALIASES: Record<string, string> = {
  // direct matches
  "--brand": "--brand",
  "--primary": "--primary",
  "--primary-foreground": "--primary-foreground",
  "--secondary": "--secondary",
  "--secondary-foreground": "--secondary-foreground",
  "--background": "--background",
  "--foreground": "--foreground",
  "--card": "--card",
  "--card-foreground": "--card-foreground",
  "--popover": "--popover",
  "--popover-foreground": "--popover-foreground",
  "--muted": "--muted",
  "--muted-foreground": "--muted-foreground",
  "--accent": "--accent",
  "--accent-foreground": "--accent-foreground",
  "--destructive": "--destructive",
  "--destructive-foreground": "--destructive-foreground",
  "--success": "--success",
  "--success-foreground": "--success-foreground",
  "--warning": "--warning",
  "--warning-foreground": "--warning-foreground",
  "--border": "--border",
  "--ring": "--ring",
  // common shadcn/ui aliases
  "--input": "--border",
  "--primary-bg": "--primary",
  "--primary-fg": "--primary-foreground",
  "--secondary-bg": "--secondary",
  "--secondary-fg": "--secondary-foreground",
  // SCSS-style names (without --)
  "$brand": "--brand",
  "$primary": "--primary",
  "$secondary": "--secondary",
  "$background": "--background",
  "$foreground": "--foreground",
  "$border": "--border",
  "$accent": "--accent",
  "$muted": "--muted",
  "$destructive": "--destructive",
  "$success": "--success",
  "$warning": "--warning",
};

const EDITABLE_KEYS: Set<string> = new Set(EDITABLE_VARS.map(v => v.key));

export function parseCssImport(input: string): ParsedCssImport {
  const result: ParsedCssImport = {
    colors: {},
    cardStyle: {},
    typographyState: {},
    buttonStyle: {},
    interactionStyle: {},
    alertStyle: {},
    raw: {},
  };

  // Strip SCSS comments
  let cleaned = input
    .replace(/\/\/[^\n]*/g, "")     // single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, ""); // block comments

  // Extract all variable declarations: CSS custom properties and SCSS variables
  // CSS: --var-name: value;
  // SCSS: $var-name: value;
  const varPattern = /(-{2}[\w-]+|\$[\w-]+)\s*:\s*([^;{}]+);/g;
  let match: RegExpExecArray | null;

  while ((match = varPattern.exec(cleaned)) !== null) {
    const rawName = match[1].trim();
    const rawValue = match[2].trim();
    result.raw[rawName] = rawValue;

    // Resolve alias to internal key
    const internalKey = CSS_VAR_ALIASES[rawName] || (rawName.startsWith("--") ? rawName : null);

    // Try as color
    if (internalKey && EDITABLE_KEYS.has(internalKey)) {
      const hsl = colorValueToHsl(rawValue);
      if (hsl) {
        result.colors[internalKey] = hsl;
        continue;
      }
    }

    // Non-color properties
    const name = rawName.startsWith("$") ? `--${rawName.slice(1)}` : rawName;
    const num = parseNumericValue(rawValue);

    switch (name) {
      // Card style
      case "--card-radius":
      case "--radius":
      case "--border-radius":
        if (num != null) result.cardStyle.borderRadius = num;
        break;
      case "--card-shadow":
      case "--shadow":
        // skip complex shadows, just note it
        break;
      case "--border-width":
        if (num != null) result.cardStyle.borderWidth = num;
        break;
      case "--backdrop-blur":
        if (num != null) result.cardStyle.backdropBlur = num;
        break;

      // Typography
      case "--font-heading":
      case "--font-family-heading":
      case "--heading-font":
        result.typographyState.headingFamily = rawValue.replace(/['"]/g, "");
        break;
      case "--font-body":
      case "--font-family-body":
      case "--body-font":
      case "--font-family":
        result.typographyState.bodyFamily = rawValue.replace(/['"]/g, "");
        break;
      case "--font-size-base":
      case "--font-size":
      case "--base-font-size":
        if (num != null) result.typographyState.baseFontSize = num;
        break;
      case "--font-weight-heading":
      case "--heading-weight":
        if (num != null) result.typographyState.headingWeight = num;
        break;
      case "--font-weight-body":
      case "--body-weight":
      case "--font-weight":
        if (num != null) result.typographyState.bodyWeight = num;
        break;
      case "--line-height":
        if (num != null) result.typographyState.lineHeight = num;
        break;
      case "--letter-spacing":
        if (num != null) result.typographyState.letterSpacing = num;
        break;
      case "--letter-spacing-heading":
        if (num != null) result.typographyState.headingLetterSpacing = num;
        break;

      // Button style
      case "--btn-px":
      case "--button-padding-x":
        if (num != null) result.buttonStyle.paddingX = num;
        break;
      case "--btn-py":
      case "--button-padding-y":
        if (num != null) result.buttonStyle.paddingY = num;
        break;
      case "--btn-font-size":
      case "--button-font-size":
        if (num != null) result.buttonStyle.fontSize = num;
        break;
      case "--btn-font-weight":
      case "--button-font-weight":
        if (num != null) result.buttonStyle.fontWeight = num;
        break;
      case "--btn-radius":
      case "--button-radius":
        if (num != null) result.buttonStyle.borderRadius = num;
        break;

      // Interaction style
      case "--hover-opacity":
        if (num != null) result.interactionStyle.hoverOpacity = num;
        break;
      case "--hover-scale":
        if (num != null) result.interactionStyle.hoverScale = num;
        break;
      case "--active-scale":
        if (num != null) result.interactionStyle.activeScale = num;
        break;
      case "--transition-duration":
        if (num != null) result.interactionStyle.transitionDuration = num;
        break;
      case "--focus-ring-width":
        if (num != null) result.interactionStyle.focusRingWidth = num;
        break;

      // Alert style
      case "--alert-radius":
      case "--alert-border-radius":
        if (num != null) result.alertStyle.borderRadius = num;
        break;
      case "--alert-border-width":
        if (num != null) result.alertStyle.borderWidth = num;
        break;
      case "--alert-padding":
        if (num != null) result.alertStyle.padding = num;
        break;
    }
  }

  // Also try to extract standard CSS properties from rule blocks
  // e.g. font-family: "Inter", sans-serif; border-radius: 8px;
  const propPattern = /(?:^|\s)(font-family|font-size|font-weight|line-height|letter-spacing|border-radius|color|background(?:-color)?)\s*:\s*([^;{}]+);/gi;
  while ((match = propPattern.exec(cleaned)) !== null) {
    const prop = match[1].toLowerCase();
    const val = match[2].trim();
    const num = parseNumericValue(val);

    switch (prop) {
      case "font-family":
        if (!result.typographyState.bodyFamily) {
          result.typographyState.bodyFamily = val.replace(/['"]/g, "").split(",")[0].trim();
        }
        break;
      case "font-size":
        if (num != null && !result.typographyState.baseFontSize) result.typographyState.baseFontSize = num;
        break;
      case "font-weight":
        if (num != null && !result.typographyState.bodyWeight) result.typographyState.bodyWeight = num;
        break;
      case "line-height":
        if (num != null && !result.typographyState.lineHeight) result.typographyState.lineHeight = num;
        break;
      case "letter-spacing":
        if (num != null && !result.typographyState.letterSpacing) result.typographyState.letterSpacing = num;
        break;
      case "border-radius":
        if (num != null && result.cardStyle.borderRadius == null) result.cardStyle.borderRadius = num;
        break;
      case "color": {
        const hsl = colorValueToHsl(val);
        if (hsl && !result.colors["--foreground"]) result.colors["--foreground"] = hsl;
        break;
      }
      case "background":
      case "background-color": {
        const hsl = colorValueToHsl(val);
        if (hsl && !result.colors["--background"]) result.colors["--background"] = hsl;
        break;
      }
    }
  }

  return result;
}

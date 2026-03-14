import storage from "../storage";
import { TYPOGRAPHY_KEY, applyTypography } from "./typographyStyle";
import type { TypographyState } from "./typographyStyle";

export const THEME_COLORS_KEY = "ds-theme-colors";
export const PENDING_COLORS_KEY = "ds-pending-colors";
export const COLOR_HISTORY_KEY = "ds-color-history";
export const CONTRAST_KNOWLEDGE_KEY = "ds-contrast-knowledge";

/** WCAG AA minimum contrast ratio */
const WCAG_AA_RATIO = 4.6;

/** Maximum lightness adjustment iterations for contrast correction */
const LIGHTNESS_ITERATIONS = 100;

/** Lightness adjustment step size per iteration */
const LIGHTNESS_STEP = 1;

/** Maximum stored contrast corrections in localStorage */
const MAX_STORED_CORRECTIONS = 100;

/** Hue margin for contrast correction knowledge base */
const CONTRAST_HUE_MARGIN = 15;

/** Lightness margin for contrast correction knowledge base */
const CONTRAST_LIGHT_MARGIN = 10;

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
  const hueMargin = CONTRAST_HUE_MARGIN;
  const lightMargin = CONTRAST_LIGHT_MARGIN;

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

  if (corrections.length > MAX_STORED_CORRECTIONS) corrections.splice(0, corrections.length - MAX_STORED_CORRECTIONS);
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
  // Additional pairs: foreground on colored surfaces
  ["--foreground", "--card"],
  ["--foreground", "--muted"],
  ["--foreground", "--accent"],
  ["--foreground", "--popover"],
  ["--foreground", "--secondary"],
  // Muted-foreground on all common surfaces
  ["--muted-foreground", "--card"],
  ["--muted-foreground", "--popover"],
  ["--muted-foreground", "--accent"],
  ["--muted-foreground", "--secondary"],
  // Brand text on surfaces
  ["--brand", "--card"],
  ["--brand", "--muted"],
  ["--brand", "--accent"],
  ["--brand", "--secondary"],
];

export function hslToRgb(hsl: string): [number, number, number] {
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
        let mutedL = bgL > 50 ? 30 : 75;
        const mutedDir = bgL > 50 ? -1 : 1;
        let mutedCandidate = `0 0% ${mutedL}%`;
        for (let mi = 0; mi < 40; mi++) {
          if (contrastRatio(mutedCandidate, bg) >= WCAG_AA_RATIO) break;
          mutedL = Math.max(0, Math.min(100, mutedL + mutedDir));
          mutedCandidate = `0 0% ${mutedL}%`;
        }
        derived["--muted-foreground"] = mutedCandidate;
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
    if (brandVal && bgVal && contrastRatio(brandVal, bgVal) < WCAG_AA_RATIO) {
      const brandLocked = locked.has("--brand");
      const bgLocked = locked.has("--background");
      if (brandLocked && bgLocked) {
        // Both locked - skip
      } else {
        const bg = parseHsl(bgVal);
        const brand = parseHsl(brandVal);
        if (bg && brand) {
          if (!brandLocked) {
            const brandDir = bg.l > 50 ? -LIGHTNESS_STEP : LIGHTNESS_STEP;
            let bl = brand.l;
            let adjBrand = toHsl(brand.h, brand.s, bl);
            for (let i = 0; i < LIGHTNESS_ITERATIONS; i++) {
              bl = Math.max(0, Math.min(100, bl + brandDir));
              adjBrand = toHsl(brand.h, brand.s, bl);
              if (contrastRatio(adjBrand, bgVal) >= WCAG_AA_RATIO) break;
            }
            // Fallback: reduce saturation while adjusting lightness for brand
            if (contrastRatio(adjBrand, bgVal) < WCAG_AA_RATIO) {
              for (let s = brand.s; s >= 0; s -= 5) {
                const dir = bg.l > 50 ? -1 : 1;
                let l = brand.l;
                for (let j = 0; j < LIGHTNESS_ITERATIONS; j++) {
                  l = Math.max(0, Math.min(100, l + dir));
                  const candidate = toHsl(brand.h, s, l);
                  if (contrastRatio(candidate, bgVal) >= WCAG_AA_RATIO) {
                    adjBrand = candidate;
                    break;
                  }
                }
                if (contrastRatio(adjBrand, bgVal) >= WCAG_AA_RATIO) break;
              }
            }
            if (contrastRatio(adjBrand, bgVal) >= WCAG_AA_RATIO) {
              adjustments["--brand"] = adjBrand;
              working["--brand"] = adjBrand;
              brandVal = adjBrand;
            } else if (!bgLocked) {
              const bgDir = brand.l > 50 ? -LIGHTNESS_STEP : LIGHTNESS_STEP;
              let bgL = bg.l;
              let adjBg = toHsl(bg.h, bg.s, bgL);
              for (let i = 0; i < LIGHTNESS_ITERATIONS; i++) {
                bgL = Math.max(0, Math.min(100, bgL + bgDir));
                adjBg = toHsl(bg.h, bg.s, bgL);
                if (contrastRatio(brandVal, adjBg) >= WCAG_AA_RATIO) break;
              }
              adjustments["--background"] = adjBg;
              working["--background"] = adjBg;
            }
          } else if (!bgLocked) {
            const bgDir = brand.l > 50 ? -LIGHTNESS_STEP : LIGHTNESS_STEP;
            let bgL = bg.l;
            let adjBg = toHsl(bg.h, bg.s, bgL);
            for (let i = 0; i < LIGHTNESS_ITERATIONS; i++) {
              bgL = Math.max(0, Math.min(100, bgL + bgDir));
              adjBg = toHsl(bg.h, bg.s, bgL);
              if (contrastRatio(brandVal, adjBg) >= WCAG_AA_RATIO) break;
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
      if (contrastRatio(fgVal, bgv) >= WCAG_AA_RATIO) continue;

      const fgLocked = locked.has(fgKey);
      const bgKeyLocked = locked.has(bgKey);
      if (fgLocked && bgKeyLocked) continue;

      const fg = parseHsl(fgVal);
      const bg = parseHsl(bgv);
      if (!fg || !bg) continue;

      let adjusted = fgVal;
      let adjustedBg = bgv;

      if (!fgLocked) {
        const direction = bg.l > 50 ? -LIGHTNESS_STEP : LIGHTNESS_STEP;
        let l = fg.l;
        adjusted = toHsl(fg.h, fg.s, l);
        for (let i = 0; i < LIGHTNESS_ITERATIONS; i++) {
          l = Math.max(0, Math.min(100, l + direction));
          adjusted = toHsl(fg.h, fg.s, l);
          if (contrastRatio(adjusted, adjustedBg) >= WCAG_AA_RATIO) break;
        }

        if (contrastRatio(adjusted, adjustedBg) < WCAG_AA_RATIO) {
          l = fg.l;
          const oppDir = -direction;
          for (let i = 0; i < LIGHTNESS_ITERATIONS; i++) {
            l = Math.max(0, Math.min(100, l + oppDir));
            adjusted = toHsl(fg.h, fg.s, l);
            if (contrastRatio(adjusted, adjustedBg) >= WCAG_AA_RATIO) break;
          }
        }

        // Fallback: reduce saturation while adjusting lightness
        if (contrastRatio(adjusted, adjustedBg) < WCAG_AA_RATIO) {
          let bestAdj = adjusted;
          let bestRatio = contrastRatio(adjusted, adjustedBg);
          for (let s = fg.s; s >= 0; s -= 5) {
            const dir = bg.l > 50 ? -1 : 1;
            let l = fg.l;
            for (let i = 0; i < LIGHTNESS_ITERATIONS; i++) {
              l = Math.max(0, Math.min(100, l + dir));
              const candidate = toHsl(fg.h, s, l);
              const ratio = contrastRatio(candidate, adjustedBg);
              if (ratio >= WCAG_AA_RATIO) {
                adjusted = candidate;
                bestRatio = ratio;
                break;
              }
              if (ratio > bestRatio) {
                bestAdj = candidate;
                bestRatio = ratio;
              }
            }
            if (bestRatio >= WCAG_AA_RATIO) break;
          }
          if (bestRatio < WCAG_AA_RATIO) adjusted = bestAdj;
        }
      }

      if (contrastRatio(adjusted, adjustedBg) < WCAG_AA_RATIO && !bgKeyLocked) {
        const refL = fgLocked ? fg.l : parseFloat(adjusted.split(/\s+/)[2]);
        const bgDir = refL > 50 ? -LIGHTNESS_STEP : LIGHTNESS_STEP;
        let bgL = bg.l;
        let adjBg = toHsl(bg.h, bg.s, bgL);
        for (let i = 0; i < LIGHTNESS_ITERATIONS; i++) {
          bgL = Math.max(0, Math.min(100, bgL + bgDir));
          adjBg = toHsl(bg.h, bg.s, bgL);
          if (contrastRatio(adjusted, adjBg) >= WCAG_AA_RATIO) break;
        }
        if (contrastRatio(adjusted, adjBg) >= WCAG_AA_RATIO) {
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
    // Final pass: ensure --muted-foreground passes against both --background and --muted
    if (!locked.has("--muted-foreground")) {
      const mutedFg = working["--muted-foreground"];
      const mutedBg = working["--muted"];
      // Check against --background
      if (finalBg && mutedFg && contrastRatio(mutedFg, finalBg) < WCAG_AA_RATIO) {
        const bgL = parseFloat(finalBg.trim().split(/\s+/)[2]);
        let mutedL = bgL > 50 ? 30 : 75;
        const dir = bgL > 50 ? -1 : 1;
        let fixedMuted = `0 0% ${mutedL}%`;
        for (let i = 0; i < 40; i++) {
          if (contrastRatio(fixedMuted, finalBg) >= WCAG_AA_RATIO) break;
          mutedL = Math.max(0, Math.min(100, mutedL + dir));
          fixedMuted = `0 0% ${mutedL}%`;
        }
        adjustments["--muted-foreground"] = fixedMuted;
        working["--muted-foreground"] = fixedMuted;
      }
      // Also check against --muted background
      if (mutedBg && working["--muted-foreground"] && contrastRatio(working["--muted-foreground"], mutedBg) < WCAG_AA_RATIO) {
        adjustments["--muted-foreground"] = fgForBg(mutedBg);
        working["--muted-foreground"] = fgForBg(mutedBg);
      }
    }

    // Final safety net: re-check all pairs one more time.
    // Skip body foreground keys — they are set optimally by fgForBg(background)
    // above and must not be overridden to satisfy contrast against colored surfaces.
    const bodyFgKeys = new Set(["--foreground", "--card-foreground", "--popover-foreground", "--muted-foreground", "--brand"]);
    for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
      if (bodyFgKeys.has(fgKey)) continue;
      const fgVal = working[fgKey];
      const bgv = working[bgKey];
      if (!fgVal || !bgv) continue;
      if (contrastRatio(fgVal, bgv) >= WCAG_AA_RATIO) continue;
      if (locked.has(fgKey)) continue;
      const fixed = fgForBg(bgv);
      adjustments[fgKey] = fixed;
      working[fgKey] = fixed;
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
  const wrap = (h: number) => ((h % 360) + 360) % 360;

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
  const bgL = parseFloat(bg.trim().split(/\s+/)[2]);

  // Generate secondary and accent after background so their lightness
  // stays on the same side (light or dark) as the background.
  const secOffset = 90 + Math.random() * 180;
  const accOffset = 30 + Math.random() * 120;
  // Surface colors: near background lightness with slight variation
  const surfaceLightRange = bgL > 50
    ? [Math.max(80, bgL - 15), Math.min(98, bgL + 3)]
    : [Math.max(2, bgL - 3), Math.min(20, bgL + 15)];
  const surfaceLight = () => surfaceLightRange[0] + Math.random() * (surfaceLightRange[1] - surfaceLightRange[0]);
  const secHsl = `${wrap(bHue + secOffset).toFixed(1)} ${Math.min(100, bSat * (0.7 + Math.random() * 0.3)).toFixed(1)}% ${surfaceLight().toFixed(1)}%`;
  const accHsl = `${wrap(bHue + accOffset).toFixed(1)} ${Math.min(100, bSat * (0.7 + Math.random() * 0.3)).toFixed(1)}% ${surfaceLight().toFixed(1)}%`;

  if (!locked.has('--secondary')) result['--secondary'] = secHsl;
  if (!locked.has('--accent')) result['--accent'] = accHsl;

  const fgColor = fgForBg(bg);
  if (!locked.has('--foreground')) result['--foreground'] = fgColor;
  if (!locked.has('--card')) result['--card'] = bg;
  if (!locked.has('--popover')) result['--popover'] = bg;
  if (!locked.has('--card-foreground')) result['--card-foreground'] = fgColor;
  if (!locked.has('--popover-foreground')) result['--popover-foreground'] = fgColor;
  if (!locked.has('--muted-foreground')) {
    const bgL = parseFloat(bg.trim().split(/\s+/)[2]);
    // Pick a muted lightness that guarantees WCAG AA (4.5:1) against the background.
    // Start from a candidate and iterate toward more contrast if needed.
    let mutedL = bgL > 50 ? 30 : 75;
    const dir = bgL > 50 ? -1 : 1;
    let candidate = `0 0% ${mutedL}%`;
    for (let i = 0; i < 40; i++) {
      if (contrastRatio(candidate, bg) >= WCAG_AA_RATIO) break;
      mutedL = Math.max(0, Math.min(100, mutedL + dir));
      candidate = `0 0% ${mutedL}%`;
    }
    result['--muted-foreground'] = candidate;
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

  // Final safety pass: for each foreground key, find a lightness that meets
  // WCAG AA against ALL its paired backgrounds simultaneously.
  const final = { ...currentColors, ...result };
  const fgToBgs = new Map<string, string[]>();
  for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
    if (locked.has(fgKey)) continue;
    if (!fgToBgs.has(fgKey)) fgToBgs.set(fgKey, []);
    fgToBgs.get(fgKey)!.push(bgKey);
  }
  for (const [fgKey, bgKeys] of fgToBgs) {
    const fgVal = final[fgKey];
    if (!fgVal) continue;
    const bgs = bgKeys.map(k => final[k]).filter(Boolean) as string[];
    const allPass = bgs.every(bg => contrastRatio(fgVal, bg) >= WCAG_AA_RATIO);
    if (allPass) continue;
    const fgParts = fgVal.trim().split(/\s+/);
    if (fgParts.length < 3) continue;
    const fgH = parseFloat(fgParts[0]);
    let fgS = parseFloat(fgParts[1]);
    const origL = parseFloat(fgParts[2]);
    // Try both directions, pick the one that works
    let found = false;
    for (const dir of [-1, 1]) {
      let l = origL;
      for (let i = 0; i < 100; i++) {
        l = Math.max(0, Math.min(100, l + dir));
        const candidate = `${fgH} ${fgS}% ${l}%`;
        if (bgs.every(bg => contrastRatio(candidate, bg) >= WCAG_AA_RATIO)) {
          result[fgKey] = candidate;
          final[fgKey] = candidate;
          found = true;
          break;
        }
      }
      if (found) break;
    }
    // Last resort: desaturate and retry
    if (!found) {
      for (let ds = fgS - 10; ds >= 0; ds -= 10) {
        for (const dir of [-1, 1]) {
          let l = origL;
          for (let i = 0; i < 100; i++) {
            l = Math.max(0, Math.min(100, l + dir));
            const candidate = `${fgH} ${Math.max(0, ds)}% ${l}%`;
            if (bgs.every(bg => contrastRatio(candidate, bg) >= WCAG_AA_RATIO)) {
              result[fgKey] = candidate;
              final[fgKey] = candidate;
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) break;
      }
    }
    // Ultimate fallback: use fgForBg on primary background
    if (!found) {
      const primaryBg = final["--background"];
      if (primaryBg) {
        const fallback = fgForBg(primaryBg);
        result[fgKey] = fallback;
        final[fgKey] = fallback;
      }
    }
  }

  return result;
};

/** Build a CSS box-shadow value from shadow properties. Returns "none" when all offsets/blur/spread are zero. */
export function buildShadowCss(style: {
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
}): string {
  if (
    style.shadowBlur === 0 &&
    style.shadowOffsetX === 0 &&
    style.shadowOffsetY === 0 &&
    style.shadowSpread === 0
  ) {
    return "none";
  }
  return `${style.shadowOffsetX}px ${style.shadowOffsetY}px ${style.shadowBlur}px ${style.shadowSpread}px ${style.shadowColor}`;
}

export function applyStoredThemeColors(root: HTMLElement = document.documentElement) {
  const saved = storage.get<Record<string, string>>(THEME_COLORS_KEY);
  if (saved) {
    Object.entries(saved).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }
  const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY);
  if (pending) {
    Object.entries(pending).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  const applied: Record<string, string> = {};
  const computed = getComputedStyle(root);
  EDITABLE_VARS.forEach((v) => {
    const val = (root.style.getPropertyValue(v.key) || computed.getPropertyValue(v.key))?.trim();
    if (val) applied[v.key] = val;
  });
  if (Object.keys(applied).length > 0) {
    const fixes = autoAdjustContrast(applied);
    Object.entries(fixes).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    persistContrastFixes(fixes);
  }

  // Also restore stored typography
  const typo = storage.get<TypographyState>(TYPOGRAPHY_KEY);
  if (typo) {
    applyTypography(typo, root);
  }
}

/**
 * Host Style Scanner — detects the consuming page's color palette,
 * maps it to Themal design tokens, and generates an override stylesheet
 * so the entire page responds to theme changes.
 */

import { contrastRatio, derivePaletteFromChange, autoAdjustContrast } from "./styles/colorUtils";

// ── Types ────────────────────────────────────────────────────────────

interface RGB { r: number; g: number; b: number }

export interface ColorEntry { hex: string; hsl: string; count: number }
export interface FontEntry { family: string; count: number }

export interface HostPalette {
  backgrounds: ColorEntry[];
  texts: ColorEntry[];
  borders: ColorEntry[];
  fonts: FontEntry[];
}

// ── Helpers ──────────────────────────────────────────────────────────

function parseRgb(str: string): RGB | null {
  const m = str.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3] };
}

function isTransparent(str: string): boolean {
  return str === "transparent" || str === "rgba(0, 0, 0, 0)";
}

function rgbToHex(rgb: RGB): string {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(rgb.r)}${h(rgb.g)}${h(rgb.b)}`;
}

function rgbDistance(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function saturation(c: RGB): number {
  return rgbToHsl(c.r, c.g, c.b).s;
}

function toHslString(c: RGB): string {
  const { h, s, l } = rgbToHsl(c.r, c.g, c.b);
  return `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`;
}

// ── Phase 1: Scan ────────────────────────────────────────────────────

const MAX_ELEMENTS = 5000;
const MERGE_THRESHOLD = 30;

export function scanHostStyles(editorRoot: HTMLElement | null): HostPalette {
  const bgMap = new Map<string, number>();
  const textMap = new Map<string, number>();
  const borderMap = new Map<string, number>();
  const fontMap = new Map<string, number>();

  let count = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (editorRoot && editorRoot.contains(node as Element)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null = walker.currentNode;
  while (node && count < MAX_ELEMENTS) {
    const el = node as Element;
    if (el.nodeType === Node.ELEMENT_NODE) {
      const style = getComputedStyle(el);

      const bg = style.backgroundColor;
      if (!isTransparent(bg)) {
        const rgb = parseRgb(bg);
        if (rgb) {
          const hex = rgbToHex(rgb);
          bgMap.set(hex, (bgMap.get(hex) || 0) + 1);
        }
      }

      const color = style.color;
      if (color) {
        const rgb = parseRgb(color);
        if (rgb) {
          const hex = rgbToHex(rgb);
          textMap.set(hex, (textMap.get(hex) || 0) + 1);
        }
      }

      const border = style.borderTopColor;
      if (border && !isTransparent(border)) {
        const rgb = parseRgb(border);
        if (rgb) {
          const hex = rgbToHex(rgb);
          borderMap.set(hex, (borderMap.get(hex) || 0) + 1);
        }
      }

      const font = style.fontFamily.split(",")[0].trim().replace(/['"]/g, "");
      if (font) {
        fontMap.set(font, (fontMap.get(font) || 0) + 1);
      }

      count++;
    }
    node = walker.nextNode();
  }

  return {
    backgrounds: mergeAndSort(bgMap),
    texts: mergeAndSort(textMap),
    borders: mergeAndSort(borderMap),
    fonts: [...fontMap.entries()]
      .map(([family, count]) => ({ family, count }))
      .sort((a, b) => b.count - a.count),
  };
}

function mergeAndSort(map: Map<string, number>): ColorEntry[] {
  const entries = [...map.entries()]
    .map(([hex, count]) => ({ hex, rgb: parseRgb(hexToRgbString(hex))!, count }))
    .sort((a, b) => b.count - a.count);

  const merged: { hex: string; rgb: RGB; count: number }[] = [];
  const used = new Set<number>();

  for (let i = 0; i < entries.length; i++) {
    if (used.has(i)) continue;
    let totalCount = entries[i].count;
    for (let j = i + 1; j < entries.length; j++) {
      if (used.has(j)) continue;
      if (rgbDistance(entries[i].rgb, entries[j].rgb) < MERGE_THRESHOLD) {
        totalCount += entries[j].count;
        used.add(j);
      }
    }
    merged.push({ ...entries[i], count: totalCount });
    used.add(i);
  }

  return merged
    .sort((a, b) => b.count - a.count)
    .map(({ hex, rgb, count }) => ({ hex, hsl: toHslString(rgb), count }));
}

function hexToRgbString(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

// ── Phase 2: Map palette to tokens ───────────────────────────────────

export function mapPaletteToTokens(palette: HostPalette): Record<string, string> {
  const tokens: Record<string, string> = {};

  // --background: most common background
  const mainBg = palette.backgrounds[0];
  if (mainBg) {
    tokens["--background"] = mainBg.hsl;
  }

  // --foreground: text with highest contrast against background
  if (palette.texts.length > 0 && tokens["--background"]) {
    let bestContrast = 0;
    let bestText = palette.texts[0];
    for (const t of palette.texts) {
      const cr = contrastRatio(tokens["--background"], t.hsl);
      if (cr > bestContrast) {
        bestContrast = cr;
        bestText = t;
      }
    }
    tokens["--foreground"] = bestText.hsl;
  }

  // --muted-foreground: most common low-saturation text
  const mutedTexts = palette.texts.filter((t) => {
    const rgb = parseRgb(hexToRgbString(t.hex));
    return rgb && saturation(rgb) < 15;
  });
  if (mutedTexts.length > 0 && mutedTexts[0].hsl !== tokens["--foreground"]) {
    tokens["--muted-foreground"] = mutedTexts[0].hsl;
  }

  // --brand: most saturated color across texts and backgrounds
  const allColors = [...palette.texts, ...palette.backgrounds];
  const saturated = allColors
    .filter((c) => {
      const rgb = parseRgb(hexToRgbString(c.hex));
      return rgb && saturation(rgb) > 30;
    })
    .sort((a, b) => {
      const rgbA = parseRgb(hexToRgbString(a.hex))!;
      const rgbB = parseRgb(hexToRgbString(b.hex))!;
      return saturation(rgbB) - saturation(rgbA);
    });

  if (saturated.length > 0) tokens["--brand"] = saturated[0].hsl;
  if (saturated.length > 1) tokens["--secondary"] = saturated[1].hsl;
  if (saturated.length > 2) tokens["--accent"] = saturated[2].hsl;

  // --card: second most common background (slightly off from main)
  if (palette.backgrounds.length > 1) {
    tokens["--card"] = palette.backgrounds[1].hsl;
  }

  // --border: most common border color
  if (palette.borders.length > 0) {
    tokens["--border"] = palette.borders[0].hsl;
  }

  // Derive remaining tokens from brand using existing derivation logic
  if (tokens["--brand"] && tokens["--background"]) {
    const base = { ...tokens };
    const derived = derivePaletteFromChange("--brand", tokens["--brand"], base, new Set());
    for (const [k, v] of Object.entries(derived)) {
      if (!tokens[k]) tokens[k] = v;
    }
    // Run contrast enforcement
    const fixes = autoAdjustContrast({ ...tokens }, new Set());
    Object.assign(tokens, fixes);
  }

  return tokens;
}

// ── Phase 3: Build override stylesheet ───────────────────────────────

export function buildOverrideStylesheet(): string {
  return `
/* Themal host overrides — auto-generated */
body:not(.ds-editor) {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
:not(.ds-editor) h1,
:not(.ds-editor) h2,
:not(.ds-editor) h3,
:not(.ds-editor) h4,
:not(.ds-editor) h5,
:not(.ds-editor) h6 {
  color: hsl(var(--foreground));
  font-family: var(--font-family-heading, inherit);
}
:not(.ds-editor) a {
  color: hsl(var(--brand));
}
:not(.ds-editor) button:not(.ds-editor button),
:not(.ds-editor) [role="button"]:not(.ds-editor [role="button"]) {
  border-radius: var(--btn-radius, 0.375rem);
}
nav:not(.ds-editor nav) {
  background-color: hsl(var(--card, var(--background)));
}
header:not(.ds-editor header) {
  background-color: hsl(var(--card, var(--background)));
  color: hsl(var(--foreground));
}
footer:not(.ds-editor footer) {
  background-color: hsl(var(--card, var(--background)));
  color: hsl(var(--foreground));
}
`.trim();
}

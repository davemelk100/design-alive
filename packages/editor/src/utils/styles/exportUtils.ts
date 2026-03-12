import { hslToRgb, hexToHslString, EDITABLE_VARS } from "./colorUtils";
import type { CardStyleState } from "./cardStyle";
import { DEFAULT_BUTTON_STYLE } from "./buttonStyle";
import type { ButtonStyleState } from "./buttonStyle";
import type { TypographyState } from "./typographyStyle";
import type { AlertStyleState } from "./alertStyle";
import type { InteractionStyleState } from "./interactionStyle";
import type { TypoInteractionStyleState } from "./typoInteractionStyle";

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

// HSL value pattern: "210 40% 98%" or "210.5 40.2% 98.1%"
const HSL_VALUE_RE = /^\d+\.?\d*\s+\d+\.?\d*%\s+\d+\.?\d*%$/;

function isValidColorMap(obj: unknown): obj is Record<string, string> {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return false;
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof key !== "string" || typeof val !== "string") return false;
    // Color values must be valid HSL triplets
    if (!HSL_VALUE_RE.test(val.trim())) return false;
  }
  return true;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function isValidCardStyle(obj: unknown): obj is CardStyleState {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return false;
  const o = obj as Record<string, unknown>;
  const validPresets = ["liquid-glass", "solid", "gradient", "border-only", "custom"];
  if (typeof o.preset !== "string" || !validPresets.includes(o.preset)) return false;
  for (const numField of ["shadowOffsetX", "shadowOffsetY", "shadowBlur", "shadowSpread", "borderRadius", "bgGradientAngle", "borderWidth", "backdropBlur", "bgOpacity"]) {
    if (!isFiniteNumber(o[numField])) return false;
  }
  return true;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
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
    // Reject excessively large payloads (max 100KB)
    if (json.length > 102400) return null;
    const data: SerializedTheme = JSON.parse(json);
    if (!data.c || !data.cs || !data.t || !data.a || !data.i || !data.ti) return null;

    // Validate color values are safe HSL strings
    if (!isValidColorMap(data.c)) return null;

    // Validate card style has expected shape
    if (!isValidCardStyle(data.cs)) return null;

    // Validate remaining objects are plain objects (not arrays, not null)
    if (!isPlainObject(data.t) || !isPlainObject(data.a) || !isPlainObject(data.i) || !isPlainObject(data.ti)) return null;

    return {
      colors: data.c,
      cardStyle: data.cs,
      typographyState: data.t as TypographyState,
      alertStyle: data.a as AlertStyleState,
      interactionStyle: data.i as InteractionStyleState,
      typoInteractionStyle: data.ti as TypoInteractionStyleState,
      buttonStyle: data.bs && isPlainObject(data.bs) ? data.bs as ButtonStyleState : { ...DEFAULT_BUTTON_STYLE },
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

/**
 * Returns a system prompt string for any LLM that generates theme values
 * matching the AiGenerateResult interface.
 */
export function buildAiSystemPrompt(): string {
  const colorKeys = EDITABLE_VARS.map(v => `  "${v.key}" (${v.label})`).join("\n");

  return `You are a design-system theme generator. Given a user's description, produce a JSON object matching this TypeScript interface:

interface AiGenerateResult {
  colors?: Record<string, string>;
  typography?: Partial<TypographyState>;
}

## Color variables

Each color value must be a space-separated HSL string WITHOUT the hsl() wrapper.
Format: "<hue> <saturation>% <lightness>%"
Example value: "210 50% 40%"

Available CSS variable keys and their roles:
${colorKeys}

You may include any subset of these keys. Omitted keys will keep their current values.

## Typography fields

interface TypographyState {
  preset: "system" | "modern" | "classic" | "compact" | "editorial" | "custom";
  headingFamily: string;   // CSS font-family for headings (e.g. "Georgia, serif")
  bodyFamily: string;      // CSS font-family for body text (e.g. "system-ui, sans-serif")
  baseFontSize: number;    // Base font size in px. Typical range: 14 to 22.
  headingWeight: number;   // Font weight for headings. Typical range: 100 to 900.
  bodyWeight: number;      // Font weight for body text. Typical range: 100 to 900.
  lineHeight: number;      // Unitless line-height multiplier. Typical range: 1.2 to 2.0.
  letterSpacing: number;   // Body letter-spacing in em. Typical range: -0.05 to 0.1.
  headingLetterSpacing: number; // Heading letter-spacing in em. Typical range: -0.05 to 0.1.
}

When setting typography, use preset "custom" unless the request clearly matches a named preset.
You may include any subset of typography fields. Omitted fields keep their current values.

## Rules

1. Return ONLY valid JSON. No markdown fences, no explanation.
2. Foreground colors must contrast well against their paired background (WCAG AA, 4.5:1 minimum).
3. Include both colors and typography when relevant, or just one if the prompt only concerns one aspect.

## Example response

{
  "colors": {
    "--brand": "220 65% 48%",
    "--background": "220 20% 97%",
    "--foreground": "220 15% 10%",
    "--primary": "220 65% 48%",
    "--primary-foreground": "0 0% 100%",
    "--border": "220 15% 85%"
  },
  "typography": {
    "preset": "custom",
    "headingFamily": "Georgia, serif",
    "baseFontSize": 18,
    "headingWeight": 700
  }
}`;
}

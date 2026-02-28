import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import axe, { type AxeResults } from "axe-core";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import { content } from "../../content";
import storage from "../../utils/storage";

// Lazy-load icons used across the portfolio site
const LazyLinkedInLogoIcon = lazy(() =>
  import("@radix-ui/react-icons").then((mod) => ({ default: mod.LinkedInLogoIcon }))
);
const LazyGitHubLogoIcon = lazy(() =>
  import("@radix-ui/react-icons").then((mod) => ({ default: mod.GitHubLogoIcon }))
);
const LazyDribbble = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Dribbble }))
);
const LazyHome = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Home }))
);
const LazyMail = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Mail }))
);
const LazyPalette = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Palette }))
);
const LazyBookOpen = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.BookOpen }))
);
const LazyFileText = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.FileText }))
);
const LazyBriefcase = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Briefcase }))
);
const LazyQuote = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Quote }))
);
const LazySearch = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Search }))
);
const LazyCalendar = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Calendar }))
);
const LazySun = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Sun }))
);
const LazyMoon = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Moon }))
);
const LazyArrowLeft = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ArrowLeft }))
);
const LazyArrowRight = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ArrowRight }))
);
const LazyChevronLeft = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ChevronLeft }))
);
const LazyChevronRight = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ChevronRight }))
);
const LazyChevronDown = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ChevronDown }))
);
const LazyChevronUp = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ChevronUp }))
);
const LazyX = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.X }))
);
const LazyCheck = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Check }))
);
const LazyExternalLink = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ExternalLink }))
);
const LazyLink2 = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Link2 }))
);
const LazyEye = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Eye }))
);
const LazyMenu = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Menu }))
);
const LazyFlaskConical = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.FlaskConical }))
);
const LazyUsers = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Users }))
);
const LazyAlertCircle = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.AlertCircle }))
);
const LazyLoader2 = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Loader2 }))
);
const LazyHeart = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Heart }))
);
const LazyZap = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Zap }))
);
const LazyGlobe = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Globe }))
);
const LazyShield = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Shield }))
);
const LazySettings = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Settings }))
);
const LazyCode = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Code }))
);
const LazyDatabase = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Database }))
);
const LazySmartphone = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Smartphone }))
);
const LazyLayers = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Layers }))
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SITE_ICONS: { name: string; icon: React.LazyExoticComponent<any> }[] = [
  { name: "LinkedIn", icon: LazyLinkedInLogoIcon },
  { name: "GitHub", icon: LazyGitHubLogoIcon },
  { name: "Dribbble", icon: LazyDribbble },
  { name: "Home", icon: LazyHome },
  { name: "Mail", icon: LazyMail },
  { name: "Palette", icon: LazyPalette },
  { name: "BookOpen", icon: LazyBookOpen },
  { name: "FileText", icon: LazyFileText },
  { name: "Briefcase", icon: LazyBriefcase },
  { name: "Quote", icon: LazyQuote },
  { name: "Search", icon: LazySearch },
  { name: "Calendar", icon: LazyCalendar },
  { name: "Sun", icon: LazySun },
  { name: "Moon", icon: LazyMoon },
  { name: "Eye", icon: LazyEye },
  { name: "Heart", icon: LazyHeart },
  { name: "Menu", icon: LazyMenu },
  { name: "X", icon: LazyX },
  { name: "Check", icon: LazyCheck },
  { name: "ArrowLeft", icon: LazyArrowLeft },
  { name: "ArrowRight", icon: LazyArrowRight },
  { name: "ChevronLeft", icon: LazyChevronLeft },
  { name: "ChevronRight", icon: LazyChevronRight },
  { name: "ChevronDown", icon: LazyChevronDown },
  { name: "ChevronUp", icon: LazyChevronUp },
  { name: "ExternalLink", icon: LazyExternalLink },
  { name: "Link", icon: LazyLink2 },
  { name: "FlaskConical", icon: LazyFlaskConical },
  { name: "Users", icon: LazyUsers },
  { name: "AlertCircle", icon: LazyAlertCircle },
  { name: "Loader", icon: LazyLoader2 },
  { name: "Zap", icon: LazyZap },
  { name: "Globe", icon: LazyGlobe },
  { name: "Shield", icon: LazyShield },
  { name: "Settings", icon: LazySettings },
  { name: "Code", icon: LazyCode },
  { name: "Database", icon: LazyDatabase },
  { name: "Smartphone", icon: LazySmartphone },
  { name: "Layers", icon: LazyLayers },
];

export const THEME_COLORS_KEY = "ds-theme-colors";
export const PENDING_COLORS_KEY = "ds-pending-colors";
export const COLOR_HISTORY_KEY = "ds-color-history";

// Contrast pairs: [foreground var, background var] that must meet WCAG AA (4.5:1)
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
  // Pick whichever (black or white) gives the higher contrast ratio
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

  // Enforce contrast after applying stored colors
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
}

export function persistContrastFixes(fixes: Record<string, string>) {
  if (Object.keys(fixes).length === 0) return;
  const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
  storage.set(PENDING_COLORS_KEY, { ...pending, ...fixes });
  const saved = storage.get<Record<string, string>>(THEME_COLORS_KEY) || {};
  storage.set(THEME_COLORS_KEY, { ...saved, ...fixes });
}

// When brand or secondary changes, derive related palette colors by shifting hue
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

    // Parse existing value to preserve saturation/lightness when possible
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

    // Regenerate semantic colors to harmonize with the new brand/secondary palette.
    // Each semantic color keeps its hue family but adopts saturation/lightness
    // proportional to the new brand color for a cohesive feel.
    const deriveSemanticColors = () => {
      const newSat = parseFloat(parts[1]);
      const newLight = parseFloat(parts[2]);

      // Destructive (red family): hue 0, saturation follows brand, lightness for readability
      if (!locked.has("--destructive")) {
        const destSat = Math.min(100, newSat * 1.1); // slightly more vivid than brand
        const destLight = Math.max(35, Math.min(55, newLight * 0.85));
        derived["--destructive"] = `0 ${destSat.toFixed(1)}% ${destLight.toFixed(1)}%`;
      }
      if (!locked.has("--destructive-foreground")) {
        derived["--destructive-foreground"] = `0 0% 100%`;
      }

      // Success (green family): hue 142, saturation follows brand
      if (!locked.has("--success")) {
        const succSat = Math.min(100, newSat * 0.9);
        const succLight = Math.max(35, Math.min(55, newLight * 0.8));
        derived["--success"] = `142 ${succSat.toFixed(1)}% ${succLight.toFixed(1)}%`;
      }
      if (!locked.has("--success-foreground")) {
        derived["--success-foreground"] = `0 0% 100%`;
      }

      // Warning (yellow/amber family): hue 45, saturation follows brand
      if (!locked.has("--warning")) {
        const warnSat = Math.min(100, newSat * 1.05);
        const warnLight = Math.max(40, Math.min(60, newLight * 0.9));
        derived["--warning"] = `45 ${warnSat.toFixed(1)}% ${warnLight.toFixed(1)}%`;
      }
      if (!locked.has("--warning-foreground")) {
        derived["--warning-foreground"] = `0 0% 0%`;
      }
    };

    // Helper: derive body foreground as pure black or white from background
    const deriveBodyForegrounds = () => {
      const bg = currentColors["--background"];
      if (!bg) return;
      const fgColor = fgForBg(bg);
      if (!locked.has("--foreground")) derived["--foreground"] = fgColor;
      if (!locked.has("--card-foreground")) derived["--card-foreground"] = fgColor;
      if (!locked.has("--popover-foreground")) derived["--popover-foreground"] = fgColor;
      // Muted foreground: neutral gray, no hue tint
      if (!locked.has("--muted-foreground")) {
        const bgParts = bg.trim().split(/\s+/);
        const bgL = parseFloat(bgParts[2]);
        const mutedL = bgL > 50 ? 44 : 65;
        derived["--muted-foreground"] = `0 0% ${mutedL}%`;
      }
    };

    if (changedKey === "--brand") {
      // Primary family: adopt brand hue, preserve existing sat/lightness for dark mode compat
      shiftExisting("--primary");
      shiftExisting("--primary-foreground");
      // Ring
      shiftExisting("--ring");
      // Secondary/muted/accent: shift hue, keep their saturation/lightness
      shiftExisting("--secondary");
      shiftExisting("--secondary-foreground");
      shiftExisting("--muted");
      shiftExisting("--accent");
      shiftExisting("--accent-foreground");
      shiftExisting("--border");
      // Body text: pure black or white based on background
      deriveBodyForegrounds();
      deriveSemanticColors();
    } else if (changedKey === "--secondary") {
      // Accent and muted follow secondary's hue, brand stays unchanged
      shiftExisting("--secondary-foreground");
      shiftExisting("--accent");
      shiftExisting("--accent-foreground");
      shiftExisting("--muted");
      shiftExisting("--border");
      // Body text: pure black or white based on background
      deriveBodyForegrounds();
      deriveSemanticColors();
    } else if (changedKey === "--accent") {
      // Accent change: muted follows accent hue, brand/secondary stay unchanged
      shiftExisting("--accent-foreground");
      shiftExisting("--muted");
      shiftExisting("--border");
      deriveSemanticColors();
    } else if (changedKey === "--background") {
      // Background change: card and popover match background
      if (!locked.has("--card")) derived["--card"] = newHsl;
      if (!locked.has("--popover")) derived["--popover"] = newHsl;
      // Body foreground: pure black or white
      const fgColor = fgForBg(newHsl);
      if (!locked.has("--foreground")) derived["--foreground"] = fgColor;
      if (!locked.has("--card-foreground")) derived["--card-foreground"] = fgColor;
      if (!locked.has("--popover-foreground")) derived["--popover-foreground"] = fgColor;
      // Component foregrounds: black or white for their respective backgrounds
      if (!locked.has("--secondary-foreground")) derived["--secondary-foreground"] = fgForBg(currentColors["--secondary"] || newHsl);
      if (!locked.has("--accent-foreground")) derived["--accent-foreground"] = fgForBg(currentColors["--accent"] || newHsl);
      // Muted foreground: neutral gray, no hue tint
      if (!locked.has("--muted-foreground")) {
        const bgL = parseFloat(newHsl.trim().split(/\s+/)[2]);
        const mutedL = bgL > 50 ? 44 : 65;
        derived["--muted-foreground"] = `0 0% ${mutedL}%`;
      }
      // Border: adapt to light/dark background
      if (!locked.has("--border")) {
        const bgParts = newHsl.trim().split(/\s+/);
        const bgL = parseFloat(bgParts[2]);
        const borderL = bgL > 50 ? Math.max(0, bgL - 9) : Math.min(100, bgL + 12);
        derived["--border"] = `${bgParts[0]} ${(parseFloat(bgParts[1]) * 0.3).toFixed(1)}% ${borderL.toFixed(1)}%`;
      }
    } else if (changedKey === "--foreground") {
      // Foreground change: card-foreground and popover-foreground follow
      if (!locked.has("--card-foreground")) derived["--card-foreground"] = newHsl;
      if (!locked.has("--popover-foreground")) derived["--popover-foreground"] = newHsl;
    } else if (changedKey === "--primary") {
      // Primary change: derive primary-foreground via contrast
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

    // Check brand against background — first try adjusting brand lightness, then background
    let brandVal = working["--brand"];
    const bgVal = working["--background"];
    if (brandVal && bgVal && contrastRatio(brandVal, bgVal) < 4.6) {
      const brandLocked = locked.has("--brand");
      const bgLocked = locked.has("--background");
      if (brandLocked && bgLocked) {
        // Both locked — skip
      } else {
        const bg = parseHsl(bgVal);
        const brand = parseHsl(brandVal);
        if (bg && brand) {
          if (!brandLocked) {
            // Try adjusting brand lightness first
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
              // Fallback: adjust background
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
            // Brand locked, adjust background only
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

    // Check all foreground/background contrast pairs
    for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
      const fgVal = working[fgKey];
      const bgv = working[bgKey];
      if (!fgVal || !bgv) continue;
      if (contrastRatio(fgVal, bgv) >= 4.6) continue;

      const fgLocked = locked.has(fgKey);
      const bgKeyLocked = locked.has(bgKey);
      if (fgLocked && bgKeyLocked) continue; // both locked, skip

      const fg = parseHsl(fgVal);
      const bg = parseHsl(bgv);
      if (!fg || !bg) continue;

      let adjusted = fgVal;
      let adjustedBg = bgv;

      if (!fgLocked) {
        // Try adjusting foreground
        const direction = bg.l > 50 ? -3 : 3;
        let l = fg.l;
        adjusted = toHsl(fg.h, fg.s, l);
        for (let i = 0; i < 34; i++) {
          l = Math.max(0, Math.min(100, l + direction));
          adjusted = toHsl(fg.h, fg.s, l);
          if (contrastRatio(adjusted, adjustedBg) >= 4.6) break;
        }

        // If still failing, try opposite direction
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

      // If foreground adjustment alone isn't enough (or fg is locked), adjust background
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

    // Final safety: ensure --foreground is pure black or white for the current background
    const finalBg = working["--background"];
    if (finalBg && !locked.has("--foreground")) {
      const bestFg = fgForBg(finalBg);
      if (contrastRatio(working["--foreground"] || bestFg, finalBg) < 4.6) {
        adjustments["--foreground"] = bestFg;
        working["--foreground"] = bestFg;
      }
    }
    // Same for card/popover foregrounds
    for (const [fgK, bgK] of [["--card-foreground", "--card"], ["--popover-foreground", "--popover"]] as const) {
      const bgV = working[bgK];
      if (bgV && !locked.has(fgK)) {
        const bestFg = fgForBg(bgV);
        if (contrastRatio(working[fgK] || bestFg, bgV) < 4.6) {
          adjustments[fgK] = bestFg;
          working[fgK] = bestFg;
        }
      }
    }
    // Ensure muted-foreground passes against background
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
          // Fallback to pure black or white
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

  // Build secondary and accent with slight sat/light variation from brand
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

  // Start with current colors, apply secondary then accent derivations
  let merged: Record<string, string> = { ...currentColors, '--secondary': secondaryHsl };
  const secDerived = derivePaletteFromChange('--secondary', secondaryHsl, merged, locked);
  merged = { ...merged, ...secDerived, '--accent': accentHsl };
  const accDerived = derivePaletteFromChange('--accent', accentHsl, merged, locked);
  merged = { ...merged, ...accDerived };

  // Collect only the changed keys (skip locked)
  const result: Record<string, string> = {};
  if (!locked.has('--secondary')) result['--secondary'] = secondaryHsl;
  if (!locked.has('--accent')) result['--accent'] = accentHsl;
  Object.assign(result, secDerived, accDerived);

  // Auto-adjust contrast
  const fullColors = { ...currentColors, ...result };
  const adjustments = autoAdjustContrast(fullColors, locked);
  Object.assign(result, adjustments);

  return result;
};

/** Generate a random brand color and derive the full palette, respecting locked keys. */
export const generateRandomPalette = (
  currentColors: Record<string, string>,
  lockedKeys?: Set<string>,
): Record<string, string> => {
  const locked = lockedKeys ?? new Set<string>();
  const result: Record<string, string> = {};
  const isDark = document.documentElement.classList.contains('dark');

  // Generate random brand (unless locked) — keep lightness in a range
  // that provides good contrast against both light and dark backgrounds
  const hue = Math.random() * 360;
  const sat = 55 + Math.random() * 35; // 55-90%
  const light = isDark
    ? 50 + Math.random() * 20  // 50-70% in dark mode (bright enough to see)
    : 35 + Math.random() * 25; // 35-60% in light mode
  const brandHsl = `${hue.toFixed(1)} ${sat.toFixed(1)}% ${light.toFixed(1)}%`;

  if (!locked.has('--brand')) {
    result['--brand'] = brandHsl;
  }

  const activeBrand = locked.has('--brand') ? currentColors['--brand'] : brandHsl;

  // Random secondary & accent offsets (unless locked)
  const bParts = activeBrand.trim().split(/\s+/);
  const bHue = parseFloat(bParts[0]);
  const bSat = parseFloat(bParts[1]);
  const bLight = parseFloat(bParts[2]);
  const wrap = (h: number) => ((h % 360) + 360) % 360;

  const secOffset = 90 + Math.random() * 180; // 90-270 degrees away
  const accOffset = 30 + Math.random() * 120;  // 30-150 degrees away
  const lightMin = isDark ? 40 : 15;
  const lightMax = isDark ? 75 : 90;
  const clampLight = (v: number) => Math.min(lightMax, Math.max(lightMin, v));
  const secHsl = `${wrap(bHue + secOffset).toFixed(1)} ${Math.min(100, bSat * (0.7 + Math.random() * 0.3)).toFixed(1)}% ${clampLight(bLight * (0.8 + Math.random() * 0.4)).toFixed(1)}%`;
  const accHsl = `${wrap(bHue + accOffset).toFixed(1)} ${Math.min(100, bSat * (0.7 + Math.random() * 0.3)).toFixed(1)}% ${clampLight(bLight * (0.8 + Math.random() * 0.4)).toFixed(1)}%`;

  if (!locked.has('--secondary')) result['--secondary'] = secHsl;
  if (!locked.has('--accent')) result['--accent'] = accHsl;

  // Ensure background/foreground are mode-appropriate
  if (!locked.has('--background')) {
    const bgLight = isDark ? 3 + Math.random() * 7 : 95 + Math.random() * 5; // dark: 3-10%, light: 95-100%
    result['--background'] = `${wrap(bHue + 20).toFixed(1)} ${(15 + Math.random() * 20).toFixed(1)}% ${bgLight.toFixed(1)}%`;
  }
  // Foreground: pure black or white based on background
  const bg = result['--background'] || currentColors['--background'];
  const fgColor = fgForBg(bg);
  if (!locked.has('--foreground')) result['--foreground'] = fgColor;
  // Card/popover match background
  if (!locked.has('--card')) result['--card'] = bg;
  if (!locked.has('--popover')) result['--popover'] = bg;
  // Card/popover foregrounds: same pure black or white
  if (!locked.has('--card-foreground')) result['--card-foreground'] = fgColor;
  if (!locked.has('--popover-foreground')) result['--popover-foreground'] = fgColor;
  // Muted foreground: neutral gray, no hue tint
  if (!locked.has('--muted-foreground')) {
    const bgL = parseFloat(bg.trim().split(/\s+/)[2]);
    const mutedL = bgL > 50 ? 44 : 65;
    result['--muted-foreground'] = `0 0% ${mutedL}%`;
  }
  // Border
  if (!locked.has('--border')) {
    const borderLight = isDark ? 15 + Math.random() * 10 : 85 + Math.random() * 10;
    result['--border'] = `${wrap(bHue + 15).toFixed(1)} ${(15 + Math.random() * 15).toFixed(1)}% ${borderLight.toFixed(1)}%`;
  }
  // Muted background
  if (!locked.has('--muted')) {
    const mutedLight = isDark ? 12 + Math.random() * 8 : 90 + Math.random() * 8;
    result['--muted'] = `${wrap(bHue + 15).toFixed(1)} ${(15 + Math.random() * 15).toFixed(1)}% ${mutedLight.toFixed(1)}%`;
  }

  // Derive from brand
  let merged = { ...currentColors, ...result };
  if (!locked.has('--brand')) {
    const brandDerived = derivePaletteFromChange('--brand', activeBrand, merged, locked);
    Object.assign(result, brandDerived);
    merged = { ...merged, ...brandDerived };
  }
  // Derive from secondary
  if (!locked.has('--secondary')) {
    const secDerived = derivePaletteFromChange('--secondary', result['--secondary'] || currentColors['--secondary'], merged, locked);
    Object.assign(result, secDerived);
    merged = { ...merged, ...secDerived };
  }
  // Derive from accent
  if (!locked.has('--accent')) {
    const accDerived = derivePaletteFromChange('--accent', result['--accent'] || currentColors['--accent'], merged, locked);
    Object.assign(result, accDerived);
    merged = { ...merged, ...accDerived };
  }

  // Auto-adjust contrast
  const fullColors = { ...currentColors, ...result };
  const adjustments = autoAdjustContrast(fullColors, locked);
  Object.assign(result, adjustments);

  return result;
};

// Shared per-element contrast fix: uses axe violation data for effective bg
function fixElementContrast(contrastViolation: { nodes: { target: unknown[]; any?: { data?: { bgColor?: string } }[] }[] }) {
  const parseRgb = (rgb: string): [number, number, number] | null => {
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return null;
    return [parseInt(m[1]) / 255, parseInt(m[2]) / 255, parseInt(m[3]) / 255];
  };
  const parseHex = (hex: string): [number, number, number] | null => {
    const m = hex.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    if (!m) return null;
    return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
  };
  const lum = (r: number, g: number, b: number) => {
    const toL = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * toL(r) + 0.7152 * toL(g) + 0.0722 * toL(b);
  };
  const rgbToHsl = (r: number, g: number, b: number) => {
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const li = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l: li };
    const d = max - min;
    const s = li > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return { h, s, l: li };
  };
  const hslToRgbStr = (h: number, s: number, l: number) => {
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    return `rgb(${Math.round(f(0) * 255)}, ${Math.round(f(8) * 255)}, ${Math.round(f(4) * 255)})`;
  };
  // Walk up DOM to find effective opaque background
  const getEffectiveBg = (el: HTMLElement): [number, number, number] => {
    let current: HTMLElement | null = el;
    while (current) {
      const bgStr = getComputedStyle(current).backgroundColor;
      const m = bgStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
      if (m) {
        const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
        if (alpha >= 0.9) return [parseInt(m[1]) / 255, parseInt(m[2]) / 255, parseInt(m[3]) / 255];
      }
      current = current.parentElement;
    }
    return [1, 1, 1]; // default white
  };

  const TARGET_RATIO = 4.6; // slightly above 4.5 for safety margin

  for (const node of contrastViolation.nodes) {
    const el = document.querySelector(node.target[0] as string) as HTMLElement | null;
    if (!el) continue;

    // Try to get effective bg from axe data, then from DOM traversal, then from computed style
    const axeBgColor = node.any?.[0]?.data?.bgColor;
    let bg = axeBgColor ? (parseRgb(axeBgColor) ?? parseHex(axeBgColor)) : null;
    if (!bg) bg = getEffectiveBg(el);

    const computed = getComputedStyle(el);
    const fg = parseRgb(computed.color);
    if (!fg) continue;

    const bgLum = lum(...bg);
    const fgLum = lum(...fg);
    const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
    if (ratio >= TARGET_RATIO) continue;

    const fgHsl = rgbToHsl(...fg);
    let fixed = false;
    // Try both directions: preferred first (darken for light bg, lighten for dark bg)
    for (const dir of [bgLum > 0.5 ? -0.01 : 0.01, bgLum > 0.5 ? 0.01 : -0.01]) {
      const tryHsl = { ...fgHsl };
      for (let i = 0; i < 100; i++) {
        tryHsl.l = Math.max(0, Math.min(1, tryHsl.l + dir));
        const a = tryHsl.s * Math.min(tryHsl.l, 1 - tryHsl.l);
        const newFg = [0, 0, 0] as [number, number, number];
        for (let ci = 0; ci < 3; ci++) {
          const n = [0, 8, 4][ci];
          const k = (n + tryHsl.h * 12) % 12;
          newFg[ci] = tryHsl.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        }
        const newRatio = (Math.max(lum(...newFg), bgLum) + 0.05) / (Math.min(lum(...newFg), bgLum) + 0.05);
        if (newRatio >= TARGET_RATIO) {
          el.style.color = hslToRgbStr(tryHsl.h, tryHsl.s, tryHsl.l);
          fixed = true;
          break;
        }
      }
      if (fixed) break;
    }
    // If hue-preserving adjustment failed, use black or white
    if (!fixed) {
      el.style.color = bgLum > 0.5 ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
    }
  }
}

export function useContrastEnforcement(
  colors: Record<string, string>,
  setColors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  lockedKeys: Set<string>,
) {
  useEffect(() => {
    const handleModeChange = () => {
      // Small delay to let CSS cascade after dark class toggle
      setTimeout(() => {
        const live: Record<string, string> = {};
        EDITABLE_VARS.forEach((v) => {
          const val = getComputedStyle(document.documentElement)
            .getPropertyValue(v.key)?.trim();
          if (val) live[v.key] = val;
        });
        if (Object.keys(live).length > 0) {
          const fixes = autoAdjustContrast(live, lockedKeys);
          Object.entries(fixes).forEach(([k, v]) => {
            document.documentElement.style.setProperty(k, v);
          });
          setColors(prev => ({ ...prev, ...live, ...fixes }));
          persistContrastFixes(fixes);
          window.dispatchEvent(new Event("theme-pending-update"));
        }
      }, 50);
    };
    window.addEventListener("theme-mode-changed", handleModeChange);
    return () => window.removeEventListener("theme-mode-changed", handleModeChange);
  }, [colors, setColors, lockedKeys]);
}

export default function DesignSystemPage() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [auditStatus, setAuditStatus] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');
  const [auditViolations, setAuditViolations] = useState<{ selector: string; text: string }[]>([]);
  const [violationIndex, setViolationIndex] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [prStatus, setPrStatus] = useState<'idle' | 'creating' | 'created' | 'error' | 'rate-limited'>('idle');
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [prError, setPrError] = useState<string | null>(null);
  const [harmonySchemeIndex, setHarmonySchemeIndex] = useState(0);
  const [shuffleOpen, setShuffleOpen] = useState(false);
  const [lockedKeys, setLockedKeys] = useState<Set<string>>(new Set());

  const readCurrentColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    const current: Record<string, string> = {};
    let hasEmpty = false;
    EDITABLE_VARS.forEach(({ key }) => {
      const val = style.getPropertyValue(key).trim();
      current[key] = val;
      if (!val) hasEmpty = true;
    });
    setColors(current);
    if (hasEmpty) {
      setTimeout(() => {
        const retryStyle = getComputedStyle(document.documentElement);
        const retried: Record<string, string> = {};
        EDITABLE_VARS.forEach(({ key }) => {
          retried[key] = retryStyle.getPropertyValue(key).trim();
        });
        setColors(retried);
      }, 100);
    }
  }, []);

  useContrastEnforcement(colors, setColors, lockedKeys);

  useEffect(() => {
    applyStoredThemeColors();
    readCurrentColors();

    const handlePendingUpdate = () => {
      setTimeout(() => readCurrentColors(), 50);
    };
    window.addEventListener("theme-pending-update", handlePendingUpdate);
    return () => window.removeEventListener("theme-pending-update", handlePendingUpdate);
  }, [readCurrentColors]);

  const generateCode = async () => {
    // CSS custom properties
    let css = ":root {\n";
    EDITABLE_VARS.forEach(({ key }) => {
      const val = colors[key];
      if (val) css += `  ${key}: ${val};\n`;
    });
    css += "}\n";

    // Tailwind config colors snippet
    let tw = "\n// tailwind.config.ts → theme.extend.colors\ncolors: {\n";
    tw += `  brand: "hsl(var(--brand))",\n`;
    tw += `  background: "hsl(var(--background))",\n`;
    tw += `  foreground: "hsl(var(--foreground))",\n`;
    tw += `  primary: {\n    DEFAULT: "hsl(var(--primary))",\n    foreground: "hsl(var(--primary-foreground))",\n  },\n`;
    tw += `  secondary: {\n    DEFAULT: "hsl(var(--secondary))",\n    foreground: "hsl(var(--secondary-foreground))",\n  },\n`;
    tw += `  muted: {\n    DEFAULT: "hsl(var(--muted))",\n    foreground: "hsl(var(--muted-foreground))",\n  },\n`;
    tw += `  accent: {\n    DEFAULT: "hsl(var(--accent))",\n    foreground: "hsl(var(--accent-foreground))",\n  },\n`;
    tw += `  destructive: {\n    DEFAULT: "hsl(var(--destructive))",\n    foreground: "hsl(var(--destructive-foreground))",\n  },\n`;
    tw += `  border: "hsl(var(--border))",\n`;
    tw += `  ring: "hsl(var(--ring))",\n`;
    tw += "}";

    setGeneratedCode(css + tw);
  };

  const runAudit = () => axe.run(
    { exclude: ['[data-axe-exclude]'] },
    { runOnly: { type: 'rule', values: ['color-contrast'] } },
  );

  const scrollToViolation = (v: { selector: string }) => {
    const el = document.querySelector(v.selector) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.style.outline = '3px solid hsl(0 84% 60%)';
    el.style.outlineOffset = '2px';
    setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 3000);
  };

  const setAuditFromResults = (results: AxeResults) => {
    if (results.violations.length === 0) {
      setAuditStatus('passed');
      setAuditViolations([]);
      setViolationIndex(0);
    } else {
      setAuditStatus('failed');
      const elements: { selector: string; text: string }[] = [];
      for (const v of results.violations) {
        for (const node of v.nodes) {
          const selector = String(node.target[0] || '');
          const el = document.querySelector(selector) as HTMLElement | null;
          const text = el?.textContent?.trim().slice(0, 40) || selector;
          elements.push({ selector, text });
        }
      }
      setAuditViolations(elements);
      setViolationIndex(0);
    }
  };

  const runAccessibilityAudit = async () => {
    setAuditStatus('running');
    setAuditViolations([]);
    setViolationIndex(0);
    try {
      const initialResults = await runAudit();

      // If violations found, auto-fix and re-audit
      if (initialResults.violations.length > 0) {
        // 1. Fix contrast on CSS variable pairs
        const style = getComputedStyle(document.documentElement);
        const liveColors: Record<string, string> = {};
        EDITABLE_VARS.forEach(({ key }) => {
          liveColors[key] = style.getPropertyValue(key).trim();
        });

        const fixes = autoAdjustContrast(liveColors, lockedKeys);
        if (Object.keys(fixes).length > 0) {
          const updatedColors = { ...liveColors };
          for (const [fixKey, fixVal] of Object.entries(fixes)) {
            document.documentElement.style.setProperty(fixKey, fixVal);
            updatedColors[fixKey] = fixVal;
          }
          persistContrastFixes(fixes);
          setColors(updatedColors);
          window.dispatchEvent(new Event("theme-pending-update"));
        }

        // 2. Fix per-element contrast violations reported by axe
        const contrastViolation = initialResults.violations.find((v) => v.id === 'color-contrast');
        if (contrastViolation) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fixElementContrast(contrastViolation as any);
        }

        // 3. Re-audit after fixes
        setAuditFromResults(await runAudit());
      } else {
        setAuditFromResults(initialResults);
      }
    } catch {
      setAuditStatus('idle');
    }
  };

  const fixContrastIssues = async () => {
    setAuditStatus('running');
    try {
      // 1. Aggressively fix CSS variable pairs
      const style = getComputedStyle(document.documentElement);
      const liveColors: Record<string, string> = {};
      EDITABLE_VARS.forEach(({ key }) => {
        liveColors[key] = style.getPropertyValue(key).trim();
      });

      const parseHsl = (val: string) => {
        const p = val.trim().split(/\s+/);
        if (p.length < 3) return null;
        return { h: parseFloat(p[0]), s: parseFloat(p[1]), l: parseFloat(p[2]) };
      };
      const toHsl = (h: number, s: number, l: number) => `${h} ${s}% ${l}%`;
      const working = { ...liveColors };

      const fixPair = (fgKey: string, bgKey: string) => {
        const fgVal = working[fgKey];
        const bgv = working[bgKey];
        if (!fgVal || !bgv || contrastRatio(fgVal, bgv) >= 4.6) return;
        const fg = parseHsl(fgVal);
        const bg = parseHsl(bgv);
        if (!fg || !bg) return;

        // Try foreground adjustment first, 1% steps, both directions
        for (const dir of [bg.l > 50 ? -1 : 1, bg.l > 50 ? 1 : -1]) {
          let l = fg.l;
          let adjusted = fgVal;
          for (let i = 0; i < 100; i++) {
            l = Math.max(0, Math.min(100, l + dir));
            adjusted = toHsl(fg.h, fg.s, l);
            if (contrastRatio(adjusted, bgv) >= 4.6) break;
          }
          if (contrastRatio(adjusted, bgv) >= 4.6) {
            document.documentElement.style.setProperty(fgKey, adjusted);
            working[fgKey] = adjusted;
            return;
          }
        }

        // If foreground alone can't fix it, also adjust background
        for (const dir of [fg.l > 50 ? -1 : 1, fg.l > 50 ? 1 : -1]) {
          let l = bg.l;
          let adjBg = bgv;
          for (let i = 0; i < 100; i++) {
            l = Math.max(0, Math.min(100, l + dir));
            adjBg = toHsl(bg.h, bg.s, l);
            if (contrastRatio(working[fgKey], adjBg) >= 4.6) break;
          }
          if (contrastRatio(working[fgKey], adjBg) >= 4.6) {
            document.documentElement.style.setProperty(bgKey, adjBg);
            working[bgKey] = adjBg;
            return;
          }
        }
      };

      // Fix brand vs background
      fixPair("--brand", "--background");
      // Fix all contrast pairs
      for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
        fixPair(fgKey, bgKey);
      }

      const contrastFixes: Record<string, string> = {};
      for (const [k, v] of Object.entries(working)) {
        if (v !== liveColors[k]) contrastFixes[k] = v;
      }
      persistContrastFixes(contrastFixes);
      setColors(working);
      window.dispatchEvent(new Event("theme-pending-update"));

      // 2. Fresh audit — then fix remaining per-element violations
      const midResults = await runAudit();
      const contrastViolation = midResults.violations.find((v) => v.id === 'color-contrast');
      if (contrastViolation) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fixElementContrast(contrastViolation as any);
      }

      // 3. Final audit
      setAuditFromResults(await runAudit());
    } catch {
      setAuditStatus('idle');
    }
  };

  const handleColorChange = (key: string, hex: string) => {
    const hsl = hexToHslString(hex);

    // Push to undo history before applying
    const history = storage.get<{ key: string; previousValue: string }[]>(COLOR_HISTORY_KEY) || [];
    history.push({ key, previousValue: colors[key] || "" });

    // Apply the changed color
    document.documentElement.style.setProperty(key, hsl);
    const newColors = { ...colors, [key]: hsl };

    const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    pending[key] = hsl;

    // Derive palette when a hero key changes
    const DERIVATION_TRIGGERS = ["--brand", "--secondary", "--accent", "--background", "--foreground", "--primary"];
    if (DERIVATION_TRIGGERS.includes(key)) {
      const derived = derivePaletteFromChange(key, hsl, newColors, lockedKeys);
      for (const [dKey, dVal] of Object.entries(derived)) {
        history.push({ key: dKey, previousValue: newColors[dKey] || "" });
        document.documentElement.style.setProperty(dKey, dVal);
        newColors[dKey] = dVal;
        pending[dKey] = dVal;
      }
    }

    // Auto-adjust contrast — treat the key user just picked as locked so it isn't overwritten
    // Exception: Brand should always be constrained to accessible ranges
    const contrastLocks = new Set(lockedKeys);
    if (key !== "--brand") contrastLocks.add(key);
    const adjustments = autoAdjustContrast(newColors, contrastLocks);
    for (const [adjKey, adjVal] of Object.entries(adjustments)) {
      history.push({ key: adjKey, previousValue: newColors[adjKey] || "" });
      document.documentElement.style.setProperty(adjKey, adjVal);
      newColors[adjKey] = adjVal;
      pending[adjKey] = adjVal;
    }

    storage.set(COLOR_HISTORY_KEY, history);
    setColors(newColors);
    storage.set(PENDING_COLORS_KEY, pending);
    persistContrastFixes(adjustments);
    window.dispatchEvent(new Event("theme-pending-update"));

  };

  const handleRegenerate = (schemeIdx: number) => {
    const scheme = HARMONY_SCHEMES[schemeIdx];
    const brandHsl = colors['--brand'];
    if (!brandHsl) return;

    const result = generateHarmonyPalette(brandHsl, scheme, colors, lockedKeys);
    const history = storage.get<{ key: string; previousValue: string }[]>(COLOR_HISTORY_KEY) || [];
    const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    const newColors = { ...colors };

    for (const [key, val] of Object.entries(result)) {
      history.push({ key, previousValue: newColors[key] || '' });
      document.documentElement.style.setProperty(key, val);
      newColors[key] = val;
      pending[key] = val;
    }

    storage.set(COLOR_HISTORY_KEY, history);
    setColors(newColors);
    storage.set(PENDING_COLORS_KEY, pending);
    window.dispatchEvent(new Event('theme-pending-update'));
    setHarmonySchemeIndex(schemeIdx);
    setShuffleOpen(false);
    runAccessibilityAudit();
  };

  const handleGenerate = () => {
    const result = generateRandomPalette(colors, lockedKeys);
    const history = storage.get<{ key: string; previousValue: string }[]>(COLOR_HISTORY_KEY) || [];
    const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    const newColors = { ...colors };

    for (const [key, val] of Object.entries(result)) {
      history.push({ key, previousValue: newColors[key] || '' });
      document.documentElement.style.setProperty(key, val);
      newColors[key] = val;
      pending[key] = val;
    }

    storage.set(COLOR_HISTORY_KEY, history);
    setColors(newColors);
    storage.set(PENDING_COLORS_KEY, pending);
    window.dispatchEvent(new Event('theme-pending-update'));
    setHarmonySchemeIndex(-1);
    runAccessibilityAudit();
  };

  const handleReset = () => {
    EDITABLE_VARS.forEach(({ key }) => {
      document.documentElement.style.removeProperty(key);
    });
    storage.remove(THEME_COLORS_KEY);
    storage.remove(PENDING_COLORS_KEY);
    storage.remove(COLOR_HISTORY_KEY);
    readCurrentColors();
    setAuditStatus('idle');
    setAuditViolations([]);
    setViolationIndex(0);
    setGeneratedCode(null);
    setPrStatus('idle');
    setPrUrl(null);
    setPrError(null);
    window.dispatchEvent(new Event("theme-pending-update"));
  };

  // Auto-audit on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setTimeout(() => runAccessibilityAudit(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PortfolioLayout currentPage="design-system">
      <section className="pt-4 pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title row */}
          <div className="mb-8">
            <SectionHeader
              title={content.designSystem.title}
              subtitle={content.designSystem.subtitle}
              className=""
            />
            <p className="text-sm mt-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Explore the interactive design system powering this site. Pick a brand color and watch every token, including primary, secondary, accent, and more, transform in real time with automatic WCAG AA contrast correction.
            </p>
          </div>
          <div id="colors" className="scroll-mt-24">

            {/* Audit badges + action buttons */}
            <div className="flex flex-wrap items-stretch gap-2 mb-4">
              <div className="relative">
                <button
                  onClick={() => setShuffleOpen(!shuffleOpen)}
                  className="px-4 h-9 text-xs font-semibold rounded-lg transition-colors hover:opacity-80 flex items-center gap-1.5"
                  style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                  <span className="hidden sm:inline">Shuffle</span>
                  <svg className="hidden sm:block w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {shuffleOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShuffleOpen(false)} />
                    <div className="absolute left-0 top-full mt-1 z-50 min-w-[180px] rounded-lg shadow-lg py-1 border" style={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}>
                      {HARMONY_SCHEMES.map((scheme, idx) => (
                        <button
                          key={scheme}
                          onClick={() => handleRegenerate(idx)}
                          className="w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:opacity-80 flex items-center justify-between"
                          style={{ color: colors["--foreground"] && colors["--background"] && contrastRatio(colors["--foreground"], colors["--background"]) < 4.6 ? (colors["--background"] ? `hsl(${fgForBg(colors["--background"])})` : "hsl(var(--foreground))") : "hsl(var(--foreground))" }}
                        >
                          {scheme}
                          {idx === harmonySchemeIndex && <span style={{ color: colors["--background"] ? `hsl(${fgForBg(colors["--background"])})` : undefined }} aria-label="Selected">&#10003;</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleGenerate}
                className="px-4 h-9 text-xs font-semibold rounded-lg transition-colors hover:opacity-80 flex items-center gap-1"
                style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span className="hidden sm:inline">Generate New</span>
              </button>
              <button
                onClick={() => setShowResetModal(true)}
                className="px-4 h-9 text-xs font-semibold rounded-lg transition-colors hover:opacity-80 flex items-center gap-1"
                style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand))" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" /></svg>
                <span className="hidden sm:inline">Reset to Defaults</span>
              </button>
              <button
                onClick={() => generateCode()}
                className="px-4 h-9 text-xs font-semibold rounded-lg transition-colors hover:opacity-80 inline-flex items-center gap-1.5"
                style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand))" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <span className="hidden sm:inline">Show CSS</span>
              </button>
              <button
                disabled={prStatus === 'creating'}
                onClick={async () => {
                  setPrStatus('creating');
                  setPrUrl(null);
                  try {
                    // Build CSS from current colors
                    let css = ":root {\n";
                    EDITABLE_VARS.forEach(({ key }) => {
                      const val = colors[key];
                      if (val) css += `  ${key}: ${val};\n`;
                    });
                    css += "}";
                    const res = await fetch('/.netlify/functions/create-design-pr', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ css }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      if (res.status === 429) {
                        setPrStatus('rate-limited');
                        setPrError(data.error);
                        return;
                      }
                      throw new Error(data.error || 'Failed to create PR');
                    }
                    setPrStatus('created');
                    setPrUrl(data.url);
                    setPrError(null);
                    window.open(data.url, '_blank');
                  } catch {
                    setPrStatus('error');
                  }
                }}
                className={`px-4 h-9 text-xs font-semibold rounded-lg transition-colors hover:opacity-80 disabled:opacity-50 inline-flex items-center gap-1.5 ${
                  prStatus === 'error' || prStatus === 'rate-limited'
                    ? 'border border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : prStatus === 'created'
                      ? 'border border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : ''
                }`}
                style={prStatus !== 'error' && prStatus !== 'rate-limited' && prStatus !== 'created'
                  ? { backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "white" }
                  : undefined
                }
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                <span className="hidden sm:inline">{prStatus === 'creating' ? 'Preparing PR...' : prStatus === 'error' ? 'Retry PR' : prStatus === 'rate-limited' ? 'Retry PR' : 'Open PR'}</span>
              </button>
              {prStatus === 'rate-limited' && prError && (
                <span className="inline-flex items-center px-4 h-9 text-xs font-medium rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                  {prError}
                </span>
              )}
              {prStatus === 'created' && prUrl && (
                <span className="inline-flex items-center gap-2 px-4 h-9 text-xs font-medium rounded-lg border border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  PR Created!
                  <a
                    href={prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-green-900 dark:hover:text-green-100 transition-colors"
                  >
                    View PR
                  </a>
                  <button
                    onClick={() => { setPrStatus('idle'); setPrUrl(null); }}
                    className="ml-1 text-green-500 hover:text-green-800 dark:hover:text-green-100 transition-colors"
                    aria-label="Dismiss PR notification"
                  >
                    &#10005;
                  </button>
                </span>
              )}
              {auditStatus === 'running' && (
                <span aria-live="assertive" data-axe-exclude className="ml-auto flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 text-xs font-medium text-gray-600 dark:text-gray-300">
                  Running audit&hellip;
                </span>
              )}
              {auditStatus === 'passed' && (
                <span aria-live="assertive" data-axe-exclude className="ml-auto flex items-center gap-1 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 px-4 text-xs font-medium text-green-700 dark:text-green-300">
                  <span className="text-green-600 dark:text-green-400">&#10003;</span> <span className="hidden sm:inline">Passed WCAG AA</span><span className="sm:hidden">WCAG</span>
                </span>
              )}
            </div>
            {auditStatus === 'failed' && (
              <div aria-live="assertive" data-axe-exclude className="fixed bottom-4 right-4 z-50 flex justify-end">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 px-3 h-9 text-xs font-medium text-red-700 dark:text-red-300 shadow-lg">
                  <span>&#10007; {auditViolations.length} contrast issue{auditViolations.length !== 1 ? 's' : ''}</span>
                  <button
                    onClick={() => {
                      const idx = (violationIndex - 1 + auditViolations.length) % auditViolations.length;
                      setViolationIndex(idx);
                      scrollToViolation(auditViolations[idx]);
                    }}
                    className="text-red-600 dark:text-red-400 hover:opacity-70 disabled:opacity-30"
                    disabled={auditViolations.length <= 1}
                  >&#9664;</button>
                  <span className="text-[10px] tabular-nums">{violationIndex + 1}/{auditViolations.length}</span>
                  <button
                    onClick={() => {
                      const idx = (violationIndex + 1) % auditViolations.length;
                      setViolationIndex(idx);
                      scrollToViolation(auditViolations[idx]);
                    }}
                    className="text-red-600 dark:text-red-400 hover:opacity-70 disabled:opacity-30"
                    disabled={auditViolations.length <= 1}
                  >&#9654;</button>
                  <button
                    onClick={() => fixContrastIssues()}
                    className="ml-1 px-2 py-0.5 text-[10px] font-semibold rounded transition-colors hover:opacity-80 whitespace-nowrap"
                    style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}
                  >
                    Fix Contrast
                  </button>
                </span>
              </div>
            )}

            {/* Generated code output — above hero swatches */}
            {generatedCode && (
              <div className="mb-4 rounded-lg border border-border bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
                  <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Generated Theme</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 2000);
                      }}
                      className="px-2 py-0.5 text-[10px] font-semibold rounded-lg transition-colors hover:opacity-80"
                      style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    >
                      {codeCopied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={() => setGeneratedCode(null)}
                      className="px-2 py-0.5 text-[10px] font-semibold rounded-lg transition-colors hover:opacity-80"
                      style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
                <pre className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed text-foreground font-mono">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            )}

            {/* Hero colors row */}
            {(() => {
              const heroKeys = [
                { key: "--brand", label: "Brand" },
                { key: "--secondary", label: "Secondary" },
                { key: "--accent", label: "Tertiary" },
                { key: "--background", label: "Background" },
                { key: "--foreground", label: "Foreground" },
                { key: "--primary", label: "Primary" },
              ];
              const renderHeroSwatch = ({ key, label: displayLabel }: { key: string; label: string }) => {
                const inputId = `color-input-${key}`;
                const isLocked = lockedKeys.has(key);
                return (
                  <div
                    key={key}
                    data-color-key={key}
                    className="relative text-left group cursor-pointer"
                  >
                    <div
                      className="relative w-full aspect-square rounded-lg mb-1 transition-all overflow-hidden shadow-md group-hover:shadow-lg"
                      onClick={() => {
                        const input = document.getElementById(inputId) as HTMLInputElement | null;
                        input?.click();
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: colors[key]
                            ? `hsl(${colors[key]})`
                            : undefined,
                        }}
                      />
                      <div className="absolute inset-0">
                        {(() => {
                          const hsl = colors[key];
                          const bgHsl = hsl || "0 0% 50%";
                          const wc = contrastRatio("0 0% 100%", bgHsl);
                          const bc = contrastRatio("0 0% 0%", bgHsl);
                          const useWhite = wc >= bc;
                          const tc = useWhite ? "#ffffff" : "#000000";
                          const hex = hsl ? hslStringToHex(hsl) : "#000000";
                          return (
                            <div className="absolute bottom-1 left-1 min-w-0">
                              <p className="text-[9px] sm:text-xs font-semibold truncate" style={{ color: tc }}>
                                {hex}
                              </p>
                            </div>
                          );
                        })()}
                        <span className="absolute top-1 right-1 bg-white/90 dark:bg-black/70 text-gray-700 dark:text-gray-200 w-6 h-6 rounded-full shadow flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </span>
                      </div>
                      <input
                        id={inputId}
                        type="color"
                        aria-label={`Select ${displayLabel} color`}
                        value={colors[key] ? hslStringToHex(colors[key]) : "#000000"}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        onBlur={() => runAccessibilityAudit()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    {/* Lock toggle on corner */}
                    <button
                      type="button"
                      aria-label={isLocked ? `Unlock ${displayLabel}` : `Lock ${displayLabel}`}
                      className="absolute z-20 flex items-center justify-center cursor-pointer"
                      style={{ top: "-6px", left: "-6px", width: "32px", height: "32px", minWidth: "32px", minHeight: "32px", padding: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setLockedKeys(prev => {
                          const next = new Set(prev);
                          if (next.has(key)) next.delete(key);
                          else next.add(key);
                          return next;
                        });
                      }}
                    >
                      {isLocked ? (
                        <svg style={{ width: "18px", height: "18px", color: colors[key] ? `hsl(${fgForBg(colors[key])})` : undefined }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      ) : (
                        <svg className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ width: "18px", height: "18px", color: colors[key] ? `hsl(${fgForBg(colors[key])})` : undefined }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                        </svg>
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {displayLabel}
                      </p>
                    </div>
                  </div>
                );
              };
              return (
                <div className="grid grid-cols-6 gap-4 mb-4" data-axe-exclude>
                  {heroKeys.map((v) => renderHeroSwatch(v))}
                </div>
              );
            })()}

            <div className="flex flex-col xl:flex-row gap-6">
              {/* Color swatches (non-hero) */}
              <div className="xl:w-56 xl:flex-shrink-0 min-w-0 rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-xl p-4" style={{ background: "linear-gradient(135deg, hsl(var(--background) / 0.6), hsl(var(--background) / 0.3))", boxShadow: "0 4px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {content.designSystem.sections.colors}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {EDITABLE_VARS
                    .filter(v => !["--brand", "--secondary", "--accent", "--background", "--foreground", "--primary"].includes(v.key))
                    .map(({ key, label }) => {
                      const hsl = colors[key];
                      const bgHsl = hsl || "0 0% 50%";
                      const wc = contrastRatio("0 0% 100%", bgHsl);
                      const bc = contrastRatio("0 0% 0%", bgHsl);
                      const swatchTextColor = (wc >= bc) ? "#ffffff" : "#000000";
                      const hexCode = hsl ? hslStringToHex(hsl) : "";
                      return (
                      <div key={key} data-color-key={key} className="text-left">
                        <div className="relative w-full h-12 rounded-md mb-1 overflow-hidden flex items-center justify-center">
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundColor: hsl
                                ? `hsl(${hsl})`
                                : undefined,
                            }}
                          />
                          <span className="relative text-[9px] font-medium truncate px-0.5 hidden sm:inline" style={{ color: swatchTextColor }}>{hexCode}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {label}
                        </p>
                      </div>
                      );
                    })}
                </div>
              </div>

              {/* Chips, Buttons, Badges row */}
              <div className="flex flex-row xl:contents gap-3 min-w-0">
                {/* Chips column */}
                <div className="flex-1 min-w-0 xl:w-auto rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-xl p-4 space-y-3" style={{ background: "linear-gradient(135deg, hsl(var(--background) / 0.6), hsl(var(--background) / 0.3))", boxShadow: "0 4px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Chips</p>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "white" }}>Brand</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Muted</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>Accent</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</span>
                  </div>
                </div>

                {/* Buttons column */}
                <div className="flex-1 min-w-0 xl:w-auto rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-xl p-4 space-y-3" style={{ background: "linear-gradient(135deg, hsl(var(--background) / 0.6), hsl(var(--background) / 0.3))", boxShadow: "0 4px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Buttons</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "white" }}>Primary</button>
                    <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</button>
                    <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors max-w-full truncate" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand))" }}>Outlined</button>
                    <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors max-w-full truncate" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))" }}>Ghost</button>
                    <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</button>
                    <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Muted</button>
                    <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</button>
                    <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</button>
                  </div>
                </div>

                {/* Badges column */}
                <div className="flex-1 min-w-0 xl:w-auto rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-xl p-4 space-y-3" style={{ background: "linear-gradient(135deg, hsl(var(--background) / 0.6), hsl(var(--background) / 0.3))", boxShadow: "0 4px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Badges</p>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "white" }}>Brand</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Muted</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>Accent</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-border max-w-full truncate" style={{ color: "hsl(var(--muted-foreground))" }}>Outlined</span>
                  </div>
                </div>
              </div>

              {/* Icons column */}
              <div className="xl:flex-1 min-w-0 rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-xl p-4 space-y-4" style={{ background: "linear-gradient(135deg, hsl(var(--background) / 0.6), hsl(var(--background) / 0.3))", boxShadow: "0 4px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Icons</p>
                <div className="grid grid-cols-3 gap-2 place-items-center">
                  <Suspense fallback={null}>
                    {SITE_ICONS.map(({ name, icon: Icon }) => (
                      <div key={name} className="bg-brand-dynamic/10 dark:bg-brand-dynamic/20 hover:bg-brand-dynamic/20 dark:hover:bg-brand-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center" title={name}>
                        <Icon className="h-5 w-5 text-brand-dynamic" aria-label={name} role="img" />
                      </div>
                    ))}
                  </Suspense>
                </div>
              </div>

            </div>


            {/* Reset Confirmation Modal */}
            {showResetModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
                  <h4 id="reset-modal-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Reset to Defaults?
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    This will revert all theme colors to their original values. Any saved customizations will be lost.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowResetModal(false)}
                      className="px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors hover:opacity-80"
                      style={{ backgroundColor: "transparent", color: "hsl(var(--brand))" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { handleReset(); setShowResetModal(false); }}
                      className="px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors hover:opacity-80"
                      style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </PortfolioLayout>
  );
}

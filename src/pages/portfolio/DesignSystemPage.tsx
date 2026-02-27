import { useState, useEffect, useCallback, lazy, Suspense } from "react";
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
}

// When brand or secondary changes, derive related palette colors by shifting hue
export const derivePaletteFromChange = (
    changedKey: string,
    newHsl: string,
    currentColors: Record<string, string>,
  ): Record<string, string> => {
    const derived: Record<string, string> = {};
    const parts = newHsl.trim().split(/\s+/);
    if (parts.length < 3) return derived;
    const newHue = parseFloat(parts[0]);

    const shiftHue = (varKey: string, sat: number, light: number) => {
      derived[varKey] = `${newHue.toFixed(1)} ${sat.toFixed(1)}% ${light.toFixed(1)}%`;
    };

    // Parse existing value to preserve saturation/lightness when possible
    const getExisting = (varKey: string): { h: number; s: number; l: number } | null => {
      const val = currentColors[varKey];
      if (!val) return null;
      const p = val.trim().split(/\s+/);
      if (p.length < 3) return null;
      return { h: parseFloat(p[0]), s: parseFloat(p[1]), l: parseFloat(p[2]) };
    };

    const shiftExisting = (varKey: string) => {
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
      const destSat = Math.min(100, newSat * 1.1); // slightly more vivid than brand
      const destLight = Math.max(35, Math.min(55, newLight * 0.85));
      derived["--destructive"] = `0 ${destSat.toFixed(1)}% ${destLight.toFixed(1)}%`;
      derived["--destructive-foreground"] = `0 0% 100%`;

      // Success (green family): hue 142, saturation follows brand
      const succSat = Math.min(100, newSat * 0.9);
      const succLight = Math.max(35, Math.min(55, newLight * 0.8));
      derived["--success"] = `142 ${succSat.toFixed(1)}% ${succLight.toFixed(1)}%`;
      derived["--success-foreground"] = `0 0% 100%`;

      // Warning (yellow/amber family): hue 45, saturation follows brand
      const warnSat = Math.min(100, newSat * 1.05);
      const warnLight = Math.max(40, Math.min(60, newLight * 0.9));
      derived["--warning"] = `45 ${warnSat.toFixed(1)}% ${warnLight.toFixed(1)}%`;
      derived["--warning-foreground"] = `0 0% 0%`;
    };

    if (changedKey === "--brand") {
      // Primary family: adopt brand hue
      shiftHue("--primary", 83.2, 48);
      shiftHue("--primary-foreground", 40, 98);
      // Ring
      shiftHue("--ring", 83.2, 53.3);
      // Secondary/muted/accent: shift hue, keep their saturation/lightness
      shiftExisting("--secondary");
      shiftExisting("--secondary-foreground");
      shiftExisting("--muted");
      shiftExisting("--muted-foreground");
      shiftExisting("--accent");
      shiftExisting("--accent-foreground");
      shiftExisting("--border");
      shiftExisting("--foreground");
      deriveSemanticColors();
    } else if (changedKey === "--secondary") {
      // Accent and muted follow secondary's hue, brand stays unchanged
      shiftExisting("--secondary-foreground");
      shiftExisting("--accent");
      shiftExisting("--accent-foreground");
      shiftExisting("--muted");
      shiftExisting("--muted-foreground");
      shiftExisting("--border");
      shiftExisting("--foreground");
      deriveSemanticColors();
    } else if (changedKey === "--accent") {
      // Accent change: muted follows accent hue, brand/secondary stay unchanged
      shiftExisting("--accent-foreground");
      shiftExisting("--muted");
      shiftExisting("--muted-foreground");
      shiftExisting("--border");
      deriveSemanticColors();
    }

    return derived;
  };

export const autoAdjustContrast = (
    newColors: Record<string, string>,
  ): Record<string, string> => {
    const adjustments: Record<string, string> = {};
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
    if (brandVal && bgVal && contrastRatio(brandVal, bgVal) < 4.5) {
      const bg = parseHsl(bgVal);
      const brand = parseHsl(brandVal);
      if (bg && brand) {
        // Try adjusting brand lightness first (darken if bg is light, lighten if bg is dark)
        const brandDir = bg.l > 50 ? -3 : 3;
        let bl = brand.l;
        let adjBrand = toHsl(brand.h, brand.s, bl);
        for (let i = 0; i < 34; i++) {
          bl = Math.max(0, Math.min(100, bl + brandDir));
          adjBrand = toHsl(brand.h, brand.s, bl);
          if (contrastRatio(adjBrand, bgVal) >= 4.5) break;
        }
        if (contrastRatio(adjBrand, bgVal) >= 4.5) {
          adjustments["--brand"] = adjBrand;
          working["--brand"] = adjBrand;
          brandVal = adjBrand;
        } else {
          // Fallback: adjust background if brand adjustment wasn't enough
          const bgDir = brand.l > 50 ? -3 : 3;
          let bgL = bg.l;
          let adjBg = toHsl(bg.h, bg.s, bgL);
          for (let i = 0; i < 34; i++) {
            bgL = Math.max(0, Math.min(100, bgL + bgDir));
            adjBg = toHsl(bg.h, bg.s, bgL);
            if (contrastRatio(brandVal, adjBg) >= 4.5) break;
          }
          adjustments["--background"] = adjBg;
          working["--background"] = adjBg;
        }
      }
    }

    // Check all foreground/background contrast pairs — adjust foreground
    for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
      const fgVal = working[fgKey];
      const bgv = working[bgKey];
      if (!fgVal || !bgv) continue;
      if (contrastRatio(fgVal, bgv) >= 4.5) continue;

      const fg = parseHsl(fgVal);
      const bg = parseHsl(bgv);
      if (!fg || !bg) continue;

      // Choose direction: make foreground lighter if bg is dark, darker if bg is light
      const direction = bg.l > 50 ? -3 : 3;
      let l = fg.l;
      let adjusted = toHsl(fg.h, fg.s, l);
      for (let i = 0; i < 34; i++) {
        l = Math.max(0, Math.min(100, l + direction));
        adjusted = toHsl(fg.h, fg.s, l);
        if (contrastRatio(adjusted, bgv) >= 4.5) break;
      }

      // If we hit the limit and still fail, try the opposite direction for foreground
      if (contrastRatio(adjusted, bgv) < 4.5) {
        l = fg.l;
        const oppDir = -direction;
        for (let i = 0; i < 34; i++) {
          l = Math.max(0, Math.min(100, l + oppDir));
          adjusted = toHsl(fg.h, fg.s, l);
          if (contrastRatio(adjusted, bgv) >= 4.5) break;
        }
      }

      // If foreground adjustment alone isn't enough, adjust the background
      if (contrastRatio(adjusted, bgv) < 4.5) {
        const bgDir = fg.l > 50 ? -3 : 3;
        let bgL = bg.l;
        let adjBg = toHsl(bg.h, bg.s, bgL);
        for (let i = 0; i < 34; i++) {
          bgL = Math.max(0, Math.min(100, bgL + bgDir));
          adjBg = toHsl(bg.h, bg.s, bgL);
          if (contrastRatio(adjusted, adjBg) >= 4.5) break;
        }
        if (contrastRatio(adjusted, adjBg) >= 4.5) {
          adjustments[bgKey] = adjBg;
          working[bgKey] = adjBg;
        }
      }

      adjustments[fgKey] = adjusted;
      working[fgKey] = adjusted;
    }
    return adjustments;
};

export const HARMONY_SCHEMES = ['complementary', 'analogous', 'triadic', 'split-complementary'] as const;
export type HarmonyScheme = typeof HARMONY_SCHEMES[number];

export const generateHarmonyPalette = (
  brandHsl: string,
  scheme: HarmonyScheme,
  currentColors: Record<string, string>,
): Record<string, string> => {
  const parts = brandHsl.trim().split(/\s+/);
  if (parts.length < 3) return {};

  const hue = parseFloat(parts[0]);
  const sat = parseFloat(parts[1]);
  const light = parseFloat(parts[2]);

  let secHueOffset: number;
  let accHueOffset: number;

  switch (scheme) {
    case 'complementary':
      secHueOffset = 180;
      accHueOffset = 150;
      break;
    case 'analogous':
      secHueOffset = 30;
      accHueOffset = -30;
      break;
    case 'triadic':
      secHueOffset = 120;
      accHueOffset = 240;
      break;
    case 'split-complementary':
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

  const secondaryHsl = `${secHue.toFixed(1)} ${secSat.toFixed(1)}% ${secLight.toFixed(1)}%`;
  const accentHsl = `${accHue.toFixed(1)} ${accSat.toFixed(1)}% ${accLight.toFixed(1)}%`;

  // Start with current colors, apply secondary then accent derivations
  let merged: Record<string, string> = { ...currentColors, '--secondary': secondaryHsl };
  const secDerived = derivePaletteFromChange('--secondary', secondaryHsl, merged);
  merged = { ...merged, ...secDerived, '--accent': accentHsl };
  const accDerived = derivePaletteFromChange('--accent', accentHsl, merged);
  merged = { ...merged, ...accDerived };

  // Collect only the changed keys
  const result: Record<string, string> = { '--secondary': secondaryHsl, '--accent': accentHsl, ...secDerived, ...accDerived };

  // Auto-adjust contrast
  const fullColors = { ...currentColors, ...result };
  const adjustments = autoAdjustContrast(fullColors);
  Object.assign(result, adjustments);

  return result;
};

export default function DesignSystemPage() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [auditStatus, setAuditStatus] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');
  const [auditViolations, setAuditViolations] = useState<{ selector: string; text: string }[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [prStatus, setPrStatus] = useState<'idle' | 'creating' | 'created' | 'error' | 'rate-limited'>('idle');
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [prError, setPrError] = useState<string | null>(null);
  const [harmonySchemeIndex, setHarmonySchemeIndex] = useState(0);
  const [shuffleOpen, setShuffleOpen] = useState(false);

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

  const setAuditFromResults = (results: AxeResults) => {
    if (results.violations.length === 0) {
      setAuditStatus('passed');
      setAuditViolations([]);
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
    }
  };

  const runAccessibilityAudit = async () => {
    setAuditStatus('running');
    setAuditViolations([]);
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

        const fixes = autoAdjustContrast(liveColors);
        if (Object.keys(fixes).length > 0) {
          const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
          const updatedColors = { ...liveColors };
          for (const [fixKey, fixVal] of Object.entries(fixes)) {
            document.documentElement.style.setProperty(fixKey, fixVal);
            updatedColors[fixKey] = fixVal;
            pending[fixKey] = fixVal;
          }
          storage.set(PENDING_COLORS_KEY, pending);
          setColors(updatedColors);
          window.dispatchEvent(new Event("theme-pending-update"));
        }

        // 2. Fix per-element contrast violations reported by axe
        const contrastViolation = initialResults.violations.find((v) => v.id === 'color-contrast');
        if (contrastViolation) {
          const parseRgb = (rgb: string): [number, number, number] | null => {
            const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (!m) return null;
            return [parseInt(m[1]) / 255, parseInt(m[2]) / 255, parseInt(m[3]) / 255];
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

          for (const node of contrastViolation.nodes) {
            const el = document.querySelector(node.target[0] as string) as HTMLElement | null;
            if (!el) continue;
            const computed = getComputedStyle(el);
            const fg = parseRgb(computed.color);
            const bg = parseRgb(computed.backgroundColor);
            if (!fg || !bg) continue;
            const bgLum = lum(...bg);
            const ratio = (Math.max(lum(...fg), bgLum) + 0.05) / (Math.min(lum(...fg), bgLum) + 0.05);
            if (ratio >= 4.5) continue;
            const fgHsl = rgbToHsl(...fg);
            const dir = bgLum > 0.5 ? -0.03 : 0.03;
            for (let i = 0; i < 40; i++) {
              fgHsl.l = Math.max(0, Math.min(1, fgHsl.l + dir));
              const newFg = [0, 0, 0] as [number, number, number];
              const a = fgHsl.s * Math.min(fgHsl.l, 1 - fgHsl.l);
              for (let ci = 0; ci < 3; ci++) {
                const n = [0, 8, 4][ci];
                const k = (n + fgHsl.h * 12) % 12;
                newFg[ci] = fgHsl.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
              }
              const newRatio = (Math.max(lum(...newFg), bgLum) + 0.05) / (Math.min(lum(...newFg), bgLum) + 0.05);
              if (newRatio >= 4.5) {
                el.style.color = hslToRgbStr(fgHsl.h, fgHsl.s, fgHsl.l);
                break;
              }
            }
          }
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
      const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};

      const fixPair = (fgKey: string, bgKey: string) => {
        const fgVal = working[fgKey];
        const bgv = working[bgKey];
        if (!fgVal || !bgv || contrastRatio(fgVal, bgv) >= 4.5) return;
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
            if (contrastRatio(adjusted, bgv) >= 4.5) break;
          }
          if (contrastRatio(adjusted, bgv) >= 4.5) {
            document.documentElement.style.setProperty(fgKey, adjusted);
            working[fgKey] = adjusted;
            pending[fgKey] = adjusted;
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
            if (contrastRatio(working[fgKey], adjBg) >= 4.5) break;
          }
          if (contrastRatio(working[fgKey], adjBg) >= 4.5) {
            document.documentElement.style.setProperty(bgKey, adjBg);
            working[bgKey] = adjBg;
            pending[bgKey] = adjBg;
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

      storage.set(PENDING_COLORS_KEY, pending);
      setColors(working);
      window.dispatchEvent(new Event("theme-pending-update"));

      // 2. Fresh audit — then fix remaining per-element violations
      const midResults = await runAudit();
      const contrastViolation = midResults.violations.find((v) => v.id === 'color-contrast');
      if (contrastViolation) {
        const parseRgb = (rgb: string): [number, number, number] | null => {
          const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (!m) return null;
          return [parseInt(m[1]) / 255, parseInt(m[2]) / 255, parseInt(m[3]) / 255];
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

        for (const node of contrastViolation.nodes) {
          const el = document.querySelector(node.target[0] as string) as HTMLElement | null;
          if (!el) continue;
          const computed = getComputedStyle(el);
          const fg = parseRgb(computed.color);
          const bg = parseRgb(computed.backgroundColor);
          if (!fg || !bg) continue;
          const bgLum = lum(...bg);
          const fgLum = lum(...fg);
          const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
          if (ratio >= 4.5) continue;
          const fgHsl = rgbToHsl(...fg);
          // Try both directions for per-element fix
          let fixed = false;
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
              if (newRatio >= 4.5) {
                el.style.color = hslToRgbStr(tryHsl.h, tryHsl.s, tryHsl.l);
                fixed = true;
                break;
              }
            }
            if (fixed) break;
          }
        }
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

    // Derive palette when brand or secondary changes
    if (key === "--brand" || key === "--secondary" || key === "--accent") {
      const derived = derivePaletteFromChange(key, hsl, newColors);
      for (const [dKey, dVal] of Object.entries(derived)) {
        history.push({ key: dKey, previousValue: newColors[dKey] || "" });
        document.documentElement.style.setProperty(dKey, dVal);
        newColors[dKey] = dVal;
        pending[dKey] = dVal;
      }
    }

    // Auto-adjust contrast across all pairs
    const adjustments = autoAdjustContrast(newColors);
    for (const [adjKey, adjVal] of Object.entries(adjustments)) {
      history.push({ key: adjKey, previousValue: newColors[adjKey] || "" });
      document.documentElement.style.setProperty(adjKey, adjVal);
      newColors[adjKey] = adjVal;
      pending[adjKey] = adjVal;
    }

    storage.set(COLOR_HISTORY_KEY, history);
    setColors(newColors);
    storage.set(PENDING_COLORS_KEY, pending);
    window.dispatchEvent(new Event("theme-pending-update"));

  };

  const handleRegenerate = (schemeIdx: number) => {
    const scheme = HARMONY_SCHEMES[schemeIdx];
    const brandHsl = colors['--brand'];
    if (!brandHsl) return;

    const result = generateHarmonyPalette(brandHsl, scheme, colors);
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
    setGeneratedCode(null);
    setPrStatus('idle');
    setPrUrl(null);
    setPrError(null);
    window.dispatchEvent(new Event("theme-pending-update"));
  };

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
            <p className="text-muted-foreground text-sm mt-2">
              Explore the interactive design system powering this site. Pick a brand color and watch every token, including primary, secondary, accent, and more, transform in real time with automatic WCAG AA contrast correction.
            </p>
          </div>
          <div id="colors" className="scroll-mt-24">

            {/* Audit badges + action buttons */}
            <div className="flex flex-wrap items-stretch gap-2 mb-4">
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
              {auditStatus === 'failed' && (
                <div aria-live="assertive" data-axe-exclude className="rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 px-4 py-2 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <p className="text-xs font-medium text-red-700 dark:text-red-300">
                    &#10007; {auditViolations.length} contrast issue{auditViolations.length !== 1 ? 's' : ''}:
                  </p>
                  <ul className="text-[10px] text-red-600 dark:text-red-400 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    {auditViolations.map((v, i) => (
                      <li
                        key={i}
                        className="cursor-pointer hover:underline"
                        onClick={() => {
                          const el = document.querySelector(v.selector) as HTMLElement | null;
                          if (!el) return;
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          el.style.outline = '3px solid hsl(0 84% 60%)';
                          el.style.outlineOffset = '2px';
                          setTimeout(() => {
                            el.style.outline = '';
                            el.style.outlineOffset = '';
                          }, 3000);
                        }}
                      >
                        <span className="font-medium">Item {i + 1}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => fixContrastIssues()}
                    className="ml-auto px-3 py-1 text-[10px] font-semibold rounded-lg transition-colors hover:opacity-80 whitespace-nowrap"
                    style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}
                  >
                    Fix Contrast
                  </button>
                </div>
              )}
              <div className="basis-full h-0" />
              <div className="relative">
                <button
                  onClick={() => setShuffleOpen(!shuffleOpen)}
                  className="px-4 h-9 text-xs font-semibold rounded-lg transition-colors hover:opacity-80 flex items-center gap-1.5"
                  style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}
                >
                  <span className="hidden sm:inline">Shuffle</span><span className="sm:hidden">Shuffle</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M6 9l6 6 6-6" /></svg>
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
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          {scheme}
                          {idx === harmonySchemeIndex && <span className="text-green-600 dark:text-green-400">&#10003;</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowResetModal(true)}
                className="px-4 h-9 text-xs font-semibold rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand))" }}
              >
                <span className="hidden sm:inline">Reset to Defaults</span><span className="sm:hidden">Reset</span>
              </button>
              <button
                onClick={() => generateCode()}
                className="px-4 h-9 text-xs font-semibold rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand))" }}
              >
                <span className="hidden sm:inline">Generate CSS</span><span className="sm:hidden">CSS</span>
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
                className={`px-4 h-9 text-xs font-semibold rounded-lg transition-colors hover:opacity-80 disabled:opacity-50 ${
                  prStatus === 'error' || prStatus === 'rate-limited'
                    ? 'border border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : prStatus === 'created'
                      ? 'border border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : ''
                }`}
                style={prStatus !== 'error' && prStatus !== 'rate-limited' && prStatus !== 'created'
                  ? { backgroundColor: "hsl(var(--brand))", color: "white" }
                  : undefined
                }
              >
                {prStatus === 'creating' ? 'Preparing PR...' : prStatus === 'error' ? 'Retry PR' : prStatus === 'rate-limited' ? 'Retry PR' : 'Open PR'}
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
            </div>

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

            {/* Hero colors row: Brand, Secondary, Tertiary */}
            {(() => {
              const renderHeroSwatch = ({ key }: { key: string; label: string }) => {
                const isEditable = key === "--brand";
                const displayLabel = key === "--brand" ? "Brand" : key === "--secondary" ? "Secondary" : "Tertiary";
                const inputId = `color-input-${key}`;
                return (
                  <div
                    key={key}
                    data-color-key={key}
                    className={`text-left flex-1 ${isEditable ? "group cursor-pointer" : ""}`}
                    onClick={isEditable ? () => {
                      const input = document.getElementById(inputId) as HTMLInputElement | null;
                      input?.click();
                    } : undefined}
                  >
                    <div className={`relative w-full h-20 rounded-lg mb-1 transition-all overflow-hidden ${isEditable ? "ring-2 ring-brand-dynamic shadow-md group-hover:ring-4 group-hover:shadow-lg border-2 border-white dark:border-gray-900" : "border border-border"}`}>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: colors[key]
                            ? `hsl(${colors[key]})`
                            : undefined,
                        }}
                      />
                      {isEditable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-white/90 dark:bg-black/70 text-gray-700 dark:text-gray-200 text-[10px] font-semibold w-6 h-6 sm:w-auto sm:h-auto sm:px-2 sm:py-1 rounded-full shadow flex items-center justify-center sm:justify-start gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span className="hidden sm:inline">Click to edit</span>
                          </span>
                        </div>
                      )}
                      {isEditable && (
                        <input
                          id={inputId}
                          type="color"
                          aria-label={`Select ${displayLabel} color`}
                          value={colors[key] ? hslStringToHex(colors[key]) : "#000000"}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          onBlur={() => runAccessibilityAudit()}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {displayLabel}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {colors[key] ? hslStringToHex(colors[key]) : key}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              };
              const heroKeys = [
                { key: "--brand", label: "Brand Blue" },
                { key: "--secondary", label: "Secondary" },
                { key: "--accent", label: "Tertiary" },
              ];
              return (
                <div className="flex gap-4 mb-4">
                  {heroKeys.map((v) => renderHeroSwatch(v))}
                </div>
              );
            })()}

            <div className="flex flex-col xl:flex-row gap-6">
              {/* Color swatches (non-hero) */}
              <div className="xl:flex-1 min-w-0 rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {content.designSystem.sections.colors}
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {EDITABLE_VARS
                    .filter(v => v.key !== "--brand" && v.key !== "--secondary" && v.key !== "--accent")
                    .map(({ key, label }) => (
                      <div key={key} data-color-key={key} className="text-left">
                        <div className="relative w-full h-12 rounded-md mb-1 border border-border overflow-hidden">
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundColor: colors[key]
                                ? `hsl(${colors[key]})`
                                : undefined,
                            }}
                          />
                        </div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {label}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {colors[key] ? hslStringToHex(colors[key]) : key}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Chips, Buttons, Badges row */}
              <div className="flex flex-row xl:contents gap-3 min-w-0">
                {/* Chips column */}
                <div className="flex-1 min-w-0 xl:w-auto rounded-lg border border-border bg-background p-4 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Chips</p>
                  <div className="flex flex-col gap-2 items-start">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: "white" }}>Brand</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Muted</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>Accent</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</span>
                  </div>
                </div>

                {/* Buttons column */}
                <div className="flex-1 min-w-0 xl:w-auto rounded-lg border border-border bg-background p-4 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Buttons</p>
                  <div className="flex flex-col gap-2 items-start">
                    <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: "white" }}>Primary</button>
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
                <div className="flex-1 min-w-0 xl:w-auto rounded-lg border border-border bg-background p-4 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Badges</p>
                  <div className="flex flex-col gap-2 items-start">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: "white" }}>Brand</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Muted</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>Accent</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-border text-muted-foreground max-w-full truncate">Outlined</span>
                  </div>
                </div>
              </div>

              {/* Icons column */}
              <div className="xl:flex-1 min-w-0 rounded-lg border border-border bg-background p-4 space-y-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Icons</p>
                <div className="grid grid-cols-3 gap-0.5">
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

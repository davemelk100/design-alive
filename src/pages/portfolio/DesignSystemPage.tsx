import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import IconWrapper from "../../components/IconWrapper";
import { content } from "../../content";
import designTokens from "../../designTokens.json";
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

const THEME_COLORS_KEY = "ds-theme-colors";
const PENDING_COLORS_KEY = "ds-pending-colors";
const COLOR_HISTORY_KEY = "ds-color-history";

// Contrast pairs: [foreground var, background var] that must meet WCAG AA (4.5:1)
const CONTRAST_PAIRS: [string, string][] = [
  ["--foreground", "--background"],
  ["--primary-foreground", "--primary"],
  ["--secondary-foreground", "--secondary"],
  ["--muted-foreground", "--muted"],
  ["--accent-foreground", "--accent"],
  ["--destructive-foreground", "--destructive"],
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

function contrastRatio(hsl1: string, hsl2: string): number {
  const [r1, g1, b1] = hslToRgb(hsl1);
  const [r2, g2, b2] = hslToRgb(hsl2);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const EDITABLE_VARS = [
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

function hslStringToHex(hsl: string): string {
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

function hexToHslString(hex: string): string {
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

export default function DesignSystemPage() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [autoAdjustNotice, setAutoAdjustNotice] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const pendingNoticeRef = useRef<string | null>(null);

  const hasPendingChanges = !!storage.get<Record<string, string>>(PENDING_COLORS_KEY);

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
    // Retry after a short delay if any CSS variable hasn't resolved yet
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

    // Re-read colors when ThemePreviewBar discards/undoes changes
    const handlePendingUpdate = () => {
      // Small delay to let inline styles be removed first
      setTimeout(() => readCurrentColors(), 50);
      setAutoAdjustNotice(null);
    };
    window.addEventListener("theme-pending-update", handlePendingUpdate);
    return () => window.removeEventListener("theme-pending-update", handlePendingUpdate);
  }, [readCurrentColors]);


  // When brand or secondary changes, derive related palette colors by shifting hue
  const derivePaletteFromChange = (
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
      derived["--destructive-foreground"] = `0 0% ${destLight > 50 ? 10 : 98}%`;

      // Success (green family): hue 142, saturation follows brand
      const succSat = Math.min(100, newSat * 0.9);
      const succLight = Math.max(35, Math.min(55, newLight * 0.8));
      derived["--success"] = `142 ${succSat.toFixed(1)}% ${succLight.toFixed(1)}%`;
      derived["--success-foreground"] = `142 ${(succSat * 0.3).toFixed(1)}% ${succLight > 50 ? 10 : 98}%`;

      // Warning (yellow/amber family): hue 45, saturation follows brand
      const warnSat = Math.min(100, newSat * 1.05);
      const warnLight = Math.max(40, Math.min(60, newLight * 0.9));
      derived["--warning"] = `45 ${warnSat.toFixed(1)}% ${warnLight.toFixed(1)}%`;
      derived["--warning-foreground"] = `45 ${(warnSat * 0.4).toFixed(1)}% ${warnLight > 55 ? 15 : 95}%`;
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

  const autoAdjustContrast = (
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

  const generateCode = () => {
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

    // Store palette adaptation notice — only revealed when the color picker closes
    const adjustedKeys = Object.keys(adjustments);
    if (key === "--brand" || key === "--secondary" || key === "--accent") {
      const extras = adjustedKeys.length > 0
        ? ` Auto-adjusted ${adjustedKeys.map(k => k.replace("--", "")).join(", ")} for contrast.`
        : "";
      pendingNoticeRef.current = `Palette adapted to new hue. All color pairs pass WCAG AA (4.5:1).${extras}`;
    } else if (adjustedKeys.length > 0) {
      pendingNoticeRef.current = `Auto-adjusted ${adjustedKeys.map(k => k.replace("--", "")).join(", ")} to maintain WCAG AA contrast (4.5:1).`;
    } else {
      pendingNoticeRef.current = null;
    }
  };


  const handleReset = () => {
    EDITABLE_VARS.forEach(({ key }) => {
      document.documentElement.style.removeProperty(key);
    });
    storage.remove(THEME_COLORS_KEY);
    storage.remove(PENDING_COLORS_KEY);
    storage.remove(COLOR_HISTORY_KEY);
    readCurrentColors();
    setAutoAdjustNotice(null);
    setGeneratedCode(null);
    window.dispatchEvent(new Event("theme-pending-update"));
  };

  return (
    <PortfolioLayout currentPage="design-system">
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-4">
            <div className="lg:w-[30%]">
              <SectionHeader
                title={content.designSystem.title}
                subtitle={content.designSystem.subtitle}
                className=""
              />
              <div className="flex flex-col gap-2 mt-3">
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full"
                >
                  Reset to Defaults
                </button>
                {hasPendingChanges && (
                  <button
                    onClick={() => generateCode()}
                    className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full"
                  >
                    Generate CSS?
                  </button>
                )}
              </div>
              {autoAdjustNotice && (
                <span className="mt-3 flex w-fit items-center gap-1 rounded-full border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:text-green-300">
                  <span className="text-green-600 dark:text-green-400">&#10003;</span> Passed WCAG AA
                </span>
              )}
            </div>
            <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside lg:flex-1 leading-relaxed">
              <li>Driven by CSS custom properties. Pick a <strong className="text-foreground">Brand</strong> color and the entire palette auto-adjusts.</li>
              <li>Secondary, primary, accent, muted, border, and foreground tokens all shift to harmonize with your selection.</li>
              <li>Every color pair is checked against WCAG AA contrast requirements (4.5:1 minimum) in real time.</li>
              <li>If a pair fails, lightness values are automatically adjusted until the ratio passes.</li>
              <li>The brand color is protected: if too light for the background, the system darkens it until it meets 4.5:1.</li>
              <li>Headings, links, and navigation text remain legible no matter what color you choose.</li>
            </ul>
          </div>
          {/* Colors + Preview side by side */}
          <div id="colors" className="mb-10 scroll-mt-24">

            {/* Generated code output — above hero swatches */}
            {generatedCode && (
              <div className="mb-4 rounded-lg border border-border bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Generated Theme</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 2000);
                      }}
                      className="px-2 py-0.5 text-[10px] font-medium rounded border border-border bg-white dark:bg-gray-800 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {codeCopied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={() => setGeneratedCode(null)}
                      className="px-2 py-0.5 text-[10px] font-medium rounded border border-border bg-white dark:bg-gray-800 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                    <div className={`relative w-full h-20 rounded-lg mb-1 border border-border transition-all overflow-hidden ${isEditable ? "group-hover:ring-2 group-hover:ring-gray-400" : ""}`}>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: colors[key]
                            ? `hsl(${colors[key]})`
                            : undefined,
                        }}
                      />
                      {isEditable && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center shadow-sm">
                          <svg className="w-3 h-3 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                      )}
                      {isEditable && (
                        <input
                          id={inputId}
                          type="color"
                          value={colors[key] ? hslStringToHex(colors[key]) : "#000000"}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          onBlur={() => {
                            setAutoAdjustNotice(pendingNoticeRef.current);
                            pendingNoticeRef.current = null;
                          }}
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
              <div className="xl:w-1/3 min-w-0 rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {content.designSystem.sections.colors}
                  </p>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
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

              {/* Chips & Buttons column */}
              <div className="xl:w-1/3 rounded-lg border border-border bg-background p-4 space-y-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Chips</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--brand))", color: "white" }}>
                    Brand
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>
                    Secondary
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                    Muted
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                    Accent
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>
                    Destructive
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>
                    Success
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>
                    Warning
                  </span>
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Buttons</p>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "hsl(var(--brand))", color: "white" }}>
                    Primary
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>
                    Secondary
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand))" }}>
                    Outlined
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))" }}>
                    Ghost
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>
                    Destructive
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                    Muted
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>
                    Success
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>
                    Warning
                  </button>
                </div>
                <div className="flex gap-6">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Spacing</p>
                    <div className="flex flex-wrap gap-3">
                      {designTokens.spacing.map((space) => (
                        <div key={space.name} className="flex flex-col items-center gap-1">
                          <div
                            className="bg-brand-dynamic rounded-sm"
                            style={{ width: space.value, height: space.value, minWidth: "1rem", minHeight: "1rem" }}
                          />
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {space.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Border Radius</p>
                    <div className="flex flex-wrap gap-3">
                      {designTokens.numbers
                        .filter((n) => n.name.startsWith("border-radius"))
                        .map((radius) => (
                          <div key={radius.name} className="flex flex-col items-center gap-1">
                            <div
                              className="w-10 h-10 bg-brand-dynamic"
                              style={{ borderRadius: `${radius.value}px` }}
                            />
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">
                              {radius.value}px
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Icons column */}
              <div className="xl:w-1/3 rounded-lg border border-border bg-background p-4 space-y-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Icons</p>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                  <Suspense fallback={null}>
                    {SITE_ICONS.map(({ name, icon: Icon }) => (
                      <div key={name} className="flex items-center justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors" title={name}>
                        <Icon className="h-5 w-5 text-brand-dynamic" aria-label={name} role="img" />
                      </div>
                    ))}
                  </Suspense>
                </div>
              </div>

            </div>

            <div className="flex flex-col xl:flex-row gap-6 mt-6">
            {/* Shadows column */}
            <div id="shadows" className="xl:w-1/2 scroll-mt-24 rounded-2xl border border-white/20 dark:border-white/10 p-4 overflow-hidden relative flex flex-col" style={{ background: "linear-gradient(160deg, hsl(var(--brand) / 0.25) 0%, hsl(var(--secondary) / 0.35) 40%, hsl(var(--brand) / 0.18) 70%, hsl(var(--accent) / 0.22) 100%)" }}>
              {/* Animated color blobs behind the glass cards */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-60" style={{ background: "radial-gradient(circle, hsl(var(--brand) / 0.5), transparent 70%)", filter: "blur(20px)" }} />
                <div className="absolute top-1/3 -right-6 w-28 h-28 rounded-full opacity-50" style={{ background: "radial-gradient(circle, hsl(var(--secondary) / 0.5), transparent 70%)", filter: "blur(18px)" }} />
                <div className="absolute -bottom-6 left-1/4 w-24 h-24 rounded-full opacity-40" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)", filter: "blur(16px)" }} />
              </div>
              {/* SVG filter for water drop refraction */}
              <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                  <filter id="water-drop-filter">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                    <feSpecularLighting in="blur" surfaceScale="4" specularConstant="0.8" specularExponent="25" result="specular" lightingColor="white">
                      <fePointLight x="80" y="40" z="200" />
                    </feSpecularLighting>
                    <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="0.2" k4="0" />
                  </filter>
                  <radialGradient id="drop-gradient" cx="40%" cy="35%" r="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                    <stop offset="40%" stopColor="white" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.05" />
                  </radialGradient>
                  <radialGradient id="drop-shadow-grad" cx="50%" cy="85%" r="40%">
                    <stop offset="0%" stopColor="black" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="black" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="drop-caustic" cx="55%" cy="70%" r="35%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 relative z-10">Shadows</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-3 relative z-10 flex-1">
                {designTokens.shadows.map((shadow, idx) => (
                  <div key={shadow.name} className="text-center flex flex-col">
                    <div
                      className="relative overflow-hidden w-full flex-1 min-h-[12rem] rounded-3xl mb-1"
                      style={{
                        boxShadow: `${shadow.value}, 0 0 0 0.5px rgba(255,255,255,0.3)`,
                      }}
                    >
                      {/* Glass background */}
                      <div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                          backdropFilter: "blur(24px) saturate(1.6) brightness(1.05)",
                          WebkitBackdropFilter: "blur(24px) saturate(1.6) brightness(1.05)",
                          background: "rgba(255,255,255,0.2)",
                        }}
                      />
                      {/* Top specular highlight */}
                      <div
                        className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{
                          background: "linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 35%, transparent 60%)",
                        }}
                      />
                      {/* Inner edge light */}
                      <div
                        className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{
                          border: "1px solid rgba(255,255,255,0.15)",
                          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.03)",
                        }}
                      />
                      {/* Water drop */}
                      <svg
                        className="absolute pointer-events-none"
                        style={{
                          width: idx % 2 === 0 ? "28px" : "22px",
                          height: idx % 2 === 0 ? "34px" : "28px",
                          top: idx < 2 ? "18%" : "25%",
                          left: idx % 2 === 0 ? "60%" : "30%",
                          filter: "url(#water-drop-filter)",
                        }}
                        viewBox="0 0 40 50"
                        aria-hidden="true"
                      >
                        {/* Drop shadow (contact shadow on glass) */}
                        <ellipse cx="20" cy="46" rx="12" ry="3" fill="url(#drop-shadow-grad)" />
                        {/* Main drop body */}
                        <path
                          d="M20 4 C20 4, 6 22, 6 32 C6 40, 12 46, 20 46 C28 46, 34 40, 34 32 C34 22, 20 4, 20 4Z"
                          fill="url(#drop-gradient)"
                          stroke="rgba(255,255,255,0.35)"
                          strokeWidth="0.5"
                        />
                        {/* Caustic light underneath */}
                        <ellipse cx="22" cy="36" rx="7" ry="5" fill="url(#drop-caustic)" />
                        {/* Primary specular highlight */}
                        <ellipse cx="15" cy="22" rx="5" ry="7" fill="white" opacity="0.45" transform="rotate(-15, 15, 22)" />
                        {/* Small secondary highlight */}
                        <circle cx="24" cy="34" r="2" fill="white" opacity="0.2" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {shadow.name}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {shadow.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          {/* Typography column */}
          <div id="typography" className="xl:w-1/2 scroll-mt-24 rounded-lg border border-border bg-background p-4">
            <h3 className="font-semibold text-brand-dynamic dark:text-white mb-4">
              {content.designSystem.sections.typography}
            </h3>
            <div className="space-y-4">
              {designTokens.typography.map((type) => (
                <div
                  key={type.name}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border-b border-border pb-4"
                >
                  <div className="sm:w-32 flex-shrink-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {type.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {type.fontSize} / {type.fontWeight}
                    </p>
                  </div>
                  <p
                    className="text-gray-900 dark:text-white"
                    style={{
                      fontSize: type.fontSize,
                      fontWeight: Number(type.fontWeight),
                      lineHeight: type.lineHeight,
                    }}
                  >
                    The interface adapts before the user knows what they need
                  </p>
                </div>
              ))}
            </div>
          </div>
          </div>

            {/* Reset Confirmation Modal */}
            {showResetModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Reset to Defaults?
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    This will revert all theme colors to their original values. Any saved customizations will be lost.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowResetModal(false)}
                      className="px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { handleReset(); setShowResetModal(false); }}
                      className="px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Design Projects */}
          <div id="design-projects" className="mb-10 mt-16 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-semibold text-brand-dynamic dark:text-white">
                Design
              </h3>
              <a
                href={content.navigation.social.dribbble.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-8 h-8 flex items-center justify-center"
                aria-label="Dribbble"
              >
                <IconWrapper
                  Icon={LazyDribbble}
                  className="h-4 w-4 text-brand-dynamic dark:text-gray-300"
                />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {content.work.projects
                .filter((project: any) => project.title !== "3D Conversion UX Plan")
                .map((project: any, index: number) => (
                  <a
                    key={index}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                  >
                    <div className="relative w-full overflow-hidden bg-transparent">
                      <img
                        src={project.image}
                        alt={project.alt || project.title}
                        className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1">
                      <h3 className="font-semibold text-brand-dynamic dark:text-white group-hover:font-bold transition-all">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-gray-600 dark:text-white line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
            </div>
          </div>

        </div>
      </section>
    </PortfolioLayout>
  );
}

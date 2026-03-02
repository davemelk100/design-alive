import React, { Suspense, useState, useRef } from "react";
import type { AxeResults } from "axe-core";
import { content } from "../../content";
import storage from "../../utils/storage";
import {
  EDITABLE_VARS,
  contrastRatio,
  THEME_COLORS_KEY,
  PENDING_COLORS_KEY,
  COLOR_HISTORY_KEY,
  hslStringToHex,
  hexToHslString,
  derivePaletteFromChange,
  autoAdjustContrast,
  generateHarmonyPalette,
  generateRandomPalette,
  HARMONY_SCHEMES,
  fgForBg,
  persistContrastFixes,
  saveContrastCorrection,
} from "./themeUtils";

import { GitHubLogoIcon } from "../../components/SocialIcons";
const LazyGitHubLogoIcon = GitHubLogoIcon;
const LazyLinkedin = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Linkedin }))
);
const LazyDribbble = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Dribbble }))
);
const LazyHome = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Home }))
);
const LazyPalette = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Palette }))
);
const LazyBookOpen = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.BookOpen }))
);
const LazyFileText = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.FileText }))
);
const LazyBriefcase = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Briefcase }))
);
const LazySearch = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Search }))
);
const LazyCalendar = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Calendar }))
);
const LazySun = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Sun }))
);
const LazyMoon = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Moon }))
);
const LazyEye = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Eye }))
);
const LazyHeart = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Heart }))
);
const LazyMenu = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Menu }))
);
const LazyX = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.X }))
);
const LazyCheck = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Check }))
);
const LazyArrowLeft = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ArrowLeft }))
);
const LazyArrowRight = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ArrowRight }))
);
const LazyChevronLeft = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ChevronLeft }))
);
const LazyChevronRight = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ChevronRight }))
);
const LazyChevronDown = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ChevronDown }))
);
const LazyChevronUp = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ChevronUp }))
);
const LazyExternalLink = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ExternalLink }))
);
const LazyLink2 = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Link2 }))
);
const LazyFlaskConical = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.FlaskConical }))
);
const LazyUsers = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Users }))
);
const LazyAlertCircle = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.AlertCircle }))
);
const LazyLoader2 = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Loader2 }))
);
const LazyZap = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Zap }))
);
const LazyGlobe = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Globe }))
);
const LazyShield = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Shield }))
);
const LazySettings = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Settings }))
);
const LazyCode = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Code }))
);
const LazyDatabase = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Database }))
);
const LazySmartphone = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Smartphone }))
);
const LazyLayers = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Layers }))
);

const SITE_ICONS: { name: string; icon: React.LazyExoticComponent<any> | React.ComponentType<any> }[] = [
  { name: "LinkedIn", icon: LazyLinkedin },
  { name: "GitHub", icon: LazyGitHubLogoIcon },
  { name: "Dribbble", icon: LazyDribbble },
  { name: "Home", icon: LazyHome },
  { name: "Palette", icon: LazyPalette },
  { name: "BookOpen", icon: LazyBookOpen },
  { name: "FileText", icon: LazyFileText },
  { name: "Briefcase", icon: LazyBriefcase },
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

const COLOR_SWATCHES = [
  { key: "--brand", label: "Brand" },
  { key: "--secondary", label: "Secondary" },
  { key: "--accent", label: "Accent" },
  { key: "--background", label: "Background" },
  { key: "--foreground", label: "Foreground" },
  { key: "--primary", label: "Primary" },
  { key: "--primary-foreground", label: "Primary FG" },
  { key: "--secondary-foreground", label: "Secondary FG" },
  { key: "--muted", label: "Muted" },
  { key: "--muted-foreground", label: "Muted FG" },
  { key: "--accent-foreground", label: "Accent FG" },
  { key: "--destructive", label: "Destructive" },
  { key: "--destructive-foreground", label: "Destructive FG" },
  { key: "--success", label: "Success" },
  { key: "--success-foreground", label: "Success FG" },
  { key: "--warning", label: "Warning" },
  { key: "--warning-foreground", label: "Warning FG" },
  { key: "--border", label: "Border" },
  { key: "--ring", label: "Ring" },
];

interface Props {
  colors: Record<string, string>;
  setColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  lockedKeys: Set<string>;
  setLockedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  prevColors: Record<string, string> | null;
  setPrevColors: React.Dispatch<React.SetStateAction<Record<string, string> | null>>;
  readCurrentColors: () => void;
}

export default function PortfolioLandingDesignSystem({ colors, setColors, lockedKeys, setLockedKeys, prevColors, setPrevColors, readCurrentColors }: Props) {
  const [showResetModal, setShowResetModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [prStatus, setPrStatus] = useState<'idle' | 'creating' | 'created' | 'error' | 'rate-limited'>('idle');
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [prError, setPrError] = useState<string | null>(null);
  const [auditStatus, setAuditStatus] = useState<'idle' | 'running' | 'failed' | 'passed'>('idle');
  const auditTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [auditViolations, setAuditViolations] = useState<{ selector: string; text: string }[]>([]);
  const [violationIndex, setViolationIndex] = useState(0);
  const [harmonySchemeIndex, setHarmonySchemeIndex] = useState(-1);
  const [shuffleOpen, setShuffleOpen] = useState(false);

  const handleColorChange = (key: string, hex: string) => {
    if (key === "--brand") {
      const lower = hex.toLowerCase();
      if (lower === "#000000" || lower === "#ffffff") return;
    }
    const hsl = hexToHslString(hex);

    const history = storage.get<{ key: string; previousValue: string }[]>(COLOR_HISTORY_KEY) || [];
    history.push({ key, previousValue: colors[key] || "" });

    document.documentElement.style.setProperty(key, hsl);
    const newColors = { ...colors, [key]: hsl };

    const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    pending[key] = hsl;

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

    if (auditTimerRef.current) clearTimeout(auditTimerRef.current);
    auditTimerRef.current = setTimeout(() => runAccessibilityAudit(), 800);
  };

  const generateCode = () => {
    let css = ":root {\n";
    EDITABLE_VARS.forEach(({ key }) => {
      const val = colors[key];
      if (val) css += `  ${key}: ${val};\n`;
    });
    css += "}\n";

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
    setPrevColors({ ...colors });
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

  const handleUndo = () => {
    if (!prevColors) return;
    const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    for (const [key, val] of Object.entries(prevColors)) {
      document.documentElement.style.setProperty(key, val);
      pending[key] = val;
    }
    setColors(prevColors);
    storage.set(PENDING_COLORS_KEY, pending);
    window.dispatchEvent(new Event('theme-pending-update'));
    setPrevColors(null);
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
    setGeneratedCode(null);
    setPrStatus('idle');
    setPrUrl(null);
    setPrError(null);
    window.dispatchEvent(new Event("theme-pending-update"));
  };

  const scrollToViolation = (v: { selector: string }) => {
    const el = document.querySelector(v.selector) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.style.outline = '3px solid hsl(0 84% 60%)';
    el.style.outlineOffset = '2px';
    setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 3000);
  };

  const runAccessibilityAudit = async () => {
    setAuditStatus('running');
    setAuditViolations([]);
    setViolationIndex(0);
    try {
      const axe = (await import("axe-core")).default;
      const results: AxeResults = await axe.run(
        { exclude: ['[data-axe-exclude]'] },
        { runOnly: { type: 'rule', values: ['color-contrast'] } },
      );
      if (results.violations.length === 0) {
        setAuditStatus('idle');
        setAuditViolations([]);
        setViolationIndex(0);
      } else {

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
        const reResults = await axe.run(
          { exclude: ['[data-axe-exclude]'] },
          { runOnly: { type: 'rule', values: ['color-contrast'] } },
        );
        if (reResults.violations.length === 0) {
          setAuditStatus('idle');
          setAuditViolations([]);
          setViolationIndex(0);
        } else {
          setAuditStatus('failed');
          const elements: { selector: string; text: string }[] = [];
          for (const v of reResults.violations) {
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
      }
    } catch {
      setAuditStatus('idle');
    }
  };

  const fixContrastIssues = async () => {
    setAuditStatus('running');
    try {
      const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

      const highlight = (el: HTMLElement, color: string, ms = 1500) => {
        el.style.outline = `3px solid ${color}`;
        el.style.outlineOffset = '2px';
        el.style.transition = 'outline-color 0.3s';
        setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; el.style.transition = ''; }, ms);
      };

      const style = getComputedStyle(document.documentElement);
      const liveColors: Record<string, string> = {};
      EDITABLE_VARS.forEach(({ key }) => {
        liveColors[key] = style.getPropertyValue(key).trim();
      });

      const fixes = autoAdjustContrast(liveColors, lockedKeys);
      const working = { ...liveColors, ...fixes };

      const bg = working["--background"];
      const fg = working["--foreground"];
      if (bg && fg && contrastRatio(fg, bg) < 4.5) {
        const bestFg = fgForBg(bg);
        working["--foreground"] = bestFg;
        fixes["--foreground"] = bestFg;
        for (const k of ["--card-foreground", "--popover-foreground"]) {
          if (!lockedKeys.has(k)) { working[k] = bestFg; fixes[k] = bestFg; }
        }
      }
      const mutedFg = working["--muted-foreground"];
      if (bg && mutedFg && contrastRatio(mutedFg, bg) < 4.5 && !lockedKeys.has("--muted-foreground")) {
        const bestMuted = fgForBg(bg);
        working["--muted-foreground"] = bestMuted;
        fixes["--muted-foreground"] = bestMuted;
      }

      const fixEntries = Object.entries(fixes).filter(([k, v]) => v !== liveColors[k]);
      for (let i = 0; i < fixEntries.length; i++) {
        const [fixKey, fixVal] = fixEntries[i];
        const swatchEl = document.querySelector(`[data-color-key="${fixKey}"]`) as HTMLElement | null;
        if (swatchEl) {
          swatchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          highlight(swatchEl, 'hsl(0 84% 60%)');
          await delay(250);
        }
        document.documentElement.style.setProperty(fixKey, fixVal);
        if (bg) saveContrastCorrection(bg, fixKey, fixVal);
        if (swatchEl) {
          await delay(150);
          highlight(swatchEl, 'hsl(142 76% 45%)');
        }
        await delay(100);
      }

      const contrastFixes: Record<string, string> = {};
      for (const [k, v] of Object.entries(working)) {
        if (v !== liveColors[k]) contrastFixes[k] = v;
      }
      persistContrastFixes(contrastFixes);
      setColors(working);
      window.dispatchEvent(new Event("theme-pending-update"));

      const axe = (await import("axe-core")).default;
      const runAudit = () => axe.run(
        { exclude: ['[data-axe-exclude]'] },
        { runOnly: { type: 'rule', values: ['color-contrast'] } },
      );

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

      const fixElementAnimated = async (node: { target: any[] }) => {
        const el = document.querySelector(node.target[0] as string) as HTMLElement | null;
        if (!el) return;
        const computed = getComputedStyle(el);
        const fgRgb = parseRgb(computed.color);
        const bgRgb = parseRgb(computed.backgroundColor);
        if (!fgRgb || !bgRgb) return;
        const bgLum = lum(...bgRgb);
        const fgLum = lum(...fgRgb);
        const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
        if (ratio >= 4.5) return;

        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlight(el, 'hsl(0 84% 60%)');
        await delay(300);

        const fgHsl = rgbToHsl(...fgRgb);
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

        highlight(el, 'hsl(142 76% 45%)');
        await delay(200);
      };

      for (let pass = 0; pass < 3; pass++) {
        await delay(300);
        const midResults = await runAudit();
        const contrastViolation = midResults.violations.find((v) => v.id === 'color-contrast');
        if (!contrastViolation) break;
        for (let ni = 0; ni < contrastViolation.nodes.length; ni++) {
          setViolationIndex(ni);
          await fixElementAnimated(contrastViolation.nodes[ni]);
        }
      }

      await delay(400);
      const finalResults = await runAudit();
      if (finalResults.violations.length === 0) {
        setAuditStatus('passed');
        setAuditViolations([]);
        setViolationIndex(0);
      } else {
        setAuditStatus('failed');
        const elements: { selector: string; text: string }[] = [];
        for (const v of finalResults.violations) {
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
    } catch (err) {
      console.error("fixContrastIssues failed:", err);
      setAuditStatus('failed');
    }
  };

  return (
    <section className="pt-4 sm:pt-6 lg:pt-8 pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and description */}
        <div className="w-full mb-4">
          <h2 className="font-bold mb-1 title-font" style={{ color: "hsl(var(--foreground))" }}>NEW - Live Design System!</h2>
          <p className="text-[17px]" style={{ color: "hsl(var(--foreground))" }}>
            Explore the interactive design system powering this site. Pick a brand color and watch every token transform in real time. Automatic WCAG AA contrast correction. Generate a CSS snapshot of your custom theme. Open a pull request to propose changes directly to the repo.
          </p>
        </div>

        {/* Specs content */}
        <div className="mb-4 space-y-3">
          {content.designSystem.specsContent.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-[17px]" style={{ color: "hsl(var(--foreground))" }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Action buttons + alerts row */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 sm:gap-4 mb-4">
          <div className="relative w-full md:w-auto md:flex-1 min-w-0">
            <button
              onClick={() => setShuffleOpen(!shuffleOpen)}
              className="w-full h-12 text-[17px] font-normal rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
              style={{ backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              <span className="truncate">{harmonySchemeIndex >= 0 ? HARMONY_SCHEMES[harmonySchemeIndex] : "Variations"}</span>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {shuffleOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShuffleOpen(false)} />
                <div className="absolute left-0 top-full mt-1 z-50 min-w-[180px] rounded-lg shadow-lg py-1 border" style={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}>
                  {HARMONY_SCHEMES.map((scheme, idx) => (
                    <button
                      key={scheme}
                      onClick={() => handleRegenerate(idx)}
                      className="w-full text-left px-4 py-2 text-[17px] font-light transition-colors hover:opacity-80 flex items-center justify-between"
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
          <div className="h-12 flex-1 md:flex-none flex items-center rounded-lg overflow-hidden" style={{ backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>
            <button
              onClick={handleGenerate}
              className="h-full flex-1 px-3 text-[17px] font-normal transition-colors hover:opacity-80 flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </button>
            {prevColors && (
              <button
                onClick={handleUndo}
                className="h-full pl-2 pr-3 text-[17px] font-normal transition-colors hover:opacity-80 flex items-center justify-center border-l"
                style={{ borderColor: "rgba(17,17,17,0.2)" }}
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 010 10H9m-6-10l4-4m-4 4l4 4" /></svg>
              </button>
            )}
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="h-12 px-3 text-[17px] font-normal rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
            style={{ backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" /></svg>
            <span className="truncate"><span className="sm:hidden">Reset</span><span className="hidden sm:inline">Reset Theme</span></span>
          </button>
          <button
            onClick={() => generatedCode ? setGeneratedCode(null) : generateCode()}
            className="h-12 px-3 text-[17px] font-normal rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
            style={{ backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            <span className="truncate"><span className="sm:hidden">{generatedCode ? "Hide" : "CSS"}</span><span className="hidden sm:inline">{generatedCode ? "Hide CSS" : "Show CSS"}</span></span>
          </button>
          <button
            disabled={prStatus === 'creating'}
            onClick={async () => {
              setPrStatus('creating');
              setPrUrl(null);
              // Open window synchronously to avoid popup blocker
              const popup = window.open('about:blank', '_blank');
              try {
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
                    popup?.close();
                    return;
                  }
                  throw new Error(data.error || 'Failed to create PR');
                }
                setPrStatus('created');
                setPrUrl(data.url);
                setPrError(null);
                if (popup) {
                  popup.location.href = data.url;
                } else {
                  window.open(data.url, '_blank');
                }
              } catch {
                setPrStatus('error');
                popup?.close();
              }
            }}
            className={`h-12 px-3 text-[17px] font-normal rounded-lg transition-colors hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-1 ${
              prStatus === 'error' || prStatus === 'rate-limited'
                ? 'border border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                : prStatus === 'created'
                  ? 'border border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : ''
            }`}
            style={prStatus !== 'error' && prStatus !== 'rate-limited' && prStatus !== 'created'
              ? { backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }
              : undefined
            }
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
            <span className="truncate"><span className="sm:hidden">{prStatus === 'creating' ? '...' : prStatus === 'error' ? 'Retry' : prStatus === 'rate-limited' ? 'Retry' : 'PR'}</span><span className="hidden sm:inline">{prStatus === 'creating' ? 'Preparing...' : prStatus === 'error' ? 'Retry PR' : prStatus === 'rate-limited' ? 'Retry PR' : 'Open PR'}</span></span>
          </button>
          {/* Alerts: full-width row on mobile (order -1), inline on sm+ — always rendered to reserve space */}
          <div className="w-full sm:w-auto order-first sm:order-last sm:ml-auto flex-shrink-0 min-h-[36px]" data-axe-exclude>
              {prStatus === 'rate-limited' && prError && (
                <span className="inline-flex items-center px-3 h-9 text-[17px] font-light rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                  {prError}
                </span>
              )}
              {prStatus === 'created' && prUrl && (
                <span className="inline-flex items-center gap-2 px-3 h-9 text-[17px] font-light rounded-lg border border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  PR Created!
                  <a href={prUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-green-900 dark:hover:text-green-100 transition-colors">View</a>
                  <button onClick={() => { setPrStatus('idle'); setPrUrl(null); }} className="text-green-500 hover:text-green-800 dark:hover:text-green-100 transition-colors" aria-label="Dismiss PR notification">&#10005;</button>
                </span>
              )}
              {auditStatus === 'failed' && (
                <span aria-live="assertive" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-1.5 rounded-xl border-2 border-red-400 dark:border-red-600 bg-red-100 dark:bg-red-950 px-4 h-10 text-[17px] font-normal text-red-800 dark:text-red-200 shadow-2xl ring-1 ring-red-300/50 dark:ring-red-700/50">
                  <span>&#10007; {auditViolations.length} issue{auditViolations.length !== 1 ? 's' : ''}</span>
                  <button
                    onClick={() => {
                      const idx = (violationIndex - 1 + auditViolations.length) % auditViolations.length;
                      setViolationIndex(idx);
                      scrollToViolation(auditViolations[idx]);
                    }}
                    className="text-red-600 dark:text-red-400 hover:opacity-70 disabled:opacity-30"
                    disabled={auditViolations.length <= 1}
                  >&#9664;</button>
                  <span className="text-[17px] tabular-nums">{violationIndex + 1}/{auditViolations.length}</span>
                  <button
                    onClick={() => {
                      const idx = (violationIndex + 1) % auditViolations.length;
                      setViolationIndex(idx);
                      scrollToViolation(auditViolations[idx]);
                    }}
                    className="text-red-600 dark:text-red-400 hover:opacity-70 disabled:opacity-30"
                    disabled={auditViolations.length <= 1}
                  >&#9654;</button>
                  <button onClick={() => { if (auditViolations[violationIndex]) scrollToViolation(auditViolations[violationIndex]); setTimeout(() => fixContrastIssues(), 500); }} className="ml-1 px-2 py-0.5 text-[17px] font-normal rounded transition-colors hover:opacity-80 whitespace-nowrap" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Fix</button>
                </span>
              )}
              {auditStatus === 'passed' && (
                <span aria-live="assertive" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-1.5 rounded-xl border-2 border-green-400 dark:border-green-600 bg-green-100 dark:bg-green-950 px-4 h-10 text-[17px] font-normal text-green-800 dark:text-green-200 shadow-2xl ring-1 ring-green-300/50 dark:ring-green-700/50">
                  <span>&#10003; WCAG AA Passed</span>
                  <button onClick={() => setAuditStatus('idle')} className="ml-1 text-green-500 hover:text-green-800 dark:hover:text-green-100 transition-colors" aria-label="Dismiss">&#10005;</button>
                </span>
              )}
          </div>
        </div>

        <hr className="border-border my-6" />

        {/* Generated code output */}
        {generatedCode && (
          <div className="mb-4 rounded-lg border" style={{ borderColor: "hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
            <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
              <span className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>Generated Theme</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    setCodeCopied(true);
                    setTimeout(() => setCodeCopied(false), 2000);
                  }}
                  className="px-2 py-0.5 text-[17px] font-normal rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                >
                  {codeCopied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => setGeneratedCode(null)}
                  className="px-2 py-0.5 text-[17px] font-normal rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                >
                  Close
                </button>
              </div>
            </div>
            <pre className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed font-mono" style={{ color: "hsl(var(--card-foreground))" }}>
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="home-reset-modal-title">
            <div className="rounded-lg shadow-xl p-6 w-full max-w-sm mx-4" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}>
              <h4 id="home-reset-modal-title" className="text-2xl font-medium mb-2">
                Reset to Defaults?
              </h4>
              <p className="text-[17px] mb-4" style={{ color: "hsl(var(--card-foreground))" }}>
                This will revert all theme colors to their original values. Any saved customizations will be lost.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-3 py-1.5 text-[17px] font-normal rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "transparent", color: "hsl(var(--card-foreground))" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { handleReset(); setShowResetModal(false); }}
                  className="px-3 py-1.5 text-[17px] font-normal rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Specs Modal */}

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
              const inputId = `home-color-input-${key}`;
              return (
                <div
                  key={key}
                  data-color-key={key}
                  className="relative text-left group cursor-pointer"
                >
                  <div
                    className="relative w-full h-[100px] rounded-lg transition-all overflow-hidden shadow-md group-hover:shadow-lg"
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
                        const whiteContrast = contrastRatio("0 0% 100%", bgHsl);
                        const blackContrast = contrastRatio("0 0% 0%", bgHsl);
                        const useWhite = whiteContrast >= 4.5 && blackContrast < 4.5
                          ? true
                          : blackContrast >= 4.5 && whiteContrast < 4.5
                            ? false
                            : whiteContrast >= blackContrast;
                        const textColor = useWhite ? "#ffffff" : "#000000";
                        const hexCode = colors[key] ? hslStringToHex(colors[key]) : "#000000";
                        return (
                          <div className="absolute inset-0 flex items-center justify-center min-w-0">
                            <p className="text-[17px] font-normal truncate" style={{ color: textColor }}>
                              {hexCode}
                            </p>
                          </div>
                        );
                      })()}

                      <span className="absolute top-1 right-1 bg-white/90 dark:bg-black/70 text-gray-700 dark:text-gray-200 w-6 h-6 rounded-full shadow flex items-center justify-center flex-shrink-0 pointer-events-none">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </span>
                      <input
                        id={inputId}
                        type="color"
                        aria-label={`Select ${displayLabel} color`}
                        value={colors[key] ? hslStringToHex(colors[key]) : "#000000"}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  {key === "--brand" && (
                    <button
                      type="button"
                      aria-label={lockedKeys.has(key) ? `Unlock ${displayLabel}` : `Lock ${displayLabel}`}
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
                      {lockedKeys.has(key) ? (
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
                  )}
                  <p className="hidden md:block text-[17px] font-light text-[color:hsl(var(--foreground))] truncate mt-1">
                    {displayLabel}
                  </p>
                </div>
              );
            };
            return (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 mb-4" data-axe-exclude>
                {heroKeys.map((v) => renderHeroSwatch(v))}
              </div>
            );
          })()}

          <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-3 lg:gap-6">
            {/* Color swatches (non-hero) */}
            <div className="min-w-0 rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-xl p-2 md:p-4" style={{ background: "linear-gradient(135deg, hsl(var(--background) / 0.6), hsl(var(--background) / 0.3))", boxShadow: "0 4px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>
                  {content.designSystem.sections.colors}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 md:grid md:gap-1.5" style={{ gridTemplateColumns: "repeat(5, 76px)" }}>
                {COLOR_SWATCHES.filter(v => !["--brand", "--secondary", "--accent", "--background", "--foreground", "--primary"].includes(v.key)).map(({ key, label }) => {
                  const hsl = colors[key];
                  const bgHsl = hsl || "0 0% 50%";
                  const wc = contrastRatio("0 0% 100%", bgHsl);
                  const bc = contrastRatio("0 0% 0%", bgHsl);
                  const swatchTextColor = (wc >= bc) ? "#ffffff" : "#000000";
                  const hexCode = hsl ? hslStringToHex(hsl) : "";
                  return (
                  <div key={key} data-color-key={key} className="text-left">
                    <div className="relative w-[76px] h-[76px] rounded-md mb-1 overflow-hidden flex items-center justify-center shadow-md">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: hsl
                            ? `hsl(${hsl})`
                            : undefined,
                        }}
                      />
                      <span className="relative text-[17px] font-normal truncate" style={{ color: swatchTextColor }}>{hexCode}</span>
                    </div>
                    <p className="hidden md:block text-[17px] font-light text-[color:hsl(var(--foreground))] truncate">
                      {label}
                    </p>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Chips, Buttons, Badges in one card */}
            <div className="flex-1 min-w-0 rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-xl p-2 md:p-4 overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(var(--background) / 0.6), hsl(var(--background) / 0.3))", boxShadow: "0 4px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
              <div className="flex flex-col gap-3">
                {/* Chips */}
                <div className="min-w-0 space-y-2">
                  <p className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Chips</p>
                  <div className="flex flex-row flex-wrap gap-1.5 items-start">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "white" }}>Brand</span>
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</span>
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}>Muted</span>
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>Accent</span>
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</span>
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</span>
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="min-w-0 space-y-2 md:border-t md:border-border md:pt-2">
                  <p className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Badges</p>
                  <div className="flex flex-row flex-wrap gap-1.5 items-start">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "white" }}>Brand</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}>Muted</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>Accent</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[17px] font-light border border-border max-w-full truncate" style={{ color: "hsl(var(--foreground))" }}>Outlined</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="min-w-0 space-y-2 md:border-t md:border-border md:pt-2">
                  <p className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Buttons</p>
                  <div className="flex flex-row flex-wrap gap-1.5 items-start">
                    <button className="px-4 py-2 rounded-lg font-normal text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--primary))", color: colors["--primary"] ? `hsl(${fgForBg(colors["--primary"])})` : "hsl(var(--primary-foreground))" }}>Primary</button>
                    <button className="px-4 py-2 rounded-lg font-normal text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</button>
                    <button className="px-4 py-2 rounded-lg font-normal text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand))" }}>Outlined</button>
                    <button className="px-4 py-2 rounded-lg font-normal text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))" }}>Ghost</button>
                    <button className="px-4 py-2 rounded-lg font-normal text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</button>
                    <button className="px-4 py-2 rounded-lg font-normal text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}>Muted</button>
                    <button className="px-4 py-2 rounded-lg font-normal text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</button>
                    <button className="px-4 py-2 rounded-lg font-normal text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Icons row */}
          <div className="min-w-0 rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-xl p-2 md:p-4 space-y-2 md:space-y-4" style={{ background: "linear-gradient(135deg, hsl(var(--background) / 0.6), hsl(var(--background) / 0.3))", boxShadow: "0 4px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
            <p className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Icons</p>
            <div className="flex flex-wrap gap-2 justify-center">
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
    </section>
  );
}

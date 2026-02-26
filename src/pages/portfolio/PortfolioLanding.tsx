import React, { Suspense, useState, useEffect, useCallback, useRef } from "react";
import axe, { type AxeResults } from "axe-core";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import IconWrapper from "../../components/IconWrapper";
import { content } from "../../content";
import storage from "../../utils/storage";
import {
  applyStoredThemeColors,
  EDITABLE_VARS,
  CONTRAST_PAIRS,
  contrastRatio,
  THEME_COLORS_KEY,
  PENDING_COLORS_KEY,
  COLOR_HISTORY_KEY,
  hslStringToHex,
  hexToHslString,
  derivePaletteFromChange,
  autoAdjustContrast,
} from "./DesignSystemPage";

const LazyLinkedInLogoIcon = React.lazy(() =>
  import("@radix-ui/react-icons").then((mod) => ({
    default: mod.LinkedInLogoIcon,
  })),
);
const LazyGitHubLogoIcon = React.lazy(() =>
  import("@radix-ui/react-icons").then((mod) => ({ default: mod.GitHubLogoIcon }))
);
const LazyDribbble = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Dribbble }))
);
const LazyHome = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Home }))
);
const LazyMail = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Mail }))
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
const LazyQuote = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Quote }))
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

export default function PortfolioLanding() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [prStatus, setPrStatus] = useState<'idle' | 'creating' | 'created' | 'error' | 'rate-limited'>('idle');
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [prError, setPrError] = useState<string | null>(null);
  const [auditStatus, setAuditStatus] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');
  const auditTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [auditViolations, setAuditViolations] = useState<{ selector: string; text: string }[]>([]);

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

  useEffect(() => {
    if (auditStatus !== 'passed') return;
    const timer = setTimeout(() => setAuditStatus('idle'), 4000);
    return () => clearTimeout(timer);
  }, [auditStatus]);

  const handleColorChange = (key: string, hex: string) => {
    const hsl = hexToHslString(hex);

    const history = storage.get<{ key: string; previousValue: string }[]>(COLOR_HISTORY_KEY) || [];
    history.push({ key, previousValue: colors[key] || "" });

    document.documentElement.style.setProperty(key, hsl);
    const newColors = { ...colors, [key]: hsl };

    const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    pending[key] = hsl;

    if (key === "--brand" || key === "--secondary" || key === "--accent") {
      const derived = derivePaletteFromChange(key, hsl, newColors);
      for (const [dKey, dVal] of Object.entries(derived)) {
        history.push({ key: dKey, previousValue: newColors[dKey] || "" });
        document.documentElement.style.setProperty(dKey, dVal);
        newColors[dKey] = dVal;
        pending[dKey] = dVal;
      }
    }

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

    // Debounced audit after color change settles
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

  const runAccessibilityAudit = async () => {
    setAuditStatus('running');
    setAuditViolations([]);
    try {
      const results: AxeResults = await axe.run(
        { exclude: ['[data-axe-exclude]'] },
        { runOnly: { type: 'rule', values: ['color-contrast'] } },
      );
      if (results.violations.length === 0) {
        setAuditStatus('passed');
        setAuditViolations([]);
      } else {
        // Auto-fix contrast on CSS variable pairs
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
        // Re-audit after fixes
        const reResults = await axe.run(
          { exclude: ['[data-axe-exclude]'] },
          { runOnly: { type: 'rule', values: ['color-contrast'] } },
        );
        if (reResults.violations.length === 0) {
          setAuditStatus('passed');
          setAuditViolations([]);
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
        }
      }
    } catch {
      setAuditStatus('idle');
    }
  };

  const fixContrastIssues = async () => {
    setAuditStatus('running');
    try {
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

      fixPair("--brand", "--background");
      for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
        fixPair(fgKey, bgKey);
      }

      storage.set(PENDING_COLORS_KEY, pending);
      setColors(working);
      window.dispatchEvent(new Event("theme-pending-update"));

      // 2. Fresh audit — then fix remaining per-element violations (up to 3 passes)
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

      const fixElements = (contrastViolation: { nodes: any[] }) => {
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
      };

      // Run up to 3 passes of per-element fixing
      for (let pass = 0; pass < 3; pass++) {
        await new Promise((r) => setTimeout(r, 300));
        const midResults = await runAudit();
        const contrastViolation = midResults.violations.find((v) => v.id === 'color-contrast');
        if (!contrastViolation) break;
        fixElements(contrastViolation);
      }

      // 3. Wait for DOM to settle, then final audit
      await new Promise((r) => setTimeout(r, 500));
      const finalResults = await runAudit();
      if (finalResults.violations.length === 0) {
        setAuditStatus('passed');
        setAuditViolations([]);
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
      }
    } catch {
      setAuditStatus('idle');
    }
  };

  return (
    <PortfolioLayout currentPage="home">
      {/* Intro */}
      <section className="relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-4 sm:mt-6">
            <div>
              <p className="text-muted-foreground text-left">
                I'm David Melkonian, a technical product and
                experience leader with over a decade of work at
                the intersection of UX, software engineering, and
                digital accessibility. I specialize in designing
                and shipping full-stack web and mobile products
                using Vue, React, Next.js, Python, and FastAPI,
                with a focus on scalable design systems,
                performance, and usability. I've led teams
                of 30+ and established enterprise-wide standards
                for digital experience delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Design System Preview */}
      <section className="pt-4 sm:pt-6 lg:pt-8 pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title and description */}
          <div className="w-full mb-4">
            <h2 className="font-bold text-brand-dynamic dark:text-white mb-1 title-font">NEW - Live Design System!</h2>
            <p className="text-muted-foreground text-sm">
              Explore the interactive design system powering this site. Pick a brand color and watch every token transform in real time. Automatic WCAG AA contrast correction. Generate a CSS snapshot of your custom theme. Open a pull request to propose changes directly to the repo.
            </p>
          </div>

          {/* Buttons and audit status row */}
          <div className="flex flex-row flex-wrap items-center gap-2 mb-6">
            {auditStatus === 'running' && (
              <span aria-live="assertive" data-axe-exclude className="inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 h-9 text-xs font-medium text-gray-600 dark:text-gray-300">
                Running audit&hellip;
              </span>
            )}
            {auditStatus === 'passed' && (
              <span aria-live="assertive" data-axe-exclude className="inline-flex items-center gap-1 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 px-4 h-9 text-xs font-medium text-green-700 dark:text-green-300">
                <span className="text-green-600 dark:text-green-400">&#10003;</span> <span className="hidden sm:inline">Passed WCAG AA</span><span className="sm:hidden">WCAG</span>
              </span>
            )}
            {auditStatus === 'failed' && (
              <div aria-live="assertive" data-axe-exclude className="rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 px-4 min-h-9 py-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
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
                  className="ml-auto px-3 py-1 text-[10px] font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                  Fix Contrast
                </button>
              </div>
            )}
            <button
                  onClick={() => setShowResetModal(true)}
                  className="px-4 h-9 text-xs font-medium rounded-lg border border-border bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="hidden sm:inline">Reset to Defaults</span><span className="sm:hidden">Reset</span>
                </button>
                <button
                  onClick={() => generateCode()}
                  className="px-4 h-9 text-xs font-medium rounded-lg border border-border bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="hidden sm:inline">Generate CSS</span><span className="sm:hidden">CSS</span>
                </button>
              <button
                disabled={prStatus === 'creating'}
                onClick={async () => {
                  setPrStatus('creating');
                  setPrUrl(null);
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
                className={`px-4 h-9 text-xs font-medium rounded-lg border transition-colors ${
                  prStatus === 'error' || prStatus === 'rate-limited'
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50'
                    : prStatus === 'created'
                      ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50'
                      : 'border-border bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                } disabled:opacity-50`}
              >
                {prStatus === 'creating' ? 'Preparing PR...' : prStatus === 'error' ? 'Retry PR' : prStatus === 'rate-limited' ? 'Retry PR' : 'Open PR'}
              </button>
              {prStatus === 'rate-limited' && prError && (
                <span className="inline-flex items-center px-4 h-9 text-xs font-medium rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 whitespace-nowrap">
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

          {/* Generated code output */}
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

          {/* Reset Confirmation Modal */}
          {showResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="home-reset-modal-title">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
                <h4 id="home-reset-modal-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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

            {/* Hero colors row: Brand, Secondary, Tertiary */}
            {(() => {
              const renderHeroSwatch = ({ key }: { key: string; label: string }) => {
                const isEditable = key === "--brand";
                const displayLabel = key === "--brand" ? "Brand" : key === "--secondary" ? "Secondary" : "Tertiary";
                const inputId = `home-color-input-${key}`;
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
                    <div className={`relative w-full h-14 rounded-lg transition-all overflow-hidden ${isEditable ? "ring-2 ring-brand-dynamic shadow-md group-hover:ring-4 group-hover:shadow-lg border-2 border-white dark:border-gray-900" : "border border-border"}`}>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: colors[key]
                            ? `hsl(${colors[key]})`
                            : undefined,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-3">
                        {(() => {
                          const hsl = colors[key];
                          // Use actual contrast ratio to pick text color
                          const bgHsl = hsl || "0 0% 50%";
                          const whiteContrast = contrastRatio("0 0% 100%", bgHsl);
                          const blackContrast = contrastRatio("0 0% 0%", bgHsl);
                          const useWhite = whiteContrast >= blackContrast;
                          const textColor = useWhite ? "#ffffff" : "#000000";
                          const subColor = useWhite ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.7)";
                          return (
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate" style={{ color: textColor }}>
                                {displayLabel}
                              </p>
                              <p data-axe-exclude className="text-[10px] truncate" style={{ color: subColor }}>
                                {colors[key] ? hslStringToHex(colors[key]) : key}
                              </p>
                            </div>
                          );
                        })()}

                        {isEditable && (
                          <span className="relative bg-white/90 dark:bg-black/70 text-gray-700 dark:text-gray-200 w-7 h-7 rounded-full shadow flex items-center justify-center flex-shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <input
                              id={inputId}
                              type="color"
                              aria-label={`Select ${displayLabel} color`}
                              value={colors[key] ? hslStringToHex(colors[key]) : "#000000"}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </span>
                        )}
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

            <div className="flex flex-row md:items-stretch gap-3 md:gap-6">
              {/* Color swatches (non-hero) */}
              <div className="w-1/3 md:flex-1 xl:w-[25%] xl:flex-none min-w-0 rounded-lg border border-border bg-background p-2 md:p-4">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {content.designSystem.sections.colors}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                  {COLOR_SWATCHES.filter(v => v.key !== "--brand" && v.key !== "--secondary" && v.key !== "--accent").map(({ key, label }) => (
                    <div key={key} data-color-key={key} className="text-left">
                      <div className="relative w-full h-8 md:h-12 rounded-md mb-1 border border-border overflow-hidden">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundColor: colors[key]
                              ? `hsl(${colors[key]})`
                              : undefined,
                          }}
                        />
                      </div>
                      <p className="text-[9px] md:text-xs font-medium text-gray-900 dark:text-white truncate">
                        {label}
                      </p>
                      <p className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {colors[key] ? hslStringToHex(colors[key]) : key}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chips, Buttons, Badges in one card */}
              <div className="w-1/3 md:flex-1 xl:w-[50%] xl:flex-none min-w-0 rounded-lg border border-border bg-background p-2 md:p-4">
                <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                  {/* Chips */}
                  <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
                    <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Chips</p>
                    <div className="flex flex-col gap-3 items-start">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: "white" }}>Brand</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>Muted</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>Accent</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex-1 min-w-0 space-y-2 md:space-y-3 border-t md:border-t-0 border-border pt-2 md:pt-0">
                    <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Badges</p>
                    <div className="flex flex-col gap-3 items-start">
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

                  {/* Buttons - stacked on mobile, column on desktop */}
                  <div className="flex-1 min-w-0 space-y-2 md:space-y-3 border-t md:border-t-0 border-border pt-2 md:pt-0">
                    <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Buttons</p>
                    <div className="flex flex-col gap-3 items-start">
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
                </div>
              </div>

              {/* Icons */}
              <div className="w-1/3 md:flex-1 xl:w-[25%] xl:flex-none min-w-0 rounded-lg border border-border bg-background p-2 md:p-4 space-y-2 md:space-y-4">
                <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Icons</p>
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
        </div>
      </section>

      {/* Career Section */}
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={content.career.title}
            subtitle={content.career.subtitle}
            className="mb-8 sm:mb-6"
            icon={
              <a
                href={content.navigation.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <IconWrapper
                  Icon={LazyLinkedInLogoIcon}
                  className="h-5 w-5 text-brand-dynamic"
                />
              </a>
            }
          />
          <div className="space-y-8">
            {content.career.positions.map((position) => (
              <div
                key={position.title + position.period}
                className=""
              >
                <h3 className="font-semibold mb-1 dark:text-white title-font">
                  {position.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  {position.company}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  {position.period}
                </p>
                {Array.isArray(position.description) ? (
                  <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                    {position.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {position.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-2">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Certifications
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-1 mb-4">
              <li>Certified ScrumMaster (Scrum Alliance)</li>
              <li>
                Certified Usability Analyst (Human Factors
                International)
              </li>
              <li>ITIL Foundation Certificate (Axelos)</li>
            </ul>
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Education
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">
              <li>Oakland University | Rochester MI</li>
              <li>Bachelor of Arts in English</li>
              <li>Minor in Public Relations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={content.testimonials.title}
            subtitle={content.testimonials.subtitle}
            className="mb-8 sm:mb-6"
          />
          <div className="space-y-6">
            {content.testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="border-l-2 border-border pl-4"
              >
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                  {testimonial.author}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {testimonial.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PortfolioLayout>
  );
}

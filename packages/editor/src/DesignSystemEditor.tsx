import React, { Suspense, useState, useRef, useEffect, useCallback } from "react";
import type { AxeResults } from "axe-core";
import type { DesignSystemEditorProps } from "./types";
import { useColorState } from "./hooks/useColorState";
import storage from "./utils/storage";
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
  CARD_STYLE_KEY,
  DEFAULT_CARD_STYLE,
  CARD_PRESETS,
  applyCardStyle,
  applyStoredCardStyle,
  removeCardStyleProperties,
  TYPOGRAPHY_KEY,
  DEFAULT_TYPOGRAPHY,
  TYPOGRAPHY_PRESETS,
  FONT_FAMILY_OPTIONS,
  applyTypography,
  applyStoredTypography,
  removeTypographyProperties,
} from "./utils/themeUtils";
import type { CardStyleState, TypographyState } from "./utils/themeUtils";
import "./styles/editor.css";

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

const GitHubLogoIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} ref={ref}>
      <path d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
    </svg>
  )
);
GitHubLogoIcon.displayName = "GitHubLogoIcon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SITE_ICONS: { name: string; icon: React.LazyExoticComponent<any> | React.ComponentType<any> }[] = [
  { name: "LinkedIn", icon: LazyLinkedin },
  { name: "GitHub", icon: GitHubLogoIcon },
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
];

const SPECS_CONTENT = `All palette colors are HSL custom properties on :root — shift a hue by 180° for complementary, ±150° for split-complementary, and so on. From one brand color the system derives the full token set (secondary, accent, muted, destructive) using your choice of harmony scheme: complementary, triadic, analogous, split-complementary, or tetradic.

Every foreground/background pair is audited against WCAG AA (4.5:1) via axe-core. Failing pairs are auto-corrected by adjusting foreground lightness, and fixes are cached so subsequent visits skip the redundant audit. Your theme persists in localStorage across reloads.`;

export function DesignSystemEditor({
  prEndpointUrl,
  accessibilityAudit = true,
  onChange,
  onExport,
  className,
}: DesignSystemEditorProps) {
  const {
    colors,
    setColors,
    lockedKeys,
    setLockedKeys,
    prevColors,
    setPrevColors,
    readCurrentColors,
  } = useColorState();

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
  const [cardStyle, setCardStyle] = useState<CardStyleState>(() => {
    const saved = storage.get<CardStyleState>(CARD_STYLE_KEY);
    return saved || { ...DEFAULT_CARD_STYLE };
  });
  const [cardCssVisible, setCardCssVisible] = useState(false);
  const [cardCssCopied, setCardCssCopied] = useState(false);
  const [typographyState, setTypographyState] = useState<TypographyState>(() => {
    const saved = storage.get<TypographyState>(TYPOGRAPHY_KEY);
    return saved || { ...DEFAULT_TYPOGRAPHY };
  });
  const [typoCssVisible, setTypoCssVisible] = useState(false);
  const [typoCssCopied, setTypoCssCopied] = useState(false);

  const fireOnChange = (newColors: Record<string, string>) => {
    onChange?.(newColors);
  };

  useEffect(() => {
    applyCardStyle(cardStyle, colors);
  }, [cardStyle, colors]);

  useEffect(() => {
    applyStoredCardStyle(colors);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCardStyle = useCallback((patch: Partial<CardStyleState>) => {
    setCardStyle(prev => {
      const next = { ...prev, ...patch };
      if (patch.preset === undefined && prev.preset !== "custom") {
        next.preset = "custom";
      }
      return next;
    });
  }, []);

  const selectCardPreset = useCallback((presetKey: string) => {
    const preset = CARD_PRESETS[presetKey];
    if (preset) {
      setCardStyle(prev => ({ ...prev, ...preset }));
    }
  }, []);

  useEffect(() => {
    applyTypography(typographyState);
  }, [typographyState]);

  useEffect(() => {
    applyStoredTypography();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTypography = useCallback((patch: Partial<TypographyState>) => {
    setTypographyState(prev => {
      const next = { ...prev, ...patch };
      if (patch.preset === undefined && prev.preset !== "custom") {
        next.preset = "custom";
      }
      return next;
    });
  }, []);

  const selectTypoPreset = useCallback((presetKey: string) => {
    const preset = TYPOGRAPHY_PRESETS[presetKey];
    if (preset) {
      setTypographyState({ ...preset });
    }
  }, []);

  const handleColorChange = (key: string, hex: string) => {
    const lower = hex.toLowerCase();

    if (key === "--brand" && (lower === "#000000" || lower === "#ffffff")) return;

    if (key !== "--background" && key !== "--foreground") {
      const bgHex = colors["--background"] ? hslStringToHex(colors["--background"]).toLowerCase() : "";
      const fgHex = colors["--foreground"] ? hslStringToHex(colors["--foreground"]).toLowerCase() : "";
      if ((bgHex === "#000000" || bgHex === "#ffffff") && lower === bgHex) return;
      if ((fgHex === "#000000" || fgHex === "#ffffff") && lower === fgHex) return;
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
    fireOnChange(newColors);

    if (accessibilityAudit) {
      if (auditTimerRef.current) clearTimeout(auditTimerRef.current);
      auditTimerRef.current = setTimeout(() => runAccessibilityAudit(), 800);
    }
  };

  const generateCode = () => {
    let css = ":root {\n";
    EDITABLE_VARS.forEach(({ key }) => {
      const val = colors[key];
      if (val) css += `  ${key}: ${val};\n`;
    });
    css += "\n  /* Card Style */\n";
    css += `  --card-radius: ${cardStyle.borderRadius}px;\n`;
    const shadowVal =
      cardStyle.shadowBlur === 0 && cardStyle.shadowOffsetX === 0 && cardStyle.shadowOffsetY === 0 && cardStyle.shadowSpread === 0
        ? "none"
        : `${cardStyle.shadowOffsetX}px ${cardStyle.shadowOffsetY}px ${cardStyle.shadowBlur}px ${cardStyle.shadowSpread}px ${cardStyle.shadowColor}`;
    css += `  --card-shadow: ${shadowVal};\n`;
    css += `  --card-border: ${cardStyle.borderWidth > 0 ? `${cardStyle.borderWidth}px solid hsl(var(--border))` : "none"};\n`;
    css += `  --card-backdrop: ${cardStyle.backdropBlur > 0 ? `blur(${cardStyle.backdropBlur}px)` : "none"};\n`;
    css += "\n  /* Typography */\n";
    css += `  --font-heading: ${typographyState.headingFamily};\n`;
    css += `  --font-body: ${typographyState.bodyFamily};\n`;
    css += `  --font-size-base: ${typographyState.baseFontSize}px;\n`;
    css += `  --font-weight-heading: ${typographyState.headingWeight};\n`;
    css += `  --font-weight-body: ${typographyState.bodyWeight};\n`;
    css += `  --line-height: ${typographyState.lineHeight};\n`;
    css += `  --letter-spacing: ${typographyState.letterSpacing}em;\n`;
    css += `  --letter-spacing-heading: ${typographyState.headingLetterSpacing}em;\n`;
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

    const fullCode = css + tw;

    if (onExport) {
      onExport(fullCode);
    } else {
      setGeneratedCode(fullCode);
    }
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
    fireOnChange(newColors);
    if (accessibilityAudit) runAccessibilityAudit();
  };

  const handleGenerate = () => {
    setPrevColors({ ...colors });
    const isDark = document.documentElement.classList.contains('dark');
    const result = generateRandomPalette(colors, lockedKeys, isDark);
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
    fireOnChange(newColors);
    if (accessibilityAudit) runAccessibilityAudit();
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
    fireOnChange(prevColors);
    if (accessibilityAudit) runAccessibilityAudit();
  };

  const handleReset = () => {
    EDITABLE_VARS.forEach(({ key }) => {
      document.documentElement.style.removeProperty(key);
    });
    storage.remove(THEME_COLORS_KEY);
    storage.remove(PENDING_COLORS_KEY);
    storage.remove(COLOR_HISTORY_KEY);
    storage.remove(CARD_STYLE_KEY);
    removeCardStyleProperties();
    setCardStyle({ ...DEFAULT_CARD_STYLE });
    storage.remove(TYPOGRAPHY_KEY);
    removeTypographyProperties();
    setTypographyState({ ...DEFAULT_TYPOGRAPHY });
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
    if (!accessibilityAudit) return;
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

      const fixEntries = Object.entries(fixes).filter(([k]) => fixes[k] !== liveColors[k]);
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

      const fixElementAnimated = async (node: { target: unknown[] }) => {
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
    <div className={`ds-editor${className ? ` ${className}` : ''}`}>
      <section className="pt-4 sm:pt-6 lg:pt-8 pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Title and description */}
          <div className="w-full mb-4">
            <h2 className="font-light pt-4 pb-3 title-font" style={{ color: "hsl(var(--foreground))" }}>NEW - Live Design System!</h2>
            <p className="text-[17px]" style={{ color: "hsl(var(--foreground))" }}>
              Explore the interactive design system powering this site. Pick a brand color and watch every token transform in real time. Automatic WCAG AA contrast correction. Generate a CSS snapshot of your custom theme. Open a pull request to propose changes directly to the repo.
            </p>
          </div>

          {/* Specs content */}
          <div className="mb-4 space-y-3">
            {SPECS_CONTENT.split("\n\n").map((paragraph, i) => (
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
                className="w-full h-12 text-[17px] font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
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
                className="h-full flex-1 px-3 text-[17px] font-light transition-colors hover:opacity-80 flex items-center justify-center gap-1 whitespace-nowrap"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Refresh
              </button>
              {prevColors && (
                <button
                  onClick={handleUndo}
                  aria-label="Undo last color change"
                  className="h-full pl-2 pr-3 text-[17px] font-light transition-colors hover:opacity-80 flex items-center justify-center border-l"
                  style={{ borderColor: "rgba(17,17,17,0.2)" }}
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 010 10H9m-6-10l4-4m-4 4l4 4" /></svg>
                </button>
              )}
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="h-12 px-3 text-[17px] font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
              style={{ backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" /></svg>
              <span className="truncate"><span className="sm:hidden">Reset</span><span className="hidden sm:inline">Reset Theme</span></span>
            </button>
            <button
              onClick={() => generatedCode ? setGeneratedCode(null) : generateCode()}
              className="h-12 px-3 text-[17px] font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
              style={{ backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              <span className="truncate"><span className="sm:hidden">{generatedCode ? "Hide" : "CSS"}</span><span className="hidden sm:inline">{generatedCode ? "Hide CSS" : "Show CSS"}</span></span>
            </button>
            {prEndpointUrl && (
              <button
                disabled={prStatus === 'creating'}
                onClick={async () => {
                  setPrStatus('creating');
                  setPrUrl(null);
                  const popup = window.open('about:blank', '_blank');
                  try {
                    let css = ":root {\n";
                    EDITABLE_VARS.forEach(({ key }) => {
                      const val = colors[key];
                      if (val) css += `  ${key}: ${val};\n`;
                    });
                    css += "}";
                    const res = await fetch(prEndpointUrl, {
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
                className={`h-12 px-3 text-[17px] font-light rounded-lg transition-colors hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-1 ${
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
            )}
            {/* Alerts */}
            <div className="w-full sm:w-auto order-first sm:order-last sm:ml-auto flex-shrink-0 min-h-[36px]" data-axe-exclude>
                {prStatus === 'rate-limited' && prError && (
                  <span className="inline-flex items-center px-3 h-9 text-[17px] font-light rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                    {prError}
                  </span>
                )}
                {prStatus === 'created' && prUrl && (
                  <span className="inline-flex items-center gap-2 px-3 h-9 text-[17px] font-light rounded-lg border border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    PR Created!
                    <a href={prUrl} target="_blank" rel="noopener noreferrer" className="underline font-light hover:text-green-900 dark:hover:text-green-100 transition-colors">View</a>
                    <button onClick={() => { setPrStatus('idle'); setPrUrl(null); }} className="text-green-500 hover:text-green-800 dark:hover:text-green-100 transition-colors" aria-label="Dismiss PR notification">&#10005;</button>
                  </span>
                )}
                {accessibilityAudit && auditStatus === 'failed' && (
                  <span aria-live="assertive" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-1.5 rounded-xl border-2 border-red-400 dark:border-red-600 bg-red-100 dark:bg-red-950 px-4 h-10 text-[17px] font-light text-red-800 dark:text-red-200 shadow-2xl ring-1 ring-red-300/50 dark:ring-red-700/50">
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
                    <button onClick={() => { if (auditViolations[violationIndex]) scrollToViolation(auditViolations[violationIndex]); setTimeout(() => fixContrastIssues(), 500); }} className="ml-1 px-2 py-0.5 text-[17px] font-light rounded transition-colors hover:opacity-80 whitespace-nowrap" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Fix</button>
                  </span>
                )}
                {accessibilityAudit && auditStatus === 'passed' && (
                  <span aria-live="assertive" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-1.5 rounded-xl border-2 border-green-400 dark:border-green-600 bg-green-100 dark:bg-green-950 px-4 h-10 text-[17px] font-light text-green-800 dark:text-green-200 shadow-2xl ring-1 ring-green-300/50 dark:ring-green-700/50">
                    <span>&#10003; WCAG AA Passed</span>
                    <button onClick={() => setAuditStatus('idle')} className="ml-1 text-green-500 hover:text-green-800 dark:hover:text-green-100 transition-colors" aria-label="Dismiss">&#10005;</button>
                  </span>
                )}
            </div>
          </div>

          <hr className="border-border my-6" />

          {/* Generated code output */}
          {generatedCode && (
            <div className="mb-4 rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                <span className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>Generated Theme</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                      setCodeCopied(true);
                      setTimeout(() => setCodeCopied(false), 2000);
                    }}
                    className="px-2 py-0.5 text-[17px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                  >
                    {codeCopied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => setGeneratedCode(null)}
                    className="px-2 py-0.5 text-[17px] font-light rounded-lg transition-colors hover:opacity-80"
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
                <h4 id="home-reset-modal-title" className="text-2xl font-light mb-2">
                  Reset to Defaults?
                </h4>
                <p className="text-[17px] mb-4" style={{ color: "hsl(var(--card-foreground))" }}>
                  This will revert all theme colors to their original values. Any saved customizations will be lost.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="px-3 py-1.5 text-[17px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "transparent", color: "hsl(var(--card-foreground))" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { handleReset(); setShowResetModal(false); }}
                    className="px-3 py-1.5 text-[17px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-stretch gap-4 md:gap-6 lg:gap-10">
            {/* All color swatches */}
            <div className="min-w-0 rounded-lg p-2 md:p-4" data-axe-exclude>
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>
                  Colors
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 md:grid md:gap-1.5" style={{ gridTemplateColumns: "repeat(4, 76px)" }}>
                {COLOR_SWATCHES.map(({ key, label }) => {
                  const hsl = colors[key];
                  const bgHsl = hsl || "0 0% 50%";
                  const wc = contrastRatio("0 0% 100%", bgHsl);
                  const bc = contrastRatio("0 0% 0%", bgHsl);
                  const swatchTextColor = (wc >= bc) ? "#ffffff" : "#000000";
                  const hexCode = hsl ? hslStringToHex(hsl) : "";
                  const isEditable = ["--brand", "--secondary", "--accent", "--background", "--foreground", "--primary"].includes(key);
                  const inputId = `home-color-input-${key}`;
                  return (
                  <div key={key} data-color-key={key} className={`text-left${isEditable ? ' relative group cursor-pointer' : ''}`}>
                    <div
                      className={`relative w-[76px] h-[76px] rounded-md mb-1 overflow-hidden flex items-center justify-center${isEditable ? ' transition-shadow hover:shadow-lg' : ' shadow-md'}`}
                      style={isEditable ? { boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" } : undefined}
                      onClick={isEditable ? () => {
                        const input = document.getElementById(inputId) as HTMLInputElement | null;
                        input?.click();
                      } : undefined}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: hsl
                            ? `hsl(${hsl})`
                            : undefined,
                        }}
                      />
                      <span className="relative text-[14px] font-light truncate" style={{ color: swatchTextColor }}>{hexCode}</span>
                      {isEditable && (
                        <>
                          <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center flex-shrink-0 pointer-events-none" style={{ color: swatchTextColor }}>
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </span>
                          <input
                            id={inputId}
                            type="color"
                            aria-label={`Select ${label} color`}
                            value={colors[key] ? hslStringToHex(colors[key]) : "#000000"}
                            onChange={(e) => handleColorChange(key, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </>
                      )}
                    </div>
                    {key === "--brand" && (
                      <button
                        type="button"
                        aria-label={lockedKeys.has(key) ? `Unlock ${label}` : `Lock ${label}`}
                        className="absolute z-20 flex items-center justify-center cursor-pointer"
                        style={{ top: "-6px", left: "-6px", width: "28px", height: "28px", minWidth: "28px", minHeight: "28px", padding: 0 }}
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
                          <svg style={{ width: "16px", height: "16px", color: colors[key] ? `hsl(${fgForBg(colors[key])})` : undefined }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        ) : (
                          <svg className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ width: "16px", height: "16px", color: colors[key] ? `hsl(${fgForBg(colors[key])})` : undefined }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                          </svg>
                        )}
                      </button>
                    )}
                    <p className="hidden md:block text-[14px] font-light text-[color:hsl(var(--foreground))] truncate" style={{ maxWidth: "76px" }}>
                      {label}
                    </p>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Chips & Badges | Buttons */}
            <div className="flex-1 min-w-0 p-2 md:p-4 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-10">
                {/* Left column: Chips + Badges */}
                <div className="flex-1 min-w-0 flex flex-col gap-3">
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
                  <div className="min-w-0 space-y-2">
                    <p className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Badges</p>
                    <div className="flex flex-row flex-wrap gap-1.5 items-start">
                      <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "white" }}>Brand</span>
                      <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</span>
                      <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}>Muted</span>
                      <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>Accent</span>
                      <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</span>
                      <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</span>
                      <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[17px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</span>
                      <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[17px] font-light border border-border max-w-full truncate" style={{ color: "hsl(var(--foreground))" }}>Outlined</span>
                    </div>
                  </div>
                </div>

                {/* Right column: Buttons */}
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Buttons</p>
                  <div className="flex flex-row flex-wrap gap-1.5 items-start">
                    <button className="h-12 px-3 rounded-lg font-light text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--primary))", color: colors["--primary"] ? `hsl(${fgForBg(colors["--primary"])})` : "hsl(var(--primary-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Primary</button>
                    <button className="h-12 px-3 rounded-lg font-light text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Secondary</button>
                    <button className="h-12 px-3 rounded-lg font-light text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Outlined</button>
                    <button className="h-12 px-3 rounded-lg font-light text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Ghost</button>
                    <button className="h-12 px-3 rounded-lg font-light text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Destructive</button>
                    <button className="h-12 px-3 rounded-lg font-light text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Muted</button>
                    <button className="h-12 px-3 rounded-lg font-light text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Success</button>
                    <button className="h-12 px-3 rounded-lg font-light text-[17px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Warning</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Icons row */}
          <div className="min-w-0 p-2 md:p-4 space-y-2 md:space-y-4">
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

          {/* Card Style section */}
          <div className="min-w-0 p-2 md:p-4 space-y-3">
            <p className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Card Style</p>

            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {(["liquid-glass", "solid", "gradient", "border-only"] as const).map((key) => {
                const labels: Record<string, string> = { "liquid-glass": "Liquid Glass", solid: "Solid Color", gradient: "Gradient", "border-only": "Border Only" };
                const active = cardStyle.preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectCardPreset(key)}
                    className="h-12 px-3 text-[17px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={active
                      ? { backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }
                      : { backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }
                    }
                  >
                    {labels[key]}
                  </button>
                );
              })}
              <button
                onClick={() => setCardCssVisible(!cardCssVisible)}
                className="h-12 px-3 text-[17px] font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
                style={{ backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <span className="truncate"><span className="sm:hidden">{cardCssVisible ? "Hide" : "CSS"}</span><span className="hidden sm:inline">{cardCssVisible ? "Hide CSS" : "Show CSS"}</span></span>
              </button>
            </div>

            {/* Card CSS output */}
            {cardCssVisible && (() => {
              const shadowVal =
                cardStyle.shadowBlur === 0 && cardStyle.shadowOffsetX === 0 && cardStyle.shadowOffsetY === 0 && cardStyle.shadowSpread === 0
                  ? "none"
                  : `${cardStyle.shadowOffsetX}px ${cardStyle.shadowOffsetY}px ${cardStyle.shadowBlur}px ${cardStyle.shadowSpread}px ${cardStyle.shadowColor}`;
              const cardCss = `:root {\n  --card-radius: ${cardStyle.borderRadius}px;\n  --card-shadow: ${shadowVal};\n  --card-border: ${cardStyle.borderWidth > 0 ? `${cardStyle.borderWidth}px solid hsl(var(--border))` : "none"};\n  --card-backdrop: ${cardStyle.backdropBlur > 0 ? `blur(${cardStyle.backdropBlur}px)` : "none"};\n}`;
              return (
                <div className="rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <span className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>Card Style CSS</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cardCss);
                          setCardCssCopied(true);
                          setTimeout(() => setCardCssCopied(false), 2000);
                        }}
                        className="px-2 py-0.5 text-[17px] font-light rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                      >
                        {cardCssCopied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => setCardCssVisible(false)}
                        className="px-2 py-0.5 text-[17px] font-light rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <pre className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed font-mono" style={{ color: "hsl(var(--card-foreground))" }}>
                    <code>{cardCss}</code>
                  </pre>
                </div>
              );
            })()}

            {/* Controls + Preview */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Slider controls */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Shadow */}
                <div className="space-y-1.5">
                  <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Shadow</p>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Y Offset: {cardStyle.shadowOffsetY}px</span>
                    <input type="range" min={0} max={30} value={cardStyle.shadowOffsetY} onChange={e => updateCardStyle({ shadowOffsetY: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Blur: {cardStyle.shadowBlur}px</span>
                    <input type="range" min={0} max={50} value={cardStyle.shadowBlur} onChange={e => updateCardStyle({ shadowBlur: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Spread: {cardStyle.shadowSpread}px</span>
                    <input type="range" min={-10} max={20} value={cardStyle.shadowSpread} onChange={e => updateCardStyle({ shadowSpread: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                </div>
                {/* Shape */}
                <div className="space-y-1.5">
                  <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Shape</p>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Border Radius: {cardStyle.borderRadius}px</span>
                    <input type="range" min={0} max={40} value={cardStyle.borderRadius} onChange={e => updateCardStyle({ borderRadius: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Border Width: {cardStyle.borderWidth}px</span>
                    <input type="range" min={0} max={4} value={cardStyle.borderWidth} onChange={e => updateCardStyle({ borderWidth: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                </div>
                {/* Background */}
                <div className="space-y-1.5">
                  <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Background</p>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Opacity: {Math.round(cardStyle.bgOpacity * 100)}%</span>
                    <input type="range" min={0} max={100} value={Math.round(cardStyle.bgOpacity * 100)} onChange={e => updateCardStyle({ bgOpacity: Number(e.target.value) / 100 })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Backdrop Blur: {cardStyle.backdropBlur}px</span>
                    <input type="range" min={0} max={30} value={cardStyle.backdropBlur} onChange={e => updateCardStyle({ backdropBlur: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                </div>
              </div>

              {/* Live preview */}
              <div className="flex-1 min-w-0 flex items-center justify-center">
                {(() => {
                  // Compute the effective text color based on what the card bg actually looks like
                  const bgHsl = colors["--background"] || "0 0% 100%";
                  const brandHsl = colors["--brand"] || "220 70% 50%";

                  let previewTextColor: string;
                  let previewSubtextColor: string;

                  if (cardStyle.bgType === "gradient") {
                    // Gradient bg: use text that contrasts with brand (the dominant gradient stop)
                    previewTextColor = `hsl(${fgForBg(brandHsl)})`;
                    previewSubtextColor = previewTextColor;
                  } else if (cardStyle.bgType === "transparent" || cardStyle.bgOpacity < 0.4) {
                    // Transparent or very low opacity: text sits on the page background
                    previewTextColor = `hsl(${fgForBg(bgHsl)})`;
                    previewSubtextColor = previewTextColor;
                  } else {
                    // Solid or semi-opaque: card-foreground works
                    previewTextColor = "hsl(var(--card-foreground))";
                    previewSubtextColor = "hsl(var(--muted-foreground))";
                  }

                  return (
                    <div
                      className="relative w-full max-w-[280px] overflow-hidden"
                      style={{
                        borderRadius: `${cardStyle.borderRadius}px`,
                        background: "repeating-linear-gradient(45deg, hsl(var(--muted)) 0px, hsl(var(--muted)) 10px, hsl(var(--background)) 10px, hsl(var(--background)) 20px)",
                        padding: "2px",
                      }}
                    >
                      <div
                        style={{
                          borderRadius: `${cardStyle.borderRadius}px`,
                          boxShadow: cardStyle.shadowBlur === 0 && cardStyle.shadowOffsetX === 0 && cardStyle.shadowOffsetY === 0 && cardStyle.shadowSpread === 0
                            ? "none"
                            : `${cardStyle.shadowOffsetX}px ${cardStyle.shadowOffsetY}px ${cardStyle.shadowBlur}px ${cardStyle.shadowSpread}px ${cardStyle.shadowColor}`,
                          background: cardStyle.bgType === "transparent"
                            ? "transparent"
                            : cardStyle.bgType === "gradient"
                              ? `linear-gradient(${cardStyle.bgGradientAngle}deg, hsl(${colors["--brand"] || "220 70% 50%"}), hsl(${colors["--secondary"] || "220 30% 60%"}), hsl(${colors["--accent"] || "220 50% 55%"}))`
                              : cardStyle.bgOpacity < 1
                                ? (() => { const p = (colors["--card"] || "0 0% 100%").trim().split(/\s+/); return p.length >= 3 ? `hsla(${p[0]}, ${p[1]}, ${p[2]}, ${cardStyle.bgOpacity})` : `hsl(${colors["--card"] || "0 0% 100%"})`; })()
                                : `hsl(${colors["--card"] || "0 0% 100%"})`,
                          border: cardStyle.borderWidth > 0 ? `${cardStyle.borderWidth}px solid hsl(${colors["--border"] || "0 0% 80%"})` : "none",
                          backdropFilter: cardStyle.backdropBlur > 0 ? `blur(${cardStyle.backdropBlur}px)` : "none",
                          WebkitBackdropFilter: cardStyle.backdropBlur > 0 ? `blur(${cardStyle.backdropBlur}px)` : "none",
                          padding: "20px",
                        }}
                      >
                        <h4 className="text-[17px] font-light mb-1" style={{ color: previewTextColor }}>Card Title</h4>
                        <p className="text-[14px] font-light mb-3" style={{ color: previewSubtextColor }}>This is a preview of your card style with customizable shadow, radius, and background.</p>
                        <button
                          className="h-9 px-3 text-[14px] font-light rounded-lg"
                          style={{ backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff" }}
                        >
                          Action
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        {/* Typography section */}
          <div className="min-w-0 p-2 md:p-4 space-y-3">
            <p className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Typography</p>

            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {(["modern", "classic", "compact", "editorial"] as const).map((key) => {
                const labels: Record<string, string> = { modern: "Modern", classic: "Classic", compact: "Compact", editorial: "Editorial" };
                const active = typographyState.preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectTypoPreset(key)}
                    className="h-12 px-3 text-[17px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={active
                      ? { backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }
                      : { backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }
                    }
                  >
                    {labels[key]}
                  </button>
                );
              })}
              <button
                onClick={() => setTypoCssVisible(!typoCssVisible)}
                className="h-12 px-3 text-[17px] font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
                style={{ backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <span className="truncate"><span className="sm:hidden">{typoCssVisible ? "Hide" : "CSS"}</span><span className="hidden sm:inline">{typoCssVisible ? "Hide CSS" : "Show CSS"}</span></span>
              </button>
            </div>

            {/* Typography CSS output */}
            {typoCssVisible && (() => {
              const typoCss = `:root {\n  --font-heading: ${typographyState.headingFamily};\n  --font-body: ${typographyState.bodyFamily};\n  --font-size-base: ${typographyState.baseFontSize}px;\n  --font-weight-heading: ${typographyState.headingWeight};\n  --font-weight-body: ${typographyState.bodyWeight};\n  --line-height: ${typographyState.lineHeight};\n  --letter-spacing: ${typographyState.letterSpacing}em;\n  --letter-spacing-heading: ${typographyState.headingLetterSpacing}em;\n}`;
              return (
                <div className="rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <span className="text-[17px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>Typography CSS</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(typoCss);
                          setTypoCssCopied(true);
                          setTimeout(() => setTypoCssCopied(false), 2000);
                        }}
                        className="px-2 py-0.5 text-[17px] font-light rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                      >
                        {typoCssCopied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => setTypoCssVisible(false)}
                        className="px-2 py-0.5 text-[17px] font-light rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <pre className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed font-mono" style={{ color: "hsl(var(--card-foreground))" }}>
                    <code>{typoCss}</code>
                  </pre>
                </div>
              );
            })()}

            {/* Controls + Preview */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Controls */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Fonts */}
                <div className="space-y-1.5">
                  <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Fonts</p>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Heading:</span>
                    <select
                      value={typographyState.headingFamily}
                      onChange={e => updateTypography({ headingFamily: e.target.value })}
                      className="w-40 h-8 px-2 text-[14px] font-light rounded-md border"
                      style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
                    >
                      {FONT_FAMILY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Body:</span>
                    <select
                      value={typographyState.bodyFamily}
                      onChange={e => updateTypography({ bodyFamily: e.target.value })}
                      className="w-40 h-8 px-2 text-[14px] font-light rounded-md border"
                      style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
                    >
                      {FONT_FAMILY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
                {/* Size & Weight */}
                <div className="space-y-1.5">
                  <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Size & Weight</p>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Base Size: {typographyState.baseFontSize}px</span>
                    <input type="range" min={14} max={22} value={typographyState.baseFontSize} onChange={e => updateTypography({ baseFontSize: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Heading Wt: {typographyState.headingWeight}</span>
                    <input type="range" min={100} max={900} step={100} value={typographyState.headingWeight} onChange={e => updateTypography({ headingWeight: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Body Wt: {typographyState.bodyWeight}</span>
                    <input type="range" min={100} max={900} step={100} value={typographyState.bodyWeight} onChange={e => updateTypography({ bodyWeight: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                </div>
                {/* Spacing */}
                <div className="space-y-1.5">
                  <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Spacing</p>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Line Height: {typographyState.lineHeight.toFixed(2)}</span>
                    <input type="range" min={100} max={200} step={5} value={Math.round(typographyState.lineHeight * 100)} onChange={e => updateTypography({ lineHeight: Number(e.target.value) / 100 })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Letter Sp: {typographyState.letterSpacing.toFixed(2)}em</span>
                    <input type="range" min={-5} max={15} step={1} value={Math.round(typographyState.letterSpacing * 100)} onChange={e => updateTypography({ letterSpacing: Number(e.target.value) / 100 })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Heading Sp: {typographyState.headingLetterSpacing.toFixed(2)}em</span>
                    <input type="range" min={-5} max={10} step={1} value={Math.round(typographyState.headingLetterSpacing * 100)} onChange={e => updateTypography({ headingLetterSpacing: Number(e.target.value) / 100 })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                </div>
              </div>

              {/* Live preview */}
              <div className="flex-1 min-w-0 flex items-start justify-center pt-2">
                <div
                  className="w-full max-w-[320px] rounded-lg p-5 space-y-3"
                  style={{
                    backgroundColor: "hsl(var(--card))",
                    color: "hsl(var(--card-foreground))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: typographyState.headingFamily,
                      fontSize: `${Math.round(typographyState.baseFontSize * 1.75)}px`,
                      fontWeight: typographyState.headingWeight,
                      lineHeight: typographyState.lineHeight,
                      letterSpacing: `${typographyState.headingLetterSpacing}em`,
                    }}
                  >
                    Heading Text
                  </h3>
                  <h4
                    style={{
                      fontFamily: typographyState.headingFamily,
                      fontSize: `${Math.round(typographyState.baseFontSize * 1.25)}px`,
                      fontWeight: typographyState.headingWeight,
                      lineHeight: typographyState.lineHeight,
                      letterSpacing: `${typographyState.headingLetterSpacing}em`,
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    Subheading Text
                  </h4>
                  <p
                    style={{
                      fontFamily: typographyState.bodyFamily,
                      fontSize: `${typographyState.baseFontSize}px`,
                      fontWeight: typographyState.bodyWeight,
                      lineHeight: typographyState.lineHeight,
                      letterSpacing: `${typographyState.letterSpacing}em`,
                    }}
                  >
                    Body text paragraph demonstrating the selected font family, size, weight, and spacing settings in real time.
                  </p>
                  <p
                    style={{
                      fontFamily: typographyState.bodyFamily,
                      fontSize: `${Math.round(typographyState.baseFontSize * 0.8)}px`,
                      fontWeight: typographyState.bodyWeight,
                      lineHeight: typographyState.lineHeight,
                      letterSpacing: `${typographyState.letterSpacing}em`,
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    Small / Caption text for secondary information and labels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

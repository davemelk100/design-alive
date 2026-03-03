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
  ALERT_STYLE_KEY,
  DEFAULT_ALERT_STYLE,
  ALERT_PRESETS,
  applyAlertStyle,
  applyStoredAlertStyle,
  removeAlertStyleProperties,
} from "./utils/themeUtils";
import type { CardStyleState, TypographyState, AlertStyleState } from "./utils/themeUtils";
import "./styles/editor.css";

const LazyHome = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Home }))
);
const LazyPalette = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Palette }))
);
const LazyBookOpen = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.BookOpen }))
);
const LazyBriefcase = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Briefcase }))
);
const LazySearch = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Search }))
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
const LazyCheck = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Check }))
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
const LazyCamera = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Camera }))
);
const LazyMail = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Mail }))
);
const LazyBell = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Bell }))
);
const LazyClock = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Clock }))
);
const LazyDownload = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Download }))
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
  { name: "GitHub", icon: GitHubLogoIcon },
  { name: "Home", icon: LazyHome },
  { name: "Palette", icon: LazyPalette },
  { name: "BookOpen", icon: LazyBookOpen },
  { name: "Briefcase", icon: LazyBriefcase },
  { name: "Search", icon: LazySearch },
  { name: "Sun", icon: LazySun },
  { name: "Moon", icon: LazyMoon },
  { name: "Eye", icon: LazyEye },
  { name: "Heart", icon: LazyHeart },
  { name: "Check", icon: LazyCheck },
  { name: "ExternalLink", icon: LazyExternalLink },
  { name: "FlaskConical", icon: LazyFlaskConical },
  { name: "Users", icon: LazyUsers },
  { name: "AlertCircle", icon: LazyAlertCircle },
  { name: "Zap", icon: LazyZap },
  { name: "Globe", icon: LazyGlobe },
  { name: "Shield", icon: LazyShield },
  { name: "Settings", icon: LazySettings },
  { name: "Code", icon: LazyCode },
  { name: "Database", icon: LazyDatabase },
  { name: "Smartphone", icon: LazySmartphone },
  { name: "Link", icon: LazyLink2 },
  { name: "Camera", icon: LazyCamera },
  { name: "Mail", icon: LazyMail },
  { name: "Bell", icon: LazyBell },
  { name: "Clock", icon: LazyClock },
  { name: "Download", icon: LazyDownload },
];

const COLOR_SWATCHES = [
  { key: "--brand", label: "Primary" },
  { key: "--secondary", label: "Secondary" },
  { key: "--accent", label: "Accent" },
  { key: "--background", label: "Background" },
  { key: "--foreground", label: "Foreground" },
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
  const [showCardResetModal, setShowCardResetModal] = useState(false);
  const [showTypoResetModal, setShowTypoResetModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [prSections, setPrSections] = useState<Set<string>>(new Set(["colors", "card", "typography", "alerts"]));
  const [showPrModal, setShowPrModal] = useState(false);
  const [sectionPrStatus, setSectionPrStatus] = useState<Record<string, { status: 'idle' | 'creating' | 'created' | 'error' | 'rate-limited'; url?: string; error?: string }>>({});
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
  const [alertStyle, setAlertStyle] = useState<AlertStyleState>(() => {
    const saved = storage.get<AlertStyleState>(ALERT_STYLE_KEY);
    return saved || { ...DEFAULT_ALERT_STYLE };
  });
  const [alertCssVisible, setAlertCssVisible] = useState(false);
  const [alertCssCopied, setAlertCssCopied] = useState(false);
  const [showAlertResetModal, setShowAlertResetModal] = useState(false);

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

  useEffect(() => {
    applyAlertStyle(alertStyle);
  }, [alertStyle]);

  useEffect(() => {
    applyStoredAlertStyle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAlertStyle = useCallback((patch: Partial<AlertStyleState>) => {
    setAlertStyle(prev => {
      const next = { ...prev, ...patch };
      if (patch.preset === undefined && prev.preset !== "custom") {
        next.preset = "custom";
      }
      return next;
    });
  }, []);

  const selectAlertPreset = useCallback((presetKey: string) => {
    const preset = ALERT_PRESETS[presetKey];
    if (preset) {
      setAlertStyle({ ...preset });
    }
  }, []);

  const handleResetAlertStyle = () => {
    storage.remove(ALERT_STYLE_KEY);
    removeAlertStyleProperties();
    setAlertStyle({ ...DEFAULT_ALERT_STYLE });
  };

  const buildSectionCss = useCallback((sections: Iterable<string>) => {
    let vars = "";
    for (const section of sections) {
      switch (section) {
        case "colors":
          EDITABLE_VARS.forEach(({ key }) => {
            const val = colors[key];
            if (val) vars += `  ${key}: ${val};\n`;
          });
          break;
        case "card": {
          const shadowVal =
            cardStyle.shadowBlur === 0 && cardStyle.shadowOffsetX === 0 && cardStyle.shadowOffsetY === 0 && cardStyle.shadowSpread === 0
              ? "none"
              : `${cardStyle.shadowOffsetX}px ${cardStyle.shadowOffsetY}px ${cardStyle.shadowBlur}px ${cardStyle.shadowSpread}px ${cardStyle.shadowColor}`;
          vars += `  --card-radius: ${cardStyle.borderRadius}px;\n`;
          vars += `  --card-shadow: ${shadowVal};\n`;
          vars += `  --card-border: ${cardStyle.borderWidth > 0 ? `${cardStyle.borderWidth}px solid hsl(var(--border))` : "none"};\n`;
          vars += `  --card-backdrop: ${cardStyle.backdropBlur > 0 ? `blur(${cardStyle.backdropBlur}px)` : "none"};\n`;
          break;
        }
        case "typography":
          vars += `  --font-heading: ${typographyState.headingFamily};\n`;
          vars += `  --font-body: ${typographyState.bodyFamily};\n`;
          vars += `  --font-size-base: ${typographyState.baseFontSize}px;\n`;
          vars += `  --font-weight-heading: ${typographyState.headingWeight};\n`;
          vars += `  --font-weight-body: ${typographyState.bodyWeight};\n`;
          vars += `  --line-height: ${typographyState.lineHeight};\n`;
          vars += `  --letter-spacing: ${typographyState.letterSpacing}em;\n`;
          vars += `  --letter-spacing-heading: ${typographyState.headingLetterSpacing}em;\n`;
          break;
        case "alerts":
          vars += `  --alert-radius: ${alertStyle.borderRadius}px;\n`;
          vars += `  --alert-border-width: ${alertStyle.borderWidth}px;\n`;
          vars += `  --alert-padding: ${alertStyle.padding}px;\n`;
          break;
      }
    }
    return `:root {\n${vars}}`;
  }, [colors, cardStyle, typographyState, alertStyle]);

  const submitPr = useCallback(async (sections: Iterable<string>, statusKey: string) => {
    if (!prEndpointUrl) return;
    setSectionPrStatus(prev => ({ ...prev, [statusKey]: { status: 'creating' } }));
    const popup = window.open('about:blank', '_blank');
    try {
      const css = buildSectionCss(sections);
      const sectionArr = [...sections];
      const res = await fetch(prEndpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ css, sections: sectionArr }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setSectionPrStatus(prev => ({ ...prev, [statusKey]: { status: 'rate-limited', error: data.error } }));
          popup?.close();
          return;
        }
        throw new Error(data.error || 'Failed to create PR');
      }
      setSectionPrStatus(prev => ({ ...prev, [statusKey]: { status: 'created', url: data.url } }));
      if (popup) {
        popup.location.href = data.url;
      } else {
        window.open(data.url, '_blank');
      }
    } catch {
      setSectionPrStatus(prev => ({ ...prev, [statusKey]: { status: 'error' } }));
      popup?.close();
    }
  }, [prEndpointUrl, buildSectionCss]);

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

    const DERIVATION_TRIGGERS = ["--brand", "--secondary", "--accent", "--background", "--foreground"];
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
    css += "\n  /* Alerts */\n";
    css += `  --alert-radius: ${alertStyle.borderRadius}px;\n`;
    css += `  --alert-border-width: ${alertStyle.borderWidth}px;\n`;
    css += `  --alert-padding: ${alertStyle.padding}px;\n`;
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
    storage.remove(ALERT_STYLE_KEY);
    removeAlertStyleProperties();
    setAlertStyle({ ...DEFAULT_ALERT_STYLE });
    readCurrentColors();
    setGeneratedCode(null);
    setSectionPrStatus({});
    window.dispatchEvent(new Event("theme-pending-update"));
  };

  const handleResetCardStyle = () => {
    storage.remove(CARD_STYLE_KEY);
    removeCardStyleProperties();
    setCardStyle({ ...DEFAULT_CARD_STYLE });
  };

  const handleResetTypography = () => {
    storage.remove(TYPOGRAPHY_KEY);
    removeTypographyProperties();
    setTypographyState({ ...DEFAULT_TYPOGRAPHY });
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
    <div id="top" className={`ds-editor${className ? ` ${className}` : ''}`}>
      <section className="pt-4 sm:pt-6 lg:pt-8 pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Title + nav links */}
          <div className="w-full mb-4 flex items-center gap-x-4">
            <div className="flex-1 min-w-0">
              <h1 className="font-light pt-4 pb-1 sm:pb-3 title-font flex items-center gap-3" style={{ color: "hsl(var(--foreground))" }}>
                <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <defs><clipPath id="cw"><circle cx="16" cy="16" r="15"/></clipPath></defs>
                  <g clipPath="url(#cw)">
                    <path d="M16 16L16 0A16 16 0 0 1 29.86 24Z" fill="#ff0000"/>
                    <path d="M16 16L29.86 24A16 16 0 0 1 16 32Z" fill="#ff8800"/>
                    <path d="M16 16L16 32A16 16 0 0 1 2.14 24Z" fill="#ffdd00"/>
                    <path d="M16 16L2.14 24A16 16 0 0 1 2.14 8Z" fill="#00cc44"/>
                    <path d="M16 16L2.14 8A16 16 0 0 1 16 0Z" fill="#0088ff"/>
                    <path d="M16 16L16 0A16 16 0 0 0 2.14 8Z" fill="#8833ff"/>
                  </g>
                  <circle cx="16" cy="16" r="5" fill="white"/>
                </svg>
                Theemal
              </h1>
              <div className="flex items-center gap-4 pb-2 sm:pb-0">
                <a
                  href="/how-it-works"
                  className="text-[14px] font-light hover:opacity-70 transition-opacity"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  How It Works &rarr;
                </a>
                <a
                  href="/readme"
                  className="text-[14px] font-light hover:opacity-70 transition-opacity"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  README &rarr;
                </a>
              </div>
            </div>
            {prEndpointUrl && (() => {
              const mainSt = sectionPrStatus["main"] || { status: 'idle' as const };
              return (
              <div className="flex-shrink-0 flex items-center gap-3">
                {mainSt.status === 'created' && (
                  <div className="flex items-center gap-2 text-[14px] font-light text-green-600 dark:text-green-400">
                    <span>PR Created!</span>
                    {mainSt.url && (
                      <a href={mainSt.url} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity">View</a>
                    )}
                    <button
                      onClick={() => setSectionPrStatus(prev => ({ ...prev, main: { status: 'idle' } }))}
                      className="hover:opacity-70 transition-opacity"
                      aria-label="Dismiss"
                    >&#10005;</button>
                  </div>
                )}
                {mainSt.status === 'rate-limited' && mainSt.error && (
                  <span className="text-[14px] font-light text-yellow-700 dark:text-yellow-300">
                    {mainSt.error}
                  </span>
                )}
                <button
                  disabled={mainSt.status === 'creating'}
                  onClick={() => { if (mainSt.status !== 'creating') { setPrSections(new Set()); setShowPrModal(true); } }}
                  className={`h-12 px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-1 ${
                    mainSt.status === 'error' || mainSt.status === 'rate-limited'
                      ? 'text-red-600 dark:text-red-400'
                      : ''
                  }`}
                  style={{ backgroundColor: "transparent", color: mainSt.status === 'error' || mainSt.status === 'rate-limited' ? undefined : "hsl(var(--brand))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                  <span className="truncate">{mainSt.status === 'creating' ? 'Preparing...' : mainSt.status === 'error' ? 'Retry PR' : mainSt.status === 'rate-limited' ? 'Retry PR' : 'Open PR'}</span>
                </button>
              </div>
              );
            })()}
          </div>

          {/* Alerts */}
          <div className="mb-0">
            <div className="w-full sm:w-auto order-first sm:order-last flex-shrink-0 min-h-[36px] pointer-events-none [&>*]:pointer-events-auto" data-axe-exclude>
                {accessibilityAudit && auditStatus === 'failed' && (
                  <span aria-live="assertive" className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-1.5 border-t-2 border-red-400 dark:border-red-600 bg-red-100 dark:bg-red-950 px-4 h-12 text-[14px] font-light text-red-800 dark:text-red-200 shadow-2xl">
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
                    <span className="text-[14px] tabular-nums">{violationIndex + 1}/{auditViolations.length}</span>
                    <button
                      onClick={() => {
                        const idx = (violationIndex + 1) % auditViolations.length;
                        setViolationIndex(idx);
                        scrollToViolation(auditViolations[idx]);
                      }}
                      className="text-red-600 dark:text-red-400 hover:opacity-70 disabled:opacity-30"
                      disabled={auditViolations.length <= 1}
                    >&#9654;</button>
                    <button onClick={() => { if (auditViolations[violationIndex]) scrollToViolation(auditViolations[violationIndex]); setTimeout(() => fixContrastIssues(), 500); }} className="ml-1 px-2 py-0.5 text-[14px] font-light rounded transition-colors hover:opacity-80 whitespace-nowrap" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Fix</button>
                  </span>
                )}
                {accessibilityAudit && auditStatus === 'passed' && (
                  <span aria-live="assertive" className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-1.5 border-t-2 border-green-400 dark:border-green-600 bg-green-100 dark:bg-green-950 px-4 h-12 text-[14px] font-light text-green-800 dark:text-green-200 shadow-2xl">
                    <span>&#10003; WCAG AA Passed</span>
                    <button onClick={() => setAuditStatus('idle')} className="ml-1 text-green-500 hover:text-green-800 dark:hover:text-green-100 transition-colors" aria-label="Dismiss">&#10005;</button>
                  </span>
                )}
            </div>
          </div>

          {/* Reset Confirmation Modal */}
          {showResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="home-reset-modal-title">
              <div className="rounded-lg shadow-xl p-6 w-full max-w-sm mx-4" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}>
                <h4 id="home-reset-modal-title" className="text-2xl font-light mb-2">
                  Reset to Defaults?
                </h4>
                <p className="text-[14px] mb-4" style={{ color: "hsl(var(--card-foreground))" }}>
                  This will revert all theme colors to their original values. Any saved customizations will be lost.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "transparent", color: "hsl(var(--card-foreground))" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { handleReset(); setShowResetModal(false); }}
                    className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card Style Reset Confirmation Modal */}
          {showCardResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="card-reset-modal-title">
              <div className="rounded-lg shadow-xl p-6 w-full max-w-sm mx-4" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}>
                <h4 id="card-reset-modal-title" className="text-2xl font-light mb-2">
                  Reset Card Style?
                </h4>
                <p className="text-[14px] mb-4" style={{ color: "hsl(var(--card-foreground))" }}>
                  This will revert all card style settings to their defaults. Any customizations will be lost.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowCardResetModal(false)}
                    className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "transparent", color: "hsl(var(--card-foreground))" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { handleResetCardStyle(); setShowCardResetModal(false); }}
                    className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Typography Reset Confirmation Modal */}
          {showTypoResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="typo-reset-modal-title">
              <div className="rounded-lg shadow-xl p-6 w-full max-w-sm mx-4" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}>
                <h4 id="typo-reset-modal-title" className="text-2xl font-light mb-2">
                  Reset Typography?
                </h4>
                <p className="text-[14px] mb-4" style={{ color: "hsl(var(--card-foreground))" }}>
                  This will revert all typography settings to their defaults. Any customizations will be lost.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowTypoResetModal(false)}
                    className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "transparent", color: "hsl(var(--card-foreground))" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { handleResetTypography(); setShowTypoResetModal(false); }}
                    className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Jump nav */}
          <nav className="flex items-center gap-1 sm:gap-2 py-2 mb-2 overflow-x-auto sticky top-0 z-20" data-axe-exclude style={{ backgroundColor: "hsl(var(--background))" }}>
            {[
              { id: "colors", label: "Colors" },
              { id: "card-style", label: "Card Style" },
              { id: "typography", label: "Typography" },
              { id: "alerts", label: "Alerts" },
            ].map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-1.5 text-[13px] font-light uppercase tracking-wider rounded-md transition-colors hover:opacity-70 whitespace-nowrap"
                style={{ color: "hsl(var(--foreground))", backgroundColor: "hsl(var(--muted-foreground) / 0.08)" }}
              >
                {s.label}
              </a>
            ))}
          </nav>

          {/* Colors section */}
          <div id="colors" className="min-w-0 p-2 md:p-4 space-y-3 scroll-mt-16">
            <div className="flex items-center flex-wrap gap-2 sm:gap-4" data-axe-exclude>
              <h2 className="text-[20px] font-normal uppercase tracking-wider flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>Colors <a href="#top" className="opacity-30 hover:opacity-70 transition-opacity" aria-label="Back to top"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg></a></h2>
              <div className="ml-auto flex flex-wrap items-center gap-1 sm:gap-2">
              <div className="relative">
                <button
                  onClick={() => setShuffleOpen(!shuffleOpen)}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                  <span className="whitespace-nowrap">{harmonySchemeIndex >= 0 ? HARMONY_SCHEMES[harmonySchemeIndex] : "Default"}</span>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {shuffleOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShuffleOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-lg shadow-lg py-1 border" style={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}>
                      <button
                        onClick={() => { setHarmonySchemeIndex(-1); setShuffleOpen(false); }}
                        className="w-full text-left px-4 py-2 text-[14px] font-light transition-colors hover:opacity-80 flex items-center justify-between"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        Default
                        {harmonySchemeIndex < 0 && <span className="text-green-600 dark:text-green-400">&#10003;</span>}
                      </button>
                      {HARMONY_SCHEMES.map((scheme, idx) => (
                        <button
                          key={scheme}
                          onClick={() => handleRegenerate(idx)}
                          className="w-full text-left px-4 py-2 text-[14px] font-light transition-colors hover:opacity-80 flex items-center justify-between"
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
              <div className="flex items-center">
                <button
                  onClick={handleGenerate}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1 whitespace-nowrap"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Refresh
                </button>
                {prevColors && (
                  <button
                    onClick={handleUndo}
                    aria-label="Undo last color change"
                    className="h-10 pl-1 pr-2 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 010 10H9m-6-10l4-4m-4 4l4 4" /></svg>
                  </button>
                )}
              </div>
                <button
                  onClick={() => generatedCode ? setGeneratedCode(null) : generateCode()}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  <span className="truncate"><span className="sm:hidden">{generatedCode ? "Hide" : "CSS"}</span><span className="hidden sm:inline">{generatedCode ? "Hide CSS" : "Show CSS"}</span></span>
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" /></svg>
                  <span className="truncate">Reset</span>
                </button>
              </div>
            </div>

            {/* Color swatch buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 rounded-lg p-3" data-axe-exclude style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
              {COLOR_SWATCHES.filter(({ key }) => ["--brand", "--secondary", "--accent", "--background", "--foreground"].includes(key)).map(({ key, label }) => {
                const hsl = colors[key];
                const bgHsl = hsl || "0 0% 50%";
                const wc = contrastRatio("0 0% 100%", bgHsl);
                const bc = contrastRatio("0 0% 0%", bgHsl);
                const btnTextColor = (wc >= bc) ? "#ffffff" : "#000000";
                const inputId = `brand-btn-color-input-${key}`;
                const hexCode = hsl ? hslStringToHex(hsl) : "";
                const isLocked = lockedKeys.has(key);
                const canLock = isLocked || lockedKeys.size < 4;
                return (
                  <div key={key} className="relative group flex items-stretch rounded-lg overflow-hidden" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>
                    <button
                      className="w-full h-14 sm:h-20 text-[12px] sm:text-[14px] font-light transition-colors hover:opacity-80 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                      style={{ backgroundColor: hsl ? `hsl(${hsl})` : "#e5e7eb", color: btnTextColor }}
                      onClick={() => {
                        const input = document.getElementById(inputId) as HTMLInputElement | null;
                        input?.click();
                      }}
                    >
                      <span className="whitespace-nowrap leading-tight">{label}</span>
                      {hexCode && <span className="hidden sm:inline whitespace-nowrap opacity-70 text-[14px] leading-tight">{hexCode}</span>}
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <input
                      id={inputId}
                      type="color"
                      aria-label={`Select ${label} color`}
                      value={colors[key] ? hslStringToHex(colors[key]) : "#000000"}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      style={{ width: "calc(100% - 32px)", height: "100%" }}
                    />
                    <button
                      className="w-8 flex items-center justify-center transition-all cursor-pointer"
                      style={{
                        backgroundColor: isLocked ? `hsl(${bgHsl})` : "rgba(0,0,0,0.08)",
                        color: isLocked ? btnTextColor : "hsl(var(--muted-foreground))",
                        opacity: canLock ? 1 : 0.3,
                      }}
                      onClick={() => {
                        if (!canLock) return;
                        setLockedKeys(prev => {
                          const next = new Set(prev);
                          if (next.has(key)) next.delete(key);
                          else next.add(key);
                          return next;
                        });
                      }}
                      title={isLocked ? `Unlock ${label}` : lockedKeys.size >= 4 ? "Max 4 locks" : `Lock ${label}`}
                      aria-label={isLocked ? `Unlock ${label} color` : `Lock ${label} color`}
                    >
                      {isLocked ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 019.9-1" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Generated code output */}
            {generatedCode && (
              <div className="rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                  <span className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>Generated Theme</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 2000);
                      }}
                      className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                      style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                    >
                      {codeCopied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={() => setGeneratedCode(null)}
                      className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
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

            {/* Controls + Preview */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Palette (own row) */}
              <div className="w-full" data-axe-exclude>
                <p className="text-[14px] font-light uppercase tracking-wider mb-2 md:mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>Palette</p>
                <div className="grid grid-cols-6 gap-1 md:grid-cols-[repeat(auto-fit,minmax(76px,1fr))] md:gap-1.5">
                  {COLOR_SWATCHES.filter(({ key }) => !["--brand", "--secondary", "--accent", "--background", "--foreground"].includes(key)).map(({ key, label }) => {
                    const hsl = colors[key];
                    const bgHsl = hsl || "0 0% 50%";
                    const wc = contrastRatio("0 0% 100%", bgHsl);
                    const bc = contrastRatio("0 0% 0%", bgHsl);
                    const swatchTextColor = (wc >= bc) ? "#ffffff" : "#000000";
                    const hexCode = hsl ? hslStringToHex(hsl) : "";
                    return (
                    <div key={key} data-color-key={key} className="text-left">
                      <div
                        className="relative w-full aspect-square rounded-md mb-1 overflow-hidden flex items-center justify-center shadow-md"
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
                      </div>
                      <p className="hidden md:block text-[14px] font-light text-[color:hsl(var(--foreground))] truncate">
                        {label}
                      </p>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Chips / Badges row */}
              <div className="w-full space-y-2" data-axe-exclude>
                <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Chips / Badges</p>
                <div className="flex flex-row flex-wrap gap-1.5 items-start">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "white" }}>Brand</span>
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</span>
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}>Muted</span>
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>Accent</span>
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</span>
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</span>
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</span>
                  <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "white" }}>Brand</span>
                  <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>Secondary</span>
                  <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}>Muted</span>
                  <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>Accent</span>
                  <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>Destructive</span>
                  <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}>Success</span>
                  <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))" }}>Warning</span>
                  <span className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light border border-border max-w-full truncate" style={{ color: "hsl(var(--foreground))" }}>Outlined</span>
                </div>
              </div>

              {/* Buttons row */}
              <div className="w-full space-y-2" data-axe-exclude>
                <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Buttons</p>
                <div className="flex flex-row flex-wrap gap-1.5 items-start">
                  <button className="h-12 px-3 rounded-lg font-light text-[14px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--primary))", color: colors["--primary"] ? `hsl(${fgForBg(colors["--primary"])})` : "hsl(var(--primary-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Primary</button>
                  <button className="h-12 px-3 rounded-lg font-light text-[14px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Secondary</button>
                  <button className="h-12 px-3 rounded-lg font-light text-[14px] transition-colors max-w-full truncate" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Outlined</button>
                  <button className="h-12 px-3 rounded-lg font-light text-[14px] transition-colors max-w-full truncate" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Ghost</button>
                  <button className="h-12 px-3 rounded-lg font-light text-[14px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Destructive</button>
                  <button className="h-12 px-3 rounded-lg font-light text-[14px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Muted</button>
                  <button className="h-12 px-3 rounded-lg font-light text-[14px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--success))", color: "hsl(var(--success-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Success</button>
                  <button className="h-12 px-3 rounded-lg font-light text-[14px] transition-colors max-w-full truncate" style={{ backgroundColor: "hsl(var(--warning))", color: "hsl(var(--warning-foreground))", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}>Warning</button>
                </div>
              </div>

              {/* Icons row */}
              <div className="w-full hidden md:block" data-axe-exclude>
                <p className="text-[14px] font-light uppercase tracking-wider mb-2 md:mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>Icons</p>
                <div className="flex flex-row flex-wrap gap-2">
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

          {/* Card Style section */}
          <div id="card-style" className="min-w-0 p-2 md:p-4 space-y-3 mt-8 md:mt-12 scroll-mt-16">
            <div className="flex items-center flex-wrap gap-2 sm:gap-4" data-axe-exclude>
              <h2 className="text-[20px] font-normal uppercase tracking-wider flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>Card Style <a href="#top" className="opacity-30 hover:opacity-70 transition-opacity" aria-label="Back to top"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg></a></h2>
              <div className="ml-auto flex flex-wrap items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setCardCssVisible(!cardCssVisible)}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  <span className="truncate"><span className="sm:hidden">{cardCssVisible ? "Hide" : "CSS"}</span><span className="hidden sm:inline">{cardCssVisible ? "Hide CSS" : "Show CSS"}</span></span>
                </button>
                <button
                  onClick={() => setShowCardResetModal(true)}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" /></svg>
                  <span className="truncate">Reset</span>
                </button>
              </div>
            </div>

            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-4 rounded-lg p-3" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
              {(["liquid-glass", "solid", "gradient", "border-only"] as const).map((key) => {
                const labels: Record<string, string> = { "liquid-glass": "Liquid Glass", solid: "Solid Color", gradient: "Gradient", "border-only": "Border Only" };
                const icons: Record<string, React.ReactNode> = {
                  "liquid-glass": <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
                  solid: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" /></svg>,
                  gradient: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 20L20 4" /></svg>,
                  "border-only": <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="4" y="4" width="16" height="16" rx="1" strokeDasharray="4 2" /></svg>,
                };
                const active = cardStyle.preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectCardPreset(key)}
                    className="h-12 px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
                    style={active
                      ? { backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }
                      : { backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }
                    }
                  >
                    {icons[key]}
                    {labels[key]}
                  </button>
                );
              })}
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
                    <span className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>Card Style CSS</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cardCss);
                          setCardCssCopied(true);
                          setTimeout(() => setCardCssCopied(false), 2000);
                        }}
                        className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                      >
                        {cardCssCopied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => setCardCssVisible(false)}
                        className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
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
                  const brandHsl = colors["--brand"] || "220 70% 50%";
                  const secondaryHsl = colors["--secondary"] || "220 30% 60%";
                  const accentHsl = colors["--accent"] || "220 50% 55%";

                  let previewTextColor: string;
                  let previewSubtextColor: string;

                  if (cardStyle.preset === "border-only") {
                    // Border-only: no card bg, text sits on page background
                    const pageBg = colors["--background"] || "0 0% 100%";
                    previewTextColor = `hsl(${fgForBg(pageBg)})`;
                    previewSubtextColor = previewTextColor;
                  } else if (cardStyle.bgType === "gradient") {
                    previewTextColor = `hsl(${fgForBg(brandHsl)})`;
                    previewSubtextColor = previewTextColor;
                  } else if (cardStyle.bgType === "transparent" || cardStyle.bgOpacity < 0.4) {
                    // When glass bg is showing, use white text since the gradient backdrop is typically dark
                    previewTextColor = "#ffffff";
                    previewSubtextColor = "rgba(255,255,255,0.85)";
                  } else {
                    // Solid card: compute accessible text color from the card background
                    const cardBg = colors["--card"] || "0 0% 100%";
                    previewTextColor = `hsl(${fgForBg(cardBg)})`;
                    previewSubtextColor = previewTextColor;
                  }

                  const showGlassBg = cardStyle.preset !== "border-only" && (cardStyle.bgType === "transparent" || cardStyle.bgOpacity < 1 || cardStyle.backdropBlur > 0);

                  return (
                    <>
                    <style>{`
                      @keyframes ds-glass-gradient {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                      }
                      @keyframes ds-glass-float-1 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(15px, -20px) scale(1.1); }
                        66% { transform: translate(-10px, 10px) scale(0.95); }
                      }
                      @keyframes ds-glass-float-2 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(-12px, 15px) scale(1.05); }
                        66% { transform: translate(18px, -8px) scale(0.9); }
                      }
                      @keyframes ds-glass-float-3 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(10px, 12px) scale(0.9); }
                        66% { transform: translate(-15px, -15px) scale(1.1); }
                      }
                    `}</style>
                    {showGlassBg ? (
                      /* Glass: outer gradient container with inset glass card */
                      <div
                        className="relative w-full md:max-w-[320px] overflow-hidden flex flex-col"
                        style={{
                          minHeight: "240px",
                          borderRadius: `${cardStyle.borderRadius}px`,
                          background: `linear-gradient(135deg, hsl(${brandHsl}), hsl(${secondaryHsl}), hsl(${accentHsl}), hsl(${brandHsl}))`,
                          backgroundSize: "300% 300%",
                          animation: "ds-glass-gradient 8s ease infinite",
                          padding: "10px",
                        }}
                      >
                        <div className="absolute" style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: `hsl(${brandHsl} / 0.6)`, top: "15%", left: "10%", filter: "blur(20px)", animation: "ds-glass-float-1 6s ease-in-out infinite" }} />
                        <div className="absolute" style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: `hsl(${accentHsl} / 0.5)`, bottom: "15%", right: "12%", filter: "blur(18px)", animation: "ds-glass-float-2 7s ease-in-out infinite" }} />
                        <div className="absolute" style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: `hsl(${secondaryHsl} / 0.4)`, top: "50%", left: "55%", filter: "blur(15px)", animation: "ds-glass-float-3 5s ease-in-out infinite" }} />
                        <div
                          className="relative overflow-hidden flex-1"
                          style={{
                            borderRadius: `${Math.max(0, cardStyle.borderRadius - 4)}px`,
                            background: (() => { const p = (colors["--card"] || "0 0% 100%").trim().split(/\s+/); return p.length >= 3 ? `hsla(${p[0]}, ${p[1]}, ${p[2]}, ${cardStyle.bgOpacity})` : "transparent"; })(),
                            border: cardStyle.borderWidth > 0 ? `${cardStyle.borderWidth}px solid hsl(${colors["--border"] || "0 0% 80%"})` : "none",
                            backdropFilter: cardStyle.backdropBlur > 0 ? `blur(${cardStyle.backdropBlur}px)` : "none",
                            WebkitBackdropFilter: cardStyle.backdropBlur > 0 ? `blur(${cardStyle.backdropBlur}px)` : "none",
                            boxShadow: cardStyle.shadowBlur === 0 && cardStyle.shadowOffsetX === 0 && cardStyle.shadowOffsetY === 0 && cardStyle.shadowSpread === 0
                              ? "none"
                              : `${cardStyle.shadowOffsetX}px ${cardStyle.shadowOffsetY}px ${cardStyle.shadowBlur}px ${cardStyle.shadowSpread}px ${cardStyle.shadowColor}`,
                            padding: "20px",
                          }}
                        >
                          <p className="text-[16px] font-normal mb-1" style={{ color: previewTextColor, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>Card Title</p>
                          <p className="text-[14px] font-light mb-3" style={{ color: previewSubtextColor, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>This is a preview of your card style with customizable shadow, radius, and background.</p>
                          <button
                            className="h-9 px-3 text-[14px] font-light rounded-lg"
                            style={{ backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                          >
                            Action
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Non-glass: single card */
                      <div
                        className="relative w-full md:max-w-[320px] overflow-hidden"
                        style={{
                          minHeight: "240px",
                          borderRadius: `${cardStyle.borderRadius}px`,
                          boxShadow: cardStyle.shadowBlur === 0 && cardStyle.shadowOffsetX === 0 && cardStyle.shadowOffsetY === 0 && cardStyle.shadowSpread === 0
                            ? "none"
                            : `${cardStyle.shadowOffsetX}px ${cardStyle.shadowOffsetY}px ${cardStyle.shadowBlur}px ${cardStyle.shadowSpread}px ${cardStyle.shadowColor}`,
                          background: cardStyle.bgType === "transparent"
                            ? "transparent"
                            : cardStyle.bgType === "gradient"
                              ? `linear-gradient(${cardStyle.bgGradientAngle}deg, hsl(${colors["--brand"] || "220 70% 50%"}), hsl(${colors["--secondary"] || "220 30% 60%"}), hsl(${colors["--accent"] || "220 50% 55%"}))`
                              : `hsl(${colors["--card"] || "0 0% 100%"})`,
                          border: cardStyle.borderWidth > 0 ? `${cardStyle.borderWidth}px solid hsl(${colors["--border"] || "0 0% 80%"})` : "none",
                          padding: "20px",
                        }}
                      >
                        <p className="text-[16px] font-normal mb-1" style={{ color: previewTextColor }}>Card Title</p>
                        <p className="text-[14px] font-light mb-3" style={{ color: previewSubtextColor }}>This is a preview of your card style with customizable shadow, radius, and background.</p>
                        <button
                          className="h-9 px-3 text-[14px] font-light rounded-lg"
                          style={{ backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff" }}
                        >
                          Action
                        </button>
                      </div>
                    )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        {/* Typography section */}
          <div id="typography" className="min-w-0 p-2 md:p-4 space-y-3 mt-8 md:mt-12 scroll-mt-16">
            <div className="flex items-center flex-wrap gap-2 sm:gap-4" data-axe-exclude>
              <h2 className="text-[20px] font-normal uppercase tracking-wider flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>Typography <a href="#top" className="opacity-30 hover:opacity-70 transition-opacity" aria-label="Back to top"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg></a></h2>
              <div className="ml-auto flex flex-wrap items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setTypoCssVisible(!typoCssVisible)}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  <span className="truncate"><span className="sm:hidden">{typoCssVisible ? "Hide" : "CSS"}</span><span className="hidden sm:inline">{typoCssVisible ? "Hide CSS" : "Show CSS"}</span></span>
                </button>
                <button
                  onClick={() => setShowTypoResetModal(true)}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" /></svg>
                  <span className="truncate">Reset</span>
                </button>
              </div>
            </div>

            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-4 rounded-lg p-3" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
              {(["modern", "classic", "compact", "editorial"] as const).map((key) => {
                const labels: Record<string, string> = { modern: "Modern", classic: "Classic", compact: "Compact", editorial: "Editorial" };
                const icons: Record<string, React.ReactNode> = {
                  modern: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                  classic: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
                  compact: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
                  editorial: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
                };
                const active = typographyState.preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectTypoPreset(key)}
                    className="h-12 px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
                    style={active
                      ? { backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }
                      : { backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }
                    }
                  >
                    {icons[key]}
                    {labels[key]}
                  </button>
                );
              })}
            </div>

            {/* Typography CSS output */}
            {typoCssVisible && (() => {
              const typoCss = `:root {\n  --font-heading: ${typographyState.headingFamily};\n  --font-body: ${typographyState.bodyFamily};\n  --font-size-base: ${typographyState.baseFontSize}px;\n  --font-weight-heading: ${typographyState.headingWeight};\n  --font-weight-body: ${typographyState.bodyWeight};\n  --line-height: ${typographyState.lineHeight};\n  --letter-spacing: ${typographyState.letterSpacing}em;\n  --letter-spacing-heading: ${typographyState.headingLetterSpacing}em;\n}`;
              return (
                <div className="rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <span className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>Typography CSS</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(typoCss);
                          setTypoCssCopied(true);
                          setTimeout(() => setTypoCssCopied(false), 2000);
                        }}
                        className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                      >
                        {typoCssCopied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => setTypoCssVisible(false)}
                        className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
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
                  className="w-full md:max-w-[320px] rounded-lg p-5 space-y-3"
                  data-axe-exclude
                  style={{
                    backgroundColor: "hsl(var(--card))",
                    color: "hsl(var(--card-foreground))",
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
                      color: "hsl(var(--card-foreground) / 0.7)",
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
                      color: "hsl(var(--card-foreground) / 0.7)",
                    }}
                  >
                    Small / Caption text for secondary information and labels.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts section */}
          <div id="alerts" className="min-w-0 p-2 md:p-4 space-y-3 mt-8 md:mt-12 scroll-mt-16">
            <div className="flex items-center flex-wrap gap-2 sm:gap-4" data-axe-exclude>
              <h2 className="text-[20px] font-normal uppercase tracking-wider flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>Alerts <a href="#top" className="opacity-30 hover:opacity-70 transition-opacity" aria-label="Back to top"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg></a></h2>
              <div className="ml-auto flex flex-wrap items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setAlertCssVisible(!alertCssVisible)}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  <span className="truncate"><span className="sm:hidden">{alertCssVisible ? "Hide" : "CSS"}</span><span className="hidden sm:inline">{alertCssVisible ? "Hide CSS" : "Show CSS"}</span></span>
                </button>
                <button
                  onClick={() => setShowAlertResetModal(true)}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" /></svg>
                  <span className="truncate">Reset</span>
                </button>
              </div>
            </div>

            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-4 rounded-lg p-3" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
              {(["filled", "soft", "outline", "minimal"] as const).map((key) => {
                const labels: Record<string, string> = { filled: "Filled", soft: "Soft", outline: "Outline", minimal: "Minimal" };
                const icons: Record<string, React.ReactNode> = {
                  filled: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                  soft: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                  outline: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="3" /></svg>,
                  minimal: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M3 4v16" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h13" /></svg>,
                };
                const active = alertStyle.preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectAlertPreset(key)}
                    className="h-12 px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
                    style={active
                      ? { backgroundColor: "hsl(var(--brand))", color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }
                      : { backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }
                    }
                  >
                    {icons[key]}
                    {labels[key]}
                  </button>
                );
              })}
            </div>

            {/* Alert CSS output */}
            {alertCssVisible && (() => {
              const alertCss = `:root {\n  --alert-radius: ${alertStyle.borderRadius}px;\n  --alert-border-width: ${alertStyle.borderWidth}px;\n  --alert-padding: ${alertStyle.padding}px;\n}`;
              return (
                <div className="rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <span className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>Alert Style CSS</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(alertCss);
                          setAlertCssCopied(true);
                          setTimeout(() => setAlertCssCopied(false), 2000);
                        }}
                        className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                      >
                        {alertCssCopied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => setAlertCssVisible(false)}
                        className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <pre className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed font-mono" style={{ color: "hsl(var(--card-foreground))" }}>
                    <code>{alertCss}</code>
                  </pre>
                </div>
              );
            })()}

            {/* Controls + Preview */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Slider controls */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="space-y-1.5">
                  <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Shape</p>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Border Radius: {alertStyle.borderRadius}px</span>
                    <input type="range" min={0} max={24} value={alertStyle.borderRadius} onChange={e => updateAlertStyle({ borderRadius: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Border Width: {alertStyle.borderWidth}px</span>
                    <input type="range" min={0} max={4} value={alertStyle.borderWidth} onChange={e => updateAlertStyle({ borderWidth: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Padding: {alertStyle.padding}px</span>
                    <input type="range" min={8} max={32} value={alertStyle.padding} onChange={e => updateAlertStyle({ padding: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                </div>
              </div>

              {/* Live preview */}
              <div className="flex-1 min-w-0 flex items-start justify-center pt-2">
                <div className="w-full md:max-w-[400px] space-y-3" data-axe-exclude>
                  {(() => {
                    const alertTypes = [
                      { key: "success", label: "Success", message: "Operation completed successfully.", colorVar: "--success", fgVar: "--success-foreground", iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                      { key: "warning", label: "Warning", message: "Please review before continuing.", colorVar: "--warning", fgVar: "--warning-foreground", iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
                      { key: "error", label: "Error", message: "Something went wrong. Try again.", colorVar: "--destructive", fgVar: "--destructive-foreground", iconPath: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
                      { key: "info", label: "Info", message: "Here is some useful information.", colorVar: "--brand", fgVar: null, iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                    ];

                    return alertTypes.map(({ key, label, message, colorVar, fgVar, iconPath }) => {
                      const colorRef = `var(${colorVar})`;
                      const fgRef = fgVar ? `var(${fgVar})` : null;
                      const preset = alertStyle.preset;

                      // For "soft" preset we need the actual HSL values to apply opacity
                      const colorHsl = colors[colorVar] || "220 70% 50%";

                      let bgStyle: string;
                      let textColor: string;
                      let borderStyle: string;
                      let leftBorder = "";

                      if (preset === "filled") {
                        bgStyle = `hsl(${colorRef})`;
                        textColor = fgRef ? `hsl(${fgRef})` : (colors[colorVar] ? `hsl(${fgForBg(colors[colorVar])})` : "#fff");
                        borderStyle = "none";
                      } else if (preset === "soft") {
                        const parts = colorHsl.trim().split(/\s+/);
                        bgStyle = parts.length >= 3 ? `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, 0.12)` : `hsl(${colorRef})`;
                        textColor = `hsl(${colorRef})`;
                        borderStyle = "none";
                      } else if (preset === "outline") {
                        bgStyle = "transparent";
                        textColor = `hsl(${colorRef})`;
                        borderStyle = `${alertStyle.borderWidth}px solid hsl(${colorRef})`;
                      } else {
                        // minimal
                        bgStyle = "transparent";
                        textColor = `hsl(${colorRef})`;
                        borderStyle = "none";
                        leftBorder = `3px solid hsl(${colorRef})`;
                      }

                      return (
                        <div
                          key={key}
                          className="flex items-start gap-3"
                          style={{
                            backgroundColor: bgStyle,
                            color: textColor,
                            borderRadius: preset === "minimal" ? 0 : `${alertStyle.borderRadius}px`,
                            border: borderStyle,
                            borderLeft: leftBorder || borderStyle,
                            padding: `${alertStyle.padding}px`,
                          }}
                        >
                          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium">{label}</p>
                            <p className="text-[13px] font-light opacity-90">{message}</p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Alert Reset Confirmation Modal */}
          {showAlertResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="alert-reset-modal-title">
              <div className="rounded-lg shadow-xl p-6 w-full max-w-sm mx-4" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}>
                <h4 id="alert-reset-modal-title" className="text-2xl font-light mb-2">
                  Reset Alert Style?
                </h4>
                <p className="text-[14px] mb-4" style={{ color: "hsl(var(--card-foreground))" }}>
                  This will revert all alert style settings to their defaults. Any customizations will be lost.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAlertResetModal(false)}
                    className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "transparent", color: "hsl(var(--card-foreground))" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { handleResetAlertStyle(); setShowAlertResetModal(false); }}
                    className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* PR Section Picker Modal */}
      {showPrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowPrModal(false)}>
          <div className="rounded-xl p-6 w-[340px] shadow-xl" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }} onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-light mb-4">Open Pull Request</h3>
            <p className="text-[14px] font-light mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>Select sections to include:</p>
            <div className="flex flex-col gap-3 mb-6">
              {(["colors", "card", "typography", "alerts"] as const).map(section => {
                const labels: Record<string, string> = { colors: "Colors", card: "Card Style", typography: "Typography", alerts: "Alerts" };
                return (
                  <label key={section} className="flex items-center gap-3 cursor-pointer text-[14px] font-light">
                    <input
                      type="checkbox"
                      checked={prSections.has(section)}
                      onChange={() => {
                        setPrSections(prev => {
                          const next = new Set(prev);
                          if (next.has(section)) next.delete(section);
                          else next.add(section);
                          return next;
                        });
                      }}
                      className="w-4 h-4 rounded"
                    />
                    {labels[section]}
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPrModal(false)}
                className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: "transparent", color: "hsl(var(--card-foreground))" }}
              >
                Cancel
              </button>
              <button
                disabled={prSections.size === 0 || (sectionPrStatus["main"]?.status === 'creating')}
                onClick={() => {
                  submitPr(prSections, "main");
                  setShowPrModal(false);
                }}
                className="px-4 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}
              >
                {sectionPrStatus["main"]?.status === 'creating' ? 'Preparing...' : `Submit PR (${prSections.size})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

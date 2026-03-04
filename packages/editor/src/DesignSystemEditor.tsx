import React, { Suspense, useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { AxeResults } from "axe-core";
import type { DesignSystemEditorProps } from "./types";
import { useColorState } from "./hooks/useColorState";
import { LicenseProvider, useLicense } from "./hooks/useLicense";
import { PremiumGate } from "./components/PremiumGate";
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
  INTERACTION_STYLE_KEY,
  DEFAULT_INTERACTION_STYLE,
  INTERACTION_PRESETS,
  applyInteractionStyle,
  applyStoredInteractionStyle,
  removeInteractionStyleProperties,
  TYPO_INTERACTION_STYLE_KEY,
  DEFAULT_TYPO_INTERACTION_STYLE,
  TYPO_INTERACTION_PRESETS,
  applyTypoInteractionStyle,
  applyStoredTypoInteractionStyle,
  removeTypoInteractionStyleProperties,
  serializeThemeState,
  deserializeThemeState,
  generateDesignTokens,
  generateSectionDesignTokens,
  exportPaletteAsText,
  exportPaletteAsSvg,
  exportPaletteAsPng,
  getCustomFonts,
  addCustomFont,
  removeCustomFont,
  initCustomFonts,
} from "./utils/themeUtils";
import type { CustomFontEntry } from "./utils/themeUtils";
import type { CardStyleState, TypographyState, AlertStyleState, InteractionStyleState, TypoInteractionStyleState } from "./utils/themeUtils";
import { extractPaletteFromImage, extractPaletteFromUrl } from "./utils/extractPalette";
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


function DesignSystemEditorInner({
  prEndpointUrl,
  accessibilityAudit = true,
  onChange,
  onExport,
  className,
  showNavLinks = true,
  showHeader = true,
  upgradeUrl,
  signInUrl,
  headerRight,
}: DesignSystemEditorProps) {
  const { isPremium } = useLicense();
  const [hoveredLockKey, setHoveredLockKey] = useState<string | null>(null);
  const {
    colors,
    setColors,
    lockedKeys,
    setLockedKeys,
    prevColors,
    setPrevColors,
    readCurrentColors,
  } = useColorState();

  const [activeSection, setActiveSection] = useState<string>("colors");

  useEffect(() => {
    const ids = ["colors", "card", "alerts", "typography", "buttons"];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showCardResetModal, setShowCardResetModal] = useState(false);
  const [showTypoResetModal, setShowTypoResetModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [prSections, setPrSections] = useState<Set<string>>(new Set(["colors", "card", "typography", "alerts", "interactions"]));
  const [showPrModal, setShowPrModal] = useState(false);
  const [showPrSetupModal, setShowPrSetupModal] = useState(false);
  const [sectionPrStatus, setSectionPrStatus] = useState<Record<string, { status: 'idle' | 'creating' | 'created' | 'error' | 'rate-limited'; url?: string; error?: string }>>({});
  const [auditStatus, setAuditStatus] = useState<'idle' | 'running' | 'failed' | 'passed'>('idle');
  const auditTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
  const [cardExportFormat, setCardExportFormat] = useState<"css" | "tokens">("css");
  const [typographyState, setTypographyState] = useState<TypographyState>(() => {
    const saved = storage.get<TypographyState>(TYPOGRAPHY_KEY);
    return saved || { ...DEFAULT_TYPOGRAPHY };
  });
  const [customFonts, setCustomFonts] = useState<CustomFontEntry[]>(() => getCustomFonts());
  const [newFontName, setNewFontName] = useState("");
  const [fontAddError, setFontAddError] = useState("");
  const [fontAddLoading, setFontAddLoading] = useState(false);

  const fontOptions = useMemo(
    () => [
      ...FONT_FAMILY_OPTIONS,
      ...customFonts.map((f) => ({ label: `${f.label} *`, value: f.value })),
    ],
    [customFonts]
  );

  const [typoCssVisible, setTypoCssVisible] = useState(false);
  const [typoCssCopied, setTypoCssCopied] = useState(false);
  const [typoExportFormat, setTypoExportFormat] = useState<"css" | "tokens">("css");
  const [alertStyle, setAlertStyle] = useState<AlertStyleState>(() => {
    const saved = storage.get<AlertStyleState>(ALERT_STYLE_KEY);
    return saved || { ...DEFAULT_ALERT_STYLE };
  });
  const [alertCssVisible, setAlertCssVisible] = useState(false);
  const [alertCssCopied, setAlertCssCopied] = useState(false);
  const [alertExportFormat, setAlertExportFormat] = useState<"css" | "tokens">("css");
  const [showAlertResetModal, setShowAlertResetModal] = useState(false);
  const [interactionStyle, setInteractionStyle] = useState<InteractionStyleState>(() => {
    const saved = storage.get<InteractionStyleState>(INTERACTION_STYLE_KEY);
    return saved || { ...DEFAULT_INTERACTION_STYLE };
  });
  const [interactionCssVisible, setInteractionCssVisible] = useState(false);
  const [interactionCssCopied, setInteractionCssCopied] = useState(false);
  const [interactionExportFormat, setInteractionExportFormat] = useState<"css" | "tokens">("css");
  const [showInteractionResetModal, setShowInteractionResetModal] = useState(false);
  const [typoInteractionStyle, setTypoInteractionStyle] = useState<TypoInteractionStyleState>(() => {
    const saved = storage.get<TypoInteractionStyleState>(TYPO_INTERACTION_STYLE_KEY);
    return saved || { ...DEFAULT_TYPO_INTERACTION_STYLE };
  });
  const [typoInteractionCssVisible, setTypoInteractionCssVisible] = useState(false);
  const [typoInteractionCssCopied, setTypoInteractionCssCopied] = useState(false);
  const [typoInteractionExportFormat, setTypoInteractionExportFormat] = useState<"css" | "tokens">("css");
  const [showTypoInteractionResetModal, setShowTypoInteractionResetModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imagePaletteStatus, setImagePaletteStatus] = useState<'idle' | 'extracting' | 'done' | 'error'>('idle');
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");
  const [exportFormat, setExportFormat] = useState<"css" | "tokens">("css");
  const [shareCopied, setShareCopied] = useState(false);
  const [showPaletteExport, setShowPaletteExport] = useState(false);
  const [paletteExportCopied, setPaletteExportCopied] = useState(false);
  const [pendingImagePalette, setPendingImagePalette] = useState<{ imageUrl: string; palette: Record<string, string> } | null>(null);

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

  // Hydrate from URL hash if present (shareable URL)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const parsed = deserializeThemeState(hash);
    if (!parsed) return;
    // Apply colors
    for (const [key, val] of Object.entries(parsed.colors)) {
      document.documentElement.style.setProperty(key, val);
    }
    setColors(parsed.colors);
    // Apply styles
    setCardStyle(parsed.cardStyle);
    applyCardStyle(parsed.cardStyle, parsed.colors);
    setTypographyState(parsed.typographyState);
    applyTypography(parsed.typographyState);
    setAlertStyle(parsed.alertStyle);
    applyAlertStyle(parsed.alertStyle);
    setInteractionStyle(parsed.interactionStyle);
    applyInteractionStyle(parsed.interactionStyle);
    setTypoInteractionStyle(parsed.typoInteractionStyle);
    applyTypoInteractionStyle(parsed.typoInteractionStyle);
    // Clear hash so it doesn't re-hydrate on state changes
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
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
    initCustomFonts();
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

  const handleAddCustomFont = useCallback(async () => {
    const name = newFontName.trim();
    if (!name) return;
    setFontAddLoading(true);
    setFontAddError("");
    try {
      await addCustomFont(name);
      setCustomFonts(getCustomFonts());
      setNewFontName("");
    } catch (err: unknown) {
      setFontAddError(err instanceof Error ? err.message : "Failed to add font");
    } finally {
      setFontAddLoading(false);
    }
  }, [newFontName]);

  const handleRemoveCustomFont = useCallback((label: string) => {
    const fonts = getCustomFonts();
    const entry = fonts.find((f) => f.label === label);
    removeCustomFont(label);
    setCustomFonts(getCustomFonts());
    // Reset heading/body if the removed font was in use
    if (entry) {
      const defaultFamily = FONT_FAMILY_OPTIONS[0].value;
      const patch: Partial<TypographyState> = {};
      if (typographyState.headingFamily === entry.value) patch.headingFamily = defaultFamily;
      if (typographyState.bodyFamily === entry.value) patch.bodyFamily = defaultFamily;
      if (Object.keys(patch).length) updateTypography(patch);
    }
  }, [typographyState, updateTypography]);

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

  useEffect(() => {
    applyInteractionStyle(interactionStyle);
  }, [interactionStyle]);

  useEffect(() => {
    applyStoredInteractionStyle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateInteractionStyle = useCallback((patch: Partial<InteractionStyleState>) => {
    setInteractionStyle(prev => {
      const next = { ...prev, ...patch };
      if (patch.preset === undefined && prev.preset !== "custom") {
        next.preset = "custom";
      }
      return next;
    });
  }, []);

  const selectInteractionPreset = useCallback((presetKey: string) => {
    const preset = INTERACTION_PRESETS[presetKey];
    if (preset) {
      setInteractionStyle({ ...preset });
    }
  }, []);

  const handleResetInteractionStyle = () => {
    storage.remove(INTERACTION_STYLE_KEY);
    removeInteractionStyleProperties();
    setInteractionStyle({ ...DEFAULT_INTERACTION_STYLE });
  };

  useEffect(() => {
    applyTypoInteractionStyle(typoInteractionStyle);
  }, [typoInteractionStyle]);

  useEffect(() => {
    applyStoredTypoInteractionStyle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTypoInteractionStyle = useCallback((patch: Partial<TypoInteractionStyleState>) => {
    setTypoInteractionStyle(prev => {
      const next = { ...prev, ...patch };
      if (patch.preset === undefined && prev.preset !== "custom") {
        next.preset = "custom";
      }
      return next;
    });
  }, []);

  const selectTypoInteractionPreset = useCallback((presetKey: string) => {
    const preset = TYPO_INTERACTION_PRESETS[presetKey];
    if (preset) {
      setTypoInteractionStyle({ ...preset });
    }
  }, []);

  const handleResetTypoInteractionStyle = () => {
    storage.remove(TYPO_INTERACTION_STYLE_KEY);
    removeTypoInteractionStyleProperties();
    setTypoInteractionStyle({ ...DEFAULT_TYPO_INTERACTION_STYLE });
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
        case "interactions":
          vars += `  --hover-opacity: ${interactionStyle.hoverOpacity};\n`;
          vars += `  --hover-scale: ${interactionStyle.hoverScale};\n`;
          vars += `  --active-scale: ${interactionStyle.activeScale};\n`;
          vars += `  --transition-duration: ${interactionStyle.transitionDuration}ms;\n`;
          vars += `  --focus-ring-width: ${interactionStyle.focusRingWidth}px;\n`;
          vars += `  --focus-ring-color: hsl(var(--ring));\n`;
          break;
      }
    }
    return `:root {\n${vars}}`;
  }, [colors, cardStyle, typographyState, alertStyle, interactionStyle]);

  const submitPr = useCallback(async (sections: Iterable<string>, statusKey: string) => {
    if (!isPremium || !prEndpointUrl) return;
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
  }, [isPremium, prEndpointUrl, buildSectionCss]);

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
    css += "\n  /* Interactions */\n";
    css += `  --hover-opacity: ${interactionStyle.hoverOpacity};\n`;
    css += `  --hover-scale: ${interactionStyle.hoverScale};\n`;
    css += `  --active-scale: ${interactionStyle.activeScale};\n`;
    css += `  --transition-duration: ${interactionStyle.transitionDuration}ms;\n`;
    css += `  --focus-ring-width: ${interactionStyle.focusRingWidth}px;\n`;
    css += `  --focus-ring-color: hsl(var(--ring));\n`;
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
    if (!isPremium) return;
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
    if (!isPremium || !prevColors) return;
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

  const handleImagePalette = async (file: File) => {
    try {
      setImagePaletteStatus('extracting');
      const palette = await extractPaletteFromImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPendingImagePalette({ imageUrl, palette });
      setImagePaletteStatus('idle');
    } catch (err) {
      console.error("Image palette extraction failed:", err);
      setImagePaletteStatus('error');
      setTimeout(() => setImagePaletteStatus('idle'), 3000);
    }
  };

  const handleImageUrlSubmit = async () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setImageUrlError("Please enter a valid URL");
      return;
    }
    setImageUrlError("");
    try {
      setImagePaletteStatus('extracting');
      const palette = await extractPaletteFromUrl(url);
      setPendingImagePalette({ imageUrl: url, palette });
      setImagePaletteStatus('idle');
      setImageUrlInput("");
    } catch (err) {
      console.error("Image URL palette extraction failed:", err);
      setImageUrlError("Failed to load image. The server may block cross-origin requests.");
      setImagePaletteStatus('error');
      setTimeout(() => setImagePaletteStatus('idle'), 3000);
    }
  };

  const applyImagePalette = (palette: Record<string, string>) => {
    setPrevColors({ ...colors });

    let newColors = { ...colors };
    const brandDerived = derivePaletteFromChange("--brand", palette["--brand"], newColors, lockedKeys);
    newColors = { ...newColors, ...brandDerived, "--brand": palette["--brand"] };

    for (const key of ["--secondary", "--accent", "--background", "--foreground"] as const) {
      if (lockedKeys.has(key)) continue;
      const derived = derivePaletteFromChange(key, palette[key], newColors, lockedKeys);
      newColors = { ...newColors, ...derived, [key]: palette[key] };
    }

    const contrastFixes = autoAdjustContrast(newColors, lockedKeys);
    newColors = { ...newColors, ...contrastFixes };

    const history = storage.get<{ key: string; previousValue: string }[]>(COLOR_HISTORY_KEY) || [];
    const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    const finalColors = { ...colors };

    for (const [key, val] of Object.entries(newColors)) {
      if (val !== colors[key]) {
        history.push({ key, previousValue: finalColors[key] || '' });
        document.documentElement.style.setProperty(key, val);
        finalColors[key] = val;
        pending[key] = val;
      }
    }

    storage.set(COLOR_HISTORY_KEY, history);
    setColors(finalColors);
    storage.set(PENDING_COLORS_KEY, pending);
    window.dispatchEvent(new Event('theme-pending-update'));
    setHarmonySchemeIndex(-1);
    fireOnChange(finalColors);
    if (accessibilityAudit) runAccessibilityAudit();
    setImagePaletteStatus('done');
    setTimeout(() => setImagePaletteStatus('idle'), 3000);
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
    storage.remove(INTERACTION_STYLE_KEY);
    removeInteractionStyleProperties();
    setInteractionStyle({ ...DEFAULT_INTERACTION_STYLE });
    storage.remove(TYPO_INTERACTION_STYLE_KEY);
    removeTypoInteractionStyleProperties();
    setTypoInteractionStyle({ ...DEFAULT_TYPO_INTERACTION_STYLE });
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
    if (!isPremium) return;
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
      {showHeader && <div className="pt-4 sm:pt-6 lg:pt-8 pb-2 sm:pb-3" style={{ backgroundColor: "hsl(var(--background))" }}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Title + nav links — single header row */}
          <div className="w-full mb-4 flex items-end gap-x-4 pt-4">
            <a href="#top" className="flex-shrink-0 leading-none" style={{ color: "hsl(var(--foreground))" }}>
              <svg className="h-10 block" viewBox="0 0 1654 514" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Themal">
                <path d="M0 21.3583C0 9.56245 9.56242 0 21.3583 0H128.15V153.78H21.3583C9.56242 153.78 0 144.217 0 132.421V21.3583Z" fill="#FC0000"/>
                <path d="M434 21.3583C434 9.56245 424.438 0 412.642 0H305.85V153.78H412.642C424.438 153.78 434 144.217 434 132.421V21.3583Z" fill="#0095FE"/>
                <path d="M128.15 153.78H217V329.772H128.15V153.78Z" fill="#FF8100"/>
                <path d="M128.15 0H217V153.78H128.15V0Z" fill="#FF4900"/>
                <path d="M128.15 329.772H217V505.764H149.508C137.712 505.764 128.15 496.201 128.15 484.406V329.772Z" fill="#FFB601"/>
                <path d="M217 153.78H305.85V329.772H217V153.78Z" fill="#15C58E"/>
                <path d="M217 0H305.85V153.78H217V0Z" fill="#3CBB0E"/>
                <path d="M217 329.772H305.85V484.406C305.85 496.201 296.288 505.764 284.492 505.764H217V329.772Z" fill="#8831F9"/>
                <path d="M596.006 198.766V235.338H492.559V505.764H450.344V235.338H346.896V198.766H596.006Z" fill="currentColor"/>
                <path d="M612.114 197.721H649.732V312.244C658.648 300.959 666.659 293.018 673.765 288.42C685.886 280.479 701.002 276.508 719.114 276.508C751.577 276.508 773.59 287.863 785.153 310.572C791.423 322.972 794.558 340.179 794.558 362.192V505.764H755.896V364.699C755.896 348.259 753.806 336.208 749.626 328.545C742.799 316.285 729.982 310.154 711.173 310.154C695.569 310.154 681.428 315.518 668.749 326.246C656.071 336.974 649.732 357.246 649.732 387.061V505.764H612.114V197.721Z" fill="currentColor"/>
                <path d="M926.444 276.926C942.326 276.926 957.722 280.688 972.629 288.211C987.537 295.595 998.892 305.208 1006.69 317.051C1014.22 328.336 1019.23 341.502 1021.74 356.549C1023.97 366.859 1025.08 383.299 1025.08 405.869H861.031C861.728 428.579 867.092 446.83 877.123 460.623C887.155 474.277 902.689 481.104 923.727 481.104C943.371 481.104 959.045 474.625 970.748 461.668C977.436 454.145 982.173 445.437 984.959 435.545H1021.95C1020.97 443.765 1017.7 452.96 1012.13 463.131C1006.69 473.162 1000.56 481.382 993.737 487.791C982.312 498.937 968.171 506.46 951.313 510.361C942.257 512.591 932.017 513.705 920.592 513.705C892.727 513.705 869.112 503.604 849.746 483.402C830.38 463.061 820.698 434.639 820.698 398.137C820.698 362.192 830.45 333.003 849.955 310.572C869.461 288.141 894.957 276.926 926.444 276.926ZM986.422 375.984C984.89 359.684 981.337 346.657 975.764 336.904C965.454 318.792 948.248 309.736 924.145 309.736C906.869 309.736 892.379 316.006 880.676 328.545C868.973 340.945 862.773 356.758 862.076 375.984H986.422Z" fill="currentColor"/>
                <path d="M1054.36 281.942H1091.56V313.707C1100.47 302.701 1108.56 294.69 1115.8 289.674C1128.2 281.175 1142.27 276.926 1158.02 276.926C1175.85 276.926 1190.2 281.315 1201.07 290.092C1207.2 295.108 1212.77 302.492 1217.78 312.244C1226.14 300.262 1235.97 291.415 1247.25 285.703C1258.54 279.852 1271.21 276.926 1285.29 276.926C1315.38 276.926 1335.86 287.793 1346.73 309.527C1352.58 321.231 1355.51 336.974 1355.51 356.758V505.764H1316.43V350.279C1316.43 335.372 1312.66 325.132 1305.14 319.559C1297.76 313.986 1288.7 311.199 1277.97 311.199C1263.2 311.199 1250.46 316.145 1239.73 326.037C1229.14 335.929 1223.85 352.439 1223.85 375.567V505.764H1185.6V359.684C1185.6 344.498 1183.79 333.421 1180.17 326.455C1174.46 316.006 1163.8 310.781 1148.19 310.781C1133.98 310.781 1121.02 316.285 1109.32 327.291C1097.76 338.298 1091.98 358.221 1091.98 387.061V505.764H1054.36V281.942Z" fill="currentColor"/>
                <path d="M1422.61 446.203C1422.61 457.07 1426.58 465.639 1434.52 471.908C1442.46 478.178 1451.86 481.313 1462.73 481.313C1475.97 481.313 1488.78 478.248 1501.18 472.117C1522.08 461.947 1532.53 445.298 1532.53 422.17V391.867C1527.93 394.793 1522.01 397.231 1514.77 399.182C1507.52 401.132 1500.42 402.526 1493.45 403.361L1470.67 406.287C1457.02 408.098 1446.78 410.955 1439.95 414.856C1428.39 421.404 1422.61 431.853 1422.61 446.203ZM1513.72 370.133C1522.36 369.018 1528.14 365.396 1531.07 359.266C1532.74 355.922 1533.58 351.115 1533.58 344.846C1533.58 332.028 1528.98 322.763 1519.78 317.051C1510.73 311.199 1497.7 308.274 1480.7 308.274C1461.06 308.274 1447.13 313.568 1438.91 324.156C1434.31 330.008 1431.31 338.716 1429.92 350.279H1394.81C1395.51 322.693 1404.42 303.537 1421.56 292.809C1438.84 281.942 1458.83 276.508 1481.54 276.508C1507.87 276.508 1529.26 281.524 1545.7 291.555C1562 301.586 1570.15 317.19 1570.15 338.367V467.311C1570.15 471.212 1570.92 474.346 1572.45 476.715C1574.12 479.083 1577.53 480.268 1582.69 480.268C1584.36 480.268 1586.24 480.198 1588.33 480.059C1590.42 479.78 1592.65 479.432 1595.02 479.014V506.809C1589.17 508.481 1584.71 509.526 1581.64 509.943C1578.58 510.361 1574.4 510.57 1569.1 510.57C1556.15 510.57 1546.74 505.973 1540.89 496.777C1537.83 491.901 1535.67 485.005 1534.41 476.088C1526.75 486.119 1515.74 494.827 1501.39 502.211C1487.04 509.595 1471.23 513.287 1453.95 513.287C1433.19 513.287 1416.2 507.018 1402.96 494.479C1389.87 481.8 1383.32 465.987 1383.32 447.039C1383.32 426.28 1389.8 410.188 1402.75 398.764C1415.71 387.339 1432.71 380.304 1453.74 377.656L1513.72 370.133Z" fill="currentColor"/>
                <path d="M1615.93 198.766H1653.55V505.764H1615.93V198.766Z" fill="currentColor"/>
              </svg>
            </a>

            {/* Desktop header actions */}
            <div className="hidden lg:flex items-center gap-3 lg:gap-4 flex-1 min-w-0 ml-6 justify-end">
              <button
                onClick={() => {
                  const hash = serializeThemeState(colors, cardStyle, typographyState, alertStyle, interactionStyle, typoInteractionStyle);
                  window.location.hash = hash;
                  navigator.clipboard.writeText(window.location.href).then(() => {
                    setShareCopied(true);
                    setTimeout(() => setShareCopied(false), 2000);
                  });
                }}
                className="text-[13px] font-light uppercase tracking-wider transition-colors hover:opacity-70 flex items-center gap-1 whitespace-nowrap"
                style={{ color: "hsl(var(--muted-foreground))", lineHeight: 1 }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                <span>{shareCopied ? "Link copied!" : "Share"}</span>
              </button>
            </div>
            {(showNavLinks || headerRight) && (
              <div className="hidden lg:flex ml-auto items-end gap-4 flex-shrink-0">
                {showNavLinks && (
                  <>
                  </>
                )}
                {headerRight}
              </div>
            )}

            {/* Mobile hamburger */}
            <div className="ml-auto flex items-center gap-3 lg:hidden">
              {headerRight}
              <button
                onClick={() => setShowFeaturesModal(true)}
                className="p-2 rounded-lg transition-opacity hover:opacity-70 sm:hidden"
                style={{ color: "hsl(var(--muted-foreground))" }}
                aria-label="Features"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                </svg>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg transition-opacity hover:opacity-70"
                style={{ color: "hsl(var(--foreground))" }}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>}

      <ul className="w-full px-4 sm:px-6 lg:px-8 pt-1.5 hidden sm:block columns-1 sm:columns-2 gap-x-8 text-[13px] font-light list-disc pl-9 sm:pl-11" style={{ color: "hsl(var(--muted-foreground))" }}>
        <li>Real-time color picking with live preview</li>
        <li>Random palette generation with smart derivation</li>
        <li>Color harmony schemes (Complementary, Analogous, Triadic, Split-Complementary)</li>
        <li>Image-based palette extraction via upload</li>
        <li>Dark mode with automatic foreground/background swap</li>
        <li>WCAG AA contrast enforcement</li>
        <li>Typography system with presets and custom Google Fonts</li>
        <li>Card, alert, and button style presets</li>
        <li>Per-section CSS and Design Token export</li>
        <li>Shareable URLs for full theme state</li>
        <li>Accessibility audit via axe-core</li>
        <li>GitHub PR integration</li>
      </ul>

      {/* Features modal (mobile) */}
      {showFeaturesModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden" onClick={() => setShowFeaturesModal(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative w-full rounded-t-2xl px-6 py-6 pb-10 max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: "hsl(var(--muted-foreground) / 0.3)" }} />
            <h3 className="text-[16px] font-medium mb-3">Features</h3>
            <ul className="space-y-2 text-[14px] font-light list-disc pl-5" style={{ color: "hsl(var(--card-foreground))" }}>
              <li>Real-time color picking with live preview</li>
              <li>Random palette generation with smart derivation</li>
              <li>Color harmony schemes (Complementary, Analogous, Triadic, Split-Complementary)</li>
              <li>Image-based palette extraction via upload</li>
              <li>Dark mode with automatic foreground/background swap</li>
              <li>WCAG AA contrast enforcement</li>
              <li>Typography system with presets and custom Google Fonts</li>
              <li>Card, alert, and button style presets</li>
              <li>Per-section CSS and Design Token export</li>
              <li>Shareable URLs for full theme state</li>
              <li>Accessibility audit via axe-core</li>
              <li>GitHub PR integration</li>
            </ul>
            <button
              onClick={() => setShowFeaturesModal(false)}
              className="mt-4 w-full h-10 text-[14px] font-medium rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile-only Open PR */}
      <div className="sm:hidden w-full px-4 pt-4 [&_.ds-premium-gated-inline]:w-full [&_.ds-premium-gated-inline]:flex [&_.ds-premium-locked-content]:w-full">
        <PremiumGate feature="pr-integration" variant="inline" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
        {(() => {
          const mainSt = sectionPrStatus["main"] || { status: 'idle' as const };
          return (
          <div className="w-full flex flex-col gap-2">
            {prEndpointUrl && mainSt.status === 'created' && (
              <div className="flex items-center gap-2 text-[13px] font-light text-green-600 dark:text-green-400">
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
            {prEndpointUrl && mainSt.status === 'rate-limited' && mainSt.error && (
              <span className="text-[13px] font-light text-yellow-700 dark:text-yellow-300">
                {mainSt.error}
              </span>
            )}
            <button
              disabled={mainSt.status === 'creating'}
              onClick={() => {
                if (mainSt.status === 'creating') return;
                setShowPrSetupModal(true);
              }}
              className={`w-full h-10 text-[14px] font-medium uppercase tracking-wider transition-colors hover:opacity-90 flex items-center justify-center gap-2 whitespace-nowrap rounded-md ${
                mainSt.status === 'error' || mainSt.status === 'rate-limited'
                  ? 'text-red-600 dark:text-red-400'
                  : ''
              }`}
              style={{
                backgroundColor: mainSt.status === 'error' || mainSt.status === 'rate-limited' ? undefined : "hsl(var(--brand))",
                color: mainSt.status === 'error' || mainSt.status === 'rate-limited' ? undefined : (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff"),
                lineHeight: 1,
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
              <span>{mainSt.status === 'creating' ? 'Preparing...' : mainSt.status === 'error' ? 'Retry PR' : mainSt.status === 'rate-limited' ? 'Retry PR' : 'Open PR'}</span>
            </button>
          </div>
          );
        })()}
        </PremiumGate>
      </div>

      {/* Section nav */}
      <nav className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-10 pb-1 hidden sm:flex items-center justify-between gap-3 lg:gap-4 flex-wrap" style={{ backgroundColor: "hsl(var(--background))" }}>
        {[
          { id: "colors", label: "Colors", icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" /></svg> },
          { id: "card", label: "Cards", icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg> },
          { id: "alerts", label: "Alerts", icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg> },
          { id: "typography", label: "Typography", icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg> },
          { id: "buttons", label: "Buttons", icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" /></svg> },
        ].map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-[20px] font-light uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 no-underline ds-nav-link"
            style={{
              color: activeSection === s.id ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
              lineHeight: 1,
              borderBottom: activeSection === s.id ? "1px solid hsl(var(--foreground))" : "1px solid transparent",
              paddingBottom: 2,
            }}
          >
            <span>{s.label}</span>
            <svg className="w-5 h-5 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-7-7m7 7l7-7" /></svg>
          </a>
        ))}
        <PremiumGate feature="pr-integration" variant="inline" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
        {(() => {
          const mainSt = sectionPrStatus["main"] || { status: 'idle' as const };
          return (
          <div className="flex items-center gap-2">
            {prEndpointUrl && mainSt.status === 'created' && (
              <div className="flex items-center gap-2 text-[13px] font-light text-green-600 dark:text-green-400">
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
            {prEndpointUrl && mainSt.status === 'rate-limited' && mainSt.error && (
              <span className="text-[13px] font-light text-yellow-700 dark:text-yellow-300">
                {mainSt.error}
              </span>
            )}
            <button
              disabled={mainSt.status === 'creating'}
              onClick={() => {
                if (mainSt.status === 'creating') return;
                setShowPrSetupModal(true);
              }}
              className={`h-10 px-4 text-[14px] font-medium uppercase tracking-wider transition-colors hover:opacity-90 flex items-center justify-center gap-2 whitespace-nowrap rounded-md ${
                mainSt.status === 'error' || mainSt.status === 'rate-limited'
                  ? 'text-red-600 dark:text-red-400'
                  : ''
              }`}
              style={{
                backgroundColor: mainSt.status === 'error' || mainSt.status === 'rate-limited' ? undefined : "hsl(var(--brand))",
                color: mainSt.status === 'error' || mainSt.status === 'rate-limited' ? undefined : (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff"),
                lineHeight: 1,
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
              <span>{mainSt.status === 'creating' ? 'Preparing...' : mainSt.status === 'error' ? 'Retry PR' : mainSt.status === 'rate-limited' ? 'Retry PR' : 'Open PR'}</span>
            </button>
          </div>
          );
        })()}
        </PremiumGate>
      </nav>

      <section className="pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">

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


          {/* Colors section */}
          <div id="colors" className="min-w-0 p-2 md:p-4 space-y-3 scroll-mt-28">
            <div className="flex items-center flex-wrap gap-2 sm:gap-4" data-axe-exclude>
              <h2 className="text-[20px] font-normal uppercase tracking-wider flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>Colors <a href="#top" className="opacity-30 hover:opacity-100 transition-all hover:scale-125" aria-label="Back to top"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg></a></h2>
              <div className="ml-auto flex items-center">
              {/* Mobile: dropdown */}
              <select
                className="sm:hidden h-8 px-2 text-[13px] font-light rounded-md border"
                style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
                value=""
                onChange={e => {
                  const v = e.target.value;
                  if (v === "default") { setHarmonySchemeIndex(-1); handleGenerate(); }
                  else if (v === "refresh") handleGenerate();
                  else if (v === "upload") fileInputRef.current?.click();
                  else if (v === "export") setShowPaletteExport(true);
                  else if (v === "css") { setExportFormat("css"); generateCode(); }
                  else if (v === "tokens") { setExportFormat("tokens"); generateCode(); }
                  else if (v === "reset") setShowResetModal(true);
                  e.target.value = "";
                }}
              >
                <option value="" disabled>Actions…</option>
                <option value="default">Default Scheme</option>
                <option value="refresh">Refresh</option>
                <option value="upload">Upload Image</option>
                <option value="export">Export Palette</option>
                <option value="css">CSS</option>
                <option value="tokens">Tokens</option>
                <option value="reset">Reset</option>
              </select>
              {/* Hidden file input - outside desktop wrapper so mobile dropdown can access it */}
              <PremiumGate feature="image-palette" variant="inline" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImagePalette(file);
                    e.target.value = '';
                  }}
                />
              </PremiumGate>
              {/* Desktop: buttons */}
              <div className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2">
              <PremiumGate feature="harmony-schemes" variant="inline" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
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
              </PremiumGate>
              <div className="flex items-center">
                <button
                  onClick={handleGenerate}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  <span className="truncate">Refresh</span>
                </button>
                {prevColors && (
                  <PremiumGate feature="undo" variant="inline" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
                  <button
                    onClick={handleUndo}
                    aria-label="Undo last color change"
                    className="h-10 pl-1 pr-2 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 010 10H9m-6-10l4-4m-4 4l4 4" /></svg>
                  </button>
                  </PremiumGate>
                )}
              </div>
                <PremiumGate feature="image-palette" variant="inline" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                  title="Upload an image to extract a color palette from it"
                >
                  {imagePaletteStatus === 'extracting' ? (
                    <svg className="w-4 h-4 flex-shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  ) : imagePaletteStatus === 'done' ? (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  ) : imagePaletteStatus === 'error' ? (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  ) : (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" /></svg>
                  )}
                  <span className="truncate">{imagePaletteStatus === 'extracting' ? 'Extracting...' : imagePaletteStatus === 'done' ? 'Palette applied' : imagePaletteStatus === 'error' ? 'Failed' : 'Upload Image'}</span>
                </button>
                </PremiumGate>
                <PremiumGate feature="image-palette" variant="inline" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => { setImageUrlInput(e.target.value); setImageUrlError(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleImageUrlSubmit(); }}
                    placeholder="Paste image URL"
                    className="h-10 px-2 text-[14px] font-light rounded-lg border bg-transparent w-[140px] sm:w-[180px]"
                    style={{ borderColor: imageUrlError ? "hsl(var(--destructive))" : "hsl(var(--border))", color: "hsl(var(--foreground))" }}
                  />
                  <button
                    onClick={handleImageUrlSubmit}
                    disabled={imagePaletteStatus === 'extracting'}
                    className="h-10 px-2 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                    title="Extract palette from image URL"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </button>
                </div>
                {imageUrlError && <span className="text-[12px] font-light" style={{ color: "hsl(var(--destructive))" }}>{imageUrlError}</span>}
                </PremiumGate>
                <PremiumGate feature="palette-export" variant="inline" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
                  <button
                    onClick={() => setShowPaletteExport(true)}
                    className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    <span className="truncate"><span className="sm:hidden">Export</span><span className="hidden sm:inline">Export Palette</span></span>
                  </button>
                </PremiumGate>
                <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: "hsl(var(--border))" }}>
                  <button
                    onClick={() => {
                      if (generatedCode && exportFormat === "css") { setGeneratedCode(null); return; }
                      setExportFormat("css");
                      generateCode();
                    }}
                    className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                    style={{
                      backgroundColor: generatedCode && exportFormat === "css" ? "hsl(var(--brand))" : "transparent",
                      color: generatedCode && exportFormat === "css" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))",
                    }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    <span className="truncate"><span className="sm:hidden">CSS</span><span className="hidden sm:inline">CSS + Tailwind</span></span>
                  </button>
                  <span className="w-px h-5" style={{ backgroundColor: "hsl(var(--border))" }} />
                  <button
                    onClick={() => {
                      if (generatedCode && exportFormat === "tokens") { setGeneratedCode(null); return; }
                      setExportFormat("tokens");
                      generateCode();
                    }}
                    className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                    style={{
                      backgroundColor: generatedCode && exportFormat === "tokens" ? "hsl(var(--brand))" : "transparent",
                      color: generatedCode && exportFormat === "tokens" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))",
                    }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16" /></svg>
                    <span className="truncate"><span className="sm:hidden">Tokens</span><span className="hidden sm:inline">Design Tokens</span></span>
                  </button>
                </div>
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
            </div>

            {/* Color swatch buttons */}
            <div className="grid grid-cols-5 gap-2 sm:gap-5 rounded-lg p-4 overflow-visible" data-axe-exclude style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
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
                  <div key={key} className="flex flex-col items-stretch overflow-visible">
                    <span className="sm:hidden text-[11px] font-light text-center truncate mb-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</span>
                  <div
                    className="relative group flex flex-col sm:flex-row items-stretch rounded-lg overflow-visible"
                    style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}
                  >
                    <button
                      className="w-full h-20 text-[12px] sm:text-[14px] font-light transition-colors hover:opacity-80 flex flex-col items-center justify-center gap-0.5 cursor-pointer rounded-t-lg sm:rounded-t-none sm:rounded-l-lg"
                      style={{ backgroundColor: hsl ? `hsl(${hsl})` : "#e5e7eb", color: btnTextColor }}
                      onClick={() => {
                        document.getElementById("colors")?.scrollIntoView({ behavior: "smooth", block: "start" });
                        const input = document.getElementById(inputId) as HTMLInputElement | null;
                        input?.click();
                      }}
                    >
                      <span className="hidden sm:inline whitespace-nowrap leading-tight">{label}</span>
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
                      style={{ width: "100%", height: "calc(100% - 24px)" }}
                    />
                    <button
                      className={`h-6 sm:h-auto sm:w-8 flex items-center justify-center transition-all rounded-b-lg sm:rounded-b-none sm:rounded-r-lg ${isPremium ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      style={{
                        backgroundColor: isLocked ? `hsl(${bgHsl})` : "rgba(0,0,0,0.08)",
                        color: isLocked ? btnTextColor : "hsl(var(--muted-foreground))",
                        opacity: canLock ? 1 : 0.3,
                      }}
                      onClick={() => {
                        if (!isPremium) {
                          setHoveredLockKey(prev => prev === key ? null : key);
                          return;
                        }
                        if (!canLock) return;
                        setLockedKeys(prev => {
                          const next = new Set(prev);
                          if (next.has(key)) next.delete(key);
                          else next.add(key);
                          return next;
                        });
                      }}
                      title={!isPremium ? "Pro feature" : isLocked ? `Unlock ${label}` : lockedKeys.size >= 4 ? "Max 4 locks" : `Lock ${label}`}
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
                  </div>
                );
              })}
            </div>

            {!isPremium && hoveredLockKey && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setHoveredLockKey(null)}>
                <div className="rounded-xl p-6 w-[360px] shadow-xl" style={{ backgroundColor: "#fff", color: "#111" }} onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f3f4f6" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-medium" style={{ color: "#111" }}>Pro Feature</h3>
                      <p className="text-[13px]" style={{ color: "#888" }}>Color Locks</p>
                    </div>
                  </div>
                  <p className="text-[14px] font-light mb-5" style={{ color: "#555" }}>
                    This feature requires a Themal Pro license. Upgrade to unlock all premium features including harmony schemes, color locks, interaction controls, and more.
                  </p>
                  <div className="flex flex-col gap-2">
                    <a href={upgradeUrl || "/pricing"} className="w-full text-center px-4 py-2.5 text-[14px] font-medium rounded-lg transition-opacity hover:opacity-90" style={{ backgroundColor: "#111", color: "#fff" }}>View Pricing</a>
                    {signInUrl && (
                      <button onClick={() => { setHoveredLockKey(null); window.dispatchEvent(new CustomEvent("theemel:sign-in")); }} className="w-full text-center px-4 py-2.5 text-[14px] font-light rounded-lg transition-opacity hover:opacity-70" style={{ backgroundColor: "#f3f4f6", color: "#111" }}>
                        Already have a license? Sign in
                      </button>
                    )}
                  </div>
                  <button onClick={() => setHoveredLockKey(null)} className="absolute top-4 right-4 p-1 rounded-lg transition-opacity hover:opacity-70" style={{ color: "#999" }} aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Generated code output */}
            {generatedCode && (
              <div className="rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                  <span className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>
                    {exportFormat === "tokens" ? "W3C Design Tokens" : "CSS + Tailwind"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const text = exportFormat === "tokens"
                          ? JSON.stringify(generateDesignTokens(colors, cardStyle, typographyState, alertStyle, interactionStyle), null, 2)
                          : generatedCode;
                        navigator.clipboard.writeText(text);
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
                  <code>{exportFormat === "tokens"
                    ? JSON.stringify(generateDesignTokens(colors, cardStyle, typographyState, alertStyle, interactionStyle), null, 2)
                    : generatedCode}</code>
                </pre>
              </div>
            )}

            {/* Controls + Preview */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Palette (own row) */}
              <div className="w-full" data-axe-exclude>
                <p className="text-[14px] font-light uppercase tracking-wider mb-2 md:mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>Palette</p>
                <div className="grid grid-cols-6 gap-2 md:grid-cols-[repeat(auto-fit,minmax(76px,1fr))] md:gap-3">
                  {COLOR_SWATCHES.filter(({ key }) => !["--brand", "--secondary", "--accent", "--background", "--foreground"].includes(key)).map(({ key, label }) => {
                    const hsl = colors[key];
                    const bgHsl = hsl || "0 0% 50%";
                    const wc = contrastRatio("0 0% 100%", bgHsl);
                    const bc = contrastRatio("0 0% 0%", bgHsl);
                    const swatchTextColor = (wc >= bc) ? "#ffffff" : "#000000";
                    const hexCode = hsl ? hslStringToHex(hsl) : "";
                    const initials = label.split(/\s+/).map(w => w[0]).join("");
                    return (
                    <div key={key} data-color-key={key} className="text-left">
                      <p className="sm:hidden text-[11px] font-light text-center mb-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{initials}</p>
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
                        <span className="relative hidden sm:inline text-[14px] font-light truncate" style={{ color: swatchTextColor }}>{hexCode}</span>
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

          {/* Buttons section */}
          <div id="buttons" className="min-w-0 p-2 md:p-4 space-y-3 mt-4 scroll-mt-28">
            <h2 className="text-[20px] font-normal uppercase tracking-wider flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>Buttons <a href="#top" className="opacity-30 hover:opacity-100 transition-all hover:scale-125" aria-label="Back to top"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg></a></h2>

            {/* Swatches + Interactions side-by-side on desktop */}
            <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-12">

            {/* Types subsection */}
            <div className="w-full lg:w-1/2 flex flex-col rounded-lg p-4" style={{ border: "1px solid hsl(var(--border))" }}>
              <div className="flex items-center h-10 mb-3">
                <h3 className="text-[16px] font-normal uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Types</h3>
              </div>
              <div className="flex-1 flex flex-wrap gap-2 content-start" data-axe-exclude>
                {([
                  { bg: "--primary", fg: "--primary-foreground", label: "Primary" },
                  { bg: "--secondary", fg: "--secondary-foreground", label: "Secondary" },
                  { bg: "--destructive", fg: "--destructive-foreground", label: "Destructive" },
                  { bg: "--muted", fg: "--muted-foreground", label: "Muted" },
                  { bg: "--success", fg: "--success-foreground", label: "Success" },
                  { bg: "--warning", fg: "--warning-foreground", label: "Warning" },
                ] as const).map(({ bg, fg, label }) => {
                  const bgHsl = colors[bg] || "0 0% 50%";
                  const fgHsl = colors[fg] || fgForBg(bgHsl);
                  return (
                    <button
                      key={bg}
                      className="px-4 py-2 text-[14px] font-light rounded-lg"
                      style={{
                        backgroundColor: `hsl(${bgHsl})`,
                        color: `hsl(${fgHsl})`,
                        cursor: "default",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
                <button
                  className="px-4 py-2 text-[14px] font-light rounded-lg border"
                  style={{
                    backgroundColor: "transparent",
                    color: "hsl(var(--foreground))",
                    borderColor: "hsl(var(--border))",
                    cursor: "default",
                  }}
                >
                  Outline
                </button>
                <button
                  className="px-4 py-2 text-[14px] font-light rounded-lg"
                  style={{
                    backgroundColor: "transparent",
                    color: "hsl(var(--foreground))",
                    cursor: "default",
                  }}
                >
                  Ghost
                </button>
              </div>
            </div>

            {/* Interactions subsection */}
            <div className="w-full lg:w-1/2 space-y-3 rounded-lg p-4" style={{ border: "1px solid hsl(var(--border))" }}>
              <div className="flex items-center flex-wrap gap-2 sm:gap-4" data-axe-exclude>
                <h3 className="text-[16px] font-normal uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Interactions</h3>
                <div className="ml-auto flex items-center">
                  {/* Mobile: dropdown */}
                  <select
                    className="sm:hidden h-8 px-2 text-[13px] font-light rounded-md border"
                    style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
                    value=""
                    onChange={e => {
                      const v = e.target.value;
                      if (v === "css") { setInteractionExportFormat("css"); setInteractionCssVisible(true); }
                      else if (v === "tokens") { setInteractionExportFormat("tokens"); setInteractionCssVisible(true); }
                      else if (v === "reset") setShowInteractionResetModal(true);
                      e.target.value = "";
                    }}
                  >
                    <option value="" disabled>Actions…</option>
                    <option value="css">CSS</option>
                    <option value="tokens">Tokens</option>
                    <option value="reset">Reset</option>
                  </select>
                  {/* Desktop: buttons */}
                  <div className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2">
                    <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: "hsl(var(--border))" }}>
                      <button
                        onClick={() => { if (interactionCssVisible && interactionExportFormat === "css") { setInteractionCssVisible(false); return; } setInteractionExportFormat("css"); setInteractionCssVisible(true); }}
                        className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                        style={{
                          backgroundColor: interactionCssVisible && interactionExportFormat === "css" ? "hsl(var(--brand))" : "transparent",
                          color: interactionCssVisible && interactionExportFormat === "css" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))",
                        }}
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        <span className="truncate">CSS</span>
                      </button>
                      <span className="w-px h-5" style={{ backgroundColor: "hsl(var(--border))" }} />
                      <button
                        onClick={() => { if (interactionCssVisible && interactionExportFormat === "tokens") { setInteractionCssVisible(false); return; } setInteractionExportFormat("tokens"); setInteractionCssVisible(true); }}
                        className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                        style={{
                          backgroundColor: interactionCssVisible && interactionExportFormat === "tokens" ? "hsl(var(--brand))" : "transparent",
                          color: interactionCssVisible && interactionExportFormat === "tokens" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))",
                        }}
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16" /></svg>
                        <span className="truncate">Tokens</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setShowInteractionResetModal(true)}
                      className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" /></svg>
                      <span className="truncate">Reset</span>
                    </button>
                  </div>
                </div>
              </div>

              <PremiumGate feature="interaction-states" variant="section" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-4 rounded-lg p-3" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
                {(["subtle", "elevated", "bold"] as const).map((key) => {
                  const labels: Record<string, string> = { subtle: "Subtle", elevated: "Elevated", bold: "Bold" };
                  const icons: Record<string, React.ReactNode> = {
                    subtle: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                    elevated: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>,
                    bold: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                  };
                  const active = interactionStyle.preset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selectInteractionPreset(key)}
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

            {/* Interaction CSS/Tokens output */}
            {interactionCssVisible && (() => {
              const intCss = `:root {\n  --hover-opacity: ${interactionStyle.hoverOpacity};\n  --hover-scale: ${interactionStyle.hoverScale};\n  --active-scale: ${interactionStyle.activeScale};\n  --transition-duration: ${interactionStyle.transitionDuration}ms;\n  --focus-ring-width: ${interactionStyle.focusRingWidth}px;\n  --focus-ring-color: hsl(var(--ring));\n}`;
              const intTokens = JSON.stringify(generateSectionDesignTokens("interactions", cardStyle, typographyState, alertStyle, interactionStyle, typoInteractionStyle), null, 2);
              const output = interactionExportFormat === "tokens" ? intTokens : intCss;
              return (
                <div className="rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <span className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>{interactionExportFormat === "tokens" ? "Interaction Tokens" : "Interaction CSS"}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(output);
                          setInteractionCssCopied(true);
                          setTimeout(() => setInteractionCssCopied(false), 2000);
                        }}
                        className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                      >
                        {interactionCssCopied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => setInteractionCssVisible(false)}
                        className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <pre className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed font-mono" style={{ color: "hsl(var(--card-foreground))" }}>
                    <code>{output}</code>
                  </pre>
                </div>
              );
            })()}

            {/* Controls + Preview */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Slider controls */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="space-y-1.5">
                  <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Hover</p>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Opacity: {interactionStyle.hoverOpacity}</span>
                    <input type="range" min={0.6} max={1} step={0.01} value={interactionStyle.hoverOpacity} onChange={e => updateInteractionStyle({ hoverOpacity: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Scale: {interactionStyle.hoverScale}</span>
                    <input type="range" min={1} max={1.1} step={0.005} value={interactionStyle.hoverScale} onChange={e => updateInteractionStyle({ hoverScale: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Active</p>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Scale: {interactionStyle.activeScale}</span>
                    <input type="range" min={0.9} max={1.05} step={0.005} value={interactionStyle.activeScale} onChange={e => updateInteractionStyle({ activeScale: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Timing & Focus</p>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Duration: {interactionStyle.transitionDuration}ms</span>
                    <input type="range" min={0} max={500} step={10} value={interactionStyle.transitionDuration} onChange={e => updateInteractionStyle({ transitionDuration: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                    <span>Focus Ring: {interactionStyle.focusRingWidth}px</span>
                    <input type="range" min={0} max={4} step={0.5} value={interactionStyle.focusRingWidth} onChange={e => updateInteractionStyle({ focusRingWidth: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                  </label>
                </div>
              </div>

              {/* Live preview */}
              <div className="flex-1 min-w-0 flex items-start justify-center pt-2">
                <div className="w-full md:max-w-[400px] space-y-3" data-axe-exclude>
                  <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Preview</p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="px-4 py-2 text-[14px] font-light rounded-lg"
                      style={{
                        backgroundColor: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                        transition: `opacity ${interactionStyle.transitionDuration}ms ease, transform ${interactionStyle.transitionDuration}ms ease`,
                      }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.opacity = String(interactionStyle.hoverOpacity); (e.target as HTMLElement).style.transform = `scale(${interactionStyle.hoverScale})`; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.transform = "scale(1)"; }}
                      onMouseDown={e => { (e.target as HTMLElement).style.transform = `scale(${interactionStyle.activeScale})`; }}
                      onMouseUp={e => { (e.target as HTMLElement).style.transform = `scale(${interactionStyle.hoverScale})`; }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="px-4 py-2 text-[14px] font-light rounded-lg"
                      style={{
                        backgroundColor: "hsl(var(--secondary))",
                        color: "hsl(var(--secondary-foreground))",
                        transition: `opacity ${interactionStyle.transitionDuration}ms ease, transform ${interactionStyle.transitionDuration}ms ease`,
                      }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.opacity = String(interactionStyle.hoverOpacity); (e.target as HTMLElement).style.transform = `scale(${interactionStyle.hoverScale})`; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.transform = "scale(1)"; }}
                      onMouseDown={e => { (e.target as HTMLElement).style.transform = `scale(${interactionStyle.activeScale})`; }}
                      onMouseUp={e => { (e.target as HTMLElement).style.transform = `scale(${interactionStyle.hoverScale})`; }}
                    >
                      Secondary
                    </button>
                    <button
                      className="px-4 py-2 text-[14px] font-light rounded-lg border"
                      style={{
                        backgroundColor: "transparent",
                        color: "hsl(var(--foreground))",
                        borderColor: "hsl(var(--border))",
                        transition: `opacity ${interactionStyle.transitionDuration}ms ease, transform ${interactionStyle.transitionDuration}ms ease`,
                      }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.opacity = String(interactionStyle.hoverOpacity); (e.target as HTMLElement).style.transform = `scale(${interactionStyle.hoverScale})`; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.transform = "scale(1)"; }}
                      onMouseDown={e => { (e.target as HTMLElement).style.transform = `scale(${interactionStyle.activeScale})`; }}
                      onMouseUp={e => { (e.target as HTMLElement).style.transform = `scale(${interactionStyle.hoverScale})`; }}
                    >
                      Outline
                    </button>
                  </div>
                  <p className="text-[12px] font-light" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Hover and click the buttons above to preview interaction states.
                  </p>
                </div>
              </div>
            </div>

              </PremiumGate>
            </div>

            </div>{/* end flex row */}
          </div>

          {/* Interaction Reset Confirmation Modal */}
          {showInteractionResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="interaction-reset-modal-title">
              <div className="rounded-lg shadow-xl p-6 w-full max-w-sm mx-4" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}>
                <h4 id="interaction-reset-modal-title" className="text-2xl font-light mb-2">
                  Reset Interaction Style?
                </h4>
                <p className="text-[14px] mb-4" style={{ color: "hsl(var(--card-foreground))" }}>
                  This will revert all interaction style settings to their defaults. Any customizations will be lost.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowInteractionResetModal(false)}
                    className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "transparent", color: "hsl(var(--card-foreground))" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { handleResetInteractionStyle(); setShowInteractionResetModal(false); }}
                    className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card Style section */}
          <div id="card" className="min-w-0 p-2 md:p-4 mt-8 md:mt-12 scroll-mt-28 space-y-3">
            <div className="flex items-center flex-wrap gap-2 sm:gap-4" data-axe-exclude>
              <h2 className="text-[20px] font-normal uppercase tracking-wider flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>Cards <a href="#top" className="opacity-30 hover:opacity-100 transition-all hover:scale-125" aria-label="Back to top"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg></a></h2>
            </div>

            <div className="space-y-3 rounded-lg p-4" style={{ border: "1px solid hsl(var(--border))" }}>
            {/* CSS / Tokens / Reset */}
            {/* Mobile: dropdown */}
            <select
              className="sm:hidden h-8 px-2 text-[13px] font-light rounded-md border w-full"
              style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
              value=""
              onChange={e => {
                const v = e.target.value;
                if (v === "css") { setCardExportFormat("css"); setCardCssVisible(true); }
                else if (v === "tokens") { setCardExportFormat("tokens"); setCardCssVisible(true); }
                else if (v === "reset") setShowCardResetModal(true);
                e.target.value = "";
              }}
            >
              <option value="" disabled>Actions…</option>
              <option value="css">CSS</option>
              <option value="tokens">Tokens</option>
              <option value="reset">Reset</option>
            </select>
            {/* Desktop: buttons */}
            <div className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2">
                <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: "hsl(var(--border))" }}>
                  <button
                    onClick={() => { if (cardCssVisible && cardExportFormat === "css") { setCardCssVisible(false); return; } setCardExportFormat("css"); setCardCssVisible(true); }}
                    className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                    style={{ backgroundColor: cardCssVisible && cardExportFormat === "css" ? "hsl(var(--brand))" : "transparent", color: cardCssVisible && cardExportFormat === "css" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))" }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    <span className="truncate">CSS</span>
                  </button>
                  <span className="w-px h-5" style={{ backgroundColor: "hsl(var(--border))" }} />
                  <button
                    onClick={() => { if (cardCssVisible && cardExportFormat === "tokens") { setCardCssVisible(false); return; } setCardExportFormat("tokens"); setCardCssVisible(true); }}
                    className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                    style={{ backgroundColor: cardCssVisible && cardExportFormat === "tokens" ? "hsl(var(--brand))" : "transparent", color: cardCssVisible && cardExportFormat === "tokens" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))" }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16" /></svg>
                    <span className="truncate">Tokens</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowCardResetModal(true)}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" /></svg>
                  <span className="truncate">Reset</span>
                </button>
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

            {/* Card CSS/Tokens output */}
            {cardCssVisible && (() => {
              const shadowVal =
                cardStyle.shadowBlur === 0 && cardStyle.shadowOffsetX === 0 && cardStyle.shadowOffsetY === 0 && cardStyle.shadowSpread === 0
                  ? "none"
                  : `${cardStyle.shadowOffsetX}px ${cardStyle.shadowOffsetY}px ${cardStyle.shadowBlur}px ${cardStyle.shadowSpread}px ${cardStyle.shadowColor}`;
              const cardCss = `:root {\n  --card-radius: ${cardStyle.borderRadius}px;\n  --card-shadow: ${shadowVal};\n  --card-border: ${cardStyle.borderWidth > 0 ? `${cardStyle.borderWidth}px solid hsl(var(--border))` : "none"};\n  --card-backdrop: ${cardStyle.backdropBlur > 0 ? `blur(${cardStyle.backdropBlur}px)` : "none"};\n}`;
              const cardTokens = JSON.stringify(generateSectionDesignTokens("card", cardStyle, typographyState, alertStyle, interactionStyle, typoInteractionStyle), null, 2);
              const output = cardExportFormat === "tokens" ? cardTokens : cardCss;
              return (
                <div className="rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <span className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>{cardExportFormat === "tokens" ? "Card Tokens" : "Card CSS"}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { navigator.clipboard.writeText(output); setCardCssCopied(true); setTimeout(() => setCardCssCopied(false), 2000); }}
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
                    <code>{output}</code>
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
            </div>{/* end Card Style border wrapper */}
          </div>
          </div>{/* end Card Style section */}

          {/* Alerts section */}
          <div id="alerts" className="min-w-0 p-2 md:p-4 mt-8 md:mt-12 scroll-mt-28 space-y-3">
            <div className="flex items-center flex-wrap gap-2 sm:gap-4" data-axe-exclude>
              <h2 className="text-[20px] font-normal uppercase tracking-wider flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>Alerts <a href="#top" className="opacity-30 hover:opacity-100 transition-all hover:scale-125" aria-label="Back to top"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg></a></h2>
            </div>

            <div className="space-y-3 rounded-lg p-4" style={{ border: "1px solid hsl(var(--border))" }}>
            {/* CSS / Tokens / Reset */}
            {/* Mobile: dropdown */}
            <select
              className="sm:hidden h-8 px-2 text-[13px] font-light rounded-md border w-full"
              style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
              value=""
              onChange={e => {
                const v = e.target.value;
                if (v === "css") { setAlertExportFormat("css"); setAlertCssVisible(true); }
                else if (v === "tokens") { setAlertExportFormat("tokens"); setAlertCssVisible(true); }
                else if (v === "reset") setShowAlertResetModal(true);
                e.target.value = "";
              }}
            >
              <option value="" disabled>Actions…</option>
              <option value="css">CSS</option>
              <option value="tokens">Tokens</option>
              <option value="reset">Reset</option>
            </select>
            {/* Desktop: buttons */}
            <div className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2">
                <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: "hsl(var(--border))" }}>
                  <button
                    onClick={() => { if (alertCssVisible && alertExportFormat === "css") { setAlertCssVisible(false); return; } setAlertExportFormat("css"); setAlertCssVisible(true); }}
                    className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                    style={{ backgroundColor: alertCssVisible && alertExportFormat === "css" ? "hsl(var(--brand))" : "transparent", color: alertCssVisible && alertExportFormat === "css" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))" }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    <span className="truncate">CSS</span>
                  </button>
                  <span className="w-px h-5" style={{ backgroundColor: "hsl(var(--border))" }} />
                  <button
                    onClick={() => { if (alertCssVisible && alertExportFormat === "tokens") { setAlertCssVisible(false); return; } setAlertExportFormat("tokens"); setAlertCssVisible(true); }}
                    className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                    style={{ backgroundColor: alertCssVisible && alertExportFormat === "tokens" ? "hsl(var(--brand))" : "transparent", color: alertCssVisible && alertExportFormat === "tokens" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))" }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16" /></svg>
                    <span className="truncate">Tokens</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowAlertResetModal(true)}
                  className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" /></svg>
                  <span className="truncate">Reset</span>
                </button>
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

            {/* Alert CSS/Tokens output */}
            {alertCssVisible && (() => {
              const alertCss = `:root {\n  --alert-radius: ${alertStyle.borderRadius}px;\n  --alert-border-width: ${alertStyle.borderWidth}px;\n  --alert-padding: ${alertStyle.padding}px;\n}`;
              const alertTokens = JSON.stringify(generateSectionDesignTokens("alerts", cardStyle, typographyState, alertStyle, interactionStyle, typoInteractionStyle), null, 2);
              const output = alertExportFormat === "tokens" ? alertTokens : alertCss;
              return (
                <div className="rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <span className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>{alertExportFormat === "tokens" ? "Alert Tokens" : "Alert CSS"}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { navigator.clipboard.writeText(output); setAlertCssCopied(true); setTimeout(() => setAlertCssCopied(false), 2000); }}
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
                    <code>{output}</code>
                  </pre>
                </div>
              );
            })()}

            {/* Controls + Preview */}
            <div className="flex flex-col gap-4">
              {/* Slider controls */}
              <div className="min-w-0 space-y-3">
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
              <div className="min-w-0">
                <div className="w-full space-y-3" data-axe-exclude>
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
          </div>{/* end Alerts border wrapper */}

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
          </div>{/* end Alerts section */}

        {/* Typography section */}
          <div id="typography" className="min-w-0 p-2 md:p-4 space-y-3 mt-8 md:mt-12 scroll-mt-28">
            <h2 className="text-[20px] font-normal uppercase tracking-wider flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>Typography <a href="#top" className="opacity-30 hover:opacity-100 transition-all hover:scale-125" aria-label="Back to top"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg></a></h2>

            {/* Typography controls + interactions stacked */}
            <div className="space-y-6">

            {/* Controls + Preview column */}
            <div className="space-y-3 rounded-lg p-4" style={{ border: "1px solid hsl(var(--border))", minWidth: 0 }}>
              <div className="flex items-center flex-wrap gap-2 sm:gap-4" data-axe-exclude>
                <h3 className="text-[16px] font-normal uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Styles</h3>
                <div className="ml-auto flex items-center">
                  {/* Mobile: dropdown */}
                  <select
                    className="sm:hidden h-8 px-2 text-[13px] font-light rounded-md border"
                    style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
                    value=""
                    onChange={e => {
                      const v = e.target.value;
                      if (v === "css") { setTypoExportFormat("css"); setTypoCssVisible(true); }
                      else if (v === "tokens") { setTypoExportFormat("tokens"); setTypoCssVisible(true); }
                      else if (v === "reset") setShowTypoResetModal(true);
                      e.target.value = "";
                    }}
                  >
                    <option value="" disabled>Actions…</option>
                    <option value="css">CSS</option>
                    <option value="tokens">Tokens</option>
                    <option value="reset">Reset</option>
                  </select>
                  {/* Desktop: buttons */}
                  <div className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2">
                    <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: "hsl(var(--border))" }}>
                      <button
                        onClick={() => { if (typoCssVisible && typoExportFormat === "css") { setTypoCssVisible(false); return; } setTypoExportFormat("css"); setTypoCssVisible(true); }}
                        className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                        style={{ backgroundColor: typoCssVisible && typoExportFormat === "css" ? "hsl(var(--brand))" : "transparent", color: typoCssVisible && typoExportFormat === "css" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))" }}
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        <span className="truncate">CSS</span>
                      </button>
                      <span className="w-px h-5" style={{ backgroundColor: "hsl(var(--border))" }} />
                      <button
                        onClick={() => { if (typoCssVisible && typoExportFormat === "tokens") { setTypoCssVisible(false); return; } setTypoExportFormat("tokens"); setTypoCssVisible(true); }}
                        className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                        style={{ backgroundColor: typoCssVisible && typoExportFormat === "tokens" ? "hsl(var(--brand))" : "transparent", color: typoCssVisible && typoExportFormat === "tokens" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))" }}
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16" /></svg>
                        <span className="truncate">Tokens</span>
                      </button>
                    </div>
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
              </div>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-4 rounded-lg p-3" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
                {(["system", "modern", "classic", "compact", "editorial"] as const).map((key) => {
                  const labels: Record<string, string> = { system: "System", modern: "Modern", classic: "Classic", compact: "Compact", editorial: "Editorial" };
                  const icons: Record<string, React.ReactNode> = {
                    system: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                    modern: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
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

              {/* Typography CSS/Tokens output */}
              {typoCssVisible && (() => {
                const typoCss = `:root {\n  --font-heading: ${typographyState.headingFamily};\n  --font-body: ${typographyState.bodyFamily};\n  --font-size-base: ${typographyState.baseFontSize}px;\n  --font-weight-heading: ${typographyState.headingWeight};\n  --font-weight-body: ${typographyState.bodyWeight};\n  --line-height: ${typographyState.lineHeight};\n  --letter-spacing: ${typographyState.letterSpacing}em;\n  --letter-spacing-heading: ${typographyState.headingLetterSpacing}em;\n}`;
                const typoTokens = JSON.stringify(generateSectionDesignTokens("typography", cardStyle, typographyState, alertStyle, interactionStyle, typoInteractionStyle), null, 2);
                const output = typoExportFormat === "tokens" ? typoTokens : typoCss;
                return (
                  <div className="rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                      <span className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>{typoExportFormat === "tokens" ? "Typography Tokens" : "Typography CSS"}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { navigator.clipboard.writeText(output); setTypoCssCopied(true); setTimeout(() => setTypoCssCopied(false), 2000); }}
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
                      <code>{output}</code>
                    </pre>
                  </div>
                );
              })()}

              {/* Controls + Preview side-by-side */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Slider controls */}
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
                        {fontOptions.map(opt => (
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
                        {fontOptions.map(opt => (
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
                  <PremiumGate feature="typography-spacing" variant="section" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
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
                  </PremiumGate>
                </div>

                {/* Live preview */}
                <div className="flex-1 min-w-0 flex items-start justify-center pt-2">
                  <div className="w-full md:max-w-[400px] space-y-3" data-axe-exclude>
                    {/* Custom font input */}
                    <PremiumGate feature="custom-fonts" variant="inline" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                        <span className="whitespace-nowrap">Custom:</span>
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <input
                            type="text"
                            value={newFontName}
                            onChange={e => { setNewFontName(e.target.value); setFontAddError(""); }}
                            placeholder="Google Font name…"
                            className="flex-1 min-w-0 h-8 px-2 text-[14px] font-light rounded-md border"
                            style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
                            onKeyDown={e => {
                              if (e.key === "Enter" && newFontName.trim()) {
                                e.preventDefault();
                                handleAddCustomFont();
                              }
                            }}
                          />
                          <button
                            disabled={fontAddLoading || !newFontName.trim()}
                            onClick={handleAddCustomFont}
                            className="h-8 px-2 text-[12px] font-medium rounded-md border whitespace-nowrap"
                            style={{
                              backgroundColor: "hsl(var(--primary))",
                              color: "hsl(var(--primary-foreground))",
                              borderColor: "hsl(var(--border))",
                              opacity: fontAddLoading || !newFontName.trim() ? 0.5 : 1,
                            }}
                          >
                            {fontAddLoading ? "…" : "+ Font"}
                          </button>
                        </div>
                      </label>
                      {fontAddError && (
                        <p className="text-[12px] mt-0.5" style={{ color: "hsl(var(--destructive))" }}>{fontAddError}</p>
                      )}
                      {customFonts.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {customFonts.map(f => (
                            <span
                              key={f.label}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] rounded-md border"
                              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
                            >
                              {f.label}
                              <button
                                onClick={() => handleRemoveCustomFont(f.label)}
                                className="ml-0.5 hover:opacity-70"
                                style={{ color: "hsl(var(--muted-foreground))" }}
                                title={`Remove ${f.label}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    </PremiumGate>
                    <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Preview</p>
                    <div
                      className="w-full rounded-lg p-5 space-y-3"
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
              </div>{/* end Controls + Preview row */}
            </div>{/* end Styles column */}

            {/* Typography Interactions column */}
            <div className="space-y-3 rounded-lg p-4" style={{ border: "1px solid hsl(var(--border))", minWidth: 0 }}>
              <div className="flex items-center flex-wrap gap-2 sm:gap-4" data-axe-exclude>
                <h3 className="text-[16px] font-normal uppercase tracking-wider" style={{ color: "hsl(var(--foreground))" }}>Interactions</h3>
                <div className="ml-auto flex items-center">
                  {/* Mobile: dropdown */}
                  <select
                    className="sm:hidden h-8 px-2 text-[13px] font-light rounded-md border"
                    style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
                    value=""
                    onChange={e => {
                      const v = e.target.value;
                      if (v === "css") { setTypoInteractionExportFormat("css"); setTypoInteractionCssVisible(true); }
                      else if (v === "tokens") { setTypoInteractionExportFormat("tokens"); setTypoInteractionCssVisible(true); }
                      else if (v === "reset") setShowTypoInteractionResetModal(true);
                      e.target.value = "";
                    }}
                  >
                    <option value="" disabled>Actions…</option>
                    <option value="css">CSS</option>
                    <option value="tokens">Tokens</option>
                    <option value="reset">Reset</option>
                  </select>
                  {/* Desktop: buttons */}
                  <div className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2">
                    <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: "hsl(var(--border))" }}>
                      <button
                        onClick={() => { if (typoInteractionCssVisible && typoInteractionExportFormat === "css") { setTypoInteractionCssVisible(false); return; } setTypoInteractionExportFormat("css"); setTypoInteractionCssVisible(true); }}
                        className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                        style={{ backgroundColor: typoInteractionCssVisible && typoInteractionExportFormat === "css" ? "hsl(var(--brand))" : "transparent", color: typoInteractionCssVisible && typoInteractionExportFormat === "css" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))" }}
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        <span className="truncate">CSS</span>
                      </button>
                      <span className="w-px h-5" style={{ backgroundColor: "hsl(var(--border))" }} />
                      <button
                        onClick={() => { if (typoInteractionCssVisible && typoInteractionExportFormat === "tokens") { setTypoInteractionCssVisible(false); return; } setTypoInteractionExportFormat("tokens"); setTypoInteractionCssVisible(true); }}
                        className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                        style={{ backgroundColor: typoInteractionCssVisible && typoInteractionExportFormat === "tokens" ? "hsl(var(--brand))" : "transparent", color: typoInteractionCssVisible && typoInteractionExportFormat === "tokens" ? (colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff") : "hsl(var(--muted-foreground))" }}
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16" /></svg>
                        <span className="truncate">Tokens</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setShowTypoInteractionResetModal(true)}
                      className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" /></svg>
                      <span className="truncate">Reset</span>
                    </button>
                  </div>
                </div>
              </div>

              <PremiumGate feature="typography-interactions" variant="section" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-4 rounded-lg p-3" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
                {(["subtle", "elevated", "bold"] as const).map((key) => {
                  const labels: Record<string, string> = { subtle: "Subtle", elevated: "Elevated", bold: "Bold" };
                  const icons: Record<string, React.ReactNode> = {
                    subtle: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                    elevated: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>,
                    bold: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                  };
                  const active = typoInteractionStyle.preset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selectTypoInteractionPreset(key)}
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

              {/* Typography Interaction CSS/Tokens output */}
              {typoInteractionCssVisible && (() => {
                const tiCss = `:root {\n  --link-hover-opacity: ${typoInteractionStyle.linkHoverOpacity};\n  --link-hover-scale: ${typoInteractionStyle.linkHoverScale};\n  --link-active-scale: ${typoInteractionStyle.linkActiveScale};\n  --link-transition-duration: ${typoInteractionStyle.linkTransitionDuration}ms;\n  --link-underline: ${typoInteractionStyle.linkUnderline};\n  --heading-hover-opacity: ${typoInteractionStyle.headingHoverOpacity};\n  --heading-hover-scale: ${typoInteractionStyle.headingHoverScale};\n  --heading-transition-duration: ${typoInteractionStyle.headingTransitionDuration}ms;\n}`;
                const tiTokens = JSON.stringify(generateSectionDesignTokens("typo-interactions", cardStyle, typographyState, alertStyle, interactionStyle, typoInteractionStyle), null, 2);
                const output = typoInteractionExportFormat === "tokens" ? tiTokens : tiCss;
                return (
                  <div className="rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                      <span className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--card-foreground))" }}>{typoInteractionExportFormat === "tokens" ? "Interaction Tokens" : "Interaction CSS"}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { navigator.clipboard.writeText(output); setTypoInteractionCssCopied(true); setTimeout(() => setTypoInteractionCssCopied(false), 2000); }}
                          className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                          style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                        >
                          {typoInteractionCssCopied ? "Copied!" : "Copy"}
                        </button>
                        <button
                          onClick={() => setTypoInteractionCssVisible(false)}
                          className="px-2 py-0.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                          style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                    <pre className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed font-mono" style={{ color: "hsl(var(--card-foreground))" }}>
                      <code>{output}</code>
                    </pre>
                  </div>
                );
              })()}

              {/* Controls + Preview */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Slider controls */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Links — Hover</p>
                    <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                      <span>Opacity: {typoInteractionStyle.linkHoverOpacity}</span>
                      <input type="range" min={0.6} max={1} step={0.01} value={typoInteractionStyle.linkHoverOpacity} onChange={e => updateTypoInteractionStyle({ linkHoverOpacity: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                    </label>
                    <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                      <span>Scale: {typoInteractionStyle.linkHoverScale}</span>
                      <input type="range" min={1} max={1.1} step={0.005} value={typoInteractionStyle.linkHoverScale} onChange={e => updateTypoInteractionStyle({ linkHoverScale: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                    </label>
                    <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                      <span>Underline:</span>
                      <select
                        value={typoInteractionStyle.linkUnderline}
                        onChange={e => updateTypoInteractionStyle({ linkUnderline: e.target.value as "always" | "hover" | "none" })}
                        className="w-32 h-8 px-2 text-[14px] font-light rounded-md border"
                        style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
                      >
                        <option value="always">Always</option>
                        <option value="hover">On Hover</option>
                        <option value="none">Never</option>
                      </select>
                    </label>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Links — Active</p>
                    <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                      <span>Scale: {typoInteractionStyle.linkActiveScale}</span>
                      <input type="range" min={0.9} max={1.05} step={0.005} value={typoInteractionStyle.linkActiveScale} onChange={e => updateTypoInteractionStyle({ linkActiveScale: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                    </label>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Headings — Hover</p>
                    <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                      <span>Opacity: {typoInteractionStyle.headingHoverOpacity}</span>
                      <input type="range" min={0.6} max={1} step={0.01} value={typoInteractionStyle.headingHoverOpacity} onChange={e => updateTypoInteractionStyle({ headingHoverOpacity: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                    </label>
                    <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                      <span>Scale: {typoInteractionStyle.headingHoverScale}</span>
                      <input type="range" min={1} max={1.05} step={0.005} value={typoInteractionStyle.headingHoverScale} onChange={e => updateTypoInteractionStyle({ headingHoverScale: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                    </label>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Timing</p>
                    <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                      <span>Link Duration: {typoInteractionStyle.linkTransitionDuration}ms</span>
                      <input type="range" min={0} max={500} step={10} value={typoInteractionStyle.linkTransitionDuration} onChange={e => updateTypoInteractionStyle({ linkTransitionDuration: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                    </label>
                    <label className="flex items-center justify-between gap-2 text-[14px] font-light" style={{ color: "hsl(var(--foreground))" }}>
                      <span>Heading Duration: {typoInteractionStyle.headingTransitionDuration}ms</span>
                      <input type="range" min={0} max={500} step={10} value={typoInteractionStyle.headingTransitionDuration} onChange={e => updateTypoInteractionStyle({ headingTransitionDuration: Number(e.target.value) })} className="w-32 accent-[hsl(var(--brand))]" />
                    </label>
                  </div>
                </div>

                {/* Live preview */}
                <div className="flex-1 min-w-0 flex items-start justify-center pt-2">
                  <div className="w-full md:max-w-[400px] space-y-3" data-axe-exclude>
                    <p className="text-[14px] font-light uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Preview</p>
                    <div className="space-y-4 rounded-lg p-4" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}>
                      <h3
                        className="cursor-default"
                        style={{
                          fontFamily: typographyState.headingFamily,
                          fontSize: `${Math.round(typographyState.baseFontSize * 1.5)}px`,
                          fontWeight: typographyState.headingWeight,
                          transition: `opacity ${typoInteractionStyle.headingTransitionDuration}ms ease, transform ${typoInteractionStyle.headingTransitionDuration}ms ease`,
                        }}
                        onMouseEnter={e => { (e.target as HTMLElement).style.opacity = String(typoInteractionStyle.headingHoverOpacity); (e.target as HTMLElement).style.transform = `scale(${typoInteractionStyle.headingHoverScale})`; }}
                        onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.transform = "scale(1)"; }}
                      >
                        Heading Example
                      </h3>
                      <p style={{ fontFamily: typographyState.bodyFamily, fontSize: `${typographyState.baseFontSize}px`, fontWeight: typographyState.bodyWeight }}>
                        Body text with a{" "}
                        <a
                          href="#"
                          onClick={e => e.preventDefault()}
                          style={{
                            color: "hsl(var(--brand))",
                            textDecoration: typoInteractionStyle.linkUnderline === "always" ? "underline" : "none",
                            transition: `opacity ${typoInteractionStyle.linkTransitionDuration}ms ease, transform ${typoInteractionStyle.linkTransitionDuration}ms ease`,
                            display: "inline-block",
                          }}
                          onMouseEnter={e => { (e.target as HTMLElement).style.opacity = String(typoInteractionStyle.linkHoverOpacity); (e.target as HTMLElement).style.transform = `scale(${typoInteractionStyle.linkHoverScale})`; (e.target as HTMLElement).style.textDecoration = typoInteractionStyle.linkUnderline !== "none" ? "underline" : "none"; }}
                          onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.transform = "scale(1)"; (e.target as HTMLElement).style.textDecoration = typoInteractionStyle.linkUnderline === "always" ? "underline" : "none"; }}
                          onMouseDown={e => { (e.target as HTMLElement).style.transform = `scale(${typoInteractionStyle.linkActiveScale})`; }}
                          onMouseUp={e => { (e.target as HTMLElement).style.transform = `scale(${typoInteractionStyle.linkHoverScale})`; }}
                        >
                          sample link
                        </a>{" "}
                        and another{" "}
                        <a
                          href="#"
                          onClick={e => e.preventDefault()}
                          style={{
                            color: "hsl(var(--brand))",
                            textDecoration: typoInteractionStyle.linkUnderline === "always" ? "underline" : "none",
                            transition: `opacity ${typoInteractionStyle.linkTransitionDuration}ms ease, transform ${typoInteractionStyle.linkTransitionDuration}ms ease`,
                            display: "inline-block",
                          }}
                          onMouseEnter={e => { (e.target as HTMLElement).style.opacity = String(typoInteractionStyle.linkHoverOpacity); (e.target as HTMLElement).style.transform = `scale(${typoInteractionStyle.linkHoverScale})`; (e.target as HTMLElement).style.textDecoration = typoInteractionStyle.linkUnderline !== "none" ? "underline" : "none"; }}
                          onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.transform = "scale(1)"; (e.target as HTMLElement).style.textDecoration = typoInteractionStyle.linkUnderline === "always" ? "underline" : "none"; }}
                          onMouseDown={e => { (e.target as HTMLElement).style.transform = `scale(${typoInteractionStyle.linkActiveScale})`; }}
                          onMouseUp={e => { (e.target as HTMLElement).style.transform = `scale(${typoInteractionStyle.linkHoverScale})`; }}
                        >
                          navigation link
                        </a>{" "}
                        to test hover states.
                      </p>
                      <p className="text-[12px] font-light" style={{ color: "hsl(var(--muted-foreground))" }}>
                        Hover over the heading and links to preview interaction states.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              </PremiumGate>
            </div>{/* end Typography Interactions column */}

            </div>{/* end side-by-side row */}

            {/* Typography Interaction Reset Modal */}
            {showTypoInteractionResetModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowTypoInteractionResetModal(false)}>
                <div className="rounded-xl p-6 w-[340px] shadow-xl" style={{ backgroundColor: "#fff", color: "#111" }} onClick={e => e.stopPropagation()}>
                  <h3 className="text-[18px] font-light mb-3">Reset Interactions?</h3>
                  <p className="text-[14px] font-light mb-4" style={{ color: "#555" }}>This will restore the default typography interaction styles.</p>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowTypoInteractionResetModal(false)} className="px-4 py-2 text-[14px] font-light rounded-lg" style={{ backgroundColor: "#e5e7eb", color: "#111" }}>Cancel</button>
                    <button
                      onClick={() => { handleResetTypoInteractionStyle(); setShowTypoInteractionResetModal(false); }}
                      className="px-4 py-2 text-[14px] font-light rounded-lg"
                      style={{ backgroundColor: "#ef4444", color: "#fff" }}
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
      {/* PR Section Picker Modal */}
      {pendingImagePalette && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => { URL.revokeObjectURL(pendingImagePalette.imageUrl); setPendingImagePalette(null); }}>
          <div className="rounded-xl p-6 w-[380px] max-h-[90vh] overflow-y-auto shadow-xl" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }} onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-light mb-4">Extracted Palette</h3>
            <img
              src={pendingImagePalette.imageUrl}
              alt="Uploaded"
              className="w-full rounded-lg mb-4 object-cover"
              style={{ maxHeight: 200 }}
            />
            <div className="flex gap-2 mb-4">
              {(["--brand", "--secondary", "--accent", "--background", "--foreground"] as const).map(key => {
                const hsl = pendingImagePalette.palette[key];
                if (!hsl) return null;
                const hex = hslStringToHex(hsl);
                return (
                  <div key={key} className="flex-1 text-center">
                    <div
                      className="w-full aspect-square rounded-lg mb-1"
                      style={{ backgroundColor: `hsl(${hsl})`, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }}
                    />
                    <span className="text-[10px] font-light block" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {key.replace("--", "").split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}
                    </span>
                    <span className="text-[10px] font-mono block" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {hex}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { URL.revokeObjectURL(pendingImagePalette.imageUrl); setPendingImagePalette(null); }}
                className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                style={{ color: "hsl(var(--card-foreground))" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  applyImagePalette(pendingImagePalette.palette);
                  URL.revokeObjectURL(pendingImagePalette.imageUrl);
                  setPendingImagePalette(null);
                }}
                className="px-4 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                style={{
                  backgroundColor: "hsl(var(--brand))",
                  color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "hsl(var(--primary-foreground))",
                }}
              >
                Apply Palette
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaletteExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowPaletteExport(false)}>
          <div className="rounded-xl p-6 w-[340px] shadow-xl" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }} onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-light mb-4">Export Palette</h3>
            <div className="flex flex-col gap-2">
              {([
                { label: "Copy as HEX", action: () => { navigator.clipboard.writeText(exportPaletteAsText(colors, "hex")); setPaletteExportCopied(true); setTimeout(() => setPaletteExportCopied(false), 2000); } },
                { label: "Copy as RGB", action: () => { navigator.clipboard.writeText(exportPaletteAsText(colors, "rgb")); setPaletteExportCopied(true); setTimeout(() => setPaletteExportCopied(false), 2000); } },
                { label: "Copy as RGBA", action: () => { navigator.clipboard.writeText(exportPaletteAsText(colors, "rgba")); setPaletteExportCopied(true); setTimeout(() => setPaletteExportCopied(false), 2000); } },
                { label: "Download SVG", action: () => {
                  const svg = exportPaletteAsSvg(colors);
                  const blob = new Blob([svg], { type: "image/svg+xml" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a"); a.href = url; a.download = "palette.svg"; a.click();
                  URL.revokeObjectURL(url);
                }},
                { label: "Download PNG", action: async () => {
                  const blob = await exportPaletteAsPng(colors);
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a"); a.href = url; a.download = "palette.png"; a.click();
                  URL.revokeObjectURL(url);
                }},
              ] as { label: string; action: () => void }[]).map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full text-left px-3 py-2 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
                >
                  {label}
                </button>
              ))}
            </div>
            {paletteExportCopied && (
              <p className="text-[13px] font-light mt-2" style={{ color: "hsl(var(--success))" }}>Copied to clipboard!</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPaletteExport(false)}
                className="px-4 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: "hsl(var(--muted))", color: colors["--muted"] ? `hsl(${fgForBg(colors["--muted"])})` : "hsl(var(--muted-foreground))" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowPrSetupModal(false)}>
          <div className="rounded-xl p-6 w-[380px] shadow-xl" style={{ backgroundColor: "#fff", color: "#111" }} onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-light mb-4" style={{ color: "#111" }}>PR Integration Setup</h3>
            <p className="text-[14px] font-light mb-3" style={{ color: "#444" }}>
              To enable pull request creation, pass a <code className="px-1 py-0.5 rounded text-[13px]" style={{ backgroundColor: "#f3f4f6", color: "#111" }}>prEndpointUrl</code> prop to the editor:
            </p>
            <pre className="text-[12px] font-light rounded-lg p-3 mb-4 overflow-x-auto" style={{ backgroundColor: "#1e293b", color: "#e2e8f0" }}>
{`<DesignSystemEditor
  prEndpointUrl="/api/design-pr"
/>`}
            </pre>
            <p className="text-[13px] font-light mb-4" style={{ color: "#444" }}>
              The endpoint receives a POST with the generated CSS and creates a GitHub PR on your behalf.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPrSetupModal(false)}
                className="px-4 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: "#e5e7eb", color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)" }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowPrModal(false)}>
          <div className="rounded-xl p-6 w-[340px] shadow-xl" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }} onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-light mb-4">Open Pull Request</h3>
            <p className="text-[14px] font-light mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>Select sections to include:</p>
            <div className="flex flex-col gap-3 mb-6">
              {(["colors", "card", "typography", "alerts", "interactions"] as const).map(section => {
                const labels: Record<string, string> = { colors: "Colors", card: "Cards", typography: "Typography", alerts: "Alerts", interactions: "Interactions" };
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

      {/* Mobile bottom tray */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl px-6 py-6 pb-28 space-y-5 max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: "hsl(var(--card))", borderTop: "1px solid hsl(var(--border))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-2" style={{ backgroundColor: "hsl(var(--muted-foreground) / 0.3)" }} />

            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Sections</p>
              {[
                { id: "colors", label: "Colors" },
                { id: "card", label: "Cards" },
                { id: "alerts", label: "Alerts" },
                { id: "typography", label: "Typography" },
                { id: "buttons", label: "Buttons" },
              ].map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[15px] font-light transition-opacity hover:opacity-70"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {s.label}
                </a>
              ))}
            </div>

            {showNavLinks && (
              <div className="space-y-1" style={{ borderTop: "1px solid hsl(var(--border))", paddingTop: "16px" }}>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Pages</p>
                <a href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[15px] font-light transition-opacity hover:opacity-70" style={{ color: "hsl(var(--foreground))" }}>How It Works</a>
                <a href="/readme" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[15px] font-light transition-opacity hover:opacity-70" style={{ color: "hsl(var(--foreground))" }}>README</a>
                <a href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[15px] font-light transition-opacity hover:opacity-70" style={{ color: "hsl(var(--foreground))" }}>Pricing</a>
                <a href="/features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[15px] font-light transition-opacity hover:opacity-70" style={{ color: "hsl(var(--foreground))" }}>Features</a>
              </div>
            )}

            <PremiumGate feature="pr-integration" variant="inline" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
              <div className="space-y-1" style={{ borderTop: "1px solid hsl(var(--border))", paddingTop: "16px" }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (!prEndpointUrl) { setShowPrSetupModal(true); return; }
                    setPrSections(new Set()); setShowPrModal(true);
                  }}
                  className="block py-2 text-[15px] font-light transition-opacity hover:opacity-70 flex items-center gap-2"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                  Open PR
                </button>
              </div>
            </PremiumGate>

            <div className="space-y-1" style={{ borderTop: "1px solid hsl(var(--border))", paddingTop: "16px" }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Legal</p>
              <a href="/privacy" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[15px] font-light transition-opacity hover:opacity-70" style={{ color: "hsl(var(--muted-foreground))" }}>Privacy Policy</a>
              <a href="/cookies" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[15px] font-light transition-opacity hover:opacity-70" style={{ color: "hsl(var(--muted-foreground))" }}>Cookies Policy</a>
              <a href="/terms" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[15px] font-light transition-opacity hover:opacity-70" style={{ color: "hsl(var(--muted-foreground))" }}>Terms & Conditions</a>
              <a href="/accessibility" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[15px] font-light transition-opacity hover:opacity-70" style={{ color: "hsl(var(--muted-foreground))" }}>Accessibility</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DesignSystemEditor({ licenseKey, ...props }: DesignSystemEditorProps) {
  return (
    <LicenseProvider licenseKey={licenseKey}>
      <DesignSystemEditorInner {...props} />
    </LicenseProvider>
  );
}

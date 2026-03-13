import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { AxeResults } from "axe-core";
import type { DesignSystemEditorProps, AiGenerateResult } from "./types";
import { useColorState } from "./hooks/useColorState";
import { useNavigationState } from "./hooks/useNavigationState";
import { useImagePalette } from "./hooks/useImagePalette";
import { usePrSubmission } from "./hooks/usePrSubmission";
import { LicenseProvider, useLicense } from "./hooks/useLicense";
import { PremiumGate } from "./components/PremiumGate";
import { ResetConfirmModal } from "./components/ResetConfirmModal";
import { CustomSelect } from "./components/CustomSelect";
import { CssImportModal } from "./components/CssImportModal";
import { ImagePaletteModal, PendingImagePaletteConfirm } from "./components/ImagePaletteModal";
import { MobileColorPicker } from "./components/MobileColorPicker";
import { PrModal } from "./components/PrModal";
import { AiGenerateModal } from "./components/AiGenerateModal";
import { SectionNav } from "./components/SectionNav";
import storage from "./utils/storage";
import {
  EDITABLE_VARS,
  contrastRatio,
  THEME_COLORS_KEY,
  PENDING_COLORS_KEY,
  COLOR_HISTORY_KEY,
  CONTRAST_KNOWLEDGE_KEY,
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
  TOAST_STYLE_KEY,
  DEFAULT_TOAST_STYLE,
  TOAST_PRESETS,
  applyToastStyle,
  applyStoredToastStyle,
  removeToastStyleProperties,
  BUTTON_STYLE_KEY,
  DEFAULT_BUTTON_STYLE,
  BUTTON_PRESETS,
  applyButtonStyle,
  applyStoredButtonStyle,
  removeButtonStyleProperties,
  INPUT_STYLE_KEY,
  DEFAULT_INPUT_STYLE,
  INPUT_PRESETS,
  applyInputStyle,
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
  exportPaletteAsText,
  exportPaletteAsSvg,
  exportPaletteAsPng,
  getCustomFonts,
  addCustomFont,
  removeCustomFont,
  initCustomFonts,
  buildShadowCss,
} from "./utils/themeUtils";
import type { CustomFontEntry } from "./utils/themeUtils";
import type {
  ButtonStyleState,
  CardStyleState,
  TypographyState,
  AlertStyleState,
  InteractionStyleState,
  TypoInteractionStyleState,
  InputStyleState,
} from "./utils/themeUtils";
import { useImportedIcons } from "./hooks/useImportedIcons";
import { useStyleState } from "./hooks/useStyleState";
import { IconImportModal } from "./components/IconImportModal";
import { ColorsSection } from "./sections/ColorsSection";
import { ButtonsSection } from "./sections/ButtonsSection";
import { CardsSection } from "./sections/CardsSection";
import { AlertsSection } from "./sections/AlertsSection";
import { TypographySection } from "./sections/TypographySection";
import { InputsSection } from "./sections/InputsSection";
import "./styles/editor.css";

function DesignSystemEditorInner({
  prEndpointUrl,
  prApiKey,
  githubConfig,
  accessibilityAudit = true,
  onChange,
  onExport,
  className,
  showNavLinks = true,
  showHeader = true,
  upgradeUrl,
  signInUrl,
  headerRight,
  topNav,
  aboutUrl,
  customIcons,
  iconMode = "append",
  showLogo = true,
  defaultColors,
  defaultTypography,
  onAiGenerate,
  sidebarLinks,
  sidebarExtra,
  showSectionNav = true,
}: DesignSystemEditorProps) {
  const { isPremium } = useLicense();
  const wcagEnforcement = true;

  const editorRootRef = useRef<HTMLDivElement>(null);

  const {
    colors,
    setColors,
    lockedKeys,
    setLockedKeys,
    colorUndoStack,
    setColorUndoStack,
    readCurrentColors,
  } = useColorState(editorRootRef, wcagEnforcement, defaultColors);

  // Sync CSS variables to the editor root element only (not document root).
  // This keeps plugin CSS fully scoped to .ds-editor.
  useEffect(() => {
    const el = editorRootRef.current;
    if (!el) return;
    const varsToSync = ["--background", "--foreground", "--border", "--muted", "--muted-foreground", "--brand"] as const;
    for (const v of varsToSync) {
      if (colors[v]) el.style.setProperty(v, colors[v]);
    }
  }, [colors["--background"], colors["--foreground"], colors["--border"], colors["--muted"], colors["--muted-foreground"], colors["--brand"]]);

  const {
    activeSection,
    navOffsets,
    mobileMenuOpen,
    setMobileMenuOpen,
    showScrollTop,
    navItemRefs,
    navContainerRef,
  } = useNavigationState();

  const [showResetModal, setShowResetModal] = useState(false);
  const [showGlobalResetModal, setShowGlobalResetModal] = useState(false);

  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [auditStatus, setAuditStatus] = useState<
    "idle" | "running" | "failed" | "passed"
  >("idle");
  const auditTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [iconsHidden, setIconsHidden] = useState(false);
  const [showIconImportModal, setShowIconImportModal] = useState(false);
  const { importedIcons, importedIconData, addIcons: addImportedIcons, removeIcon: removeImportedIcon, clearAll: clearImportedIcons } = useImportedIcons();
  const [auditViolations, setAuditViolations] = useState<
    { selector: string; text: string }[]
  >([]);
  const [harmonySchemeIndex, setHarmonySchemeIndex] = useState(-1);
  const [shuffleOpen, setShuffleOpen] = useState(false);
  const [cardStyle, setCardStyle] = useState<CardStyleState>(() => {
    const saved = storage.get<CardStyleState>(CARD_STYLE_KEY);
    return saved || { ...DEFAULT_CARD_STYLE };
  });
  const [typographyState, setTypographyState] = useState<TypographyState>(
    () => {
      const saved = storage.get<TypographyState>(TYPOGRAPHY_KEY);
      if (saved) return saved;
      if (defaultTypography) {
        return { ...DEFAULT_TYPOGRAPHY, ...defaultTypography, preset: "custom" as const };
      }
      return { ...DEFAULT_TYPOGRAPHY };
    },
  );
  const [customFonts, setCustomFonts] = useState<CustomFontEntry[]>(() =>
    getCustomFonts(),
  );
  const [newFontName, setNewFontName] = useState("");
  const [fontAddError, setFontAddError] = useState("");
  const [fontAddLoading, setFontAddLoading] = useState(false);

  const fontOptions = useMemo(() => {
    const appDefaultOptions: { label: string; value: string }[] = [];
    if (defaultTypography) {
      // Collect unique app-default font families
      const seen = new Set<string>();
      for (const family of [defaultTypography.bodyFamily, defaultTypography.headingFamily]) {
        if (family && !seen.has(family)) {
          seen.add(family);
          // Extract the first font name for the label (strip quotes and fallbacks)
          const firstName = family.split(",")[0].trim().replace(/^["']|["']$/g, "");
          // Skip if it matches the system default value
          if (family !== "inherit" && family !== "system-ui, -apple-system, sans-serif") {
            appDefaultOptions.push({ label: `App Default (${firstName})`, value: family });
          }
        }
      }
    }
    return [
      ...appDefaultOptions,
      ...FONT_FAMILY_OPTIONS,
      ...customFonts.map((f) => ({ label: `${f.label} *`, value: f.value })),
    ];
  }, [customFonts, defaultTypography]);

  const {
    state: alertStyle,
    setState: setAlertStyle,
    update: updateAlertStyle,
    selectPreset: selectAlertPreset,
  } = useStyleState<AlertStyleState>(
    () => storage.get<AlertStyleState>(ALERT_STYLE_KEY) || { ...DEFAULT_ALERT_STYLE },
    ALERT_PRESETS,
  );
  const {
    state: toastStyle,
    setState: setToastStyle,
    update: updateToastStyle,
    selectPreset: selectToastPreset,
  } = useStyleState<AlertStyleState>(
    () => storage.get<AlertStyleState>(TOAST_STYLE_KEY) || { ...DEFAULT_TOAST_STYLE },
    TOAST_PRESETS,
  );
  const {
    state: buttonStyle,
    setState: setButtonStyle,
    update: updateButtonStyle,
    selectPreset: selectButtonPreset,
  } = useStyleState<ButtonStyleState>(
    () => storage.get<ButtonStyleState>(BUTTON_STYLE_KEY) || { ...DEFAULT_BUTTON_STYLE },
    BUTTON_PRESETS,
  );
  const {
    state: interactionStyle,
    setState: setInteractionStyle,
    update: updateInteractionStyle,
    selectPreset: selectInteractionPreset,
  } = useStyleState<InteractionStyleState>(
    () => storage.get<InteractionStyleState>(INTERACTION_STYLE_KEY) || { ...DEFAULT_INTERACTION_STYLE },
    INTERACTION_PRESETS,
  );
  const {
    state: typoInteractionStyle,
    setState: setTypoInteractionStyle,
    update: updateTypoInteractionStyle,
    selectPreset: selectTypoInteractionPreset,
  } = useStyleState<TypoInteractionStyleState>(
    () => storage.get<TypoInteractionStyleState>(TYPO_INTERACTION_STYLE_KEY) || { ...DEFAULT_TYPO_INTERACTION_STYLE },
    TYPO_INTERACTION_PRESETS,
  );
  const {
    showImagePaletteModal,
    setShowImagePaletteModal,
    imagePaletteStatus,
    imageUrlInput,
    setImageUrlInput,
    imageUrlError,
    setImageUrlError,
    pendingImagePalette,
    setPendingImagePalette,
    appliedImageUrl,
    setAppliedImageUrl,
    appliedImageFading,
    setAppliedImageFading,
    fileInputRef,
    handleImagePalette,
    handleImageUrlSubmit,
    markApplied: markImageApplied,
  } = useImagePalette();
  const [exportFormat, setExportFormat] = useState<"css" | "tokens">("css");
  const [shareCopied, setShareCopied] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeInfoPos, setPurgeInfoPos] = useState<{ top: number; left: number } | null>(null);
  const purgeInfoRef = useRef<HTMLButtonElement>(null);
  const {
    state: inputStyle,
    update: updateInputStyle,
    selectPreset: selectInputPreset,
  } = useStyleState<InputStyleState>(
    () => storage.get<InputStyleState>(INPUT_STYLE_KEY) || { ...DEFAULT_INPUT_STYLE },
    INPUT_PRESETS,
  );
  const [showPaletteExport, setShowPaletteExport] = useState(false);
  const [showCssImportModal, setShowCssImportModal] = useState(false);
  const [paletteExportCopied, setPaletteExportCopied] = useState(false);
  const [mobilePickerKey, setMobilePickerKey] = useState<string | null>(null);
  const [mobilePickerHex, setMobilePickerHex] = useState("#000000");
  const [showAiGenerateModal, setShowAiGenerateModal] = useState(false);

  const fireOnChange = (newColors: Record<string, string>) => {
    onChange?.(newColors);
  };

  useEffect(() => {
    applyCardStyle(cardStyle, colors, editorRootRef.current!);
  }, [cardStyle, colors]);

  useEffect(() => {
    applyStoredCardStyle(colors, editorRootRef.current!);
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
      editorRootRef.current?.style.setProperty(key, val);
    }
    setColors(parsed.colors);
    // Apply styles
    setCardStyle(parsed.cardStyle);
    applyCardStyle(parsed.cardStyle, parsed.colors, editorRootRef.current!);
    setTypographyState(parsed.typographyState);
    applyTypography(parsed.typographyState, editorRootRef.current!);
    setAlertStyle(parsed.alertStyle);
    applyAlertStyle(parsed.alertStyle, editorRootRef.current!);
    setInteractionStyle(parsed.interactionStyle);
    applyInteractionStyle(parsed.interactionStyle, editorRootRef.current!);
    setTypoInteractionStyle(parsed.typoInteractionStyle);
    applyTypoInteractionStyle(parsed.typoInteractionStyle, editorRootRef.current!);
    setButtonStyle(parsed.buttonStyle);
    applyButtonStyle(parsed.buttonStyle, editorRootRef.current!);
    // Clear hash so it doesn't re-hydrate on state changes
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCardStyle = useCallback((patch: Partial<CardStyleState>) => {
    setCardStyle((prev) => {
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
      setCardStyle((prev) => ({ ...prev, ...preset }));
    }
  }, []);

  useEffect(() => {
    applyTypography(typographyState, editorRootRef.current!);
    // Recalculate nav offsets after font changes reflow
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("nav-recalc"));
    });
  }, [typographyState]);

  useEffect(() => {
    initCustomFonts();
    applyStoredTypography(editorRootRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTypography = useCallback((patch: Partial<TypographyState>) => {
    setTypographyState((prev) => {
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
      setFontAddError(
        err instanceof Error ? err.message : "Failed to add font",
      );
    } finally {
      setFontAddLoading(false);
    }
  }, [newFontName]);

  const handleRemoveCustomFont = useCallback(
    (label: string) => {
      const fonts = getCustomFonts();
      const entry = fonts.find((f) => f.label === label);
      removeCustomFont(label);
      setCustomFonts(getCustomFonts());
      // Reset heading/body if the removed font was in use
      if (entry) {
        const defaultFamily = FONT_FAMILY_OPTIONS[0].value;
        const patch: Partial<TypographyState> = {};
        if (typographyState.headingFamily === entry.value)
          patch.headingFamily = defaultFamily;
        if (typographyState.bodyFamily === entry.value)
          patch.bodyFamily = defaultFamily;
        if (Object.keys(patch).length) updateTypography(patch);
      }
    },
    [typographyState, updateTypography],
  );

  useEffect(() => {
    applyAlertStyle(alertStyle, editorRootRef.current!);
  }, [alertStyle]);

  useEffect(() => {
    applyStoredAlertStyle(editorRootRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleResetAlertStyle = () => {
    storage.remove(ALERT_STYLE_KEY);
    removeAlertStyleProperties(editorRootRef.current!);
    setAlertStyle({ ...DEFAULT_ALERT_STYLE });
    storage.remove(TOAST_STYLE_KEY);
    removeToastStyleProperties(editorRootRef.current!);
    setToastStyle({ ...DEFAULT_TOAST_STYLE });
  };

  useEffect(() => {
    applyToastStyle(toastStyle, editorRootRef.current!);
  }, [toastStyle]);

  useEffect(() => {
    applyStoredToastStyle(editorRootRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    applyButtonStyle(buttonStyle, editorRootRef.current!);
  }, [buttonStyle]);

  useEffect(() => {
    applyInputStyle(inputStyle, editorRootRef.current!);
  }, [inputStyle]);


  useEffect(() => {
    applyInteractionStyle(interactionStyle, editorRootRef.current!);
  }, [interactionStyle]);

  useEffect(() => {
    applyStoredButtonStyle(editorRootRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyStoredInteractionStyle(editorRootRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleResetInteractionStyle = () => {
    storage.remove(INTERACTION_STYLE_KEY);
    removeInteractionStyleProperties(editorRootRef.current!);
    setInteractionStyle({ ...DEFAULT_INTERACTION_STYLE });
  };

  useEffect(() => {
    applyTypoInteractionStyle(typoInteractionStyle, editorRootRef.current!);
  }, [typoInteractionStyle]);

  useEffect(() => {
    applyStoredTypoInteractionStyle(editorRootRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleResetTypoInteractionStyle = () => {
    storage.remove(TYPO_INTERACTION_STYLE_KEY);
    removeTypoInteractionStyleProperties(editorRootRef.current!);
    setTypoInteractionStyle({ ...DEFAULT_TYPO_INTERACTION_STYLE });
  };

  const buildSectionCss = useCallback(
    (sections: Iterable<string>) => {
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
            vars += `  --card-radius: ${cardStyle.borderRadius}px;\n`;
            vars += `  --card-shadow: ${buildShadowCss(cardStyle)};\n`;
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
          case "buttons": {
            vars += `  --btn-px: ${buttonStyle.paddingX}px;\n`;
            vars += `  --btn-py: ${buttonStyle.paddingY}px;\n`;
            vars += `  --btn-font-size: ${buttonStyle.fontSize}px;\n`;
            vars += `  --btn-font-weight: ${buttonStyle.fontWeight};\n`;
            vars += `  --btn-radius: ${buttonStyle.borderRadius}px;\n`;
            vars += `  --btn-shadow: ${buildShadowCss(buttonStyle)};\n`;
            vars += `  --btn-border-width: ${buttonStyle.borderWidth}px;\n`;
            break;
          }
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
    },
    [colors, cardStyle, typographyState, alertStyle, buttonStyle, interactionStyle],
  );

  const {
    showPrModal,
    setShowPrModal,
    prError,
    prSections,
    setPrSections,
    sectionPrStatus,
    setSectionPrStatus,
    submitPr,
    openPrModal,
  } = usePrSubmission(isPremium, prEndpointUrl, prApiKey, githubConfig, buildSectionCss);

  const handleColorChange = (key: string, hex: string) => {
    const lower = hex.toLowerCase();

    if (key === "--brand" && (lower === "#000000" || lower === "#ffffff"))
      return;

    if (key !== "--background" && key !== "--foreground") {
      const bgHex = colors["--background"]
        ? hslStringToHex(colors["--background"]).toLowerCase()
        : "";
      const fgHex = colors["--foreground"]
        ? hslStringToHex(colors["--foreground"]).toLowerCase()
        : "";
      if ((bgHex === "#000000" || bgHex === "#ffffff") && lower === bgHex)
        return;
      if ((fgHex === "#000000" || fgHex === "#ffffff") && lower === fgHex)
        return;
    }

    const hsl = hexToHslString(hex);

    const history =
      storage.get<{ key: string; previousValue: string }[]>(
        COLOR_HISTORY_KEY,
      ) || [];
    history.push({ key, previousValue: colors[key] || "" });

    editorRootRef.current?.style.setProperty(key, hsl);
    const newColors = { ...colors, [key]: hsl };

    const pending =
      storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    pending[key] = hsl;

    const DERIVATION_TRIGGERS = [
      "--brand",
      "--secondary",
      "--accent",
      "--background",
      "--foreground",
    ];
    if (DERIVATION_TRIGGERS.includes(key)) {
      const derived = derivePaletteFromChange(key, hsl, newColors, lockedKeys);
      for (const [dKey, dVal] of Object.entries(derived)) {
        history.push({ key: dKey, previousValue: newColors[dKey] || "" });
        editorRootRef.current?.style.setProperty(dKey, dVal);
        newColors[dKey] = dVal;
        pending[dKey] = dVal;
      }
    }

    const adjustments: Record<string, string> = {};
    if (wcagEnforcement) {
      const contrastLocks = new Set(lockedKeys);
      if (key !== "--brand") contrastLocks.add(key);
      const fixes = autoAdjustContrast(newColors, contrastLocks);
      for (const [adjKey, adjVal] of Object.entries(fixes)) {
        history.push({ key: adjKey, previousValue: newColors[adjKey] || "" });
        editorRootRef.current?.style.setProperty(adjKey, adjVal);
        newColors[adjKey] = adjVal;
        pending[adjKey] = adjVal;
        adjustments[adjKey] = adjVal;
      }
    }

    storage.set(COLOR_HISTORY_KEY, history);
    setColors(newColors);
    storage.set(PENDING_COLORS_KEY, pending);
    if (wcagEnforcement) persistContrastFixes(adjustments);
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
    css += `  --card-shadow: ${buildShadowCss(cardStyle)};\n`;
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
    const brandHsl = colors["--brand"];
    if (!brandHsl) return;

    const result = generateHarmonyPalette(brandHsl, scheme, colors, lockedKeys);
    const history =
      storage.get<{ key: string; previousValue: string }[]>(
        COLOR_HISTORY_KEY,
      ) || [];
    const pending =
      storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    const newColors = { ...colors };

    for (const [key, val] of Object.entries(result)) {
      history.push({ key, previousValue: newColors[key] || "" });
      editorRootRef.current?.style.setProperty(key, val);
      newColors[key] = val;
      pending[key] = val;
    }

    storage.set(COLOR_HISTORY_KEY, history);
    setColors(newColors);
    storage.set(PENDING_COLORS_KEY, pending);
    window.dispatchEvent(new Event("theme-pending-update"));
    setHarmonySchemeIndex(schemeIdx);
    setShuffleOpen(false);
    fireOnChange(newColors);
    if (accessibilityAudit) runAccessibilityAudit();
  };

  const MAX_UNDO = 10;

  const captureColorsForUndo = useCallback(() => {
    const el = editorRootRef.current || document.documentElement;
    const style = getComputedStyle(el);
    const snapshot: Record<string, string> = {};
    EDITABLE_VARS.forEach(({ key }) => {
      const val = style.getPropertyValue(key).trim();
      if (val) snapshot[key] = val;
    });
    return Object.keys(snapshot).length > 0 ? snapshot : { ...colors };
  }, [colors]);

  const handleGenerate = () => {
    const snapshot = captureColorsForUndo();
    setColorUndoStack((s) => [...s.slice(-(MAX_UNDO - 1)), snapshot]);
    const isDark = document.documentElement.classList.contains("dark");
    const result = generateRandomPalette(colors, lockedKeys, isDark);
    const history =
      storage.get<{ key: string; previousValue: string }[]>(
        COLOR_HISTORY_KEY,
      ) || [];
    const pending =
      storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    const newColors = { ...colors };

    for (const [key, val] of Object.entries(result)) {
      history.push({ key, previousValue: newColors[key] || "" });
      editorRootRef.current?.style.setProperty(key, val);
      newColors[key] = val;
      pending[key] = val;
    }

    storage.set(COLOR_HISTORY_KEY, history);
    setColors(newColors);
    storage.set(PENDING_COLORS_KEY, pending);
    window.dispatchEvent(new Event("theme-pending-update"));
    setHarmonySchemeIndex(-1);
    fireOnChange(newColors);
    if (accessibilityAudit) runAccessibilityAudit();
  };

  const handleUndo = () => {
    if (colorUndoStack.length === 0) return;
    const restored = colorUndoStack[colorUndoStack.length - 1];
    setColorUndoStack((s) => s.slice(0, -1));
    const el = editorRootRef.current || document.documentElement;
    const pending =
      storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    const saved = storage.get<Record<string, string>>(THEME_COLORS_KEY) || {};
    for (const [key, val] of Object.entries(restored)) {
      el.style.setProperty(key, val);
      pending[key] = val;
      saved[key] = val;
    }
    setColors(restored);
    storage.set(PENDING_COLORS_KEY, pending);
    storage.set(THEME_COLORS_KEY, saved);
    window.dispatchEvent(new Event("theme-pending-update"));
    fireOnChange(restored);
    if (accessibilityAudit) runAccessibilityAudit();
  };

  const applyImagePalette = (palette: Record<string, string>) => {
    const snapshot = captureColorsForUndo();
    setColorUndoStack((s) => [...s.slice(-(MAX_UNDO - 1)), snapshot]);

    let newColors = { ...colors };
    const brandDerived = derivePaletteFromChange(
      "--brand",
      palette["--brand"],
      newColors,
      lockedKeys,
    );
    newColors = {
      ...newColors,
      ...brandDerived,
      "--brand": palette["--brand"],
    };

    for (const key of [
      "--secondary",
      "--accent",
      "--background",
      "--foreground",
    ] as const) {
      if (lockedKeys.has(key)) continue;
      const derived = derivePaletteFromChange(
        key,
        palette[key],
        newColors,
        lockedKeys,
      );
      newColors = { ...newColors, ...derived, [key]: palette[key] };
    }

    if (wcagEnforcement) {
      const contrastFixes = autoAdjustContrast(newColors, lockedKeys);
      newColors = { ...newColors, ...contrastFixes };
    }

    const history =
      storage.get<{ key: string; previousValue: string }[]>(
        COLOR_HISTORY_KEY,
      ) || [];
    const pending =
      storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    const finalColors = { ...colors };

    for (const [key, val] of Object.entries(newColors)) {
      if (val !== colors[key]) {
        history.push({ key, previousValue: finalColors[key] || "" });
        editorRootRef.current?.style.setProperty(key, val);
        finalColors[key] = val;
        pending[key] = val;
      }
    }

    storage.set(COLOR_HISTORY_KEY, history);
    setColors(finalColors);
    storage.set(PENDING_COLORS_KEY, pending);
    window.dispatchEvent(new Event("theme-pending-update"));
    setHarmonySchemeIndex(-1);
    fireOnChange(finalColors);
    if (accessibilityAudit) runAccessibilityAudit();
    markImageApplied();
  };

  const handleResetColors = () => {
    EDITABLE_VARS.forEach(({ key }) => {
      editorRootRef.current?.style.removeProperty(key);
    });
    if (defaultColors) {
      Object.entries(defaultColors).forEach(([key, value]) => {
        editorRootRef.current?.style.setProperty(key, value);
      });
    }
    storage.remove(THEME_COLORS_KEY);
    storage.remove(PENDING_COLORS_KEY);
    storage.remove(COLOR_HISTORY_KEY);
    storage.remove(CONTRAST_KNOWLEDGE_KEY);
    readCurrentColors();
    setGeneratedCode(null);
    window.dispatchEvent(new Event("theme-pending-update"));
  };

  const handleReset = () => {
    EDITABLE_VARS.forEach(({ key }) => {
      editorRootRef.current?.style.removeProperty(key);
    });
    // If the consumer provided default colors, restore them instead of bare defaults
    if (defaultColors) {
      Object.entries(defaultColors).forEach(([key, value]) => {
        editorRootRef.current?.style.setProperty(key, value);
      });
    }
    storage.remove(THEME_COLORS_KEY);
    storage.remove(PENDING_COLORS_KEY);
    storage.remove(COLOR_HISTORY_KEY);
    storage.remove(CONTRAST_KNOWLEDGE_KEY);
    storage.remove(CARD_STYLE_KEY);
    removeCardStyleProperties(editorRootRef.current!);
    setCardStyle({ ...DEFAULT_CARD_STYLE });
    storage.remove(TYPOGRAPHY_KEY);
    removeTypographyProperties(editorRootRef.current!);
    const resetTypo = defaultTypography
      ? { ...DEFAULT_TYPOGRAPHY, ...defaultTypography, preset: "custom" as const }
      : { ...DEFAULT_TYPOGRAPHY };
    setTypographyState(resetTypo);
    if (defaultTypography) applyTypography(resetTypo, editorRootRef.current!);
    storage.remove(ALERT_STYLE_KEY);
    removeAlertStyleProperties(editorRootRef.current!);
    setAlertStyle({ ...DEFAULT_ALERT_STYLE });
    storage.remove(BUTTON_STYLE_KEY);
    removeButtonStyleProperties(editorRootRef.current!);
    setButtonStyle({ ...DEFAULT_BUTTON_STYLE });
    storage.remove(INTERACTION_STYLE_KEY);
    removeInteractionStyleProperties(editorRootRef.current!);
    setInteractionStyle({ ...DEFAULT_INTERACTION_STYLE });
    storage.remove(TYPO_INTERACTION_STYLE_KEY);
    removeTypoInteractionStyleProperties(editorRootRef.current!);
    setTypoInteractionStyle({ ...DEFAULT_TYPO_INTERACTION_STYLE });
    readCurrentColors();
    setGeneratedCode(null);
    setSectionPrStatus({});
    window.dispatchEvent(new Event("theme-pending-update"));
  };

  const handleResetCardStyle = () => {
    storage.remove(CARD_STYLE_KEY);
    removeCardStyleProperties(editorRootRef.current!);
    setCardStyle({ ...DEFAULT_CARD_STYLE });
  };

  const handleResetTypography = () => {
    storage.remove(TYPOGRAPHY_KEY);
    removeTypographyProperties(editorRootRef.current!);
    const resetTypo = defaultTypography
      ? { ...DEFAULT_TYPOGRAPHY, ...defaultTypography, preset: "custom" as const }
      : { ...DEFAULT_TYPOGRAPHY };
    setTypographyState(resetTypo);
    if (defaultTypography) applyTypography(resetTypo, editorRootRef.current!);
  };

  const handlePurgeStorage = () => {
    try { localStorage.clear(); } catch { /* noop */ }
    try { sessionStorage.clear(); } catch { /* noop */ }
    window.location.reload();
  };

  const runAccessibilityAudit = async (manual = false) => {
    if (!accessibilityAudit) return;
    setAuditStatus("running");
    setAuditViolations([]);
    try {
      const axe = (await import("axe-core")).default;
      const context = editorRootRef.current || document.body;
      const results: AxeResults = await axe.run(
        { include: [context], exclude: ["[data-axe-exclude]"] },
        { runOnly: { type: "rule", values: ["color-contrast"] } },
      );
      const issueCount = results.violations.reduce((n, v) => n + v.nodes.length, 0);
      console.log(
        `[Themal] Accessibility audit: ${issueCount === 0 ? "PASSED" : `${issueCount} contrast issue${issueCount !== 1 ? "s" : ""} found`}`,
      );
      if (results.violations.length === 0) {
        setAuditStatus(manual ? "passed" : "idle");
        setAuditViolations([]);
      } else {
        for (const v of results.violations) {
          for (const node of v.nodes) {
            console.log(`[Themal]   - ${node.target[0]}: ${node.failureSummary?.split("\n")[0] || "contrast failure"}`);
          }
        }
        const style = getComputedStyle(editorRootRef.current || document.documentElement);
        const liveColors: Record<string, string> = {};
        EDITABLE_VARS.forEach(({ key }) => {
          liveColors[key] = style.getPropertyValue(key).trim();
        });
        if (wcagEnforcement) {
          const fixes = autoAdjustContrast(liveColors, lockedKeys);
          if (Object.keys(fixes).length > 0) {
            const updatedColors = { ...liveColors };
            const bg = liveColors["--background"];
            for (const [fixKey, fixVal] of Object.entries(fixes)) {
              editorRootRef.current?.style.setProperty(fixKey, fixVal);
              updatedColors[fixKey] = fixVal;
              if (bg) saveContrastCorrection(bg, fixKey, fixVal);
              console.log(`[Themal]   Fixed ${fixKey}: ${liveColors[fixKey]} -> ${fixVal}`);
            }
            persistContrastFixes(fixes);
            setColors(updatedColors);
            window.dispatchEvent(new Event("theme-pending-update"));
          }
        }
        const reResults = await axe.run(
          { include: [context], exclude: ["[data-axe-exclude]"] },
          { runOnly: { type: "rule", values: ["color-contrast"] } },
        );
        const remainingCount = reResults.violations.reduce((n, v) => n + v.nodes.length, 0);
        console.log(
          `[Themal] Post-fix audit: ${remainingCount === 0 ? "ALL ISSUES RESOLVED" : `${remainingCount} issue${remainingCount !== 1 ? "s" : ""} remaining`}`,
        );
        if (reResults.violations.length === 0) {
          setAuditStatus(manual ? "passed" : "idle");
          setAuditViolations([]);
        } else {
          setAuditStatus(manual ? "failed" : "idle");
          const elements: { selector: string; text: string }[] = [];
          for (const v of reResults.violations) {
            for (const node of v.nodes) {
              const selector = String(node.target[0] || "");
              const el = document.querySelector(selector) as HTMLElement | null;
              const text = el?.textContent?.trim().slice(0, 40) || selector;
              elements.push({ selector, text });
            }
          }
          setAuditViolations(elements);
  
        }
      }
    } catch {
      setAuditStatus("idle");
    }
  };

  const fixContrastIssues = async () => {
    if (!isPremium) return;
    setAuditStatus("running");
    try {
      const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

      const highlight = (el: HTMLElement, color: string, ms = 1500) => {
        el.style.outline = `3px solid ${color}`;
        el.style.outlineOffset = "2px";
        el.style.transition = "outline-color 0.3s";
        setTimeout(() => {
          el.style.outline = "";
          el.style.outlineOffset = "";
          el.style.transition = "";
        }, ms);
      };

      const style = getComputedStyle(editorRootRef.current || document.documentElement);
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
          if (!lockedKeys.has(k)) {
            working[k] = bestFg;
            fixes[k] = bestFg;
          }
        }
      }
      const mutedFg = working["--muted-foreground"];
      if (
        bg &&
        mutedFg &&
        contrastRatio(mutedFg, bg) < 4.5 &&
        !lockedKeys.has("--muted-foreground")
      ) {
        const bestMuted = fgForBg(bg);
        working["--muted-foreground"] = bestMuted;
        fixes["--muted-foreground"] = bestMuted;
      }

      const fixEntries = Object.entries(fixes).filter(
        ([k]) => fixes[k] !== liveColors[k],
      );
      for (let i = 0; i < fixEntries.length; i++) {
        const [fixKey, fixVal] = fixEntries[i];
        const swatchEl = document.querySelector(
          `[data-color-key="${fixKey}"]`,
        ) as HTMLElement | null;
        if (swatchEl) {
          swatchEl.scrollIntoView({ behavior: "smooth", block: "center" });
          highlight(swatchEl, "hsl(0 84% 60%)");
          await delay(250);
        }
        editorRootRef.current?.style.setProperty(fixKey, fixVal);
        if (bg) saveContrastCorrection(bg, fixKey, fixVal);
        if (swatchEl) {
          await delay(150);
          highlight(swatchEl, "hsl(142 76% 45%)");
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
      const runAudit = () =>
        axe.run(
          { exclude: ["[data-axe-exclude]"] },
          { runOnly: { type: "rule", values: ["color-contrast"] } },
        );

      const parseRgb = (rgb: string): [number, number, number] | null => {
        const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return null;
        return [
          parseInt(m[1]) / 255,
          parseInt(m[2]) / 255,
          parseInt(m[3]) / 255,
        ];
      };
      const lum = (r: number, g: number, b: number) => {
        const toL = (c: number) =>
          c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        return 0.2126 * toL(r) + 0.7152 * toL(g) + 0.0722 * toL(b);
      };
      const rgbToHsl = (r: number, g: number, b: number) => {
        const max = Math.max(r, g, b),
          min = Math.min(r, g, b);
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
        const el = document.querySelector(
          node.target[0] as string,
        ) as HTMLElement | null;
        if (!el) return;
        const computed = getComputedStyle(el);
        const fgRgb = parseRgb(computed.color);
        const bgRgb = parseRgb(computed.backgroundColor);
        if (!fgRgb || !bgRgb) return;
        const bgLum = lum(...bgRgb);
        const fgLum = lum(...fgRgb);
        const ratio =
          (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
        if (ratio >= 4.5) return;

        el.scrollIntoView({ behavior: "smooth", block: "center" });
        highlight(el, "hsl(0 84% 60%)");
        await delay(300);

        const fgHsl = rgbToHsl(...fgRgb);
        let fixed = false;
        for (const dir of [
          bgLum > 0.5 ? -0.01 : 0.01,
          bgLum > 0.5 ? 0.01 : -0.01,
        ]) {
          const tryHsl = { ...fgHsl };
          for (let i = 0; i < 100; i++) {
            tryHsl.l = Math.max(0, Math.min(1, tryHsl.l + dir));
            const a = tryHsl.s * Math.min(tryHsl.l, 1 - tryHsl.l);
            const newFg = [0, 0, 0] as [number, number, number];
            for (let ci = 0; ci < 3; ci++) {
              const n = [0, 8, 4][ci];
              const k = (n + tryHsl.h * 12) % 12;
              newFg[ci] =
                tryHsl.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            }
            const newRatio =
              (Math.max(lum(...newFg), bgLum) + 0.05) /
              (Math.min(lum(...newFg), bgLum) + 0.05);
            if (newRatio >= 4.5) {
              el.style.color = hslToRgbStr(tryHsl.h, tryHsl.s, tryHsl.l);
              fixed = true;
              break;
            }
          }
          if (fixed) break;
        }

        highlight(el, "hsl(142 76% 45%)");
        await delay(200);
      };

      for (let pass = 0; pass < 3; pass++) {
        await delay(300);
        const midResults = await runAudit();
        const contrastViolation = midResults.violations.find(
          (v) => v.id === "color-contrast",
        );
        if (!contrastViolation) break;
        for (let ni = 0; ni < contrastViolation.nodes.length; ni++) {
          await fixElementAnimated(contrastViolation.nodes[ni]);
        }
      }

      await delay(400);
      const finalResults = await runAudit();
      if (finalResults.violations.length === 0) {
        setAuditStatus("passed");
        setAuditViolations([]);

      } else {
        setAuditStatus("failed");
        const elements: { selector: string; text: string }[] = [];
        for (const v of finalResults.violations) {
          for (const node of v.nodes) {
            const selector = String(node.target[0] || "");
            const el = document.querySelector(selector) as HTMLElement | null;
            const text = el?.textContent?.trim().slice(0, 40) || selector;
            elements.push({ selector, text });
          }
        }
        setAuditViolations(elements);

      }
    } catch (err) {
      console.error("fixContrastIssues failed:", err);
      setAuditStatus("failed");
    }
  };

  // On mobile, scroll any focused editable element to the top of the viewport
  useEffect(() => {
    if (typeof window === "undefined") return;

    const findScrollTarget = (el: HTMLElement): HTMLElement => {
      // Walk up to find a label parent or a div that contains a label sibling
      let node: HTMLElement | null = el;
      for (let i = 0; i < 5 && node; i++) {
        if (node.tagName === "LABEL") return node;
        const parent: HTMLElement | null = node.parentElement;
        if (parent && parent.querySelector("label")) return parent;
        node = parent;
      }
      return el.parentElement || el;
    };

    const scrollToTop = (target: HTMLElement) => {
      const scrollEl = findScrollTarget(target);
      setTimeout(() => {
        const rect = scrollEl.getBoundingClientRect();
        const scrollY = window.scrollY + rect.top - 8;
        window.scrollTo({ top: scrollY, behavior: "smooth" });
      }, 100);
    };

    const handleFocus = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const tag = target.tagName;
      const type = target.getAttribute("type");
      if (tag === "INPUT" && type === "color") return;
      if (target.closest("[data-mobile-picker]")) return;
      if (!target.closest("#colors")) return;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") {
        scrollToTop(target);
      }
    };

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (target.closest("[data-mobile-picker]")) return;
      if (!target.closest("#colors")) return;
      // Swatch buttons handle their own scroll in onClick, skip them here
      if (target.closest("button[aria-label*='color swatch']")) return;
      // Handle range inputs
      if (target.tagName === "INPUT" && target.getAttribute("type") === "range") {
        scrollToTop(target);
      }
    };

    const root = editorRootRef.current;
    if (!root) return;
    root.addEventListener("focusin", handleFocus, { passive: true });
    root.addEventListener("click", handleClick, { passive: true });
    return () => {
      root.removeEventListener("focusin", handleFocus);
      root.removeEventListener("click", handleClick);
    };
  }, []);

  const handleAiApply = (result: AiGenerateResult) => {
    if (result.colors) {
      const pending =
        storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
      const newColors = { ...colors };
      for (const [key, val] of Object.entries(result.colors)) {
        editorRootRef.current?.style.setProperty(key, val);
        newColors[key] = val;
        pending[key] = val;
      }
      setColors(newColors);
      storage.set(PENDING_COLORS_KEY, pending);
      window.dispatchEvent(new Event("theme-pending-update"));
      fireOnChange(newColors);
    }

    if (result.typography) {
      setTypographyState((prev) => ({
        ...prev,
        ...result.typography,
        preset: "custom" as const,
      }));
    }

    setShowAiGenerateModal(false);
  };

  return (
    <div id="top" ref={editorRootRef} className={`ds-editor${className ? ` ${className}` : ""}`} style={{ background: "transparent", color: "hsl(var(--foreground))" }}>
      {showHeader && (
        <div
          className="pt-2 sm:pt-3 pb-4 sm:pb-2 lg:pb-3"
        >
          <div className="w-full px-4 sm:px-6 lg:px-8">
            {/* Title + nav links - single header row */}
            <div className="w-full mb-2 sm:mb-3 lg:mb-4 flex items-end gap-x-8 sm:gap-x-12 pt-2 sm:pt-3 lg:pt-4 relative" data-axe-exclude>
              {showLogo && <a
                href="/"
                className="flex-shrink-0 leading-none ds-text-fg"
              >
                <svg
                  className="h-10 block"
                  viewBox="0 0 1654 514"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Themal"
                >
                  <path
                    d="M0 21.3583C0 9.56245 9.56242 0 21.3583 0H128.15V153.78H21.3583C9.56242 153.78 0 144.217 0 132.421V21.3583Z"
                    fill="#FC0000"
                  />
                  <path
                    d="M434 21.3583C434 9.56245 424.438 0 412.642 0H305.85V153.78H412.642C424.438 153.78 434 144.217 434 132.421V21.3583Z"
                    fill="#0095FE"
                  />
                  <path
                    d="M128.15 153.78H217V329.772H128.15V153.78Z"
                    fill="#FF8100"
                  />
                  <path d="M128.15 0H217V153.78H128.15V0Z" fill="#FF4900" />
                  <path
                    d="M128.15 329.772H217V505.764H149.508C137.712 505.764 128.15 496.201 128.15 484.406V329.772Z"
                    fill="#FFB601"
                  />
                  <path
                    d="M217 153.78H305.85V329.772H217V153.78Z"
                    fill="#15C58E"
                  />
                  <path d="M217 0H305.85V153.78H217V0Z" fill="#3CBB0E" />
                  <path
                    d="M217 329.772H305.85V484.406C305.85 496.201 296.288 505.764 284.492 505.764H217V329.772Z"
                    fill="#8831F9"
                  />
                  <path
                    d="M596.006 198.766V235.338H492.559V505.764H450.344V235.338H346.896V198.766H596.006Z"
                    fill="currentColor"
                  />
                  <path
                    d="M612.114 197.721H649.732V312.244C658.648 300.959 666.659 293.018 673.765 288.42C685.886 280.479 701.002 276.508 719.114 276.508C751.577 276.508 773.59 287.863 785.153 310.572C791.423 322.972 794.558 340.179 794.558 362.192V505.764H755.896V364.699C755.896 348.259 753.806 336.208 749.626 328.545C742.799 316.285 729.982 310.154 711.173 310.154C695.569 310.154 681.428 315.518 668.749 326.246C656.071 336.974 649.732 357.246 649.732 387.061V505.764H612.114V197.721Z"
                    fill="currentColor"
                  />
                  <path
                    d="M926.444 276.926C942.326 276.926 957.722 280.688 972.629 288.211C987.537 295.595 998.892 305.208 1006.69 317.051C1014.22 328.336 1019.23 341.502 1021.74 356.549C1023.97 366.859 1025.08 383.299 1025.08 405.869H861.031C861.728 428.579 867.092 446.83 877.123 460.623C887.155 474.277 902.689 481.104 923.727 481.104C943.371 481.104 959.045 474.625 970.748 461.668C977.436 454.145 982.173 445.437 984.959 435.545H1021.95C1020.97 443.765 1017.7 452.96 1012.13 463.131C1006.69 473.162 1000.56 481.382 993.737 487.791C982.312 498.937 968.171 506.46 951.313 510.361C942.257 512.591 932.017 513.705 920.592 513.705C892.727 513.705 869.112 503.604 849.746 483.402C830.38 463.061 820.698 434.639 820.698 398.137C820.698 362.192 830.45 333.003 849.955 310.572C869.461 288.141 894.957 276.926 926.444 276.926ZM986.422 375.984C984.89 359.684 981.337 346.657 975.764 336.904C965.454 318.792 948.248 309.736 924.145 309.736C906.869 309.736 892.379 316.006 880.676 328.545C868.973 340.945 862.773 356.758 862.076 375.984H986.422Z"
                    fill="currentColor"
                  />
                  <path
                    d="M1054.36 281.942H1091.56V313.707C1100.47 302.701 1108.56 294.69 1115.8 289.674C1128.2 281.175 1142.27 276.926 1158.02 276.926C1175.85 276.926 1190.2 281.315 1201.07 290.092C1207.2 295.108 1212.77 302.492 1217.78 312.244C1226.14 300.262 1235.97 291.415 1247.25 285.703C1258.54 279.852 1271.21 276.926 1285.29 276.926C1315.38 276.926 1335.86 287.793 1346.73 309.527C1352.58 321.231 1355.51 336.974 1355.51 356.758V505.764H1316.43V350.279C1316.43 335.372 1312.66 325.132 1305.14 319.559C1297.76 313.986 1288.7 311.199 1277.97 311.199C1263.2 311.199 1250.46 316.145 1239.73 326.037C1229.14 335.929 1223.85 352.439 1223.85 375.567V505.764H1185.6V359.684C1185.6 344.498 1183.79 333.421 1180.17 326.455C1174.46 316.006 1163.8 310.781 1148.19 310.781C1133.98 310.781 1121.02 316.285 1109.32 327.291C1097.76 338.298 1091.98 358.221 1091.98 387.061V505.764H1054.36V281.942Z"
                    fill="currentColor"
                  />
                  <path
                    d="M1422.61 446.203C1422.61 457.07 1426.58 465.639 1434.52 471.908C1442.46 478.178 1451.86 481.313 1462.73 481.313C1475.97 481.313 1488.78 478.248 1501.18 472.117C1522.08 461.947 1532.53 445.298 1532.53 422.17V391.867C1527.93 394.793 1522.01 397.231 1514.77 399.182C1507.52 401.132 1500.42 402.526 1493.45 403.361L1470.67 406.287C1457.02 408.098 1446.78 410.955 1439.95 414.856C1428.39 421.404 1422.61 431.853 1422.61 446.203ZM1513.72 370.133C1522.36 369.018 1528.14 365.396 1531.07 359.266C1532.74 355.922 1533.58 351.115 1533.58 344.846C1533.58 332.028 1528.98 322.763 1519.78 317.051C1510.73 311.199 1497.7 308.274 1480.7 308.274C1461.06 308.274 1447.13 313.568 1438.91 324.156C1434.31 330.008 1431.31 338.716 1429.92 350.279H1394.81C1395.51 322.693 1404.42 303.537 1421.56 292.809C1438.84 281.942 1458.83 276.508 1481.54 276.508C1507.87 276.508 1529.26 281.524 1545.7 291.555C1562 301.586 1570.15 317.19 1570.15 338.367V467.311C1570.15 471.212 1570.92 474.346 1572.45 476.715C1574.12 479.083 1577.53 480.268 1582.69 480.268C1584.36 480.268 1586.24 480.198 1588.33 480.059C1590.42 479.78 1592.65 479.432 1595.02 479.014V506.809C1589.17 508.481 1584.71 509.526 1581.64 509.943C1578.58 510.361 1574.4 510.57 1569.1 510.57C1556.15 510.57 1546.74 505.973 1540.89 496.777C1537.83 491.901 1535.67 485.005 1534.41 476.088C1526.75 486.119 1515.74 494.827 1501.39 502.211C1487.04 509.595 1471.23 513.287 1453.95 513.287C1433.19 513.287 1416.2 507.018 1402.96 494.479C1389.87 481.8 1383.32 465.987 1383.32 447.039C1383.32 426.28 1389.8 410.188 1402.75 398.764C1415.71 387.339 1432.71 380.304 1453.74 377.656L1513.72 370.133Z"
                    fill="currentColor"
                  />
                  <path
                    d="M1615.93 198.766H1653.55V505.764H1615.93V198.766Z"
                    fill="currentColor"
                  />
                </svg>
              </a>}

              {/* Nav links - desktop (next to logo) */}
              {topNav ? (
                <nav className="hidden md:flex items-center gap-4">
                  {topNav}
                </nav>
              ) : showNavLinks && (
                <nav className="hidden md:flex items-center gap-4">
                  {[
                    { href: "/editor", label: "Editor" },
                    ...(aboutUrl ? [{ href: aboutUrl, label: "About" }] : []),
                    { href: "/how-it-works", label: "How" },
                    { href: "/readme", label: "Dev" },
                    { href: "/features", label: "Features" },
                    { href: "/pricing", label: "Pricing" },
                  ].map(({ href, label }) => {
                    const isActive = typeof window !== "undefined" && window.location.pathname === href;
                    return (
                      <a
                        key={href}
                        href={href}
                        className={`ds-nav-link text-xs font-light uppercase tracking-wider hover:opacity-70 whitespace-nowrap${isActive ? " ds-active" : ""}`}
                      >
                        {label}
                      </a>
                    );
                  })}
                </nav>
              )}

              {/* Header actions (right side) */}
              <div className="ml-auto flex items-center gap-3">
                {headerRight}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg transition-opacity hover:opacity-70 md:hidden ds-text-fg"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    {mobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSectionNav && <SectionNav />}

      {/* Tablet actions dropdown (hidden on mobile where left nav is used, visible sm-lg) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 md:pt-12 hidden sm:flex items-center gap-2 lg:hidden" data-axe-exclude>
        <div className="ml-auto">
          <CustomSelect
            ariaLabel="Global actions"
            placeholder="Actions…"
            size="sm"
            width="120px"
            value=""
            onChange={(v) => {
              if (v === "reset-all") setShowGlobalResetModal(true);
              else if (v === "default") {
                setHarmonySchemeIndex(-1);
                handleGenerate();
              } else if (v === "refresh") handleGenerate();
              else if (v === "undo-refresh") handleUndo();
              else if (v === "upload") setShowImagePaletteModal(true);
              else if (v === "export") setShowPaletteExport(true);
              else if (v === "share") {
                const hash = serializeThemeState(
                  colors,
                  cardStyle,
                  typographyState,
                  alertStyle,
                  interactionStyle,
                  typoInteractionStyle,
                  buttonStyle,
                );
                window.location.hash = hash;
                navigator.clipboard.writeText(window.location.href).then(() => {
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 2000);
                });
              } else if (v === "pr") {
                openPrModal();
              }
              else if (v === "purge") setShowPurgeModal(true);
              else if (v === "audit") runAccessibilityAudit(true);
              else if (v === "ai-generate") setShowAiGenerateModal(true);
            }}
            options={[
              { value: "reset-all", label: "Reset theme to default" },
              { value: "refresh", label: "Refresh Theme" },
              ...(colorUndoStack.length > 0 ? [{ value: "undo-refresh", label: "Undo last refresh" }] : []),
              { value: "default", label: "Default Scheme" },
              { value: "upload", label: "Upload Image" },
              { value: "export", label: "Export Palette" },
              { value: "share", label: "Share" },
              ...((prEndpointUrl || githubConfig) ? [{ value: "pr", label: "Open PR" }] : []),
              { value: "purge", label: "Purge Storage" },
              ...(accessibilityAudit ? [{ value: "audit", label: "Accessibility Check" }] : []),
              ...(onAiGenerate ? [{ value: "ai-generate", label: "AI Generate" }] : []),
            ]}
          />
        </div>
      </div>
      {/* Main layout: left sidebar + content */}
      <div className="flex w-full">
        {/* Mobile menu button — visible below lg */}
        <button
          type="button"
          className="lg:hidden fixed bottom-3 left-3 z-50 w-10 h-10 rounded-full flex items-center justify-center ds-text-fg"
          style={{
            background: "linear-gradient(135deg, rgba(128,128,128,0.35), rgba(160,160,160,0.2))",
            backdropFilter: "blur(12px) saturate(180%)",
            WebkitBackdropFilter: "blur(12px) saturate(180%)",
            border: "1px solid rgba(128,128,128,0.25)",
            boxShadow: "4px 4px 12px rgba(0,0,0,0.1), -2px -2px 8px rgba(255,255,255,0.15), inset 1px 1px 2px rgba(255,255,255,0.2)",
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Left sidebar — shared between desktop (always visible) and mobile (slide-in) */}
        <aside
          className={`ds-left-nav flex flex-col gap-1.5 flex-shrink-0 w-56 lg:w-48 pt-4 lg:pt-8 pb-6 pl-4 pr-2 overflow-y-auto ${
            mobileMenuOpen
              ? "fixed inset-y-0 left-0 z-50"
              : "hidden lg:flex sticky top-0 self-start z-30"
          }`}
          style={{ maxHeight: mobileMenuOpen ? undefined : "100vh", backgroundColor: mobileMenuOpen ? "hsl(var(--background))" : undefined }}
          data-axe-exclude
          onClick={mobileMenuOpen ? (e) => e.stopPropagation() : undefined}
        >
          <button
            onClick={() => setShowGlobalResetModal(true)}
            className="ds-global-btn w-full h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
            title="Reset all sections to defaults"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" />
            </svg>
            <span className="truncate">Reset</span>
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleGenerate}
              className="ds-global-btn flex-1 min-w-0 h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
              title="Generate new random palette"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="truncate">Refresh</span>
            </button>
            {colorUndoStack.length > 0 && (
              <button
                type="button"
                onClick={handleUndo}
                className="ds-global-btn ds-undo-btn h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center shrink-0"
                title="Undo last refresh"
                aria-label="Undo last refresh"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 010 10H9m-6-10l4-4m-4 4l4 4" />
                </svg>
              </button>
            )}
          </div>
          <PremiumGate
            feature="harmony-schemes"
            variant="inline"
            hideLock
            upgradeUrl={upgradeUrl}
            signInUrl={signInUrl}
          >
            <div className="relative w-full">
              <button
                onClick={() => setShuffleOpen(!shuffleOpen)}
                className="ds-global-btn w-full h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="truncate">
                  {harmonySchemeIndex >= 0 ? HARMONY_SCHEMES[harmonySchemeIndex] : "Palette"}
                </span>
                <svg className="w-3 h-3 flex-shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
                {!isPremium && (
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
              </button>
              {shuffleOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShuffleOpen(false)} />
                  <div
                    className="absolute left-0 top-full mt-1 z-50 min-w-[180px] rounded-lg shadow-lg py-1 border ds-bg ds-border"
                  >
                    <button
                      onClick={() => { setHarmonySchemeIndex(-1); setShuffleOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-light transition-colors hover:opacity-80 flex items-center justify-between ds-text-fg"
                    >
                      Default
                      {harmonySchemeIndex < 0 && <span className="text-green-600 dark:text-green-400">&#10003;</span>}
                    </button>
                    {HARMONY_SCHEMES.map((scheme, idx) => (
                      <button
                        key={scheme}
                        onClick={() => handleRegenerate(idx)}
                        className="w-full text-left px-4 py-2 text-xs font-light transition-colors hover:opacity-80 flex items-center justify-between ds-text-fg"
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
          <PremiumGate
            feature="image-palette"
            variant="inline"
            hideLock
            upgradeUrl={upgradeUrl}
            signInUrl={signInUrl}
          >
            <button
              onClick={() => setShowImagePaletteModal(true)}
              className="ds-global-btn w-full h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
              title="Extract a color palette from an image"
            >
              {imagePaletteStatus === "extracting" ? (
                <svg className="w-4 h-4 flex-shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : imagePaletteStatus === "done" ? (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : imagePaletteStatus === "error" ? (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
                </svg>
              )}
              <span className="truncate">
                {imagePaletteStatus === "extracting" ? "Extracting..." : imagePaletteStatus === "done" ? "Applied" : imagePaletteStatus === "error" ? "Failed" : "Image"}
              </span>
              {!isPremium && (
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </button>
          </PremiumGate>
          {accessibilityAudit && (
            <button
              onClick={() => runAccessibilityAudit(true)}
              className="ds-global-btn w-full h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
              title="Run accessibility audit"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">{auditStatus === "running" ? "Auditing..." : "A11y Check"}</span>
            </button>
          )}
          {onAiGenerate && (
            <button
              onClick={() => setShowAiGenerateModal(true)}
              className="ds-global-btn w-full h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
              title="Generate theme with AI"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              <span className="truncate">AI Generate</span>
            </button>
          )}

          {/* Divider */}
          <div className="my-1 border-t ds-border" />

          <PremiumGate feature="palette-export" variant="inline" hideLock upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
            <button
              onClick={() => setShowPaletteExport(true)}
              className="ds-global-btn w-full h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
              title="Export palette"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="truncate">Export</span>
            </button>
          </PremiumGate>
          <button
            onClick={() => {
              const hash = serializeThemeState(colors, cardStyle, typographyState, alertStyle, interactionStyle, typoInteractionStyle, buttonStyle);
              window.location.hash = hash;
              navigator.clipboard.writeText(window.location.href).then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2000); });
            }}
            className="ds-global-btn w-full h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
            title="Share theme URL"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            <span className="truncate">{shareCopied ? "Copied!" : "Share"}</span>
          </button>
          {(prEndpointUrl || githubConfig) && (
            <PremiumGate feature="pr-integration" variant="inline" hideLock upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
              <button
                onClick={openPrModal}
                className="ds-global-btn w-full h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
                title="Open a GitHub PR"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="truncate">Open PR</span>
              </button>
            </PremiumGate>
          )}
          <button
            onClick={() => setShowPurgeModal(true)}
            className="ds-global-btn flex-1 h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="truncate">Purge</span>
            <span
              ref={purgeInfoRef}
              className="ds-text-muted hover:opacity-70 transition-opacity"
              onMouseEnter={(e) => {
                e.stopPropagation();
                const rect = purgeInfoRef.current?.getBoundingClientRect();
                if (rect) setPurgeInfoPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
              }}
              onMouseLeave={() => setPurgeInfoPos(null)}
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </span>
          </button>
          {purgeInfoPos && (
            <div
              className="ds-purge-tooltip"
              style={{ top: purgeInfoPos.top, left: purgeInfoPos.left, transform: "translate(-50%, -100%)" }}
            >
              Clears all saved theme data, preferences, and cached settings from localStorage and sessionStorage. The page will reload with default values.
            </div>
          )}
          {sidebarLinks && sidebarLinks.length > 0 && (
            <>
              <div className="my-1 border-t ds-border" />
              {sidebarLinks.map(({ to, label }) => (
                <a
                  key={to}
                  href={to}
                  className="ds-global-btn w-full h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2 ds-text-fg"
                >
                  <span className="truncate">{label}</span>
                </a>
              ))}
            </>
          )}
          {sidebarExtra && (
            <>
              <div className="my-1 border-t ds-border" />
              {sidebarExtra}
            </>
          )}
        </aside>

        {/* Main content area */}
        <div className="flex-1 min-w-0">

      {/* Section nav */}
      <nav
        ref={navContainerRef}
        className="ds-section-nav sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 hidden items-center gap-3 lg:gap-4"
        data-axe-exclude
      >
        {[
          {
            id: "colors",
            label: "Colors",
            icon: (
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
                />
              </svg>
            ),
          },
          {
            id: "buttons",
            label: "Buttons",
            icon: (
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
                />
              </svg>
            ),
          },
          {
            id: "card",
            label: "Cards",
            icon: (
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
            ),
          },
          {
            id: "alerts",
            label: "Alerts",
            icon: (
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            ),
          },
          {
            id: "typography",
            label: "Typography",
            icon: (
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            ),
          },
        ].map((s) => (
          <a
            key={s.id}
            ref={(el) => {
              navItemRefs.current[s.id] = el;
            }}
            href={`#${s.id}`}
            className={`whitespace-nowrap flex items-center gap-2 no-underline ds-nav-link ds-nav-link-item${activeSection === s.id ? " ds-active" : ""}`}
            style={{
              transform: `translateX(${navOffsets[s.id] ?? 0}px)`,
            }}
          >
            <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-wider m-0 p-0">{s.label}</h2>
            <svg
              className="w-[1em] h-[1em] opacity-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14m0 0l-7-7m7 7l7-7"
              />
            </svg>
          </a>
        ))}
      </nav>

      <section className="pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Alerts */}
          <div className="mb-0">
            <div
              className="w-full sm:w-auto order-first sm:order-last flex-shrink-0 sm:min-h-[36px] pointer-events-none [&>*]:pointer-events-auto"
              data-axe-exclude
            >
              {accessibilityAudit && (auditStatus === "failed" || auditStatus === "passed") && (
                <button
                  type="button"
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 cursor-default"
                  aria-label="Close accessibility audit results"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setAuditStatus("idle");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setAuditStatus("idle");
                  }}
                >
                  <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Accessibility audit results"
                    className="rounded-xl shadow-2xl p-6 max-w-sm w-[90vw] text-center space-y-4 ds-surface-bg"
                    style={{
                      border: "1px solid hsl(var(--border))",
                    }}
                    aria-live="assertive"
                  >
                    {auditStatus === "passed" ? (
                      <>
                        <div className="flex justify-center">
                          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--success, 142 76% 36%))" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-base font-medium">WCAG AA Passed</p>
                        <p className="text-sm font-light ds-text-muted">
                          All color contrast checks passed.
                        </p>
                        <button
                          onClick={() => setAuditStatus("idle")}
                          className="px-4 py-2 text-sm font-light rounded-lg transition-colors hover:opacity-80"
                          style={{
                            backgroundColor: "hsl(var(--brand))",
                            color: "hsl(var(--brand-foreground, var(--background)))",
                          }}
                        >
                          OK
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-center">
                          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--destructive))" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p className="text-base font-medium">
                          {auditViolations.length} Contrast Issue{auditViolations.length !== 1 ? "s" : ""} Found
                        </p>
                        <p className="text-sm font-light ds-text-muted">
                          Some color combinations do not meet WCAG AA contrast requirements.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setAuditStatus("idle")}
                            className="px-4 py-2 text-sm font-light rounded-lg transition-colors hover:opacity-80 ds-bg-muted ds-text-muted"
                          >
                            Ignore
                          </button>
                          <button
                            onClick={() => {
                              setAuditStatus("idle");
                              fixContrastIssues();
                            }}
                            className="px-4 py-2 text-sm font-light rounded-lg transition-colors hover:opacity-80"
                            style={{
                              backgroundColor: "hsl(var(--brand))",
                              color: "hsl(var(--brand-foreground, var(--background)))",
                            }}
                          >
                            Suggest Alternative
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Reset Confirmation Modal */}
          <ResetConfirmModal
            open={showResetModal}
            onClose={() => setShowResetModal(false)}
            onConfirm={handleResetColors}
            title="Reset to Defaults?"
            message="This will revert all theme colors to their original values. Any saved customizations will be lost."
            id="home-reset-modal-title"
          />

          {/* Global Reset theme to default Confirmation Modal */}
          <ResetConfirmModal
            open={showGlobalResetModal}
            onClose={() => setShowGlobalResetModal(false)}
            onConfirm={handleReset}
            title="Reset Everything?"
            message="This will reset all sections - colors, buttons, cards, alerts, and typography - to their defaults. All customizations will be lost."
            confirmText="Reset theme to default"
            id="global-reset-modal-title"
          />

          {/* Icon Import Modal */}
          <IconImportModal
            open={showIconImportModal}
            onClose={() => setShowIconImportModal(false)}
            onImport={addImportedIcons}
          />


          {/* Colors section */}
          <ColorsSection
            colors={colors}
            lockedKeys={lockedKeys}
            setLockedKeys={setLockedKeys}
            generatedCode={generatedCode}
            setGeneratedCode={setGeneratedCode}
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            codeCopied={codeCopied}
            setCodeCopied={setCodeCopied}
            generateCode={generateCode}
            handleColorChange={handleColorChange}
            handleImagePalette={handleImagePalette}
            setShowResetModal={setShowResetModal}
            setShowImagePaletteModal={setShowImagePaletteModal}
            setMobilePickerKey={setMobilePickerKey}
            setMobilePickerHex={setMobilePickerHex}
            fileInputRef={fileInputRef}
            upgradeUrl={upgradeUrl}
            signInUrl={signInUrl}
            customIcons={customIcons}
            iconMode={iconMode}
            iconsHidden={iconsHidden}
            setIconsHidden={setIconsHidden}
            showIconImportModal={showIconImportModal}
            setShowIconImportModal={setShowIconImportModal}
            importedIcons={importedIcons}
            importedIconData={importedIconData}
            removeImportedIcon={removeImportedIcon}
            clearImportedIcons={clearImportedIcons}
            cardStyle={cardStyle}
            typographyState={typographyState}
            alertStyle={alertStyle}
            interactionStyle={interactionStyle}
          />

          <ButtonsSection
            colors={colors}
            buttonStyle={buttonStyle}
            updateButtonStyle={updateButtonStyle}
            selectButtonPreset={selectButtonPreset}
            setButtonStyle={setButtonStyle}
            interactionStyle={interactionStyle}
            updateInteractionStyle={updateInteractionStyle}
            selectInteractionPreset={selectInteractionPreset}
            cardStyle={cardStyle}
            typographyState={typographyState}
            alertStyle={alertStyle}
            typoInteractionStyle={typoInteractionStyle}
            upgradeUrl={upgradeUrl}
            signInUrl={signInUrl}
            handleResetInteractionStyle={handleResetInteractionStyle}
            defaultButtonStyle={DEFAULT_BUTTON_STYLE}
          />



          <CardsSection
            colors={colors}
            cardStyle={cardStyle}
            updateCardStyle={updateCardStyle}
            selectCardPreset={selectCardPreset}
            handleResetCardStyle={handleResetCardStyle}
            typographyState={typographyState}
            alertStyle={alertStyle}
            interactionStyle={interactionStyle}
            typoInteractionStyle={typoInteractionStyle}
          />

          {/* Alerts section */}
          <AlertsSection
            colors={colors}
            alertStyle={alertStyle}
            updateAlertStyle={updateAlertStyle}
            selectAlertPreset={selectAlertPreset}
            toastStyle={toastStyle}
            updateToastStyle={updateToastStyle}
            selectToastPreset={selectToastPreset}
            handleResetDialogStyle={() => {
              storage.remove(ALERT_STYLE_KEY);
              removeAlertStyleProperties(editorRootRef.current!);
              setAlertStyle({ ...DEFAULT_ALERT_STYLE });
            }}
            handleResetToastStyle={() => {
              storage.remove(TOAST_STYLE_KEY);
              removeToastStyleProperties(editorRootRef.current!);
              setToastStyle({ ...DEFAULT_TOAST_STYLE });
            }}
            handleResetAlertStyle={handleResetAlertStyle}
            upgradeUrl={upgradeUrl}
            signInUrl={signInUrl}
          />
          {/* end Alerts section */}

          <TypographySection
            colors={colors}
            typographyState={typographyState}
            updateTypography={updateTypography}
            selectTypoPreset={selectTypoPreset}
            fontOptions={fontOptions}
            customFonts={customFonts}
            newFontName={newFontName}
            setNewFontName={setNewFontName}
            fontAddError={fontAddError}
            setFontAddError={setFontAddError}
            fontAddLoading={fontAddLoading}
            handleAddCustomFont={handleAddCustomFont}
            handleRemoveCustomFont={handleRemoveCustomFont}
            handleResetTypography={handleResetTypography}
            typoInteractionStyle={typoInteractionStyle}
            updateTypoInteractionStyle={updateTypoInteractionStyle}
            selectTypoInteractionPreset={selectTypoInteractionPreset}
            handleResetTypoInteractionStyle={handleResetTypoInteractionStyle}
            cardStyle={cardStyle}
            alertStyle={alertStyle}
            interactionStyle={interactionStyle}
            upgradeUrl={upgradeUrl}
            signInUrl={signInUrl}
          />
          <InputsSection
            inputStyle={inputStyle}
            updateInputStyle={updateInputStyle}
            selectInputPreset={selectInputPreset}
          />
        </div>

      </section>
      {/* CSS Import Modal */}
      {showCssImportModal && (
        <CssImportModal
          colors={colors}
          editorRootRef={editorRootRef}
          setColors={setColors}
          setCardStyle={setCardStyle}
          setTypographyState={setTypographyState}
          setButtonStyle={setButtonStyle}
          setInteractionStyle={setInteractionStyle}
          setAlertStyle={setAlertStyle}
          applyCardStyle={applyCardStyle}
          applyTypography={applyTypography}
          applyButtonStyle={applyButtonStyle}
          applyInteractionStyle={applyInteractionStyle}
          applyAlertStyle={applyAlertStyle}
          onClose={() => setShowCssImportModal(false)}
        />
      )}
      {/* Image Palette Modal */}
      {showImagePaletteModal && (
        <ImagePaletteModal
          imageUrlInput={imageUrlInput}
          setImageUrlInput={setImageUrlInput}
          imageUrlError={imageUrlError}
          setImageUrlError={setImageUrlError}
          imagePaletteStatus={imagePaletteStatus}
          fileInputRef={fileInputRef}
          handleImagePalette={handleImagePalette}
          handleImageUrlSubmit={handleImageUrlSubmit}
          onClose={() => setShowImagePaletteModal(false)}
        />
      )}
      {/* Extracted Palette Confirmation Modal */}
      {pendingImagePalette && (
        <PendingImagePaletteConfirm
          pendingImagePalette={pendingImagePalette}
          colors={colors}
          applyImagePalette={applyImagePalette}
          setPendingImagePalette={setPendingImagePalette}
          setAppliedImageUrl={setAppliedImageUrl}
          setAppliedImageFading={setAppliedImageFading}
        />
      )}

      {/* Applied image showcase (fades out) */}
      {appliedImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{
            opacity: appliedImageFading ? 0 : 1,
            transition: "opacity 1s ease-out",
          }}
        >
          <div
            className="rounded-xl overflow-hidden shadow-2xl pointer-events-auto"
            style={{ maxWidth: 400, maxHeight: "80vh" }}
          >
            <img
              src={appliedImageUrl}
              alt="Applied palette source"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
      {/* Mobile Color Picker */}
      {mobilePickerKey && (
        <MobileColorPicker
          mobilePickerKey={mobilePickerKey}
          mobilePickerHex={mobilePickerHex}
          setMobilePickerKey={setMobilePickerKey}
          setMobilePickerHex={setMobilePickerHex}
          colors={colors}
          handleColorChange={handleColorChange}
        />
      )}
      {showPaletteExport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowPaletteExport(false)}
        >
          <div
            className="rounded-xl p-6 w-[340px] shadow-xl ds-bg-card ds-text-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-light mb-4">Export Palette</h3>
            <div className="flex flex-col gap-2">
              {(
                [
                  {
                    label: "Copy CSS",
                    icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
                    action: () => {
                      generateCode();
                      let css = ":root {\n";
                      EDITABLE_VARS.forEach(({ key }) => {
                        const val = colors[key];
                        if (val) css += `  ${key}: ${val};\n`;
                      });
                      css += "\n  /* Card Style */\n";
                      css += `  --card-radius: ${cardStyle.borderRadius}px;\n`;
                      css += `  --card-shadow: ${buildShadowCss(cardStyle)};\n`;
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
                      navigator.clipboard.writeText(css);
                      setPaletteExportCopied(true);
                      setTimeout(() => setPaletteExportCopied(false), 2000);
                    },
                  },
                  {
                    label: "Copy as HEX",
                    icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.334a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>,
                    action: () => {
                      navigator.clipboard.writeText(
                        exportPaletteAsText(colors, "hex"),
                      );
                      setPaletteExportCopied(true);
                      setTimeout(() => setPaletteExportCopied(false), 2000);
                    },
                  },
                  {
                    label: "Copy as RGB",
                    icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.334a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>,
                    action: () => {
                      navigator.clipboard.writeText(
                        exportPaletteAsText(colors, "rgb"),
                      );
                      setPaletteExportCopied(true);
                      setTimeout(() => setPaletteExportCopied(false), 2000);
                    },
                  },
                  {
                    label: "Copy as RGBA",
                    icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.334a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>,
                    action: () => {
                      navigator.clipboard.writeText(
                        exportPaletteAsText(colors, "rgba"),
                      );
                      setPaletteExportCopied(true);
                      setTimeout(() => setPaletteExportCopied(false), 2000);
                    },
                  },
                  {
                    label: "Download SVG",
                    icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
                    action: () => {
                      const svg = exportPaletteAsSvg(colors);
                      const blob = new Blob([svg], { type: "image/svg+xml" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "palette.svg";
                      a.click();
                      URL.revokeObjectURL(url);
                    },
                  },
                  {
                    label: "Download PNG",
                    icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
                    action: async () => {
                      const blob = await exportPaletteAsPng(colors);
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "palette.png";
                      a.click();
                      URL.revokeObjectURL(url);
                    },
                  },
                ] as { label: string; icon: React.ReactNode; action: () => void }[]
              ).map(({ label, icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full text-left px-3 py-2 text-sm font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
                  style={{
                    backgroundColor: "hsl(var(--muted))",
                    color: colors["--muted"]
                      ? `hsl(${fgForBg(colors["--muted"])})`
                      : "hsl(var(--muted-foreground))",
                  }}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
            {paletteExportCopied && (
              <p
                className="text-xs font-light mt-2"
                style={{ color: "hsl(var(--success))" }}
              >
                Copied to clipboard!
              </p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPaletteExport(false)}
                className="px-4 py-1.5 text-sm font-light rounded-lg transition-colors hover:opacity-80"
                style={{
                  backgroundColor: "hsl(var(--muted))",
                  color: colors["--muted"]
                    ? `hsl(${fgForBg(colors["--muted"])})`
                    : "hsl(var(--muted-foreground))",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {showPrModal && (
        <PrModal
          prSections={prSections}
          setPrSections={setPrSections}
          prError={prError}
          sectionPrStatus={sectionPrStatus}
          submitPr={submitPr}
          onClose={() => setShowPrModal(false)}
        />
      )}

      {/* AI Generate Modal */}
      {showAiGenerateModal && onAiGenerate && (
        <AiGenerateModal
          onAiGenerate={onAiGenerate}
          onApply={handleAiApply}
          onClose={() => setShowAiGenerateModal(false)}
        />
      )}

      {showPurgeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowPurgeModal(false)}
        >
          <div
            className="rounded-xl p-6 w-[380px] shadow-xl ds-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "hsl(var(--destructive) / 0.12)" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="hsl(var(--destructive))" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Purge Storage</h3>
            </div>
            <p className="text-sm font-light mb-4 ds-text-muted">
              This will clear all saved theme data, preferences, and cached settings. The page will reload with default values. This cannot be undone.
            </p>
            <p className="text-xs font-light mb-4 ds-text-muted">
              Save your current theme first?
            </p>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => {
                  setShowPurgeModal(false);
                  setShowPaletteExport(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 border ds-border ds-text-fg"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Export
              </button>
              <button
                onClick={() => {
                  const hash = serializeThemeState(
                    colors,
                    cardStyle,
                    typographyState,
                    alertStyle,
                    interactionStyle,
                    typoInteractionStyle,
                    buttonStyle,
                  );
                  window.location.hash = hash;
                  navigator.clipboard.writeText(window.location.href).then(() => {
                    setShareCopied(true);
                    setTimeout(() => setShareCopied(false), 2000);
                  });
                  setShowPurgeModal(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 border ds-border ds-text-fg"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                Share Link
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPurgeModal(false)}
                className="px-4 py-2 text-sm font-light rounded-lg transition-colors hover:opacity-80 ds-text-fg"
              >
                Cancel
              </button>
              <button
                onClick={handlePurgeStorage}
                className="px-4 py-2 text-sm font-light rounded-lg transition-colors hover:opacity-80"
                style={{
                  backgroundColor: "hsl(var(--destructive, 0 84% 60%))",
                  color: "hsl(var(--destructive-foreground, 0 0% 100%))",
                }}
              >
                Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
        {/* end main content area */}
      </div>
      {/* end flex layout (sidebar + content) */}

      {/* Floating scroll-to-top button */}
      <button
        type="button"
        className={`ds-scroll-top${showScrollTop ? " ds-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}

export function DesignSystemEditor({
  licenseKey,
  ...props
}: DesignSystemEditorProps) {
  return (
    <LicenseProvider licenseKey={licenseKey}>
      <DesignSystemEditorInner {...props} />
    </LicenseProvider>
  );
}

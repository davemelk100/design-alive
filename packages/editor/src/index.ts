export { DesignSystemEditor } from "./DesignSystemEditor";
export type { DesignSystemEditorProps, TokenDefinition, CustomIcon, AiGenerateResult } from "./types";
export {
  hslStringToHex,
  hexToHslString,
  contrastRatio,
  fgForBg,
  EDITABLE_VARS,
  HARMONY_SCHEMES,
  applyStoredThemeColors,
  CARD_STYLE_KEY,
  applyStoredCardStyle,
  TYPOGRAPHY_KEY,
  applyStoredTypography,
  ALERT_STYLE_KEY,
  applyStoredAlertStyle,
  TOAST_STYLE_KEY,
  applyStoredToastStyle,
  INTERACTION_STYLE_KEY,
  applyStoredInteractionStyle,
  serializeThemeState,
  deserializeThemeState,
  generateDesignTokens,
  exportPaletteAsText,
  exportPaletteAsSvg,
  exportPaletteAsPng,
  getCustomFonts,
  addCustomFont,
  removeCustomFont,
  initCustomFonts,
  buildAiSystemPrompt,
} from "./utils/themeUtils";
export type { HarmonyScheme, CardStyleState, TypographyState, AlertStyleState, ToastStyleState, InteractionStyleState, TypoInteractionStyleState, CustomFontEntry } from "./utils/themeUtils";

export { validateLicenseKey, generateLicenseKey } from "./utils/license";
export type { PremiumFeature, LicenseValidation } from "./utils/license";
export { LicenseProvider, useLicense } from "./hooks/useLicense";
export type { LicenseProviderProps } from "./hooks/useLicense";
export { PremiumGate } from "./components/PremiumGate";
export type { PremiumGateProps } from "./components/PremiumGate";

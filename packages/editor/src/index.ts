export { DesignSystemEditor } from "./DesignSystemEditor";
export type { DesignSystemEditorProps, TokenDefinition, CustomIcon, AiGenerateResult, ImportedIconData } from "./types";
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
  BUTTON_STYLE_KEY,
  BUTTON_PRESETS,
  applyStoredButtonStyle,
  INPUT_STYLE_KEY,
  INPUT_PRESETS,
  applyStoredInputStyle,
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
export type { HarmonyScheme, CardStyleState, ButtonStyleState, InputStyleState, TypographyState, AlertStyleState, ToastStyleState, InteractionStyleState, TypoInteractionStyleState, CustomFontEntry } from "./utils/themeUtils";

export { createDesignPr, replaceRootBlock, getAuthenticatedUser } from "./utils/githubApi";
export type { GitHubConfig } from "./utils/githubApi";
export { startOAuthFlow, getStoredAuth, clearAuth, validateStoredToken } from "./utils/githubAuth";
export type { StoredGitHubAuth } from "./utils/githubAuth";

export { validateLicenseKey, generateLicenseKey } from "./utils/license";
export type { PremiumFeature, LicenseValidation } from "./utils/license";
export { LicenseProvider, useLicense } from "./hooks/useLicense";
export type { LicenseProviderProps } from "./hooks/useLicense";
export { PremiumGate } from "./components/PremiumGate";
export type { PremiumGateProps } from "./components/PremiumGate";
export { SectionNav } from "./components/SectionNav";

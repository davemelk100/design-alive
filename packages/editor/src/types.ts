import type React from "react";

export interface AiGenerateResult {
  colors?: Record<string, string>;
  typography?: Partial<import("./utils/themeUtils").TypographyState>;
}

export interface DesignSystemEditorProps {
  /** URL for the PR creation endpoint. Hides PR button if omitted. */
  prEndpointUrl?: string;
  /** API key sent as x-api-key header when using prEndpointUrl. Required in production. */
  prApiKey?: string;
  /** Client-side GitHub config for creating PRs directly via the GitHub API. When provided, the PR button uses an OAuth popup flow instead of a server endpoint. */
  githubConfig?: import("./utils/githubApi").GitHubConfig;
  /** Enable built-in WCAG AA contrast auditing. Default: true */
  accessibilityAudit?: boolean;
  /** Callback fired on every color change with the full color map */
  onChange?: (colors: Record<string, string>) => void;
  /** Override built-in CSS export modal - receives the generated CSS string */
  onExport?: (css: string) => void;
  /** Additional CSS class for the wrapper element */
  className?: string;
  /** Show "How It Works", "README", and "Pricing" nav links. Default: true */
  showNavLinks?: boolean;
  /** Show the sticky header bar (logo, nav, PR button). Default: true. Set false for embedded/plugin usage. */
  showHeader?: boolean;
  /** License key to unlock premium features */
  licenseKey?: string;
  /** Custom URL for the "Upgrade" link shown on gated features */
  upgradeUrl?: string;
  /** Custom URL for the "Sign in" link shown on gated features */
  signInUrl?: string;
  /** Content rendered at the far right of the header row (e.g. auth buttons) */
  headerRight?: React.ReactNode;
  /** Custom top navigation component. When provided, replaces the built-in nav links entirely. */
  topNav?: React.ReactNode;
  /** Show the sticky section jump-scroll navigation bar. Default: true */
  showSectionNav?: boolean;
  /** URL for the "Learn more about features" link */
  featuresUrl?: string;
  /** URL for the About page link in the header */
  aboutUrl?: string;
  /** Show the Themal logo in the header. Default: true */
  showLogo?: boolean;
  /** Default color values to restore on reset, keyed by CSS variable name (e.g. {"--brand": "210 50% 40%"}). When provided, "Reset theme to default" restores these instead of the Themal defaults. */
  defaultColors?: Record<string, string>;
  /** Default typography state to restore on reset. When provided, "Reset theme to default" restores these font settings instead of the Themal defaults. Partial values are merged with the built-in defaults. */
  defaultTypography?: Partial<import("./utils/themeUtils").TypographyState>;
  /** Provider-agnostic AI theme generation. When provided, an "AI Generate" button appears in Global Actions. The callback receives the user's text prompt and should return colors and/or typography to preview and apply. */
  onAiGenerate?: (prompt: string) => Promise<AiGenerateResult>;
  /** Show a "Purge Storage" button in Global Actions that clears all Themal localStorage keys. Useful during development. Default: false */
  devMode?: boolean;
  /** Navigation links to render at the bottom of the left sidebar */
  sidebarLinks?: { to: string; label: string }[];
  /** Extra content rendered at the very bottom of the left sidebar (e.g. contact forms) */
  sidebarExtra?: React.ReactNode;
  /** Mirror CSS custom properties to :root so the theme applies to the entire page, not just the editor. Default: false */
  applyToRoot?: boolean;
  /** Provider-agnostic AI palette mapping. When provided (and the `aiPaletteMapping` feature flag is enabled), an "AI Map" button appears in the host-scan confirmation modal. The callback receives a structured prompt describing the detected palette and should return a token map to apply. */
  onAiPaletteMap?: (prompt: string) => Promise<Record<string, string>>;
}

export interface TokenDefinition {
  key: string;
  label: string;
}

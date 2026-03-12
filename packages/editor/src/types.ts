import type React from "react";

export interface CustomIcon {
  /** Display name for the icon */
  name: string;
  /** React component that renders the icon. Receives className and standard SVG props. */
  icon: React.ComponentType<{ className?: string; [key: string]: unknown }>;
}

export interface AiGenerateResult {
  colors?: Record<string, string>;
  typography?: Partial<import("./utils/themeUtils").TypographyState>;
}

export interface DesignSystemEditorProps {
  /** URL for the PR creation endpoint. Hides PR button if omitted. */
  prEndpointUrl?: string;
  /** Client-side GitHub config for creating PRs directly via the GitHub API. When provided, the PR button uses an OAuth popup flow instead of a server endpoint. */
  githubConfig?: import("./utils/githubApi").GitHubConfig;
  /** Enable accessibility audit via axe-core. Default: true */
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
  /** URL for the "Learn more about features" link */
  featuresUrl?: string;
  /** URL for the About page link in the header */
  aboutUrl?: string;
  /** Custom icons to display in the Icons preview section */
  customIcons?: CustomIcon[];
  /** How custom icons interact with built-in icons. "append" adds them after built-ins, "replace" hides built-ins entirely. Default: "append" */
  iconMode?: "append" | "replace";
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
}

export type { ImportedIconData } from "./utils/iconImport";

export interface TokenDefinition {
  key: string;
  label: string;
}

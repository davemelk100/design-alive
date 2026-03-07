import type React from "react";

export interface CustomIcon {
  /** Display name for the icon */
  name: string;
  /** React component that renders the icon. Receives className and standard SVG props. */
  icon: React.ComponentType<{ className?: string; [key: string]: unknown }>;
}

export interface DesignSystemEditorProps {
  /** URL for the PR creation endpoint. Hides PR button if omitted. */
  prEndpointUrl?: string;
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
  /** URL for the "Learn more about features" link */
  featuresUrl?: string;
  /** URL for the About page link in the header */
  aboutUrl?: string;
  /** Custom icons to display in the Icons preview section */
  customIcons?: CustomIcon[];
  /** How custom icons interact with built-in icons. "append" adds them after built-ins, "replace" hides built-ins entirely. Default: "append" */
  iconMode?: "append" | "replace";
}

export interface TokenDefinition {
  key: string;
  label: string;
}

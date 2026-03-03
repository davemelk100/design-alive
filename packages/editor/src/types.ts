export interface DesignSystemEditorProps {
  /** URL for the PR creation endpoint. Hides PR button if omitted. */
  prEndpointUrl?: string;
  /** Enable accessibility audit via axe-core. Default: true */
  accessibilityAudit?: boolean;
  /** Callback fired on every color change with the full color map */
  onChange?: (colors: Record<string, string>) => void;
  /** Override built-in CSS export modal — receives the generated CSS string */
  onExport?: (css: string) => void;
  /** Additional CSS class for the wrapper element */
  className?: string;
  /** Show "How It Works" and "README" nav links. Default: true */
  showNavLinks?: boolean;
}

export interface TokenDefinition {
  key: string;
  label: string;
}

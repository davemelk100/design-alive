import React, { useState } from "react";
import { parseCssImport, fgForBg } from "../utils/themeUtils";
import type {
  CardStyleState,
  TypographyState,
  ButtonStyleState,
  InteractionStyleState,
  AlertStyleState,
} from "../utils/themeUtils";

export interface CssImportModalProps {
  colors: Record<string, string>;
  editorRootRef: React.RefObject<HTMLDivElement>;
  setColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setCardStyle: React.Dispatch<React.SetStateAction<CardStyleState>>;
  setTypographyState: React.Dispatch<React.SetStateAction<TypographyState>>;
  setButtonStyle: React.Dispatch<React.SetStateAction<ButtonStyleState>>;
  setInteractionStyle: React.Dispatch<React.SetStateAction<InteractionStyleState>>;
  setAlertStyle: React.Dispatch<React.SetStateAction<AlertStyleState>>;
  applyCardStyle: (style: CardStyleState, colors: Record<string, string>, root: HTMLElement) => void;
  applyTypography: (state: TypographyState, root: HTMLElement) => void;
  applyButtonStyle: (state: ButtonStyleState, root: HTMLElement) => void;
  applyInteractionStyle: (state: InteractionStyleState, root: HTMLElement) => void;
  applyAlertStyle: (style: AlertStyleState, root: HTMLElement) => void;
  onClose: () => void;
}

export function CssImportModal({
  colors,
  editorRootRef,
  setColors,
  setCardStyle,
  setTypographyState,
  setButtonStyle,
  setInteractionStyle,
  setAlertStyle,
  applyCardStyle,
  applyTypography,
  applyButtonStyle,
  applyInteractionStyle,
  applyAlertStyle,
  onClose,
}: CssImportModalProps) {
  const [cssImportText, setCssImportText] = useState("");
  const [cssImportPreview, setCssImportPreview] = useState<ReturnType<typeof parseCssImport> | null>(null);

  const handleClose = () => {
    setCssImportText("");
    setCssImportPreview(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-2xl mx-4 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ds-surface-bg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Import CSS / SCSS</h3>
            <button
              onClick={handleClose}
              className="p-1 rounded hover:opacity-70 ds-text-muted"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-sm font-light ds-text-muted">
            Paste CSS or SCSS containing custom properties or variables. Themal will parse colors, typography, button, card, and interaction values.
          </p>

          <textarea
            className="w-full h-48 p-3 rounded-lg border font-mono text-sm resize-y ds-surface ds-border"
            placeholder={`:root {\n  --brand: 220 70% 50%;\n  --primary: #3b82f6;\n  --background: #ffffff;\n  --font-heading: "Inter";\n  --border-radius: 12px;\n}\n\n/* or SCSS */\n$primary: #3b82f6;\n$background: #fff;`}
            value={cssImportText}
            onChange={(e) => {
              setCssImportText(e.target.value);
              if (e.target.value.trim()) {
                setCssImportPreview(parseCssImport(e.target.value));
              } else {
                setCssImportPreview(null);
              }
            }}
          />

          {cssImportPreview && (
            <div className="space-y-3">
              <p className="text-sm font-medium ds-text-fg">
                Detected values:
              </p>

              {/* Colors */}
              {Object.keys(cssImportPreview.colors).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-light uppercase tracking-wider ds-text-muted">
                    Colors ({Object.keys(cssImportPreview.colors).length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(cssImportPreview.colors).map(([key, hsl]) => (
                      <div key={key} className="flex items-center gap-1.5 text-xs font-light">
                        <span
                          className="w-4 h-4 rounded border ds-border"
                          style={{ backgroundColor: `hsl(${hsl})` }}
                        />
                        <span className="ds-text-fg">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Typography */}
              {Object.keys(cssImportPreview.typographyState).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-light uppercase tracking-wider ds-text-muted">
                    Typography
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-light ds-text-fg">
                    {Object.entries(cssImportPreview.typographyState).map(([k, v]) => (
                      <span key={k}>{k}: {String(v)}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Button */}
              {Object.keys(cssImportPreview.buttonStyle).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-light uppercase tracking-wider ds-text-muted">
                    Buttons
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-light ds-text-fg">
                    {Object.entries(cssImportPreview.buttonStyle).map(([k, v]) => (
                      <span key={k}>{k}: {String(v)}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Card */}
              {Object.keys(cssImportPreview.cardStyle).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-light uppercase tracking-wider ds-text-muted">
                    Card Style
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-light ds-text-fg">
                    {Object.entries(cssImportPreview.cardStyle).map(([k, v]) => (
                      <span key={k}>{k}: {String(v)}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactions */}
              {Object.keys(cssImportPreview.interactionStyle).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-light uppercase tracking-wider ds-text-muted">
                    Interactions
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-light ds-text-fg">
                    {Object.entries(cssImportPreview.interactionStyle).map(([k, v]) => (
                      <span key={k}>{k}: {String(v)}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Alerts */}
              {Object.keys(cssImportPreview.alertStyle).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-light uppercase tracking-wider ds-text-muted">
                    Alerts
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-light ds-text-fg">
                    {Object.entries(cssImportPreview.alertStyle).map(([k, v]) => (
                      <span key={k}>{k}: {String(v)}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nothing found */}
              {Object.keys(cssImportPreview.colors).length === 0 &&
                Object.keys(cssImportPreview.typographyState).length === 0 &&
                Object.keys(cssImportPreview.cardStyle).length === 0 &&
                Object.keys(cssImportPreview.buttonStyle).length === 0 &&
                Object.keys(cssImportPreview.interactionStyle).length === 0 &&
                Object.keys(cssImportPreview.alertStyle).length === 0 && (
                <p className="text-sm font-light ds-text-destructive">
                  No recognized values found. Make sure your CSS uses custom properties (--var-name) or SCSS variables ($var-name).
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-light rounded-lg ds-surface-muted"
            >
              Cancel
            </button>
            <button
              disabled={!cssImportPreview || (
                Object.keys(cssImportPreview.colors).length === 0 &&
                Object.keys(cssImportPreview.typographyState).length === 0 &&
                Object.keys(cssImportPreview.cardStyle).length === 0 &&
                Object.keys(cssImportPreview.buttonStyle).length === 0 &&
                Object.keys(cssImportPreview.interactionStyle).length === 0 &&
                Object.keys(cssImportPreview.alertStyle).length === 0
              )}
              onClick={() => {
                if (!cssImportPreview) return;
                // Apply colors
                if (Object.keys(cssImportPreview.colors).length > 0) {
                  const merged = { ...colors, ...cssImportPreview.colors };
                  for (const [key, val] of Object.entries(cssImportPreview.colors)) {
                    editorRootRef.current?.style.setProperty(key, val);
                  }
                  setColors(merged);
                }
                // Apply card style
                if (Object.keys(cssImportPreview.cardStyle).length > 0) {
                  setCardStyle((prev) => {
                    const next = { ...prev, ...cssImportPreview.cardStyle, preset: "custom" as const };
                    applyCardStyle(next, colors, editorRootRef.current!);
                    return next;
                  });
                }
                // Apply typography
                if (Object.keys(cssImportPreview.typographyState).length > 0) {
                  setTypographyState((prev) => {
                    const next = { ...prev, ...cssImportPreview.typographyState, preset: "custom" as const };
                    applyTypography(next, editorRootRef.current!);
                    return next;
                  });
                }
                // Apply button style
                if (Object.keys(cssImportPreview.buttonStyle).length > 0) {
                  setButtonStyle((prev) => {
                    const next = { ...prev, ...cssImportPreview.buttonStyle };
                    applyButtonStyle(next, editorRootRef.current!);
                    return next;
                  });
                }
                // Apply interaction style
                if (Object.keys(cssImportPreview.interactionStyle).length > 0) {
                  setInteractionStyle((prev) => {
                    const next = { ...prev, ...cssImportPreview.interactionStyle, preset: "custom" as const };
                    applyInteractionStyle(next, editorRootRef.current!);
                    return next;
                  });
                }
                // Apply alert style
                if (Object.keys(cssImportPreview.alertStyle).length > 0) {
                  setAlertStyle((prev) => {
                    const next = { ...prev, ...cssImportPreview.alertStyle, preset: "custom" as const };
                    applyAlertStyle(next, editorRootRef.current!);
                    return next;
                  });
                }
                handleClose();
              }}
              className="px-4 py-2 text-sm font-light rounded-lg transition-opacity"
              style={{
                backgroundColor: "hsl(var(--brand))",
                color: colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "hsl(var(--primary-foreground))",
                opacity: !cssImportPreview || (
                  Object.keys(cssImportPreview.colors).length === 0 &&
                  Object.keys(cssImportPreview.typographyState).length === 0 &&
                  Object.keys(cssImportPreview.cardStyle).length === 0 &&
                  Object.keys(cssImportPreview.buttonStyle).length === 0 &&
                  Object.keys(cssImportPreview.interactionStyle).length === 0 &&
                  Object.keys(cssImportPreview.alertStyle).length === 0
                ) ? 0.5 : 1,
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

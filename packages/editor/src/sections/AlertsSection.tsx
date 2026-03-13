import { useState } from "react";
import { fgForBg } from "../utils/themeUtils";
import type { AlertStyleState, ToastStyleState } from "../utils/styles/alertStyle";
import {
  ALERT_PRESETS,
  TOAST_PRESETS,
} from "../utils/styles/alertStyle";
import { CustomSelect } from "../components/CustomSelect";
import { PremiumGate } from "../components/PremiumGate";
import { ResetConfirmModal } from "../components/ResetConfirmModal";

function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export interface AlertsSectionProps {
  colors: Record<string, string>;
  alertStyle: AlertStyleState;
  updateAlertStyle: (patch: Partial<AlertStyleState>) => void;
  selectAlertPreset: (presetKey: string) => void;
  toastStyle: ToastStyleState;
  updateToastStyle: (patch: Partial<ToastStyleState>) => void;
  selectToastPreset: (presetKey: string) => void;
  handleResetDialogStyle: () => void;
  handleResetToastStyle: () => void;
  handleResetAlertStyle: () => void;
  upgradeUrl?: string;
  signInUrl?: string;
}

export function AlertsSection({
  colors,
  alertStyle,
  updateAlertStyle,
  selectAlertPreset,
  toastStyle,
  updateToastStyle,
  selectToastPreset,
  handleResetDialogStyle,
  handleResetToastStyle,
  handleResetAlertStyle,
  upgradeUrl,
  signInUrl,
}: AlertsSectionProps) {
  const [alertCssVisible, setAlertCssVisible] = useState(false);
  const [alertCssCopied, setAlertCssCopied] = useState(false);
  const [alertExportFormat, setAlertExportFormat] = useState<"css" | "tokens">(
    "css",
  );
  const [toastCssVisible, setToastCssVisible] = useState(false);
  const [toastCssCopied, setToastCssCopied] = useState(false);
  const [toastExportFormat, setToastExportFormat] = useState<"css" | "tokens">(
    "css",
  );
  const [showAlertResetModal, setShowAlertResetModal] = useState(false);
  const [showDialogResetModal, setShowDialogResetModal] = useState(false);
  const [showToastResetModal, setShowToastResetModal] = useState(false);

  return (
          <div
            id="alerts"
            className="min-w-0 mt-6 mb-6 md:mt-16 md:mb-16 scroll-mt-28 lg:scroll-mt-14 space-y-3"
          >
            <div
              className="flex items-center flex-wrap gap-2 sm:gap-4"
              data-axe-exclude
            >
              <h2
                className="text-sm sm:text-base md:text-lg font-bold tracking-wider mb-[5px] flex items-baseline gap-2 ds-text-fg"
              >
                Alerts{" "}
                <a
                  href="#top"
                  className="ds-h2-link opacity-30"
                  aria-label="Back to top"
                >
                  <svg
                    className="w-[1em] h-[1em]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19V5m0 0l-7 7m7-7l7 7"
                    />
                  </svg>
                </a>
              </h2>
            </div>
              {/* Two-column: Dialog Boxes + Toast Messages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dialog Boxes (left) */}
                <div
                  className="space-y-3 rounded-lg p-4"
                  style={{ border: "1px solid hsl(var(--border))" }}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3
                      className="text-base font-normal uppercase tracking-wider ds-text-fg"
                    >
                      Dialog Boxes
                    </h3>
                    <div className="flex items-center gap-1">
                      <div
                        className="flex items-center rounded-lg overflow-hidden border ds-border"
                      >
                        <button
                          onClick={() => {
                            if (alertCssVisible && alertExportFormat === "css") {
                              setAlertCssVisible(false);
                              return;
                            }
                            setAlertExportFormat("css");
                            setAlertCssVisible(true);
                          }}
                          className="h-10 px-2 sm:px-3 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                          style={{
                            backgroundColor:
                              alertCssVisible && alertExportFormat === "css"
                                ? "hsl(var(--brand))"
                                : "transparent",
                            color:
                              alertCssVisible && alertExportFormat === "css"
                                ? colors["--brand"]
                                  ? `hsl(${fgForBg(colors["--brand"])})`
                                  : "#fff"
                                : "hsl(var(--muted-foreground))",
                          }}
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          CSS
                        </button>
                        <span
                          className="w-px h-5"
                          style={{ backgroundColor: "hsl(var(--border))" }}
                        />
                        <button
                          onClick={() => {
                            if (alertCssVisible && alertExportFormat === "tokens") {
                              setAlertCssVisible(false);
                              return;
                            }
                            setAlertExportFormat("tokens");
                            setAlertCssVisible(true);
                          }}
                          className="h-10 px-2 sm:px-3 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                          style={{
                            backgroundColor:
                              alertCssVisible && alertExportFormat === "tokens"
                                ? "hsl(var(--brand))"
                                : "transparent",
                            color:
                              alertCssVisible && alertExportFormat === "tokens"
                                ? colors["--brand"]
                                  ? `hsl(${fgForBg(colors["--brand"])})`
                                  : "#fff"
                                : "hsl(var(--muted-foreground))",
                          }}
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16" />
                          </svg>
                          Tokens
                        </button>
                      </div>
                      <button
                        onClick={() => setShowDialogResetModal(true)}
                        className="h-10 px-2 sm:px-3 text-sm font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1 ds-text-muted"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" />
                        </svg>
                        Reset
                      </button>
                    </div>
                  </div>
                  {/* Dialog Preset Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {Object.keys(ALERT_PRESETS).map((key) => {
                      const labels: Record<string, string> = {
                        filled: "Filled",
                        soft: "Soft",
                        outline: "Outline",
                        minimal: "Minimal",
                      };
                      const active = alertStyle.preset === key;
                      return (
                        <button
                          key={key}
                          onClick={() => selectAlertPreset(key)}
                          className="h-12 px-3 text-sm font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
                          style={
                            active
                              ? {
                                  backgroundColor: "hsl(var(--brand))",
                                  color: colors["--brand"]
                                    ? `hsl(${fgForBg(colors["--brand"])})`
                                    : "#fff",
                                  boxShadow:
                                    "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
                                }
                              : {
                                  backgroundColor: "hsl(var(--muted))",
                                  color: "hsl(var(--foreground))",
                                  boxShadow:
                                    "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
                                }
                          }
                        >
                          {labels[key]}
                        </button>
                      );
                    })}
                  </div>
                  {/* Controls */}
                  <div className="space-y-1.5">
                    <p
                      className="text-sm font-light uppercase tracking-wider ds-text-muted"
                    >
                      Shape
                    </p>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>Border Radius: {alertStyle.borderRadius}px</span>
                      <input
                        type="range"
                        name="alert-border-radius"
                        min={0}
                        max={24}
                        value={alertStyle.borderRadius}
                        onChange={(e) =>
                          updateAlertStyle({
                            borderRadius: Number(e.target.value),
                          })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>Border Width: {alertStyle.borderWidth}px</span>
                      <input
                        type="range"
                        name="alert-border-width"
                        min={0}
                        max={4}
                        value={alertStyle.borderWidth}
                        onChange={(e) =>
                          updateAlertStyle({
                            borderWidth: Number(e.target.value),
                          })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>Padding: {alertStyle.padding}px</span>
                      <input
                        type="range"
                        name="alert-padding"
                        min={8}
                        max={32}
                        value={alertStyle.padding}
                        onChange={(e) =>
                          updateAlertStyle({ padding: Number(e.target.value) })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                  </div>
                  {/* Preview */}
                  <div className="w-full space-y-3" data-axe-exclude>
                    {(() => {
                      const alertTypes = [
                        {
                          key: "success",
                          label: "Success",
                          message: "Operation completed successfully.",
                          colorVar: "--success",
                          fgVar: "--success-foreground",
                          iconPath:
                            "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                        },
                        {
                          key: "warning",
                          label: "Warning",
                          message: "Please review before continuing.",
                          colorVar: "--warning",
                          fgVar: "--warning-foreground",
                          iconPath:
                            "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                        },
                        {
                          key: "error",
                          label: "Error",
                          message: "Something went wrong. Try again.",
                          colorVar: "--destructive",
                          fgVar: "--destructive-foreground",
                          iconPath:
                            "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
                        },
                        {
                          key: "info",
                          label: "Info",
                          message: "Here is some useful information.",
                          colorVar: "--brand",
                          fgVar: null,
                          iconPath:
                            "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                        },
                      ];

                      return alertTypes.map(
                        ({
                          key,
                          label,
                          message,
                          colorVar,
                          fgVar,
                          iconPath,
                        }) => {
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
                            textColor = fgRef
                              ? `hsl(${fgRef})`
                              : colors[colorVar]
                                ? `hsl(${fgForBg(colors[colorVar])})`
                                : "#fff";
                            borderStyle = "none";
                          } else if (preset === "soft") {
                            const parts = colorHsl.trim().split(/\s+/);
                            bgStyle =
                              parts.length >= 3
                                ? `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, 0.12)`
                                : `hsl(${colorRef})`;
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
                                borderRadius:
                                  preset === "minimal"
                                    ? 0
                                    : `${alertStyle.borderRadius}px`,
                                border: borderStyle,
                                borderLeft: leftBorder || borderStyle,
                                padding: `${alertStyle.padding}px`,
                              }}
                            >
                              <svg
                                className="w-5 h-5 flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d={iconPath}
                                />
                              </svg>
                              <div className="min-w-0">
                                <p className="text-sm font-medium">
                                  {label}
                                </p>
                                <p className="text-xs font-light opacity-90">
                                  {message}
                                </p>
                              </div>
                            </div>
                          );
                        },
                      );
                    })()}
                  </div>
                  {/* Dialog CSS/Tokens output */}
                  {alertCssVisible &&
                    (() => {
                      const dialogCss = `:root {\n  --alert-radius: ${alertStyle.borderRadius}px;\n  --alert-border-width: ${alertStyle.borderWidth}px;\n  --alert-padding: ${alertStyle.padding}px;\n}`;
                      const dialogTokens = JSON.stringify(
                        { dialog: { borderRadius: alertStyle.borderRadius, borderWidth: alertStyle.borderWidth, padding: alertStyle.padding, preset: alertStyle.preset } },
                        null,
                        2,
                      );
                      const output =
                        alertExportFormat === "tokens" ? dialogTokens : dialogCss;
                      return (
                        <div
                          className="rounded-lg border ds-border"
                        >
                          <div
                            className="flex items-center justify-between px-3 py-1.5 border-b ds-border"
                          >
                            <span
                              className="text-xs font-light uppercase tracking-wider"
                              style={{ color: "hsl(var(--card-foreground))" }}
                            >
                              {alertExportFormat === "tokens" ? "Dialog Tokens" : "Dialog CSS"}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(output);
                                  setAlertCssCopied(true);
                                  setTimeout(() => setAlertCssCopied(false), 2000);
                                }}
                                aria-label="Copy" className="p-1 rounded-lg transition-colors hover:opacity-80"
                                style={{
                                  backgroundColor: "hsl(var(--muted))",
                                  color: colors["--muted"]
                                    ? `hsl(${fgForBg(colors["--muted"])})`
                                    : "hsl(var(--muted-foreground))",
                                }}
                              >
                                {alertCssCopied ? <CheckIcon /> : <CopyIcon />}
                              </button>
                              <button
                                onClick={() => setAlertCssVisible(false)}
                                aria-label="Close"
                                className="p-1 rounded-lg transition-colors hover:opacity-80"
                                style={{
                                  backgroundColor: "hsl(var(--muted))",
                                  color: colors["--muted"]
                                    ? `hsl(${fgForBg(colors["--muted"])})`
                                    : "hsl(var(--muted-foreground))",
                                }}
                              >
                                <XIcon />
                              </button>
                            </div>
                          </div>
                          <pre
                            className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed font-mono"
                            style={{ color: "hsl(var(--card-foreground))" }}
                          >
                            <code>{output}</code>
                          </pre>
                        </div>
                      );
                    })()}
                </div>

                {/* Toast Messages (right, Pro) */}
                <PremiumGate
                  feature="toast-messages"
                  variant="section"
                  upgradeUrl={upgradeUrl}
                  signInUrl={signInUrl}
                >
                  <div
                    className="space-y-3 rounded-lg p-4"
                    style={{ border: "1px solid hsl(var(--border))" }}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3
                        className="text-base font-normal uppercase tracking-wider ds-text-fg"
                      >
                        Toast Messages
                      </h3>
                      <div className="flex items-center gap-1">
                        <div
                          className="flex items-center rounded-lg overflow-hidden border ds-border"
                        >
                          <button
                            onClick={() => {
                              if (toastCssVisible && toastExportFormat === "css") {
                                setToastCssVisible(false);
                                return;
                              }
                              setToastExportFormat("css");
                              setToastCssVisible(true);
                            }}
                            className="h-10 px-2 sm:px-3 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                            style={{
                              backgroundColor:
                                toastCssVisible && toastExportFormat === "css"
                                  ? "hsl(var(--brand))"
                                  : "transparent",
                              color:
                                toastCssVisible && toastExportFormat === "css"
                                  ? colors["--brand"]
                                    ? `hsl(${fgForBg(colors["--brand"])})`
                                    : "#fff"
                                  : "hsl(var(--muted-foreground))",
                            }}
                          >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            CSS
                          </button>
                          <span
                            className="w-px h-5"
                            style={{ backgroundColor: "hsl(var(--border))" }}
                          />
                          <button
                            onClick={() => {
                              if (toastCssVisible && toastExportFormat === "tokens") {
                                setToastCssVisible(false);
                                return;
                              }
                              setToastExportFormat("tokens");
                              setToastCssVisible(true);
                            }}
                            className="h-10 px-2 sm:px-3 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                            style={{
                              backgroundColor:
                                toastCssVisible && toastExportFormat === "tokens"
                                  ? "hsl(var(--brand))"
                                  : "transparent",
                              color:
                                toastCssVisible && toastExportFormat === "tokens"
                                  ? colors["--brand"]
                                    ? `hsl(${fgForBg(colors["--brand"])})`
                                    : "#fff"
                                  : "hsl(var(--muted-foreground))",
                            }}
                          >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16" />
                            </svg>
                            Tokens
                          </button>
                        </div>
                        <button
                          onClick={() => setShowToastResetModal(true)}
                          className="h-10 px-2 sm:px-3 text-sm font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1 ds-text-muted"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" />
                          </svg>
                          Reset
                        </button>
                      </div>
                    </div>
                    {/* Toast Preset Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {Object.keys(TOAST_PRESETS).map((key) => {
                        const labels: Record<string, string> = {
                          filled: "Filled",
                          soft: "Soft",
                          outline: "Outline",
                          minimal: "Minimal",
                        };
                        const active = toastStyle.preset === key;
                        return (
                          <button
                            key={key}
                            onClick={() => selectToastPreset(key)}
                            className="h-12 px-3 text-sm font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
                            style={
                              active
                                ? {
                                    backgroundColor: "hsl(var(--brand))",
                                    color: colors["--brand"]
                                      ? `hsl(${fgForBg(colors["--brand"])})`
                                      : "#fff",
                                    boxShadow:
                                      "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
                                  }
                                : {
                                    backgroundColor: "hsl(var(--muted))",
                                    color: "hsl(var(--foreground))",
                                    boxShadow:
                                      "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
                                  }
                            }
                          >
                            {labels[key]}
                          </button>
                        );
                      })}
                    </div>
                    {/* Toast Controls */}
                    <div className="space-y-1.5">
                      <p
                        className="text-sm font-light uppercase tracking-wider ds-text-muted"
                      >
                        Shape
                      </p>
                      <label
                        className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                      >
                        <span>Border Radius: {toastStyle.borderRadius}px</span>
                        <input
                          type="range"
                          name="toast-border-radius"
                          min={0}
                          max={24}
                          value={toastStyle.borderRadius}
                          onChange={(e) =>
                            updateToastStyle({
                              borderRadius: Number(e.target.value),
                            })
                          }
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                      <label
                        className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                      >
                        <span>
                          Padding: {Math.max(toastStyle.padding - 4, 8)}px
                        </span>
                        <input
                          type="range"
                          name="toast-padding"
                          min={8}
                          max={32}
                          value={toastStyle.padding}
                          onChange={(e) =>
                            updateToastStyle({
                              padding: Number(e.target.value),
                            })
                          }
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                      <label
                        className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                      >
                        <span>Shadow</span>
                        <CustomSelect
                          value="lg"
                          disabled
                          size="sm"
                          width="100px"
                          onChange={() => {}}
                          options={[{ value: "lg", label: "Large" }]}
                        />
                      </label>
                    </div>
                    {/* Toast Preview */}
                    <div className="w-full space-y-3" data-axe-exclude>
                      {(() => {
                        const toasts = [
                          {
                            key: "success",
                            label: "Changes saved",
                            colorVar: "--success",
                            fgVar: "--success-foreground",
                            iconPath:
                              "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                          },
                          {
                            key: "error",
                            label: "Failed to save",
                            colorVar: "--destructive",
                            fgVar: "--destructive-foreground",
                            iconPath:
                              "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
                          },
                          {
                            key: "info",
                            label: "3 items updated",
                            colorVar: "--brand",
                            fgVar: null,
                            iconPath:
                              "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                          },
                          {
                            key: "warning",
                            label: "Connection unstable",
                            colorVar: "--warning",
                            fgVar: "--warning-foreground",
                            iconPath:
                              "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                          },
                        ];

                        return toasts.map(
                          ({ key, label, colorVar, fgVar, iconPath }) => {
                            const colorHsl = colors[colorVar] || "220 70% 50%";
                            const colorRef = `var(${colorVar})`;
                            const fgRef = fgVar ? `var(${fgVar})` : null;
                            const preset = toastStyle.preset;

                            let bgStyle: string;
                            let textColor: string;
                            let borderStyle: string;

                            if (preset === "filled") {
                              bgStyle = `hsl(${colorRef})`;
                              textColor = fgRef
                                ? `hsl(${fgRef})`
                                : colors[colorVar]
                                  ? `hsl(${fgForBg(colors[colorVar])})`
                                  : "#fff";
                              borderStyle = "none";
                            } else if (preset === "soft") {
                              const parts = colorHsl.trim().split(/\s+/);
                              bgStyle =
                                parts.length >= 3
                                  ? `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, 0.12)`
                                  : `hsl(${colorRef})`;
                              textColor = `hsl(${colorRef})`;
                              borderStyle = "none";
                            } else if (preset === "outline") {
                              bgStyle = "hsl(var(--card))";
                              textColor = `hsl(${colorRef})`;
                              borderStyle = `${toastStyle.borderWidth}px solid hsl(${colorRef})`;
                            } else {
                              bgStyle = "hsl(var(--card))";
                              textColor = `hsl(${colorRef})`;
                              borderStyle = `1px solid hsl(var(--border))`;
                            }

                            return (
                              <div
                                key={key}
                                className="flex items-center gap-3 shadow-lg"
                                style={{
                                  backgroundColor: bgStyle,
                                  color: textColor,
                                  borderRadius: `${toastStyle.borderRadius}px`,
                                  border: borderStyle,
                                  padding: `${Math.max(toastStyle.padding - 4, 8)}px ${toastStyle.padding}px`,
                                }}
                              >
                                <svg
                                  className="w-5 h-5 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={iconPath}
                                  />
                                </svg>
                                <p className="text-sm font-medium flex-1 min-w-0">
                                  {label}
                                </p>
                                <button
                                  aria-label="Dismiss"
                                  className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                                  style={{ color: textColor }}
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            );
                          },
                        );
                      })()}
                    </div>
                    {/* Toast CSS/Tokens output */}
                    {toastCssVisible &&
                      (() => {
                        const tCss = `:root {\n  --toast-radius: ${toastStyle.borderRadius}px;\n  --toast-border-width: ${toastStyle.borderWidth}px;\n  --toast-padding: ${toastStyle.padding}px;\n}`;
                        const tTokens = JSON.stringify(
                          { toast: { borderRadius: toastStyle.borderRadius, borderWidth: toastStyle.borderWidth, padding: toastStyle.padding, preset: toastStyle.preset } },
                          null,
                          2,
                        );
                        const output =
                          toastExportFormat === "tokens" ? tTokens : tCss;
                        return (
                          <div
                            className="rounded-lg border ds-border"
                          >
                            <div
                              className="flex items-center justify-between px-3 py-1.5 border-b ds-border"
                            >
                              <span
                                className="text-xs font-light uppercase tracking-wider"
                                style={{ color: "hsl(var(--card-foreground))" }}
                              >
                                {toastExportFormat === "tokens" ? "Toast Tokens" : "Toast CSS"}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(output);
                                    setToastCssCopied(true);
                                    setTimeout(() => setToastCssCopied(false), 2000);
                                  }}
                                  aria-label="Copy" className="p-1 rounded-lg transition-colors hover:opacity-80"
                                  style={{
                                    backgroundColor: "hsl(var(--muted))",
                                    color: colors["--muted"]
                                      ? `hsl(${fgForBg(colors["--muted"])})`
                                      : "hsl(var(--muted-foreground))",
                                  }}
                                >
                                  {toastCssCopied ? <CheckIcon /> : <CopyIcon />}
                                </button>
                                <button
                                  onClick={() => setToastCssVisible(false)}
                                  aria-label="Close"
                                  className="p-1 rounded-lg transition-colors hover:opacity-80"
                                  style={{
                                    backgroundColor: "hsl(var(--muted))",
                                    color: colors["--muted"]
                                      ? `hsl(${fgForBg(colors["--muted"])})`
                                      : "hsl(var(--muted-foreground))",
                                  }}
                                >
                                  <XIcon />
                                </button>
                              </div>
                            </div>
                            <pre
                              className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed font-mono"
                              style={{ color: "hsl(var(--card-foreground))" }}
                            >
                              <code>{output}</code>
                            </pre>
                          </div>
                        );
                      })()}
                  </div>
                </PremiumGate>
              </div>
              {/* end two-column grid */}

            {/* Alert Reset Confirmation Modal */}
            <ResetConfirmModal
              open={showAlertResetModal}
              onClose={() => setShowAlertResetModal(false)}
              onConfirm={handleResetAlertStyle}
              title="Reset Alert Style?"
              message="This will revert all alert style settings to their defaults. Any customizations will be lost."
              id="alert-reset-modal-title"
            />
            <ResetConfirmModal
              open={showDialogResetModal}
              onClose={() => setShowDialogResetModal(false)}
              onConfirm={handleResetDialogStyle}
              title="Reset Dialog Style?"
              message="This will revert dialog style settings to their defaults. Any customizations will be lost."
              id="dialog-reset-modal-title"
            />
            <ResetConfirmModal
              open={showToastResetModal}
              onClose={() => setShowToastResetModal(false)}
              onConfirm={handleResetToastStyle}
              title="Reset Toast Style?"
              message="This will revert toast style settings to their defaults. Any customizations will be lost."
              id="toast-reset-modal-title"
            />
          </div>
  );
}

import React, { useState } from "react";
import {
  fgForBg,
  buildShadowCss,
  generateSectionDesignTokens,
} from "../utils/themeUtils";
import type {
  CardStyleState,
  TypographyState,
  AlertStyleState,
  InteractionStyleState,
  ButtonStyleState,
  TypoInteractionStyleState,
} from "../utils/themeUtils";
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

export interface ButtonsSectionProps {
  colors: Record<string, string>;
  buttonStyle: ButtonStyleState;
  updateButtonStyle: (patch: Partial<ButtonStyleState>) => void;
  selectButtonPreset: (key: string) => void;
  setButtonStyle: React.Dispatch<React.SetStateAction<ButtonStyleState>>;
  interactionStyle: InteractionStyleState;
  updateInteractionStyle: (patch: Partial<InteractionStyleState>) => void;
  selectInteractionPreset: (key: string) => void;
  cardStyle: CardStyleState;
  typographyState: TypographyState;
  alertStyle: AlertStyleState;
  typoInteractionStyle: TypoInteractionStyleState;
  upgradeUrl?: string;
  signInUrl?: string;
  handleResetInteractionStyle: () => void;
  defaultButtonStyle: ButtonStyleState;
}

export function ButtonsSection({
  colors,
  buttonStyle,
  updateButtonStyle,
  selectButtonPreset,
  setButtonStyle,
  interactionStyle,
  updateInteractionStyle,
  selectInteractionPreset,
  cardStyle,
  typographyState,
  alertStyle,
  typoInteractionStyle,
  upgradeUrl,
  signInUrl,
  handleResetInteractionStyle,
  defaultButtonStyle,
}: ButtonsSectionProps) {
  const [showBtnResetModal, setShowBtnResetModal] = useState(false);
  const [btnCssVisible, setBtnCssVisible] = useState(false);
  const [btnCssCopied, setBtnCssCopied] = useState(false);
  const [btnExportFormat, setBtnExportFormat] = useState<"css" | "tokens">("css");
  const [interactionCssVisible, setInteractionCssVisible] = useState(false);
  const [interactionCssCopied, setInteractionCssCopied] = useState(false);
  const [interactionExportFormat, setInteractionExportFormat] = useState<
    "css" | "tokens"
  >("css");
  const [showInteractionResetModal, setShowInteractionResetModal] =
    useState(false);

  return (
    <>
          {/* Buttons section */}
          <div
            id="buttons"
            className="min-w-0 space-y-3 mt-6 mb-6 md:mt-16 md:mb-16 scroll-mt-[56px]"
          >
            <h2
              className="text-[14px] sm:text-[16px] md:text-[20px] font-bold tracking-wider mb-[5px] flex items-baseline gap-2"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Buttons{" "}
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

            {/* Swatches + Interactions side-by-side on desktop */}
            <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-12">
              {/* Types subsection */}
              <div
                className="w-full lg:w-1/2 flex flex-col rounded-lg p-4"
                style={{ border: "1px solid hsl(var(--border))" }}
              >
                <div
                  className="flex items-center flex-wrap gap-2 sm:gap-4"
                  data-axe-exclude
                >
                  <h3
                    className="text-[16px] font-normal uppercase tracking-wider"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    Types
                  </h3>
                  <div className="ml-auto flex items-center">
                    {/* Mobile: dropdown */}
                    <CustomSelect
                      ariaLabel="Button types actions"
                      className="sm:hidden"
                      placeholder="Actions…"
                      size="sm"
                      width="120px"
                      value=""
                      onChange={(v) => {
                        if (v === "css") { setBtnExportFormat("css"); setBtnCssVisible(true); }
                        else if (v === "tokens") { setBtnExportFormat("tokens"); setBtnCssVisible(true); }
                        else if (v === "reset") setShowBtnResetModal(true);
                      }}
                      options={[
                        { value: "css", label: "CSS" },
                        { value: "tokens", label: "Tokens" },
                        { value: "reset", label: "Reset" },
                      ]}
                    />
                    {/* Desktop: buttons */}
                    <div className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2">
                      <div
                        className="flex items-center rounded-lg overflow-hidden border"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <button
                          onClick={() => {
                            if (btnCssVisible && btnExportFormat === "css") { setBtnCssVisible(false); return; }
                            setBtnExportFormat("css");
                            setBtnCssVisible(true);
                          }}
                          className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                          style={{
                            backgroundColor: btnCssVisible && btnExportFormat === "css" ? "hsl(var(--brand))" : "transparent",
                            color: btnCssVisible && btnExportFormat === "css"
                              ? colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff"
                              : "hsl(var(--muted-foreground))",
                          }}
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          <span className="truncate">CSS</span>
                        </button>
                        <span className="w-px h-5" style={{ backgroundColor: "hsl(var(--border))" }} />
                        <button
                          onClick={() => {
                            if (btnCssVisible && btnExportFormat === "tokens") { setBtnCssVisible(false); return; }
                            setBtnExportFormat("tokens");
                            setBtnCssVisible(true);
                          }}
                          className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                          style={{
                            backgroundColor: btnCssVisible && btnExportFormat === "tokens" ? "hsl(var(--brand))" : "transparent",
                            color: btnCssVisible && btnExportFormat === "tokens"
                              ? colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "#fff"
                              : "hsl(var(--muted-foreground))",
                          }}
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16" />
                          </svg>
                          <span className="truncate">Tokens</span>
                        </button>
                      </div>
                      <button
                        onClick={() => setShowBtnResetModal(true)}
                        className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" />
                        </svg>
                        <span className="truncate">Reset</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Button CSS/Tokens output */}
                {btnCssVisible && (() => {
                  const btnCss = `:root {\n  --btn-px: ${buttonStyle.paddingX}px;\n  --btn-py: ${buttonStyle.paddingY}px;\n  --btn-font-size: ${buttonStyle.fontSize}px;\n  --btn-font-weight: ${buttonStyle.fontWeight};\n  --btn-radius: ${buttonStyle.borderRadius}px;\n  --btn-shadow: ${buildShadowCss(buttonStyle)};\n  --btn-border-width: ${buttonStyle.borderWidth}px;\n}`;
                  const btnTokens = JSON.stringify(
                    generateSectionDesignTokens(
                      "buttons",
                      cardStyle,
                      typographyState,
                      alertStyle,
                      interactionStyle,
                      typoInteractionStyle,
                      buttonStyle,
                    ),
                    null,
                    2,
                  );
                  const output = btnExportFormat === "tokens" ? btnTokens : btnCss;
                  return (
                    <div
                      className="rounded-lg border"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      <div
                        className="flex items-center justify-between px-3 py-1.5 border-b"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <span
                          className="text-[14px] font-light uppercase tracking-wider"
                          style={{ color: "hsl(var(--card-foreground))" }}
                        >
                          {btnExportFormat === "tokens" ? "Button Tokens" : "Button CSS"}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(output);
                              setBtnCssCopied(true);
                              setTimeout(() => setBtnCssCopied(false), 2000);
                            }}
                            aria-label="Copy" className="p-1 rounded-lg transition-colors hover:opacity-80"
                            style={{
                              backgroundColor: "hsl(var(--muted))",
                              color: colors["--muted"]
                                ? `hsl(${fgForBg(colors["--muted"])})`
                                : "hsl(var(--muted-foreground))",
                            }}
                          >
                            {btnCssCopied ? <CheckIcon /> : <CopyIcon />}
                          </button>
                          <button
                            onClick={() => setBtnCssVisible(false)}
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

                {/* Preset buttons */}
                <div className="flex flex-wrap gap-2 sm:gap-4 rounded-lg p-3">
                  {(["subtle", "elevated", "bold"] as const).map((key) => {
                    const labels: Record<string, string> = {
                      subtle: "Subtle",
                      elevated: "Elevated",
                      bold: "Bold",
                    };
                    const icons: Record<string, React.ReactNode> = {
                      subtle: (
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 12H4"
                          />
                        </svg>
                      ),
                      elevated: (
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                          />
                        </svg>
                      ),
                      bold: (
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      ),
                    };
                    const active = buttonStyle.preset === key;
                    return (
                      <button
                        key={key}
                        onClick={() => selectButtonPreset(key)}
                        className="h-12 px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
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
                                backgroundColor: "hsl(var(--foreground) / 0.1)",
                                color: "hsl(var(--foreground))",
                                boxShadow:
                                  "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
                              }
                        }
                      >
                        {icons[key]}
                        {labels[key]}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-1">
                  {/* Controls */}
                  <div className="flex-1 min-w-0 space-y-3 order-2 md:order-1">
                    <div className="space-y-1.5">
                      <p
                        className="text-[14px] font-light uppercase tracking-wider"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Size
                      </p>
                      <label
                        className="flex items-center justify-between gap-2 text-[14px] font-light"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <span>Padding X: {buttonStyle.paddingX}px</span>
                        <input
                          type="range"
                          name="btn-padding-x"
                          min={4}
                          max={40}
                          value={buttonStyle.paddingX}
                          onChange={(e) => updateButtonStyle({ paddingX: Number(e.target.value) })}
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                      <label
                        className="flex items-center justify-between gap-2 text-[14px] font-light"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <span>Padding Y: {buttonStyle.paddingY}px</span>
                        <input
                          type="range"
                          name="btn-padding-y"
                          min={2}
                          max={20}
                          value={buttonStyle.paddingY}
                          onChange={(e) => updateButtonStyle({ paddingY: Number(e.target.value) })}
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                      <label
                        className="flex items-center justify-between gap-2 text-[14px] font-light"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <span>Radius: {buttonStyle.borderRadius}px</span>
                        <input
                          type="range"
                          name="btn-border-radius"
                          min={0}
                          max={24}
                          value={buttonStyle.borderRadius}
                          onChange={(e) => updateButtonStyle({ borderRadius: Number(e.target.value) })}
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                    </div>
                    <div className="space-y-1.5">
                      <p
                        className="text-[14px] font-light uppercase tracking-wider"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Text
                      </p>
                      <label
                        className="flex items-center justify-between gap-2 text-[14px] font-light"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <span>Font Size: {buttonStyle.fontSize}px</span>
                        <input
                          type="range"
                          name="btn-font-size"
                          min={10}
                          max={22}
                          value={buttonStyle.fontSize}
                          onChange={(e) => updateButtonStyle({ fontSize: Number(e.target.value) })}
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                      <label
                        className="flex items-center justify-between gap-2 text-[14px] font-light"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <span>Font Weight: {buttonStyle.fontWeight}</span>
                        <input
                          type="range"
                          name="btn-font-weight"
                          min={100}
                          max={900}
                          step={100}
                          value={buttonStyle.fontWeight}
                          onChange={(e) => updateButtonStyle({ fontWeight: Number(e.target.value) })}
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                    </div>
                    <div className="space-y-1.5">
                      <p
                        className="text-[14px] font-light uppercase tracking-wider"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Shadow
                      </p>
                      <label
                        className="flex items-center justify-between gap-2 text-[14px] font-light"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <span>Offset X: {buttonStyle.shadowOffsetX}px</span>
                        <input
                          type="range" name="btn-shadow-x" min={-10} max={10}
                          value={buttonStyle.shadowOffsetX}
                          onChange={(e) => updateButtonStyle({ shadowOffsetX: Number(e.target.value) })}
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                      <label
                        className="flex items-center justify-between gap-2 text-[14px] font-light"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <span>Offset Y: {buttonStyle.shadowOffsetY}px</span>
                        <input
                          type="range" name="btn-shadow-y" min={-10} max={10}
                          value={buttonStyle.shadowOffsetY}
                          onChange={(e) => updateButtonStyle({ shadowOffsetY: Number(e.target.value) })}
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                      <label
                        className="flex items-center justify-between gap-2 text-[14px] font-light"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <span>Blur: {buttonStyle.shadowBlur}px</span>
                        <input
                          type="range" name="btn-shadow-blur" min={0} max={30}
                          value={buttonStyle.shadowBlur}
                          onChange={(e) => updateButtonStyle({ shadowBlur: Number(e.target.value) })}
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                      <label
                        className="flex items-center justify-between gap-2 text-[14px] font-light"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <span>Spread: {buttonStyle.shadowSpread}px</span>
                        <input
                          type="range" name="btn-shadow-spread" min={-5} max={10}
                          value={buttonStyle.shadowSpread}
                          onChange={(e) => updateButtonStyle({ shadowSpread: Number(e.target.value) })}
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                    </div>
                    <div className="space-y-1.5">
                      <p
                        className="text-[14px] font-light uppercase tracking-wider"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Border
                      </p>
                      <label
                        className="flex items-center justify-between gap-2 text-[14px] font-light"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <span>Width: {buttonStyle.borderWidth}px</span>
                        <input
                          type="range" name="btn-border-width" min={0} max={4}
                          value={buttonStyle.borderWidth}
                          onChange={(e) => updateButtonStyle({ borderWidth: Number(e.target.value) })}
                          className="w-32 accent-[hsl(var(--brand))]"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="flex-1 min-w-0 flex items-start justify-center pt-2 order-1 md:order-2">
                    <div className="w-full space-y-3" data-axe-exclude>
                      <p
                        className="text-[14px] font-light uppercase tracking-wider"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Preview
                      </p>
                      {(() => {
                        const previewShadow = buildShadowCss(buttonStyle);
                        const commonStyle = {
                          borderRadius: `${buttonStyle.borderRadius}px`,
                          padding: `${buttonStyle.paddingY}px ${buttonStyle.paddingX}px`,
                          fontSize: `${buttonStyle.fontSize}px`,
                          fontWeight: buttonStyle.fontWeight,
                          boxShadow: previewShadow,
                          border: buttonStyle.borderWidth > 0 ? `${buttonStyle.borderWidth}px solid hsl(var(--border))` : "none",
                          transition: `opacity ${interactionStyle.transitionDuration}ms ease, transform ${interactionStyle.transitionDuration}ms ease`,
                        };
                        const hoverHandlers = {
                          onMouseEnter: (e: React.MouseEvent) => {
                            (e.target as HTMLElement).style.opacity = String(interactionStyle.hoverOpacity);
                            (e.target as HTMLElement).style.transform = `scale(${interactionStyle.hoverScale})`;
                          },
                          onMouseLeave: (e: React.MouseEvent) => {
                            (e.target as HTMLElement).style.opacity = "1";
                            (e.target as HTMLElement).style.transform = "scale(1)";
                          },
                          onMouseDown: (e: React.MouseEvent) => {
                            (e.target as HTMLElement).style.transform = `scale(${interactionStyle.activeScale})`;
                          },
                          onMouseUp: (e: React.MouseEvent) => {
                            (e.target as HTMLElement).style.transform = `scale(${interactionStyle.hoverScale})`;
                          },
                        };
                        return (
                          <div
                            className="flex flex-wrap gap-2 content-start rounded-lg p-4"
                            style={{ backgroundColor: "hsl(var(--card))" }}
                          >
                            {(
                              [
                                { bg: "--primary", fg: "--primary-foreground", label: "Primary" },
                                { bg: "--secondary", fg: "--secondary-foreground", label: "Secondary" },
                                { bg: "--destructive", fg: "--destructive-foreground", label: "Destructive" },
                                { bg: "--muted", fg: "--muted-foreground", label: "Muted" },
                                { bg: "--success", fg: "--success-foreground", label: "Success" },
                                { bg: "--warning", fg: "--warning-foreground", label: "Warning" },
                              ] as const
                            ).map(({ bg, fg, label }) => {
                              const bgHsl = colors[bg] || "0 0% 50%";
                              const fgHsl = colors[fg] || fgForBg(bgHsl);
                              return (
                                <button
                                  key={bg}
                                  style={{
                                    ...commonStyle,
                                    backgroundColor: `hsl(${bgHsl})`,
                                    color: `hsl(${fgHsl})`,
                                  }}
                                  {...hoverHandlers}
                                >
                                  {label}
                                </button>
                              );
                            })}
                            <button
                              style={{
                                ...commonStyle,
                                backgroundColor: "transparent",
                                color: "hsl(var(--foreground))",
                                border: `${Math.max(buttonStyle.borderWidth, 1)}px solid hsl(var(--border))`,
                              }}
                              {...hoverHandlers}
                            >
                              Outline
                            </button>
                            <button
                              style={{
                                ...commonStyle,
                                backgroundColor: "transparent",
                                color: "hsl(var(--foreground))",
                                border: "none",
                              }}
                              {...hoverHandlers}
                            >
                              Ghost
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactions subsection */}
              <div
                className="w-full lg:w-1/2 space-y-3 rounded-lg p-4"
                style={{ border: "1px solid hsl(var(--border))" }}
              >
                <div
                  className="flex items-center flex-wrap gap-2 sm:gap-4"
                  data-axe-exclude
                >
                  <h3
                    className="text-[16px] font-normal uppercase tracking-wider"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    Interactions
                  </h3>
                  <div className="ml-auto flex items-center">
                    {/* Mobile: dropdown */}
                    <CustomSelect
                      ariaLabel="Color interactions actions"
                      className="sm:hidden"
                      placeholder="Actions…"
                      size="sm"
                      width="120px"
                      value=""
                      onChange={(v) => {
                        if (v === "css") { setInteractionExportFormat("css"); setInteractionCssVisible(true); }
                        else if (v === "tokens") { setInteractionExportFormat("tokens"); setInteractionCssVisible(true); }
                        else if (v === "reset") setShowInteractionResetModal(true);
                      }}
                      options={[
                        { value: "css", label: "CSS" },
                        { value: "tokens", label: "Tokens" },
                        { value: "reset", label: "Reset" },
                      ]}
                    />
                    {/* Desktop: buttons */}
                    <div className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2">
                      <div
                        className="flex items-center rounded-lg overflow-hidden border"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <button
                          onClick={() => {
                            if (
                              interactionCssVisible &&
                              interactionExportFormat === "css"
                            ) {
                              setInteractionCssVisible(false);
                              return;
                            }
                            setInteractionExportFormat("css");
                            setInteractionCssVisible(true);
                          }}
                          className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                          style={{
                            backgroundColor:
                              interactionCssVisible &&
                              interactionExportFormat === "css"
                                ? "hsl(var(--brand))"
                                : "transparent",
                            color:
                              interactionCssVisible &&
                              interactionExportFormat === "css"
                                ? colors["--brand"]
                                  ? `hsl(${fgForBg(colors["--brand"])})`
                                  : "#fff"
                                : "hsl(var(--muted-foreground))",
                          }}
                        >
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                          </svg>
                          <span className="truncate">CSS</span>
                        </button>
                        <span
                          className="w-px h-5"
                          style={{ backgroundColor: "hsl(var(--border))" }}
                        />
                        <button
                          onClick={() => {
                            if (
                              interactionCssVisible &&
                              interactionExportFormat === "tokens"
                            ) {
                              setInteractionCssVisible(false);
                              return;
                            }
                            setInteractionExportFormat("tokens");
                            setInteractionCssVisible(true);
                          }}
                          className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                          style={{
                            backgroundColor:
                              interactionCssVisible &&
                              interactionExportFormat === "tokens"
                                ? "hsl(var(--brand))"
                                : "transparent",
                            color:
                              interactionCssVisible &&
                              interactionExportFormat === "tokens"
                                ? colors["--brand"]
                                  ? `hsl(${fgForBg(colors["--brand"])})`
                                  : "#fff"
                                : "hsl(var(--muted-foreground))",
                          }}
                        >
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16"
                            />
                          </svg>
                          <span className="truncate">Tokens</span>
                        </button>
                      </div>
                      <button
                        onClick={() => setShowInteractionResetModal(true)}
                        className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z"
                          />
                        </svg>
                        <span className="truncate">Reset</span>
                      </button>
                    </div>
                  </div>
                </div>

                <PremiumGate
                  feature="interaction-states"
                  variant="section"
                  upgradeUrl={upgradeUrl}
                  signInUrl={signInUrl}
                >
                  {/* Preset buttons */}
                  <div
                    className="flex flex-wrap gap-2 sm:gap-4 rounded-lg p-3"
                  >
                    {(["subtle", "elevated", "bold"] as const).map((key) => {
                      const labels: Record<string, string> = {
                        subtle: "Subtle",
                        elevated: "Elevated",
                        bold: "Bold",
                      };
                      const icons: Record<string, React.ReactNode> = {
                        subtle: (
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ),
                        elevated: (
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ),
                        bold: (
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        ),
                      };
                      const active = interactionStyle.preset === key;
                      return (
                        <button
                          key={key}
                          onClick={() => selectInteractionPreset(key)}
                          className="h-12 px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
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
                          {icons[key]}
                          {labels[key]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Interaction CSS/Tokens output */}
                  {interactionCssVisible &&
                    (() => {
                      const intCss = `:root {\n  --hover-opacity: ${interactionStyle.hoverOpacity};\n  --hover-scale: ${interactionStyle.hoverScale};\n  --active-scale: ${interactionStyle.activeScale};\n  --transition-duration: ${interactionStyle.transitionDuration}ms;\n  --focus-ring-width: ${interactionStyle.focusRingWidth}px;\n  --focus-ring-color: hsl(var(--ring));\n}`;
                      const intTokens = JSON.stringify(
                        generateSectionDesignTokens(
                          "interactions",
                          cardStyle,
                          typographyState,
                          alertStyle,
                          interactionStyle,
                          typoInteractionStyle,
                        ),
                        null,
                        2,
                      );
                      const output =
                        interactionExportFormat === "tokens"
                          ? intTokens
                          : intCss;
                      return (
                        <div
                          className="rounded-lg border"
                          style={{ borderColor: "hsl(var(--border))" }}
                        >
                          <div
                            className="flex items-center justify-between px-3 py-1.5 border-b"
                            style={{ borderColor: "hsl(var(--border))" }}
                          >
                            <span
                              className="text-[14px] font-light uppercase tracking-wider"
                              style={{ color: "hsl(var(--card-foreground))" }}
                            >
                              {interactionExportFormat === "tokens"
                                ? "Interaction Tokens"
                                : "Interaction CSS"}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(output);
                                  setInteractionCssCopied(true);
                                  setTimeout(
                                    () => setInteractionCssCopied(false),
                                    2000,
                                  );
                                }}
                                aria-label="Copy" className="p-1 rounded-lg transition-colors hover:opacity-80"
                                style={{
                                  backgroundColor: "hsl(var(--muted))",
                                  color: colors["--muted"]
                                    ? `hsl(${fgForBg(colors["--muted"])})`
                                    : "hsl(var(--muted-foreground))",
                                }}
                              >
                                {interactionCssCopied ? <CheckIcon /> : <CopyIcon />}
                              </button>
                              <button
                                onClick={() => setInteractionCssVisible(false)}
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

                  {/* Controls + Preview */}
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* Slider controls */}
                    <div className="flex-1 min-w-0 space-y-3 order-2 md:order-1">
                      <div className="space-y-1.5">
                        <p
                          className="text-[14px] font-light uppercase tracking-wider"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          Hover
                        </p>
                        <label
                          className="flex items-center justify-between gap-2 text-[14px] font-light"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          <span>Opacity: {interactionStyle.hoverOpacity}</span>
                          <input
                            type="range"
                            name="hover-opacity"
                            min={0.6}
                            max={1}
                            step={0.01}
                            value={interactionStyle.hoverOpacity}
                            onChange={(e) =>
                              updateInteractionStyle({
                                hoverOpacity: Number(e.target.value),
                              })
                            }
                            className="w-32 accent-[hsl(var(--brand))]"
                          />
                        </label>
                        <label
                          className="flex items-center justify-between gap-2 text-[14px] font-light"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          <span>Scale: {interactionStyle.hoverScale}</span>
                          <input
                            type="range"
                            name="hover-scale"
                            min={1}
                            max={1.1}
                            step={0.005}
                            value={interactionStyle.hoverScale}
                            onChange={(e) =>
                              updateInteractionStyle({
                                hoverScale: Number(e.target.value),
                              })
                            }
                            className="w-32 accent-[hsl(var(--brand))]"
                          />
                        </label>
                      </div>
                      <div className="space-y-1.5">
                        <p
                          className="text-[14px] font-light uppercase tracking-wider"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          Active
                        </p>
                        <label
                          className="flex items-center justify-between gap-2 text-[14px] font-light"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          <span>Scale: {interactionStyle.activeScale}</span>
                          <input
                            type="range"
                            name="active-scale"
                            min={0.9}
                            max={1.05}
                            step={0.005}
                            value={interactionStyle.activeScale}
                            onChange={(e) =>
                              updateInteractionStyle({
                                activeScale: Number(e.target.value),
                              })
                            }
                            className="w-32 accent-[hsl(var(--brand))]"
                          />
                        </label>
                      </div>
                      <div className="space-y-1.5">
                        <p
                          className="text-[14px] font-light uppercase tracking-wider"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          Timing & Focus
                        </p>
                        <label
                          className="flex items-center justify-between gap-2 text-[14px] font-light"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          <span>
                            Duration: {interactionStyle.transitionDuration}ms
                          </span>
                          <input
                            type="range"
                            name="transition-duration"
                            min={0}
                            max={500}
                            step={10}
                            value={interactionStyle.transitionDuration}
                            onChange={(e) =>
                              updateInteractionStyle({
                                transitionDuration: Number(e.target.value),
                              })
                            }
                            className="w-32 accent-[hsl(var(--brand))]"
                          />
                        </label>
                        <label
                          className="flex items-center justify-between gap-2 text-[14px] font-light"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          <span>
                            Focus Ring: {interactionStyle.focusRingWidth}px
                          </span>
                          <input
                            type="range"
                            name="focus-ring-width"
                            min={0}
                            max={4}
                            step={0.5}
                            value={interactionStyle.focusRingWidth}
                            onChange={(e) =>
                              updateInteractionStyle({
                                focusRingWidth: Number(e.target.value),
                              })
                            }
                            className="w-32 accent-[hsl(var(--brand))]"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Live preview */}
                    <div className="flex-1 min-w-0 flex items-start justify-center pt-2 order-1 md:order-2">
                      <div
                        className="w-full md:max-w-[400px] space-y-3"
                        data-axe-exclude
                      >
                        <p
                          className="text-[14px] font-light uppercase tracking-wider"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          Preview
                        </p>
                        {(() => {
                          const ixShadow = buildShadowCss(buttonStyle);
                          const ixCommon = {
                            borderRadius: `${buttonStyle.borderRadius}px`,
                            padding: `${buttonStyle.paddingY}px ${buttonStyle.paddingX}px`,
                            fontSize: `${buttonStyle.fontSize}px`,
                            fontWeight: buttonStyle.fontWeight,
                            boxShadow: ixShadow,
                            border: buttonStyle.borderWidth > 0 ? `${buttonStyle.borderWidth}px solid hsl(var(--border))` : "none",
                            transition: `opacity ${interactionStyle.transitionDuration}ms ease, transform ${interactionStyle.transitionDuration}ms ease`,
                          };
                          const ixHover = {
                            onMouseEnter: (e: React.MouseEvent) => {
                              (e.target as HTMLElement).style.opacity = String(interactionStyle.hoverOpacity);
                              (e.target as HTMLElement).style.transform = `scale(${interactionStyle.hoverScale})`;
                            },
                            onMouseLeave: (e: React.MouseEvent) => {
                              (e.target as HTMLElement).style.opacity = "1";
                              (e.target as HTMLElement).style.transform = "scale(1)";
                            },
                            onMouseDown: (e: React.MouseEvent) => {
                              (e.target as HTMLElement).style.transform = `scale(${interactionStyle.activeScale})`;
                            },
                            onMouseUp: (e: React.MouseEvent) => {
                              (e.target as HTMLElement).style.transform = `scale(${interactionStyle.hoverScale})`;
                            },
                          };
                          return (
                            <div className="flex flex-wrap gap-3">
                              <button
                                style={{
                                  ...ixCommon,
                                  backgroundColor: "hsl(var(--primary))",
                                  color: "hsl(var(--primary-foreground))",
                                }}
                                {...ixHover}
                              >
                                Primary Button
                              </button>
                              <button
                                style={{
                                  ...ixCommon,
                                  backgroundColor: "hsl(var(--secondary))",
                                  color: "hsl(var(--secondary-foreground))",
                                }}
                                {...ixHover}
                              >
                                Secondary
                              </button>
                              <button
                                style={{
                                  ...ixCommon,
                                  backgroundColor: "transparent",
                                  color: "hsl(var(--foreground))",
                                  border: `${Math.max(buttonStyle.borderWidth, 1)}px solid hsl(var(--border))`,
                                }}
                                {...ixHover}
                              >
                                Outline
                              </button>
                            </div>
                          );
                        })()}
                        <p
                          className="text-[12px] font-light"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          Hover and click the buttons above to preview
                          interaction states.
                        </p>
                      </div>
                    </div>
                  </div>
                </PremiumGate>
              </div>
            </div>
            {/* end flex row */}
          </div>

          {/* Interaction Reset Confirmation Modal */}
          <ResetConfirmModal
            open={showInteractionResetModal}
            onClose={() => setShowInteractionResetModal(false)}
            onConfirm={handleResetInteractionStyle}
            title="Reset Interaction Style?"
            message="This will revert all interaction style settings to their defaults. Any customizations will be lost."
            id="interaction-reset-modal-title"
          />

          {/* Button Reset Confirmation Modal */}
          <ResetConfirmModal
            open={showBtnResetModal}
            onClose={() => setShowBtnResetModal(false)}
            onConfirm={() => setButtonStyle({ ...defaultButtonStyle })}
            title="Reset Button Style?"
            message="This will revert all button style settings to their defaults. Any customizations will be lost."
            id="btn-reset-modal-title"
          />
    </>
  );
}

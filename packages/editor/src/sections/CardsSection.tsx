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
  TypoInteractionStyleState,
} from "../utils/themeUtils";
import { CustomSelect } from "../components/CustomSelect";
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

export interface CardsSectionProps {
  colors: Record<string, string>;
  cardStyle: CardStyleState;
  updateCardStyle: (patch: Partial<CardStyleState>) => void;
  selectCardPreset: (presetKey: string) => void;
  handleResetCardStyle: () => void;
  typographyState: TypographyState;
  alertStyle: AlertStyleState;
  interactionStyle: InteractionStyleState;
  typoInteractionStyle: TypoInteractionStyleState;
}

export function CardsSection({
  colors,
  cardStyle,
  updateCardStyle,
  selectCardPreset,
  handleResetCardStyle,
  typographyState,
  alertStyle,
  interactionStyle,
  typoInteractionStyle,
}: CardsSectionProps) {
  const [cardCssVisible, setCardCssVisible] = useState(false);
  const [cardCssCopied, setCardCssCopied] = useState(false);
  const [cardExportFormat, setCardExportFormat] = useState<"css" | "tokens">(
    "css",
  );
  const [showCardResetModal, setShowCardResetModal] = useState(false);

  return (
    <>
      <ResetConfirmModal
        open={showCardResetModal}
        onClose={() => setShowCardResetModal(false)}
        onConfirm={handleResetCardStyle}
        title="Reset Card Style?"
        message="This will revert all card style settings to their defaults. Any customizations will be lost."
        id="card-reset-modal-title"
      />

      {/* Card Style section */}
      <div
        id="card"
        className="min-w-0 mt-6 mb-6 md:mt-16 md:mb-16 scroll-mt-28 lg:scroll-mt-14 space-y-3"
      >
        <div
          className="flex items-center flex-wrap gap-2 sm:gap-4"
          data-axe-exclude
        >
          <h2
            className="text-sm sm:text-base md:text-lg font-bold tracking-wider mb-[5px] flex items-baseline gap-2 ds-text-fg"
          >
            Cards{" "}
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
          <div className="ml-auto flex items-center">
            {/* CSS / Tokens / Reset */}
            {/* Mobile: dropdown */}
            <CustomSelect
              ariaLabel="Card actions"
              className="sm:hidden"
              placeholder="Actions…"
              size="sm"
              width="120px"
              value=""
              onChange={(v) => {
                if (v === "css") { setCardExportFormat("css"); setCardCssVisible(true); }
                else if (v === "tokens") { setCardExportFormat("tokens"); setCardCssVisible(true); }
                else if (v === "reset") setShowCardResetModal(true);
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
                className="flex items-center rounded-lg overflow-hidden border ds-border"
              >
                <button
                  onClick={() => {
                    if (cardCssVisible && cardExportFormat === "css") {
                      setCardCssVisible(false);
                      return;
                    }
                    setCardExportFormat("css");
                    setCardCssVisible(true);
                  }}
                  className="h-10 px-2 sm:px-3 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{
                    backgroundColor:
                      cardCssVisible && cardExportFormat === "css"
                        ? "hsl(var(--brand))"
                        : "transparent",
                    color:
                      cardCssVisible && cardExportFormat === "css"
                        ? colors["--brand"]
                          ? `hsl(${fgForBg(colors["--brand"])})`
                          : "hsl(var(--primary-foreground))"
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
                    if (cardCssVisible && cardExportFormat === "tokens") {
                      setCardCssVisible(false);
                      return;
                    }
                    setCardExportFormat("tokens");
                    setCardCssVisible(true);
                  }}
                  className="h-10 px-2 sm:px-3 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{
                    backgroundColor:
                      cardCssVisible && cardExportFormat === "tokens"
                        ? "hsl(var(--brand))"
                        : "transparent",
                    color:
                      cardCssVisible && cardExportFormat === "tokens"
                        ? colors["--brand"]
                          ? `hsl(${fgForBg(colors["--brand"])})`
                          : "hsl(var(--primary-foreground))"
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
                onClick={() => setShowCardResetModal(true)}
                className="h-10 px-2 sm:px-3 text-sm font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1 ds-text-muted"
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

        <div
          className="space-y-3 rounded-lg p-4"
          style={{ border: "1px solid hsl(var(--border))" }}
        >
          {/* Preset buttons */}
          <div
            className="flex flex-wrap gap-2 sm:gap-4 rounded-lg p-3"
            data-axe-exclude
          >
            {(
              ["liquid-glass", "solid", "gradient", "border-only"] as const
            ).map((key) => {
              const labels: Record<string, string> = {
                "liquid-glass": "Liquid Glass",
                solid: "Solid Color",
                gradient: "Gradient",
                "border-only": "Border Only",
              };
              const icons: Record<string, React.ReactNode> = {
                "liquid-glass": (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ),
                solid: (
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
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
                    />
                  </svg>
                ),
                gradient: (
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
                      d="M4 4h16v16H4z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 20L20 4"
                    />
                  </svg>
                ),
                "border-only": (
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="1"
                      strokeDasharray="4 2"
                    />
                  </svg>
                ),
              };
              const active = cardStyle.preset === key;
              return (
                <button
                  key={key}
                  onClick={() => selectCardPreset(key)}
                  className="h-12 px-3 text-sm font-light rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-1"
                  style={
                    active
                      ? {
                          backgroundColor: "hsl(var(--brand))",
                          color: colors["--brand"]
                            ? `hsl(${fgForBg(colors["--brand"])})`
                            : "hsl(var(--primary-foreground))",
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

          {/* Card CSS/Tokens output */}
          {cardCssVisible &&
            (() => {
              const cardCss = `:root {\n  --card-radius: ${cardStyle.borderRadius}px;\n  --card-shadow: ${buildShadowCss(cardStyle)};\n  --card-border: ${cardStyle.borderWidth > 0 ? `${cardStyle.borderWidth}px solid hsl(var(--border))` : "none"};\n  --card-backdrop: ${cardStyle.backdropBlur > 0 ? `blur(${cardStyle.backdropBlur}px)` : "none"};\n}`;
              const cardTokens = JSON.stringify(
                generateSectionDesignTokens(
                  "card",
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
                cardExportFormat === "tokens" ? cardTokens : cardCss;
              return (
                <div
                  className="rounded-lg border ds-border"
                >
                  <div
                    className="flex items-center justify-between px-3 py-1.5 border-b ds-border"
                  >
                    <span
                      className="text-sm font-light uppercase tracking-wider ds-text-card"
                    >
                      {cardExportFormat === "tokens"
                        ? "Card Tokens"
                        : "Card CSS"}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(output);
                          setCardCssCopied(true);
                          setTimeout(() => setCardCssCopied(false), 2000);
                        }}
                        aria-label="Copy" className="p-1 rounded-lg transition-colors hover:opacity-80"
                        style={{
                          backgroundColor: "hsl(var(--muted))",
                          color: colors["--muted"]
                            ? `hsl(${fgForBg(colors["--muted"])})`
                            : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {cardCssCopied ? <CheckIcon /> : <CopyIcon />}
                      </button>
                      <button
                        onClick={() => setCardCssVisible(false)}
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
                    className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed font-mono ds-text-card"
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
              {/* Shadow */}
              <div className="space-y-1.5">
                <p
                  className="text-sm font-light uppercase tracking-wider ds-text-muted"
                >
                  Shadow
                </p>
                <label
                  className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                >
                  <span>Y Offset: {cardStyle.shadowOffsetY}px</span>
                  <input
                    type="range"
                    name="card-shadow-offset-y"
                    min={0}
                    max={30}
                    value={cardStyle.shadowOffsetY}
                    onChange={(e) =>
                      updateCardStyle({
                        shadowOffsetY: Number(e.target.value),
                      })
                    }
                    className="w-32 accent-[hsl(var(--brand))]"
                  />
                </label>
                <label
                  className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                >
                  <span>Blur: {cardStyle.shadowBlur}px</span>
                  <input
                    type="range"
                    name="card-shadow-blur"
                    min={0}
                    max={50}
                    value={cardStyle.shadowBlur}
                    onChange={(e) =>
                      updateCardStyle({
                        shadowBlur: Number(e.target.value),
                      })
                    }
                    className="w-32 accent-[hsl(var(--brand))]"
                  />
                </label>
                <label
                  className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                >
                  <span>Spread: {cardStyle.shadowSpread}px</span>
                  <input
                    type="range"
                    name="card-shadow-spread"
                    min={-10}
                    max={20}
                    value={cardStyle.shadowSpread}
                    onChange={(e) =>
                      updateCardStyle({
                        shadowSpread: Number(e.target.value),
                      })
                    }
                    className="w-32 accent-[hsl(var(--brand))]"
                  />
                </label>
              </div>
              {/* Shape */}
              <div className="space-y-1.5">
                <p
                  className="text-sm font-light uppercase tracking-wider ds-text-muted"
                >
                  Shape
                </p>
                <label
                  className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                >
                  <span>Border Radius: {cardStyle.borderRadius}px</span>
                  <input
                    type="range"
                    name="card-border-radius"
                    min={0}
                    max={40}
                    value={cardStyle.borderRadius}
                    onChange={(e) =>
                      updateCardStyle({
                        borderRadius: Number(e.target.value),
                      })
                    }
                    className="w-32 accent-[hsl(var(--brand))]"
                  />
                </label>
                <label
                  className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                >
                  <span>Border Width: {cardStyle.borderWidth}px</span>
                  <input
                    type="range"
                    name="card-border-width"
                    min={0}
                    max={4}
                    value={cardStyle.borderWidth}
                    onChange={(e) =>
                      updateCardStyle({
                        borderWidth: Number(e.target.value),
                      })
                    }
                    className="w-32 accent-[hsl(var(--brand))]"
                  />
                </label>
              </div>
              {/* Background */}
              <div className="space-y-1.5">
                <p
                  className="text-sm font-light uppercase tracking-wider ds-text-muted"
                >
                  Background
                </p>
                <label
                  className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                >
                  <span>
                    Opacity: {Math.round(cardStyle.bgOpacity * 100)}%
                  </span>
                  <input
                    type="range"
                    name="card-bg-opacity"
                    min={0}
                    max={100}
                    value={Math.round(cardStyle.bgOpacity * 100)}
                    onChange={(e) =>
                      updateCardStyle({
                        bgOpacity: Number(e.target.value) / 100,
                      })
                    }
                    className="w-32 accent-[hsl(var(--brand))]"
                  />
                </label>
                <label
                  className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                >
                  <span>Backdrop Blur: {cardStyle.backdropBlur}px</span>
                  <input
                    type="range"
                    name="card-backdrop-blur"
                    min={0}
                    max={30}
                    value={cardStyle.backdropBlur}
                    onChange={(e) =>
                      updateCardStyle({
                        backdropBlur: Number(e.target.value),
                      })
                    }
                    className="w-32 accent-[hsl(var(--brand))]"
                  />
                </label>
              </div>
            </div>

            {/* Live preview */}
            <div className="flex-1 min-w-0 flex items-center justify-center order-1 md:order-2" data-axe-exclude>
              {(() => {
                // Compute the effective text color based on what the card bg actually looks like
                const brandHsl = colors["--brand"] || "220 70% 50%";
                const secondaryHsl = colors["--secondary"] || "220 30% 60%";
                const accentHsl = colors["--accent"] || "220 50% 55%";

                let previewTextColor: string;
                let previewSubtextColor: string;

                if (cardStyle.preset === "border-only") {
                  // Border-only: no card bg, text sits on page background
                  const pageBg = colors["--background"] || "0 0% 100%";
                  previewTextColor = `hsl(${fgForBg(pageBg)})`;
                  previewSubtextColor = previewTextColor;
                } else if (cardStyle.bgType === "gradient") {
                  previewTextColor = `hsl(${fgForBg(brandHsl)})`;
                  previewSubtextColor = previewTextColor;
                } else if (
                  cardStyle.bgType === "transparent" ||
                  cardStyle.bgOpacity < 0.4
                ) {
                  // When glass bg is showing, compute text color from brand (gradient backdrop)
                  previewTextColor = `hsl(${fgForBg(brandHsl)})`;
                  previewSubtextColor = previewTextColor;
                } else {
                  // Solid card: compute accessible text color from the card background
                  const cardBg = colors["--card"] || "0 0% 100%";
                  previewTextColor = `hsl(${fgForBg(cardBg)})`;
                  previewSubtextColor = previewTextColor;
                }

                const showGlassBg =
                  cardStyle.preset !== "border-only" &&
                  (cardStyle.bgType === "transparent" ||
                    cardStyle.bgOpacity < 1 ||
                    cardStyle.backdropBlur > 0);

                return (
                  <>
                    <style>{`
                      @keyframes ds-glass-gradient {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                      }
                      @keyframes ds-glass-float-1 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(15px, -20px) scale(1.1); }
                        66% { transform: translate(-10px, 10px) scale(0.95); }
                      }
                      @keyframes ds-glass-float-2 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(-12px, 15px) scale(1.05); }
                        66% { transform: translate(18px, -8px) scale(0.9); }
                      }
                      @keyframes ds-glass-float-3 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(10px, 12px) scale(0.9); }
                        66% { transform: translate(-15px, -15px) scale(1.1); }
                      }
                    `}</style>
                    {showGlassBg ? (
                      /* Glass: outer gradient container with inset glass card */
                      <div
                        className="relative w-full md:max-w-[320px] overflow-hidden flex flex-col"
                        style={{
                          minHeight: "240px",
                          borderRadius: `${cardStyle.borderRadius}px`,
                          background: `linear-gradient(135deg, hsl(${brandHsl}), hsl(${secondaryHsl}), hsl(${accentHsl}), hsl(${brandHsl}))`,
                          backgroundSize: "300% 300%",
                          animation: "ds-glass-gradient 8s ease infinite",
                          padding: "10px",
                        }}
                      >
                        <div
                          className="absolute"
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            backgroundColor: `hsl(${brandHsl} / 0.6)`,
                            top: "15%",
                            left: "10%",
                            filter: "blur(20px)",
                            animation:
                              "ds-glass-float-1 6s ease-in-out infinite",
                          }}
                        />
                        <div
                          className="absolute"
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            backgroundColor: `hsl(${accentHsl} / 0.5)`,
                            bottom: "15%",
                            right: "12%",
                            filter: "blur(18px)",
                            animation:
                              "ds-glass-float-2 7s ease-in-out infinite",
                          }}
                        />
                        <div
                          className="absolute"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            backgroundColor: `hsl(${secondaryHsl} / 0.4)`,
                            top: "50%",
                            left: "55%",
                            filter: "blur(15px)",
                            animation:
                              "ds-glass-float-3 5s ease-in-out infinite",
                          }}
                        />
                        <div
                          className="relative overflow-hidden flex-1"
                          style={{
                            borderRadius: `${Math.max(0, cardStyle.borderRadius - 4)}px`,
                            background: (() => {
                              const p = (colors["--card"] || "0 0% 100%")
                                .trim()
                                .split(/\s+/);
                              return p.length >= 3
                                ? `hsla(${p[0]}, ${p[1]}, ${p[2]}, ${cardStyle.bgOpacity})`
                                : "transparent";
                            })(),
                            border:
                              cardStyle.borderWidth > 0
                                ? `${cardStyle.borderWidth}px solid hsl(${colors["--border"] || "0 0% 80%"})`
                                : "none",
                            backdropFilter:
                              cardStyle.backdropBlur > 0
                                ? `blur(${cardStyle.backdropBlur}px)`
                                : "none",
                            WebkitBackdropFilter:
                              cardStyle.backdropBlur > 0
                                ? `blur(${cardStyle.backdropBlur}px)`
                                : "none",
                            boxShadow: buildShadowCss(cardStyle),
                            padding: "20px",
                          }}
                        >
                          <p
                            className="text-base font-normal mb-1"
                            style={{
                              color: previewTextColor,
                              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                            }}
                          >
                            Card Title
                          </p>
                          <p
                            className="text-sm font-light mb-3"
                            style={{
                              color: previewSubtextColor,
                              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                            }}
                          >
                            This is a preview of your card style with
                            customizable shadow, radius, and background.
                          </p>
                          <button
                            className="h-9 px-3 text-sm font-light rounded-lg"
                            style={{
                              backgroundColor: "hsl(var(--brand))",
                              color: colors["--brand"]
                                ? `hsl(${fgForBg(colors["--brand"])})`
                                : "hsl(var(--primary-foreground))",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            }}
                          >
                            Action
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Non-glass: single card */
                      <div
                        className="relative w-full md:max-w-[320px] overflow-hidden"
                        style={{
                          minHeight: "240px",
                          borderRadius: `${cardStyle.borderRadius}px`,
                          boxShadow: buildShadowCss(cardStyle),
                          background:
                            cardStyle.bgType === "transparent"
                              ? "transparent"
                              : cardStyle.bgType === "gradient"
                                ? `linear-gradient(${cardStyle.bgGradientAngle}deg, hsl(${colors["--brand"] || "220 70% 50%"}), hsl(${colors["--secondary"] || "220 30% 60%"}), hsl(${colors["--accent"] || "220 50% 55%"}))`
                                : `hsl(${colors["--card"] || "0 0% 100%"})`,
                          border:
                            cardStyle.borderWidth > 0
                              ? `${cardStyle.borderWidth}px solid hsl(${colors["--border"] || "0 0% 80%"})`
                              : "none",
                          padding: "20px",
                        }}
                      >
                        <p
                          className="text-base font-normal mb-1"
                          style={{ color: previewTextColor }}
                        >
                          Card Title
                        </p>
                        <p
                          className="text-sm font-light mb-3"
                          style={{ color: previewSubtextColor }}
                        >
                          This is a preview of your card style with
                          customizable shadow, radius, and background.
                        </p>
                        <button
                          className="h-9 px-3 text-sm font-light rounded-lg"
                          style={{
                            backgroundColor: "hsl(var(--brand))",
                            color: colors["--brand"]
                              ? `hsl(${fgForBg(colors["--brand"])})`
                              : "hsl(var(--primary-foreground))",
                          }}
                        >
                          Action
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

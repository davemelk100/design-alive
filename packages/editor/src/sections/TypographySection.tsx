import React, { useState } from "react";
import { fgForBg, generateSectionDesignTokens } from "../utils/themeUtils";
import type {
  TypographyState,
  CardStyleState,
  AlertStyleState,
  InteractionStyleState,
  TypoInteractionStyleState,
  CustomFontEntry,
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

export interface TypographySectionProps {
  colors: Record<string, string>;
  typographyState: TypographyState;
  updateTypography: (patch: Partial<TypographyState>) => void;
  selectTypoPreset: (presetKey: string) => void;
  fontOptions: { label: string; value: string }[];
  customFonts: CustomFontEntry[];
  newFontName: string;
  setNewFontName: (v: string) => void;
  fontAddError: string;
  setFontAddError: (v: string) => void;
  fontAddLoading: boolean;
  handleAddCustomFont: () => void;
  handleRemoveCustomFont: (label: string) => void;
  handleResetTypography: () => void;
  typoInteractionStyle: TypoInteractionStyleState;
  updateTypoInteractionStyle: (patch: Partial<TypoInteractionStyleState>) => void;
  selectTypoInteractionPreset: (presetKey: string) => void;
  handleResetTypoInteractionStyle: () => void;
  cardStyle: CardStyleState;
  alertStyle: AlertStyleState;
  interactionStyle: InteractionStyleState;
  upgradeUrl?: string;
  signInUrl?: string;
}

export function TypographySection({
  colors,
  typographyState,
  updateTypography,
  selectTypoPreset,
  fontOptions,
  customFonts,
  newFontName,
  setNewFontName,
  fontAddError,
  setFontAddError,
  fontAddLoading,
  handleAddCustomFont,
  handleRemoveCustomFont,
  handleResetTypography,
  typoInteractionStyle,
  updateTypoInteractionStyle,
  selectTypoInteractionPreset,
  handleResetTypoInteractionStyle,
  cardStyle,
  alertStyle,
  interactionStyle,
  upgradeUrl,
  signInUrl,
}: TypographySectionProps) {
  const [typoCssVisible, setTypoCssVisible] = useState(false);
  const [typoCssCopied, setTypoCssCopied] = useState(false);
  const [typoExportFormat, setTypoExportFormat] = useState<"css" | "tokens">(
    "css",
  );
  const [showTypoResetModal, setShowTypoResetModal] = useState(false);
  const [typoInteractionCssVisible, setTypoInteractionCssVisible] =
    useState(false);
  const [typoInteractionCssCopied, setTypoInteractionCssCopied] =
    useState(false);
  const [typoInteractionExportFormat, setTypoInteractionExportFormat] =
    useState<"css" | "tokens">("css");
  const [showTypoInteractionResetModal, setShowTypoInteractionResetModal] =
    useState(false);

  return (
    <>
      {/* Typography Reset Confirmation Modal */}
      <ResetConfirmModal
        open={showTypoResetModal}
        onClose={() => setShowTypoResetModal(false)}
        onConfirm={handleResetTypography}
        title="Reset Typography?"
        message="This will revert all typography settings to their defaults. Any customizations will be lost."
        id="typo-reset-modal-title"
      />

      {/* Typography section */}
      <div
        id="typography"
        className="min-w-0 space-y-3 mt-6 mb-6 md:mt-16 md:mb-16 scroll-mt-28 lg:scroll-mt-14"
      >
        <h2
          className="text-sm sm:text-base md:text-lg font-bold tracking-wider mb-[5px] flex items-baseline gap-2 ds-text-fg"
        >
          Typography{" "}
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

        {/* Typography controls + interactions stacked */}
        <div className="space-y-6">
          {/* Controls + Preview column */}
          <div
            className="space-y-3 rounded-lg p-4"
            style={{ minWidth: 0 }}
          >
            <div
              className="flex items-center flex-wrap gap-2 sm:gap-4"
              data-axe-exclude
            >
              <h3
                className="text-base font-normal uppercase tracking-wider ds-text-fg"
              >
                Styles
              </h3>
              <div className="ml-auto flex items-center">
                {/* Mobile: dropdown */}
                <CustomSelect
                  ariaLabel="Typography styles actions"
                  className="sm:hidden"
                  placeholder="Actions…"
                  size="sm"
                  width="120px"
                  value=""
                  onChange={(v) => {
                    if (v === "css") { setTypoExportFormat("css"); setTypoCssVisible(true); }
                    else if (v === "tokens") { setTypoExportFormat("tokens"); setTypoCssVisible(true); }
                    else if (v === "reset") setShowTypoResetModal(true);
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
                        if (typoCssVisible && typoExportFormat === "css") {
                          setTypoCssVisible(false);
                          return;
                        }
                        setTypoExportFormat("css");
                        setTypoCssVisible(true);
                      }}
                      className="h-10 px-3 sm:px-4 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                      style={{
                        backgroundColor:
                          typoCssVisible && typoExportFormat === "css"
                            ? "hsl(var(--brand))"
                            : "transparent",
                        color:
                          typoCssVisible && typoExportFormat === "css"
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
                        if (
                          typoCssVisible &&
                          typoExportFormat === "tokens"
                        ) {
                          setTypoCssVisible(false);
                          return;
                        }
                        setTypoExportFormat("tokens");
                        setTypoCssVisible(true);
                      }}
                      className="h-10 px-3 sm:px-4 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                      style={{
                        backgroundColor:
                          typoCssVisible && typoExportFormat === "tokens"
                            ? "hsl(var(--brand))"
                            : "transparent",
                        color:
                          typoCssVisible && typoExportFormat === "tokens"
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
                    onClick={() => setShowTypoResetModal(true)}
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

            {/* Preset buttons */}
            <div
              className="flex flex-wrap gap-2 sm:gap-4 rounded-lg p-3"
              data-axe-exclude
            >
              {(
                [
                  "system",
                  "modern",
                  "classic",
                  "compact",
                  "editorial",
                ] as const
              ).map((key) => {
                const labels: Record<string, string> = {
                  system: "System",
                  modern: "Modern",
                  classic: "Classic",
                  compact: "Compact",
                  editorial: "Editorial",
                };
                const icons: Record<string, React.ReactNode> = {
                  system: (
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
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  modern: (
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
                  classic: (
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  ),
                  compact: (
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
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  ),
                  editorial: (
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
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  ),
                };
                const active = typographyState.preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectTypoPreset(key)}
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

            {/* Typography CSS/Tokens output */}
            {typoCssVisible &&
              (() => {
                const typoCss = `:root {\n  --font-heading: ${typographyState.headingFamily};\n  --font-body: ${typographyState.bodyFamily};\n  --font-size-base: ${typographyState.baseFontSize}px;\n  --font-weight-heading: ${typographyState.headingWeight};\n  --font-weight-body: ${typographyState.bodyWeight};\n  --line-height: ${typographyState.lineHeight};\n  --letter-spacing: ${typographyState.letterSpacing}em;\n  --letter-spacing-heading: ${typographyState.headingLetterSpacing}em;\n}`;
                const typoTokens = JSON.stringify(
                  generateSectionDesignTokens(
                    "typography",
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
                  typoExportFormat === "tokens" ? typoTokens : typoCss;
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
                        {typoExportFormat === "tokens"
                          ? "Typography Tokens"
                          : "Typography CSS"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(output);
                            setTypoCssCopied(true);
                            setTimeout(() => setTypoCssCopied(false), 2000);
                          }}
                          aria-label="Copy" className="p-1 rounded-lg transition-colors hover:opacity-80"
                          style={{
                            backgroundColor: "hsl(var(--muted))",
                            color: colors["--muted"]
                              ? `hsl(${fgForBg(colors["--muted"])})`
                              : "hsl(var(--muted-foreground))",
                          }}
                        >
                          {typoCssCopied ? <CheckIcon /> : <CopyIcon />}
                        </button>
                        <button
                          onClick={() => setTypoCssVisible(false)}
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

            {/* Controls + Preview side-by-side */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Slider controls */}
              <div className="flex-1 min-w-0 space-y-3 order-2 md:order-1">
                {/* Fonts */}
                <div className="space-y-1.5">
                  <p
                    className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                  >
                    Fonts
                  </p>
                  <label
                    className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                  >
                    <span>Heading:</span>
                    <CustomSelect
                      value={typographyState.headingFamily}
                      onChange={(v) => updateTypography({ headingFamily: v })}
                      options={fontOptions.map((opt) => ({ value: opt.value, label: opt.label }))}
                      size="sm"
                      width="160px"
                    />
                  </label>
                  <label
                    className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                  >
                    <span>Body:</span>
                    <CustomSelect
                      value={typographyState.bodyFamily}
                      onChange={(v) => updateTypography({ bodyFamily: v })}
                      options={fontOptions.map((opt) => ({ value: opt.value, label: opt.label }))}
                      size="sm"
                      width="160px"
                    />
                  </label>
                </div>
                {/* Size & Weight */}
                <div className="space-y-1.5">
                  <p
                    className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                  >
                    Size & Weight
                  </p>
                  <label
                    className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                  >
                    <span>Base Size: {typographyState.baseFontSize}px</span>
                    <input
                      type="range"
                      name="base-font-size"
                      min={14}
                      max={22}
                      value={typographyState.baseFontSize}
                      onChange={(e) =>
                        updateTypography({
                          baseFontSize: Number(e.target.value),
                        })
                      }
                      className="w-32 accent-[hsl(var(--brand))]"
                    />
                  </label>
                  <label
                    className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                  >
                    <span>Heading Wt: {typographyState.headingWeight}</span>
                    <input
                      type="range"
                      name="heading-weight"
                      min={100}
                      max={900}
                      step={100}
                      value={typographyState.headingWeight}
                      onChange={(e) =>
                        updateTypography({
                          headingWeight: Number(e.target.value),
                        })
                      }
                      className="w-32 accent-[hsl(var(--brand))]"
                    />
                  </label>
                  <label
                    className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                  >
                    <span>Body Wt: {typographyState.bodyWeight}</span>
                    <input
                      type="range"
                      name="body-weight"
                      min={100}
                      max={900}
                      step={100}
                      value={typographyState.bodyWeight}
                      onChange={(e) =>
                        updateTypography({
                          bodyWeight: Number(e.target.value),
                        })
                      }
                      className="w-32 accent-[hsl(var(--brand))]"
                    />
                  </label>
                </div>
                {/* Spacing */}
                <PremiumGate
                  feature="typography-spacing"
                  variant="section"
                  upgradeUrl={upgradeUrl}
                  signInUrl={signInUrl}
                >
                  <div className="space-y-1.5">
                    <p
                      className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                    >
                      Spacing
                    </p>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>
                        Line Height: {typographyState.lineHeight.toFixed(2)}
                      </span>
                      <input
                        type="range"
                        name="line-height"
                        min={100}
                        max={200}
                        step={5}
                        value={Math.round(typographyState.lineHeight * 100)}
                        onChange={(e) =>
                          updateTypography({
                            lineHeight: Number(e.target.value) / 100,
                          })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>
                        Letter Sp:{" "}
                        {typographyState.letterSpacing.toFixed(2)}em
                      </span>
                      <input
                        type="range"
                        name="letter-spacing"
                        min={-5}
                        max={15}
                        step={1}
                        value={Math.round(
                          typographyState.letterSpacing * 100,
                        )}
                        onChange={(e) =>
                          updateTypography({
                            letterSpacing: Number(e.target.value) / 100,
                          })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>
                        Heading Sp:{" "}
                        {typographyState.headingLetterSpacing.toFixed(2)}em
                      </span>
                      <input
                        type="range"
                        name="heading-letter-spacing"
                        min={-5}
                        max={10}
                        step={1}
                        value={Math.round(
                          typographyState.headingLetterSpacing * 100,
                        )}
                        onChange={(e) =>
                          updateTypography({
                            headingLetterSpacing:
                              Number(e.target.value) / 100,
                          })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                  </div>
                </PremiumGate>
              </div>

              {/* Live preview */}
              <div className="flex-1 min-w-0 flex items-start justify-center pt-2 order-1 md:order-2">
                <div
                  className="w-full md:max-w-[400px] space-y-3"
                  data-axe-exclude
                >
                  {/* Custom font input */}
                  <PremiumGate
                    feature="custom-fonts"
                    variant="inline"
                    upgradeUrl={upgradeUrl}
                    signInUrl={signInUrl}
                  >
                    <div className="space-y-1.5">
                      <label
                        className="flex items-center gap-2 text-sm font-light ds-text-fg"
                      >
                        <span className="whitespace-nowrap">Custom:</span>
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <input
                            type="text"
                            name="custom-font"
                            autoComplete="off"
                            value={newFontName}
                            onChange={(e) => {
                              setNewFontName(e.target.value);
                              setFontAddError("");
                            }}
                            placeholder="Google Font name…"
                            className="flex-1 min-w-0 h-8 px-2 text-sm font-light rounded-md border ds-surface-bg ds-border"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newFontName.trim()) {
                                e.preventDefault();
                                handleAddCustomFont();
                              }
                            }}
                          />
                          <button
                            disabled={fontAddLoading || !newFontName.trim()}
                            onClick={handleAddCustomFont}
                            className="h-8 px-2 text-[12px] font-medium rounded-md border whitespace-nowrap"
                            style={{
                              backgroundColor: "hsl(var(--primary))",
                              color: "hsl(var(--primary-foreground))",
                              borderColor: "hsl(var(--border))",
                              opacity:
                                fontAddLoading || !newFontName.trim()
                                  ? 0.5
                                  : 1,
                            }}
                          >
                            {fontAddLoading ? "…" : "+ Font"}
                          </button>
                        </div>
                      </label>
                      {fontAddError && (
                        <p
                          className="text-[12px] mt-0.5 ds-text-destructive"
                        >
                          {fontAddError}
                        </p>
                      )}
                      {customFonts.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {customFonts.map((f) => (
                            <span
                              key={f.label}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] rounded-md border ds-border ds-text-fg"
                            >
                              {f.label}
                              <button
                                onClick={() =>
                                  handleRemoveCustomFont(f.label)
                                }
                                className="ml-0.5 hover:opacity-70 ds-text-muted"
                                title={`Remove ${f.label}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </PremiumGate>
                  <p
                    className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                  >
                    Preview
                  </p>
                  <div
                    className="w-full rounded-lg p-5 space-y-3 ds-surface"
                  >
                    <h3
                      style={{
                        ...(typographyState.headingFamily !== "inherit" ? { fontFamily: typographyState.headingFamily } : {}),
                        fontSize: `${Math.round(typographyState.baseFontSize * 1.75)}px`,
                        fontWeight: typographyState.headingWeight,
                        lineHeight: typographyState.lineHeight,
                        letterSpacing: `${typographyState.headingLetterSpacing}em`,
                      }}
                    >
                      Heading Text
                    </h3>
                    <h4
                      style={{
                        ...(typographyState.headingFamily !== "inherit" ? { fontFamily: typographyState.headingFamily } : {}),
                        fontSize: `${Math.round(typographyState.baseFontSize * 1.25)}px`,
                        fontWeight: typographyState.headingWeight,
                        lineHeight: typographyState.lineHeight,
                        letterSpacing: `${typographyState.headingLetterSpacing}em`,
                        color: "hsl(var(--card-foreground) / 0.7)",
                      }}
                    >
                      Subheading Text
                    </h4>
                    <p
                      style={{
                        fontFamily: typographyState.bodyFamily,
                        fontSize: `${typographyState.baseFontSize}px`,
                        fontWeight: typographyState.bodyWeight,
                        lineHeight: typographyState.lineHeight,
                        letterSpacing: `${typographyState.letterSpacing}em`,
                      }}
                    >
                      Body text paragraph demonstrating the selected font
                      family, size, weight, and spacing settings in real
                      time.
                    </p>
                    <p
                      style={{
                        fontFamily: typographyState.bodyFamily,
                        fontSize: `${Math.round(typographyState.baseFontSize * 0.8)}px`,
                        fontWeight: typographyState.bodyWeight,
                        lineHeight: typographyState.lineHeight,
                        letterSpacing: `${typographyState.letterSpacing}em`,
                        color: "hsl(var(--card-foreground) / 0.7)",
                      }}
                    >
                      Small / Caption text for secondary information and
                      labels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end Controls + Preview row */}
          </div>
          {/* end Styles column */}

          {/* Typography Interactions column */}
          <div
            className="space-y-3 rounded-lg p-4"
            style={{ minWidth: 0 }}
          >
            <div
              className="flex items-center flex-wrap gap-2 sm:gap-4"
              data-axe-exclude
            >
              <h3
                className="text-base font-normal uppercase tracking-wider ds-text-fg"
              >
                Interactions
              </h3>
              <div className="ml-auto flex items-center">
                {/* Mobile: dropdown */}
                <CustomSelect
                  ariaLabel="Typography interactions actions"
                  className="sm:hidden"
                  placeholder="Actions…"
                  size="sm"
                  width="120px"
                  value=""
                  onChange={(v) => {
                    if (v === "css") { setTypoInteractionExportFormat("css"); setTypoInteractionCssVisible(true); }
                    else if (v === "tokens") { setTypoInteractionExportFormat("tokens"); setTypoInteractionCssVisible(true); }
                    else if (v === "reset") setShowTypoInteractionResetModal(true);
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
                        if (
                          typoInteractionCssVisible &&
                          typoInteractionExportFormat === "css"
                        ) {
                          setTypoInteractionCssVisible(false);
                          return;
                        }
                        setTypoInteractionExportFormat("css");
                        setTypoInteractionCssVisible(true);
                      }}
                      className="h-10 px-3 sm:px-4 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                      style={{
                        backgroundColor:
                          typoInteractionCssVisible &&
                          typoInteractionExportFormat === "css"
                            ? "hsl(var(--brand))"
                            : "transparent",
                        color:
                          typoInteractionCssVisible &&
                          typoInteractionExportFormat === "css"
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
                        if (
                          typoInteractionCssVisible &&
                          typoInteractionExportFormat === "tokens"
                        ) {
                          setTypoInteractionCssVisible(false);
                          return;
                        }
                        setTypoInteractionExportFormat("tokens");
                        setTypoInteractionCssVisible(true);
                      }}
                      className="h-10 px-3 sm:px-4 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                      style={{
                        backgroundColor:
                          typoInteractionCssVisible &&
                          typoInteractionExportFormat === "tokens"
                            ? "hsl(var(--brand))"
                            : "transparent",
                        color:
                          typoInteractionCssVisible &&
                          typoInteractionExportFormat === "tokens"
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
                    onClick={() => setShowTypoInteractionResetModal(true)}
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

            <PremiumGate
              feature="typography-interactions"
              variant="section"
              upgradeUrl={upgradeUrl}
              signInUrl={signInUrl}
            >
              {/* Preset buttons */}
              <div
                className="flex flex-wrap gap-2 sm:gap-4 rounded-lg p-3"
                data-axe-exclude
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
                  const active = typoInteractionStyle.preset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selectTypoInteractionPreset(key)}
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

              {/* Typography Interaction CSS/Tokens output */}
              {typoInteractionCssVisible &&
                (() => {
                  const tiCss = `:root {\n  --link-hover-opacity: ${typoInteractionStyle.linkHoverOpacity};\n  --link-hover-scale: ${typoInteractionStyle.linkHoverScale};\n  --link-active-scale: ${typoInteractionStyle.linkActiveScale};\n  --link-transition-duration: ${typoInteractionStyle.linkTransitionDuration}ms;\n  --link-underline: ${typoInteractionStyle.linkUnderline};\n  --heading-hover-opacity: ${typoInteractionStyle.headingHoverOpacity};\n  --heading-hover-scale: ${typoInteractionStyle.headingHoverScale};\n  --heading-transition-duration: ${typoInteractionStyle.headingTransitionDuration}ms;\n}`;
                  const tiTokens = JSON.stringify(
                    generateSectionDesignTokens(
                      "typo-interactions",
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
                    typoInteractionExportFormat === "tokens"
                      ? tiTokens
                      : tiCss;
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
                          {typoInteractionExportFormat === "tokens"
                            ? "Interaction Tokens"
                            : "Interaction CSS"}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(output);
                              setTypoInteractionCssCopied(true);
                              setTimeout(
                                () => setTypoInteractionCssCopied(false),
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
                            {typoInteractionCssCopied ? <CheckIcon /> : <CopyIcon />}
                          </button>
                          <button
                            onClick={() =>
                              setTypoInteractionCssVisible(false)
                            }
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
                  <div className="space-y-1.5">
                    <p
                      className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                    >
                      Links - Hover
                    </p>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>
                        Opacity: {typoInteractionStyle.linkHoverOpacity}
                      </span>
                      <input
                        type="range"
                        name="link-hover-opacity"
                        min={0.6}
                        max={1}
                        step={0.01}
                        value={typoInteractionStyle.linkHoverOpacity}
                        onChange={(e) =>
                          updateTypoInteractionStyle({
                            linkHoverOpacity: Number(e.target.value),
                          })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>
                        Scale: {typoInteractionStyle.linkHoverScale}
                      </span>
                      <input
                        type="range"
                        name="link-hover-scale"
                        min={1}
                        max={1.1}
                        step={0.005}
                        value={typoInteractionStyle.linkHoverScale}
                        onChange={(e) =>
                          updateTypoInteractionStyle({
                            linkHoverScale: Number(e.target.value),
                          })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>Underline:</span>
                      <CustomSelect
                        value={typoInteractionStyle.linkUnderline}
                        onChange={(v) => updateTypoInteractionStyle({ linkUnderline: v as "always" | "hover" | "none" })}
                        options={[
                          { value: "always", label: "Always" },
                          { value: "hover", label: "On Hover" },
                          { value: "none", label: "Never" },
                        ]}
                        size="sm"
                        width="128px"
                      />
                    </label>
                  </div>
                  <div className="space-y-1.5">
                    <p
                      className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                    >
                      Links - Active
                    </p>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>
                        Scale: {typoInteractionStyle.linkActiveScale}
                      </span>
                      <input
                        type="range"
                        name="link-active-scale"
                        min={0.9}
                        max={1.05}
                        step={0.005}
                        value={typoInteractionStyle.linkActiveScale}
                        onChange={(e) =>
                          updateTypoInteractionStyle({
                            linkActiveScale: Number(e.target.value),
                          })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                  </div>
                  <div className="space-y-1.5">
                    <p
                      className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                    >
                      Headings - Hover
                    </p>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>
                        Opacity: {typoInteractionStyle.headingHoverOpacity}
                      </span>
                      <input
                        type="range"
                        name="heading-hover-opacity"
                        min={0.6}
                        max={1}
                        step={0.01}
                        value={typoInteractionStyle.headingHoverOpacity}
                        onChange={(e) =>
                          updateTypoInteractionStyle({
                            headingHoverOpacity: Number(e.target.value),
                          })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>
                        Scale: {typoInteractionStyle.headingHoverScale}
                      </span>
                      <input
                        type="range"
                        name="heading-hover-scale"
                        min={1}
                        max={1.05}
                        step={0.005}
                        value={typoInteractionStyle.headingHoverScale}
                        onChange={(e) =>
                          updateTypoInteractionStyle({
                            headingHoverScale: Number(e.target.value),
                          })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                  </div>
                  <div className="space-y-1.5">
                    <p
                      className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                    >
                      Timing
                    </p>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>
                        Link Duration:{" "}
                        {typoInteractionStyle.linkTransitionDuration}ms
                      </span>
                      <input
                        type="range"
                        name="link-transition-duration"
                        min={0}
                        max={500}
                        step={10}
                        value={typoInteractionStyle.linkTransitionDuration}
                        onChange={(e) =>
                          updateTypoInteractionStyle({
                            linkTransitionDuration: Number(e.target.value),
                          })
                        }
                        className="w-32 accent-[hsl(var(--brand))]"
                      />
                    </label>
                    <label
                      className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                    >
                      <span>
                        Heading Duration:{" "}
                        {typoInteractionStyle.headingTransitionDuration}ms
                      </span>
                      <input
                        type="range"
                        name="heading-transition-duration"
                        min={0}
                        max={500}
                        step={10}
                        value={
                          typoInteractionStyle.headingTransitionDuration
                        }
                        onChange={(e) =>
                          updateTypoInteractionStyle({
                            headingTransitionDuration: Number(
                              e.target.value,
                            ),
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
                      className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                    >
                      Preview
                    </p>
                    <div
                      className="space-y-4 rounded-lg p-4 ds-surface"
                    >
                      <h3
                        className="cursor-default"
                        style={{
                          ...(typographyState.headingFamily !== "inherit" ? { fontFamily: typographyState.headingFamily } : {}),
                          fontSize: `${Math.round(typographyState.baseFontSize * 1.5)}px`,
                          fontWeight: typographyState.headingWeight,
                          transition: `opacity ${typoInteractionStyle.headingTransitionDuration}ms ease, transform ${typoInteractionStyle.headingTransitionDuration}ms ease`,
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.opacity = String(
                            typoInteractionStyle.headingHoverOpacity,
                          );
                          (e.target as HTMLElement).style.transform =
                            `scale(${typoInteractionStyle.headingHoverScale})`;
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.opacity = "1";
                          (e.target as HTMLElement).style.transform =
                            "scale(1)";
                        }}
                      >
                        Heading Example
                      </h3>
                      <p
                        style={{
                          fontFamily: typographyState.bodyFamily,
                          fontSize: `${typographyState.baseFontSize}px`,
                          fontWeight: typographyState.bodyWeight,
                        }}
                      >
                        Body text with a{" "}
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          style={{
                            color: "hsl(var(--brand))",
                            textDecoration:
                              typoInteractionStyle.linkUnderline ===
                              "always"
                                ? "underline"
                                : "none",
                            transition: `opacity ${typoInteractionStyle.linkTransitionDuration}ms ease, transform ${typoInteractionStyle.linkTransitionDuration}ms ease`,
                            display: "inline-block",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.opacity =
                              String(typoInteractionStyle.linkHoverOpacity);
                            (e.target as HTMLElement).style.transform =
                              `scale(${typoInteractionStyle.linkHoverScale})`;
                            (e.target as HTMLElement).style.textDecoration =
                              typoInteractionStyle.linkUnderline !== "none"
                                ? "underline"
                                : "none";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.opacity = "1";
                            (e.target as HTMLElement).style.transform =
                              "scale(1)";
                            (e.target as HTMLElement).style.textDecoration =
                              typoInteractionStyle.linkUnderline ===
                              "always"
                                ? "underline"
                                : "none";
                          }}
                          onMouseDown={(e) => {
                            (e.target as HTMLElement).style.transform =
                              `scale(${typoInteractionStyle.linkActiveScale})`;
                          }}
                          onMouseUp={(e) => {
                            (e.target as HTMLElement).style.transform =
                              `scale(${typoInteractionStyle.linkHoverScale})`;
                          }}
                        >
                          sample link
                        </a>{" "}
                        and another{" "}
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          style={{
                            color: "hsl(var(--brand))",
                            textDecoration:
                              typoInteractionStyle.linkUnderline ===
                              "always"
                                ? "underline"
                                : "none",
                            transition: `opacity ${typoInteractionStyle.linkTransitionDuration}ms ease, transform ${typoInteractionStyle.linkTransitionDuration}ms ease`,
                            display: "inline-block",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.opacity =
                              String(typoInteractionStyle.linkHoverOpacity);
                            (e.target as HTMLElement).style.transform =
                              `scale(${typoInteractionStyle.linkHoverScale})`;
                            (e.target as HTMLElement).style.textDecoration =
                              typoInteractionStyle.linkUnderline !== "none"
                                ? "underline"
                                : "none";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.opacity = "1";
                            (e.target as HTMLElement).style.transform =
                              "scale(1)";
                            (e.target as HTMLElement).style.textDecoration =
                              typoInteractionStyle.linkUnderline ===
                              "always"
                                ? "underline"
                                : "none";
                          }}
                          onMouseDown={(e) => {
                            (e.target as HTMLElement).style.transform =
                              `scale(${typoInteractionStyle.linkActiveScale})`;
                          }}
                          onMouseUp={(e) => {
                            (e.target as HTMLElement).style.transform =
                              `scale(${typoInteractionStyle.linkHoverScale})`;
                          }}
                        >
                          navigation link
                        </a>{" "}
                        to test hover states.
                      </p>
                      <p
                        className="text-[12px] font-light ds-text-muted"
                      >
                        Hover over the heading and links to preview
                        interaction states.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </PremiumGate>
          </div>
          {/* end Typography Interactions column */}
        </div>
        {/* end side-by-side row */}

        {/* Typography Interaction Reset Modal */}
        <ResetConfirmModal
          open={showTypoInteractionResetModal}
          onClose={() => setShowTypoInteractionResetModal(false)}
          onConfirm={handleResetTypoInteractionStyle}
          title="Reset Interactions?"
          message="This will restore the default typography interaction styles."
          id="typo-interaction-reset-modal-title"
        />
      </div>
    </>
  );
}

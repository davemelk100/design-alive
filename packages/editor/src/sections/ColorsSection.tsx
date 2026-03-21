import React from "react";
import {
  contrastRatio,
  hslStringToHex,
  fgForBg,
  generateDesignTokens,
} from "../utils/themeUtils";
import type {
  CardStyleState,
  TypographyState,
  AlertStyleState,
  InteractionStyleState,
} from "../utils/themeUtils";
import { CustomSelect } from "../components/CustomSelect";
import { ExportCodeBlock } from "../components/ExportCodeBlock";
import { PremiumGate } from "../components/PremiumGate";
import { BREAKPOINTS } from "../utils/breakpoints";
import { copyToClipboard } from "../utils/clipboard";

export const COLOR_SWATCHES = [
  { key: "--brand", label: "Primary" },
  { key: "--secondary", label: "Secondary" },
  { key: "--accent", label: "Accent" },
  { key: "--background", label: "Background" },
  { key: "--foreground", label: "Foreground" },
  { key: "--primary-foreground", label: "Primary FG" },
  { key: "--secondary-foreground", label: "Secondary FG" },
  { key: "--muted", label: "Muted" },
  { key: "--muted-foreground", label: "Muted FG" },
  { key: "--accent-foreground", label: "Accent FG" },
  { key: "--destructive", label: "Destructive" },
  { key: "--destructive-foreground", label: "Destructive FG" },
  { key: "--success", label: "Success" },
  { key: "--success-foreground", label: "Success FG" },
  { key: "--warning", label: "Warning" },
  { key: "--warning-foreground", label: "Warning FG" },
  { key: "--border", label: "Border" },
];

/** Maps each swatch bg key to the CSS variable used for its text color. */
const SWATCH_FG_MAP: Record<string, string> = {
  "--brand": "--brand-foreground",
  "--secondary": "--secondary-foreground",
  "--accent": "--accent-foreground",
  "--background": "--foreground",
  "--foreground": "--background",
  "--primary-foreground": "--primary",
  "--secondary-foreground": "--secondary",
  "--muted": "--muted-foreground",
  "--muted-foreground": "--muted",
  "--accent-foreground": "--accent",
  "--destructive": "--destructive-foreground",
  "--destructive-foreground": "--destructive",
  "--success": "--success-foreground",
  "--success-foreground": "--success",
  "--warning": "--warning-foreground",
  "--warning-foreground": "--warning",
  "--border": "--foreground",
};

export interface ColorsSectionProps {
  colors: Record<string, string>;
  lockedKeys: Set<string>;
  setLockedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  generatedCode: string | null;
  setGeneratedCode: React.Dispatch<React.SetStateAction<string | null>>;
  exportFormat: "css" | "tokens";
  setExportFormat: React.Dispatch<React.SetStateAction<"css" | "tokens">>;
  codeCopied: boolean;
  setCodeCopied: React.Dispatch<React.SetStateAction<boolean>>;
  generateCode: () => void;
  handleColorChange: (key: string, hex: string) => void;
  handleImagePalette: (file: File) => void;
  setShowResetModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowImagePaletteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMobilePickerKey: React.Dispatch<React.SetStateAction<string | null>>;
  setMobilePickerHex: React.Dispatch<React.SetStateAction<string>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  cardStyle: CardStyleState;
  typographyState: TypographyState;
  alertStyle: AlertStyleState;
  interactionStyle: InteractionStyleState;
  upgradeUrl?: string;
  signInUrl?: string;
}

export function ColorsSection({
  colors,
  lockedKeys,
  setLockedKeys,
  generatedCode,
  setGeneratedCode,
  exportFormat,
  setExportFormat,
  codeCopied,
  setCodeCopied,
  generateCode,
  handleColorChange,
  handleImagePalette,
  setShowResetModal,
  setShowImagePaletteModal,
  setMobilePickerKey,
  setMobilePickerHex,
  fileInputRef,
  cardStyle,
  typographyState,
  alertStyle,
  upgradeUrl,
  signInUrl,
  interactionStyle,
}: ColorsSectionProps) {
  // Compute the code for the export block
  const exportCode = generatedCode
    ? exportFormat === "tokens"
      ? JSON.stringify(
          generateDesignTokens(
            colors,
            cardStyle,
            typographyState,
            alertStyle,
            interactionStyle,
          ),
          null,
          2,
        )
      : generatedCode
    : "";

  const exportLabel = exportFormat === "tokens" ? "Design Tokens" : "CSS";

  return (
          <div
            id="colors"
            className="min-w-0 space-y-3 mb-6 md:mt-0 md:mb-16 scroll-mt-40 lg:scroll-mt-24"
          >
            <div
              className="flex items-center flex-wrap gap-2 sm:gap-4"
              data-axe-exclude
            >
              <h2
                className="text-sm sm:text-base md:text-lg font-bold tracking-wider mb-[5px] flex items-baseline gap-2 ds-text-fg"
              >
                Colors{" "}
                <a
                  href="#top"
                  className="ds-h2-link opacity-30"
                  aria-label="Back to top"
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById("top"); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 160; window.scrollTo({ top: Math.max(0, y), behavior: "smooth" }); } }}
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
                {/* Mobile: dropdown (Colors section actions only) */}
                <CustomSelect
                  ariaLabel="Colors actions"
                  className="sm:hidden"
                  placeholder="Actions…"
                  size="sm"
                  width="120px"
                  value=""
                  onChange={(v) => {
                    if (v === "css") { setExportFormat("css"); generateCode(); }
                    else if (v === "tokens") { setExportFormat("tokens"); generateCode(); }
                    else if (v === "reset") setShowResetModal(true);
                  }}
                  options={[
                    { value: "css", label: "CSS" },
                    { value: "tokens", label: "Tokens" },
                    { value: "reset", label: "Reset" },
                  ]}
                />
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image-upload"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setShowImagePaletteModal(false);
                      handleImagePalette(file);
                    }
                    e.target.value = "";
                  }}
                />
                {/* Desktop: buttons */}
                <div className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2">
                  <div
                    className="flex items-center rounded-lg overflow-hidden border ds-border"
                  >
                    <button
                      onClick={() => {
                        if (generatedCode && exportFormat === "css") {
                          setGeneratedCode(null);
                          return;
                        }
                        setExportFormat("css");
                        generateCode();
                      }}
                      className={`h-10 px-3 sm:px-4 text-sm transition-colors hover:opacity-70 flex items-center justify-center gap-1 ${generatedCode && exportFormat === "css" ? "" : "ds-text-subtle"}`}
                      style={
                        generatedCode && exportFormat === "css"
                          ? {
                              backgroundColor: "hsl(var(--brand))",
                              color: colors["--brand"]
                                ? `hsl(${fgForBg(colors["--brand"])})`
                                : "hsl(var(--primary-foreground))",
                            }
                          : { backgroundColor: "transparent" }
                      }
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
                        if (generatedCode && exportFormat === "tokens") {
                          setGeneratedCode(null);
                          return;
                        }
                        setExportFormat("tokens");
                        generateCode();
                      }}
                      className={`h-10 px-3 sm:px-4 text-sm transition-colors hover:opacity-70 flex items-center justify-center gap-1 ${generatedCode && exportFormat === "tokens" ? "" : "ds-text-subtle"}`}
                      style={
                        generatedCode && exportFormat === "tokens"
                          ? {
                              backgroundColor: "hsl(var(--brand))",
                              color: colors["--brand"]
                                ? `hsl(${fgForBg(colors["--brand"])})`
                                : "hsl(var(--primary-foreground))",
                            }
                          : { backgroundColor: "transparent" }
                      }
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
                    onClick={() => setShowResetModal(true)}
                    className="h-10 px-2 sm:px-3 text-sm rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1 ds-text-subtle"
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
              className="rounded-xl p-4 sm:p-6 space-y-3"
            >
              {/* Color swatch buttons */}
              <div
                id="color-swatch-grid"
                className="grid grid-cols-5 gap-2 sm:gap-5 rounded-lg p-4 overflow-visible"
                data-axe-exclude
                style={{ backgroundColor: "hsl(var(--foreground) / 0.04)" }}
              >
                {COLOR_SWATCHES.filter(({ key }) =>
                  [
                    "--brand",
                    "--secondary",
                    "--accent",
                    "--background",
                    "--foreground",
                  ].includes(key),
                ).map(({ key, label }) => {
                  const hsl = colors[key];
                  const bgHsl = hsl || "0 0% 50%";
                  const fgKey = SWATCH_FG_MAP[key];
                  const fgHsl = fgKey ? colors[fgKey] : undefined;
                  const wc = contrastRatio("0 0% 100%", bgHsl);
                  const bc = contrastRatio("0 0% 0%", bgHsl);
                  const inputId = `brand-btn-color-input-${key}`;
                  const hexCode = hsl ? hslStringToHex(hsl) : "";
                  const isLocked = lockedKeys.has(key);
                  const canLock = isLocked || lockedKeys.size < 4;
                  return (
                    <div
                      key={key}
                      className="flex flex-col items-stretch overflow-visible"
                    >
                      <span
                        className="sm:hidden text-xs text-center truncate mb-0.5 ds-text-muted"
                      >
                        {label}
                      </span>
                      <div
                        className="relative group flex flex-col sm:flex-row items-stretch rounded-lg overflow-visible"
                        style={{
                          boxShadow:
                            "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <button
                          aria-label={`${label} color swatch`}
                          className="w-full aspect-square text-xs sm:text-sm transition-colors hover:opacity-80 flex flex-col items-center justify-center gap-0.5 cursor-pointer rounded-tl-lg rounded-tr-lg sm:rounded-tr-none sm:rounded-bl-lg"
                          style={{
                            backgroundColor: hsl ? `hsl(${hsl})` : "hsl(var(--muted))",
                            color: fgHsl ? `hsl(${fgHsl})` : (wc >= bc ? "#ffffff" : "#000000"),
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Force scroll to absolute top using every method
                            window.scrollTo(0, 0);
                            document.documentElement.scrollTop = 0;
                            document.body.scrollTop = 0;
                            // Also scroll any parent overflow containers
                            let el: HTMLElement | null = e.currentTarget as HTMLElement;
                            while (el) {
                              el.scrollTop = 0;
                              el = el.parentElement;
                            }
                            const isMobile = window.innerWidth < BREAKPOINTS.sm;
                            if (isMobile) {
                              setTimeout(() => {
                                setMobilePickerKey(key);
                                setMobilePickerHex(hsl ? hslStringToHex(hsl) : "#000000");
                              }, 100);
                              return;
                            }
                            setTimeout(() => {
                              const input = document.getElementById(
                                inputId,
                              ) as HTMLInputElement | null;
                              input?.click();
                            }, 100);
                          }}
                        >
                          <span className="hidden sm:inline whitespace-nowrap leading-tight">
                            {label}
                          </span>
                          {hexCode && (
                            <span className="hidden sm:inline whitespace-nowrap text-sm leading-tight">
                              {hexCode}
                            </span>
                          )}
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <input
                          id={inputId}
                          type="color"
                          aria-label={`Select ${label} color`}
                          value={
                            colors[key]
                              ? hslStringToHex(colors[key])
                              : "#000000"
                          }
                          onChange={(e) =>
                            handleColorChange(key, e.target.value)
                          }
                          className="absolute inset-0 opacity-0 pointer-events-none"
                          style={{ width: "100%", height: "calc(100% - 24px)", pointerEvents: "none" }}
                          tabIndex={-1}
                        />
                        <button
                          className={`h-6 sm:h-auto sm:w-8 flex items-center justify-center transition-all rounded-bl-lg rounded-br-lg sm:rounded-bl-none sm:rounded-tr-lg cursor-pointer ${isLocked ? (wc >= bc ? "ds-swatch-light" : "ds-swatch-dark") : ""}`}
                          style={{
                            backgroundColor: isLocked
                              ? `hsl(${bgHsl})`
                              : "rgba(0,0,0,0.08)",
                            color: isLocked
                              ? undefined
                              : "hsl(var(--foreground) / 0.6)",
                            opacity: canLock ? 1 : 0.3,
                          }}
                          onClick={() => {
                            if (!canLock) return;
                            setLockedKeys((prev) => {
                              const next = new Set(prev);
                              if (next.has(key)) next.delete(key);
                              else next.add(key);
                              return next;
                            });
                          }}
                          title={
                            isLocked
                              ? `Unlock ${label}`
                              : lockedKeys.size >= 4
                                ? "Max 4 locks"
                                : `Lock ${label}`
                          }
                          aria-label={
                            isLocked
                              ? `Unlock ${label} color`
                              : `Lock ${label} color`
                          }
                        >
                          {isLocked ? (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
                            >
                              <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                                ry="2"
                              />
                              <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
                            >
                              <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                                ry="2"
                              />
                              <path d="M7 11V7a5 5 0 019.9-1" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Generated code output */}
              <ExportCodeBlock
                visible={!!generatedCode}
                code={exportCode}
                copied={codeCopied}
                onCopy={() => {
                  copyToClipboard(exportCode);
                  setCodeCopied(true);
                  setTimeout(() => setCodeCopied(false), 2000);
                }}
                onClose={() => setGeneratedCode(null)}
                label={exportLabel}
                mutedColor={colors["--muted"]}
                fgForBg={fgForBg}
              />

              {/* Controls + Preview */}
              <div className="flex flex-col gap-4 md:gap-6">
                {/* Palette (own row) — Pro feature */}
                <PremiumGate feature="secondary-palette" variant="section" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
                <div className="w-full" data-axe-exclude>
                  <p
                    className="text-sm uppercase tracking-wider mb-2 md:mb-3 ds-text-muted"
                  >
                    Palette
                  </p>
                  <div className="grid grid-cols-6 gap-2 md:grid-cols-[repeat(auto-fit,minmax(76px,1fr))] md:gap-3">
                    {COLOR_SWATCHES.filter(
                      ({ key }) =>
                        ![
                          "--brand",
                          "--secondary",
                          "--accent",
                          "--background",
                          "--foreground",
                        ].includes(key),
                    ).map(({ key, label }) => {
                      const hsl = colors[key];
                      const bgHsl = hsl || "0 0% 50%";
                      const fgKey = SWATCH_FG_MAP[key];
                      const fgHsl = fgKey ? colors[fgKey] : undefined;
                      const wc = contrastRatio("0 0% 100%", bgHsl);
                      const bc = contrastRatio("0 0% 0%", bgHsl);
                      const hexCode = hsl ? hslStringToHex(hsl) : "";
                      const initials = label
                        .split(/\s+/)
                        .map((w) => w[0])
                        .join("");
                      return (
                        <div
                          key={key}
                          data-color-key={key}
                          className="text-left"
                        >
                          <p
                            className="sm:hidden text-xs text-center mb-0.5 ds-text-muted"
                          >
                            {initials}
                          </p>
                          <div className="relative w-full aspect-square rounded-md mb-1 overflow-hidden flex items-center justify-center shadow-md">
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundColor: hsl
                                  ? `hsl(${hsl})`
                                  : undefined,
                              }}
                            />
                            <span
                              className="relative hidden sm:inline text-sm truncate"
                              style={{ color: fgHsl ? `hsl(${fgHsl})` : (wc >= bc ? "#ffffff" : "#000000") }}
                            >
                              {hexCode}
                            </span>
                          </div>
                          <p className="hidden md:block text-sm truncate" style={{ color: colors["--background"] ? `hsl(${fgForBg(colors["--background"])})` : undefined }}>
                            {label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                </PremiumGate>

                {/* Chips / Badges row */}
                <div className="w-full space-y-2" data-audit-target>
                  <p
                    className="text-sm uppercase tracking-wider ds-text-subtle"
                  >
                    Chips / Badges
                  </p>
                  <div className="flex flex-row flex-wrap gap-1.5 items-start">
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--brand))",
                        color: colors["--brand"]
                          ? `hsl(${fgForBg(colors["--brand"])})`
                          : "white",
                      }}
                    >
                      Brand
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--secondary))",
                        color: "hsl(var(--secondary-foreground))",
                      }}
                    >
                      Secondary
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--muted))",
                        color: colors["--muted"]
                          ? `hsl(${fgForBg(colors["--muted"])})`
                          : "hsl(var(--muted-foreground))",
                      }}
                    >
                      Muted
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--accent))",
                        color: "hsl(var(--accent-foreground))",
                      }}
                    >
                      Accent
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--destructive))",
                        color: "hsl(var(--destructive-foreground))",
                      }}
                    >
                      Destructive
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--success))",
                        color: "hsl(var(--success-foreground))",
                      }}
                    >
                      Success
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--warning))",
                        color: "hsl(var(--warning-foreground))",
                      }}
                    >
                      Warning
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--brand))",
                        color: colors["--brand"]
                          ? `hsl(${fgForBg(colors["--brand"])})`
                          : "white",
                      }}
                    >
                      Brand
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--secondary))",
                        color: "hsl(var(--secondary-foreground))",
                      }}
                    >
                      Secondary
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--muted))",
                        color: colors["--muted"]
                          ? `hsl(${fgForBg(colors["--muted"])})`
                          : "hsl(var(--muted-foreground))",
                      }}
                    >
                      Muted
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--accent))",
                        color: "hsl(var(--accent-foreground))",
                      }}
                    >
                      Accent
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--destructive))",
                        color: "hsl(var(--destructive-foreground))",
                      }}
                    >
                      Destructive
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--success))",
                        color: "hsl(var(--success-foreground))",
                      }}
                    >
                      Success
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-sm max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--warning))",
                        color: "hsl(var(--warning-foreground))",
                      }}
                    >
                      Warning
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-sm border border-border max-w-full truncate ds-text-fg"
                    >
                      Outlined
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
  );
}

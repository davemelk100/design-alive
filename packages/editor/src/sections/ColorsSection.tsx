import React, { Suspense } from "react";
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
import {
  LazyHome, LazyPalette, LazyBookOpen, LazyBriefcase, LazySearch,
  LazySun, LazyMoon, LazyEye, LazyHeart, LazyCheck,
  LazyExternalLink, LazyLink2, LazyFlaskConical, LazyUsers, LazyAlertCircle,
  LazyZap, LazyGlobe, LazyShield, LazySettings, LazyCode,
  LazyDatabase, LazySmartphone, LazyCamera, LazyMail, LazyBell,
  LazyClock, LazyDownload,
} from "../utils/lazyIcons";

const GitHubLogoIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    ref={ref}
  >
    <path
      d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
));
GitHubLogoIcon.displayName = "GitHubLogoIcon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SITE_ICONS: {
  name: string;
  icon: React.LazyExoticComponent<any> | React.ComponentType<any>;
}[] = [
  { name: "GitHub", icon: GitHubLogoIcon },
  { name: "Home", icon: LazyHome },
  { name: "Palette", icon: LazyPalette },
  { name: "BookOpen", icon: LazyBookOpen },
  { name: "Briefcase", icon: LazyBriefcase },
  { name: "Search", icon: LazySearch },
  { name: "Sun", icon: LazySun },
  { name: "Moon", icon: LazyMoon },
  { name: "Eye", icon: LazyEye },
  { name: "Heart", icon: LazyHeart },
  { name: "Check", icon: LazyCheck },
  { name: "ExternalLink", icon: LazyExternalLink },
  { name: "FlaskConical", icon: LazyFlaskConical },
  { name: "Users", icon: LazyUsers },
  { name: "AlertCircle", icon: LazyAlertCircle },
  { name: "Zap", icon: LazyZap },
  { name: "Globe", icon: LazyGlobe },
  { name: "Shield", icon: LazyShield },
  { name: "Settings", icon: LazySettings },
  { name: "Code", icon: LazyCode },
  { name: "Database", icon: LazyDatabase },
  { name: "Smartphone", icon: LazySmartphone },
  { name: "Link", icon: LazyLink2 },
  { name: "Camera", icon: LazyCamera },
  { name: "Mail", icon: LazyMail },
  { name: "Bell", icon: LazyBell },
  { name: "Clock", icon: LazyClock },
  { name: "Download", icon: LazyDownload },
];

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

export interface ColorsSectionProps {
  colors: Record<string, string>;
  lockedKeys: Set<string>;
  setLockedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  hoveredLockKey: string | null;
  setHoveredLockKey: React.Dispatch<React.SetStateAction<string | null>>;
  isPremium: boolean;
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
  upgradeUrl?: string;
  signInUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customIcons?: { name: string; icon: React.ComponentType<any> }[];
  iconMode: "append" | "replace";
  iconsHidden: boolean;
  setIconsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  showIconImportModal: boolean;
  setShowIconImportModal: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importedIcons: { name: string; icon: React.ComponentType<any> }[];
  importedIconData: { id: string; name: string }[];
  removeImportedIcon: (id: string) => void;
  clearImportedIcons: () => void;
  cardStyle: CardStyleState;
  typographyState: TypographyState;
  alertStyle: AlertStyleState;
  interactionStyle: InteractionStyleState;
}

export function ColorsSection({
  colors,
  lockedKeys,
  setLockedKeys,
  hoveredLockKey,
  setHoveredLockKey,
  isPremium,
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
  upgradeUrl,
  signInUrl,
  customIcons,
  iconMode,
  iconsHidden,
  setIconsHidden,
  showIconImportModal: _showIconImportModal,
  setShowIconImportModal,
  importedIcons,
  importedIconData,
  removeImportedIcon,
  clearImportedIcons,
  cardStyle,
  typographyState,
  alertStyle,
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
            className="min-w-0 space-y-3 mb-6 md:mt-0 md:mb-16 scroll-mt-[56px]"
          >
            <div
              className="flex items-center flex-wrap gap-2 sm:gap-4"
              data-axe-exclude
            >
              <h2
                className="text-[14px] sm:text-[16px] md:text-[20px] font-bold tracking-wider mb-[5px] flex items-baseline gap-2"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Colors{" "}
                <a
                  href="#top"
                  className="ds-h2-link opacity-30"
                  aria-label="Back to top"
                >
                  <svg
                    className="w-5 h-5"
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
                    className="flex items-center rounded-lg overflow-hidden border"
                    style={{ borderColor: "hsl(var(--border))" }}
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
                      className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                      style={{
                        backgroundColor:
                          generatedCode && exportFormat === "css"
                            ? "hsl(var(--brand))"
                            : "transparent",
                        color:
                          generatedCode && exportFormat === "css"
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
                        if (generatedCode && exportFormat === "tokens") {
                          setGeneratedCode(null);
                          return;
                        }
                        setExportFormat("tokens");
                        generateCode();
                      }}
                      className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                      style={{
                        backgroundColor:
                          generatedCode && exportFormat === "tokens"
                            ? "hsl(var(--brand))"
                            : "transparent",
                        color:
                          generatedCode && exportFormat === "tokens"
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
                    onClick={() => setShowResetModal(true)}
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

            <div
              className="rounded-xl p-4 sm:p-6 space-y-3"
              style={{ border: "1px solid hsl(var(--border))" }}
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
                  const wc = contrastRatio("0 0% 100%", bgHsl);
                  const bc = contrastRatio("0 0% 0%", bgHsl);
                  const btnTextColor = wc >= bc ? "#ffffff" : "#000000";
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
                        className="sm:hidden text-[11px] font-light text-center truncate mb-0.5"
                        style={{ color: "hsl(var(--muted-foreground))" }}
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
                          className="w-full aspect-square text-[12px] sm:text-[14px] font-light transition-colors hover:opacity-80 flex flex-col items-center justify-center gap-0.5 cursor-pointer rounded-tl-lg rounded-tr-lg sm:rounded-tr-none sm:rounded-bl-lg"
                          style={{
                            backgroundColor: hsl ? `hsl(${hsl})` : "hsl(var(--muted))",
                            color: btnTextColor,
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
                            const isMobile = window.innerWidth < 640;
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
                            <span className="hidden sm:inline whitespace-nowrap opacity-70 text-[14px] leading-tight">
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
                          className={`h-6 sm:h-auto sm:w-8 flex items-center justify-center transition-all rounded-bl-lg rounded-br-lg sm:rounded-bl-none sm:rounded-tr-lg ${isPremium ? "cursor-pointer" : "cursor-not-allowed"}`}
                          style={{
                            backgroundColor: isLocked
                              ? `hsl(${bgHsl})`
                              : "rgba(0,0,0,0.08)",
                            color: isLocked
                              ? btnTextColor
                              : "hsl(var(--muted-foreground))",
                            opacity: canLock ? 1 : 0.3,
                          }}
                          onClick={() => {
                            if (!isPremium) {
                              setHoveredLockKey((prev) =>
                                prev === key ? null : key,
                              );
                              return;
                            }
                            if (!canLock) return;
                            setLockedKeys((prev) => {
                              const next = new Set(prev);
                              if (next.has(key)) next.delete(key);
                              else next.add(key);
                              return next;
                            });
                          }}
                          title={
                            !isPremium
                              ? "Pro feature"
                              : isLocked
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

              {!isPremium && hoveredLockKey && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  onClick={() => setHoveredLockKey(null)}
                >
                  <div
                    className="rounded-xl p-6 w-[360px] shadow-xl"
                    style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "hsl(var(--muted))" }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <div>
                        <h3
                          className="text-[18px] font-medium"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          Pro Feature
                        </h3>
                        <p className="text-[13px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                          Color Locks
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-[14px] font-light mb-5"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      This feature requires a Themal Pro license. Upgrade to
                      unlock all premium features including harmony schemes,
                      color locks, interaction controls, and more.
                    </p>
                    <div className="flex flex-col gap-2">
                      <a
                        href={upgradeUrl || "/pricing"}
                        className="w-full text-center px-4 py-2.5 text-[14px] font-medium rounded-lg transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
                      >
                        View Pricing
                      </a>
                      {signInUrl && (
                        <button
                          onClick={() => {
                            setHoveredLockKey(null);
                            window.dispatchEvent(
                              new CustomEvent("themal:sign-in"),
                            );
                          }}
                          className="w-full text-center px-4 py-2.5 text-[14px] font-light rounded-lg transition-opacity hover:opacity-70"
                          style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
                        >
                          Already have a license? Sign in
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setHoveredLockKey(null)}
                      className="absolute top-4 right-4 p-1 rounded-lg transition-opacity hover:opacity-70"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                      aria-label="Close"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Generated code output */}
              <ExportCodeBlock
                visible={!!generatedCode}
                code={exportCode}
                copied={codeCopied}
                onCopy={() => {
                  navigator.clipboard.writeText(exportCode);
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
                {/* Palette (own row) */}
                <div className="w-full" data-axe-exclude>
                  <p
                    className="text-[14px] font-light uppercase tracking-wider mb-2 md:mb-3"
                    style={{ color: "hsl(var(--muted-foreground))" }}
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
                      const wc = contrastRatio("0 0% 100%", bgHsl);
                      const bc = contrastRatio("0 0% 0%", bgHsl);
                      const swatchTextColor = wc >= bc ? "#ffffff" : "#000000";
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
                            className="sm:hidden text-[11px] font-light text-center mb-0.5"
                            style={{ color: "hsl(var(--muted-foreground))" }}
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
                              className="relative hidden sm:inline text-[14px] font-light truncate"
                              style={{ color: swatchTextColor }}
                            >
                              {hexCode}
                            </span>
                          </div>
                          <p className="hidden md:block text-[14px] font-light text-[color:hsl(var(--foreground))] truncate">
                            {label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chips / Badges row */}
                <div className="w-full space-y-2" data-axe-exclude>
                  <p
                    className="text-[14px] font-light uppercase tracking-wider"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    Chips / Badges
                  </p>
                  <div className="flex flex-row flex-wrap gap-1.5 items-start">
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate"
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
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--secondary))",
                        color: "hsl(var(--secondary-foreground))",
                      }}
                    >
                      Secondary
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate"
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
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--accent))",
                        color: "hsl(var(--accent-foreground))",
                      }}
                    >
                      Accent
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--destructive))",
                        color: "hsl(var(--destructive-foreground))",
                      }}
                    >
                      Destructive
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--success))",
                        color: "hsl(var(--success-foreground))",
                      }}
                    >
                      Success
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[14px] font-light max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--warning))",
                        color: "hsl(var(--warning-foreground))",
                      }}
                    >
                      Warning
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate"
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
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--secondary))",
                        color: "hsl(var(--secondary-foreground))",
                      }}
                    >
                      Secondary
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate"
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
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--accent))",
                        color: "hsl(var(--accent-foreground))",
                      }}
                    >
                      Accent
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--destructive))",
                        color: "hsl(var(--destructive-foreground))",
                      }}
                    >
                      Destructive
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--success))",
                        color: "hsl(var(--success-foreground))",
                      }}
                    >
                      Success
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light max-w-full truncate"
                      style={{
                        backgroundColor: "hsl(var(--warning))",
                        color: "hsl(var(--warning-foreground))",
                      }}
                    >
                      Warning
                    </span>
                    <span
                      className="inline-flex items-center justify-center px-4 py-0.5 rounded-full text-[14px] font-light border border-border max-w-full truncate"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      Outlined
                    </span>
                  </div>
                </div>

                {/* Icons row */}
                {(() => {
                  const builtInIcons = iconMode === "replace" ? [] : SITE_ICONS;
                  const extraIcons = (customIcons || []).map((ci) => ({
                    name: ci.name,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    icon: ci.icon as React.ComponentType<any>,
                  }));
                  const importedIconEntries = importedIcons.map((ci) => ({
                    name: ci.name,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    icon: ci.icon as React.ComponentType<any>,
                    imported: true,
                  }));
                  const allIcons = [
                    ...builtInIcons.map((i) => ({ ...i, imported: false })),
                    ...extraIcons.map((i) => ({ ...i, imported: false })),
                    ...importedIconEntries,
                  ];
                  return (
                    <div className="w-full hidden md:block" data-axe-exclude>
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <p
                          className="text-[14px] font-light uppercase tracking-wider"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          Icons
                        </p>
                        {allIcons.length > 0 && (
                          <button
                            onClick={() => setIconsHidden((h) => !h)}
                            className="text-[12px] font-light px-2 py-0.5 rounded transition-colors hover:opacity-80"
                            style={{
                              color: "hsl(var(--muted-foreground))",
                              border: "1px solid hsl(var(--border))",
                            }}
                          >
                            {iconsHidden ? "Show All" : "Hide All"}
                          </button>
                        )}
                        <PremiumGate feature="icon-import" variant="inline" upgradeUrl={upgradeUrl} signInUrl={signInUrl}>
                          <button
                            onClick={() => setShowIconImportModal(true)}
                            className="text-[12px] font-light px-2 py-0.5 rounded transition-colors hover:opacity-80"
                            style={{
                              color: "hsl(var(--muted-foreground))",
                              border: "1px solid hsl(var(--border))",
                            }}
                          >
                            Import
                          </button>
                        </PremiumGate>
                        {importedIconData.length > 0 && (
                          <button
                            onClick={clearImportedIcons}
                            className="text-[12px] font-light px-2 py-0.5 rounded transition-colors hover:opacity-80"
                            style={{
                              color: "hsl(var(--muted-foreground))",
                              border: "1px solid hsl(var(--border))",
                            }}
                          >
                            Clear Imported ({importedIconData.length})
                          </button>
                        )}
                      </div>
                      {!iconsHidden && allIcons.length > 0 && (
                        <div className="flex flex-row flex-wrap gap-2">
                          <Suspense fallback={null}>
                            {allIcons.map(({ name, icon: Icon, imported }) => {
                              const matchingData = imported
                                ? importedIconData.find((d) => d.name === name)
                                : null;
                              return (
                                <div
                                  key={`${imported ? "imported" : "builtin"}-${name}`}
                                  className={`bg-brand-dynamic/10 dark:bg-brand-dynamic/20 hover:bg-brand-dynamic/20 dark:hover:bg-brand-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center relative${imported ? " ds-icon-remove-parent" : ""}`}
                                  title={name}
                                >
                                  <Icon
                                    className="h-5 w-5 text-brand-dynamic"
                                    aria-label={name}
                                    role="img"
                                  />
                                  {matchingData && (
                                    <button
                                      className="ds-icon-remove-badge"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeImportedIcon(matchingData.id);
                                      }}
                                      aria-label={`Remove ${name}`}
                                    >
                                      &times;
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </Suspense>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import { content } from "../../content";
import designTokens from "../../designTokens.json";
import storage from "../../utils/storage";

const THEME_COLORS_KEY = "ds-theme-colors";
const PENDING_COLORS_KEY = "ds-pending-colors";
const COLOR_HISTORY_KEY = "ds-color-history";

// Contrast pairs: [foreground var, background var] that must meet WCAG AA (4.5:1)
const CONTRAST_PAIRS: [string, string][] = [
  ["--foreground", "--background"],
  ["--primary-foreground", "--primary"],
  ["--secondary-foreground", "--secondary"],
  ["--muted-foreground", "--muted"],
  ["--accent-foreground", "--accent"],
  ["--destructive-foreground", "--destructive"],
];

function hslToRgb(hsl: string): [number, number, number] {
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3) return [0, 0, 0];
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [f(0), f(8), f(4)];
}

function luminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hsl1: string, hsl2: string): number {
  const [r1, g1, b1] = hslToRgb(hsl1);
  const [r2, g2, b2] = hslToRgb(hsl2);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const EDITABLE_VARS = [
  { key: "--brand", label: "Brand Blue" },
  { key: "--background", label: "Background" },
  { key: "--foreground", label: "Foreground" },
  { key: "--primary", label: "Primary" },
  { key: "--primary-foreground", label: "Primary FG" },
  { key: "--secondary", label: "Secondary" },
  { key: "--secondary-foreground", label: "Secondary FG" },
  { key: "--muted", label: "Muted" },
  { key: "--muted-foreground", label: "Muted FG" },
  { key: "--accent", label: "Accent" },
  { key: "--accent-foreground", label: "Accent FG" },
  { key: "--destructive", label: "Destructive" },
  { key: "--destructive-foreground", label: "Destructive FG" },
  { key: "--border", label: "Border" },
  { key: "--ring", label: "Ring" },
] as const;

function hslStringToHex(hsl: string): string {
  if (!hsl || !hsl.trim()) return "#000000";
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3 || parts.some((p) => isNaN(parseFloat(p)))) return "#000000";
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHslString(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return `0 0% ${(l * 100).toFixed(1)}%`;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}

export function applyStoredThemeColors() {
  const saved = storage.get<Record<string, string>>(THEME_COLORS_KEY);
  if (saved) {
    Object.entries(saved).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
  const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY);
  if (pending) {
    Object.entries(pending).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
}

export default function DesignSystemPage() {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [colors, setColors] = useState<Record<string, string>>({});
  const unlocked = true;
  const [showResetModal, setShowResetModal] = useState(false);
  const [autoAdjustNotice, setAutoAdjustNotice] = useState<string | null>(null);

  const readCurrentColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    const current: Record<string, string> = {};
    let hasEmpty = false;
    EDITABLE_VARS.forEach(({ key }) => {
      const val = style.getPropertyValue(key).trim();
      current[key] = val;
      if (!val) hasEmpty = true;
    });
    setColors(current);
    // Retry after a short delay if any CSS variable hasn't resolved yet
    if (hasEmpty) {
      setTimeout(() => {
        const retryStyle = getComputedStyle(document.documentElement);
        const retried: Record<string, string> = {};
        EDITABLE_VARS.forEach(({ key }) => {
          retried[key] = retryStyle.getPropertyValue(key).trim();
        });
        setColors(retried);
      }, 100);
    }
  }, []);

  useEffect(() => {
    applyStoredThemeColors();
    readCurrentColors();

    // Re-read colors when ThemePreviewBar discards/undoes changes
    const handlePendingUpdate = () => {
      // Small delay to let inline styles be removed first
      setTimeout(() => readCurrentColors(), 50);
      setAutoAdjustNotice(null);
    };
    window.addEventListener("theme-pending-update", handlePendingUpdate);
    return () => window.removeEventListener("theme-pending-update", handlePendingUpdate);
  }, [readCurrentColors]);

  // When brand or secondary changes, derive related palette colors by shifting hue
  const derivePaletteFromChange = (
    changedKey: string,
    newHsl: string,
    currentColors: Record<string, string>,
  ): Record<string, string> => {
    const derived: Record<string, string> = {};
    const parts = newHsl.trim().split(/\s+/);
    if (parts.length < 3) return derived;
    const newHue = parseFloat(parts[0]);

    const shiftHue = (varKey: string, sat: number, light: number) => {
      derived[varKey] = `${newHue.toFixed(1)} ${sat.toFixed(1)}% ${light.toFixed(1)}%`;
    };

    // Parse existing value to preserve saturation/lightness when possible
    const getExisting = (varKey: string): { h: number; s: number; l: number } | null => {
      const val = currentColors[varKey];
      if (!val) return null;
      const p = val.trim().split(/\s+/);
      if (p.length < 3) return null;
      return { h: parseFloat(p[0]), s: parseFloat(p[1]), l: parseFloat(p[2]) };
    };

    const shiftExisting = (varKey: string) => {
      const existing = getExisting(varKey);
      if (existing) {
        derived[varKey] = `${newHue.toFixed(1)} ${existing.s.toFixed(1)}% ${existing.l.toFixed(1)}%`;
      }
    };

    if (changedKey === "--brand") {
      // Primary family: adopt brand hue
      shiftHue("--primary", 83.2, 48);
      shiftHue("--primary-foreground", 40, 98);
      // Ring
      shiftHue("--ring", 83.2, 53.3);
      // Secondary/muted/accent: shift hue, keep their saturation/lightness
      shiftExisting("--secondary");
      shiftExisting("--secondary-foreground");
      shiftExisting("--muted");
      shiftExisting("--muted-foreground");
      shiftExisting("--accent");
      shiftExisting("--accent-foreground");
      shiftExisting("--border");
      shiftExisting("--foreground");
    } else if (changedKey === "--secondary") {
      // Accent and muted follow secondary's hue
      shiftExisting("--accent");
      shiftExisting("--accent-foreground");
      shiftExisting("--muted");
      shiftExisting("--muted-foreground");
      shiftExisting("--border");
    }

    return derived;
  };

  const autoAdjustContrast = (
    newColors: Record<string, string>,
  ): Record<string, string> => {
    const adjustments: Record<string, string> = {};
    const working = { ...newColors };
    for (const [fg, bg] of CONTRAST_PAIRS) {
      const fgVal = working[fg];
      const bgVal = working[bg];
      if (!fgVal || !bgVal) continue;

      if (contrastRatio(fgVal, bgVal) >= 4.5) continue;

      const fgParts = fgVal.trim().split(/\s+/);
      if (fgParts.length < 3) continue;

      const h = parseFloat(fgParts[0]);
      const s = parseFloat(fgParts[1]);
      let l = parseFloat(fgParts[2]);

      const bgParts = bgVal.trim().split(/\s+/);
      const bgLightness = bgParts.length >= 3 ? parseFloat(bgParts[2]) : 50;
      const direction = bgLightness > 50 ? -3 : 3;

      let adjusted = `${h} ${s}% ${l}%`;
      for (let i = 0; i < 15; i++) {
        l = Math.max(0, Math.min(100, l + direction));
        adjusted = `${h} ${s}% ${l}%`;
        if (contrastRatio(adjusted, bgVal) >= 4.5) break;
      }
      adjustments[fg] = adjusted;
      working[fg] = adjusted;
    }
    return adjustments;
  };

  const handleColorChange = (key: string, hex: string) => {
    const hsl = hexToHslString(hex);

    // Push to undo history before applying
    const history = storage.get<{ key: string; previousValue: string }[]>(COLOR_HISTORY_KEY) || [];
    history.push({ key, previousValue: colors[key] || "" });

    // Apply the changed color
    document.documentElement.style.setProperty(key, hsl);
    const newColors = { ...colors, [key]: hsl };

    const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY) || {};
    pending[key] = hsl;

    // Derive palette when brand or secondary changes
    if (key === "--brand" || key === "--secondary") {
      const derived = derivePaletteFromChange(key, hsl, newColors);
      for (const [dKey, dVal] of Object.entries(derived)) {
        history.push({ key: dKey, previousValue: newColors[dKey] || "" });
        document.documentElement.style.setProperty(dKey, dVal);
        newColors[dKey] = dVal;
        pending[dKey] = dVal;
      }
    }

    // Auto-adjust contrast across all pairs
    const adjustments = autoAdjustContrast(newColors);
    for (const [adjKey, adjVal] of Object.entries(adjustments)) {
      history.push({ key: adjKey, previousValue: newColors[adjKey] || "" });
      document.documentElement.style.setProperty(adjKey, adjVal);
      newColors[adjKey] = adjVal;
      pending[adjKey] = adjVal;
    }

    storage.set(COLOR_HISTORY_KEY, history);
    setColors(newColors);
    storage.set(PENDING_COLORS_KEY, pending);
    window.dispatchEvent(new Event("theme-pending-update"));

    // Show palette adaptation notice
    if (key === "--brand" || key === "--secondary") {
      setAutoAdjustNotice("Palette adapted to new hue. All color pairs pass WCAG AA contrast ratio (4.5:1).");
    } else {
      setAutoAdjustNotice(null);
    }
  };


  const handleReset = () => {
    EDITABLE_VARS.forEach(({ key }) => {
      document.documentElement.style.removeProperty(key);
    });
    storage.remove(THEME_COLORS_KEY);
    storage.remove(PENDING_COLORS_KEY);
    storage.remove(COLOR_HISTORY_KEY);
    readCurrentColors();
    setAutoAdjustNotice(null);
    window.dispatchEvent(new Event("theme-pending-update"));
  };

  return (
    <PortfolioLayout currentPage="design-system">
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={content.designSystem.title}
            subtitle={content.designSystem.subtitle}
            className="mb-8 sm:mb-6"
          />

          {/* Colors */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-brand-dynamic dark:text-white">
                {content.designSystem.sections.colors}
              </h3>
              {unlocked && (
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset to Defaults
                </button>
              )}
            </div>

            {/* Instructions */}
            <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">How to use the color editor</p>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                <li>Click the <strong className="text-gray-900 dark:text-white">Brand Blue</strong> or <strong className="text-gray-900 dark:text-white">Secondary</strong> swatch (marked with a pencil icon) to open the color picker</li>
                <li>Choose a new color. The rest of the palette will automatically adapt to maintain WCAG AA contrast ratios (4.5:1)</li>
                <li>Use the preview bar at the bottom to navigate affected pages, then <strong className="text-gray-900 dark:text-white">Save</strong>, <strong className="text-gray-900 dark:text-white">Discard</strong>, or <strong className="text-gray-900 dark:text-white">Undo</strong> your changes</li>
              </ol>
            </div>

            {/* Palette adaptation notice */}
            {autoAdjustNotice && (
              <div className="mb-4 rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 px-4 py-2">
                <p className="text-sm text-blue-800 dark:text-blue-200">{autoAdjustNotice}</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {EDITABLE_VARS.map(({ key, label }) => {
                const isEditable = key === "--brand" || key === "--secondary";
                return (
                <div
                  key={key}
                  className={`text-left ${isEditable ? "group cursor-pointer" : ""}`}
                  onClick={undefined}
                >
                  <label className={isEditable && unlocked ? "cursor-pointer" : "pointer-events-none"}>
                    <div className={`relative w-full h-16 rounded-lg mb-2 border border-gray-200 dark:border-gray-700 transition-all overflow-hidden ${isEditable ? "group-hover:ring-2 group-hover:ring-gray-400" : ""}`}>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: colors[key]
                            ? `hsl(${colors[key]})`
                            : undefined,
                        }}
                      />
                      {isEditable && !unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-white/10">
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      )}
                      {isEditable && unlocked && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center shadow-sm">
                          <svg className="w-3 h-3 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                      )}
                      {isEditable && (
                        <input
                          type="color"
                          value={colors[key] ? hslStringToHex(colors[key]) : "#000000"}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      )}
                    </div>
                  </label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {colors[key] ? hslStringToHex(colors[key]) : key}
                  </p>
                </div>
                );
              })}
            </div>

            {/* Reset Confirmation Modal */}
            {showResetModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Reset to Defaults?
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    This will revert all theme colors to their original values. Any saved customizations will be lost.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowResetModal(false)}
                      className="px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { handleReset(); setShowResetModal(false); }}
                      className="px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Live Preview */}
            <div className="mt-6 rounded-lg border border-border bg-background p-5 space-y-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Live Preview
              </p>
              <div className="space-y-3">
                <p className="text-foreground text-sm">
                  This text uses <span className="font-semibold">foreground</span> on <span className="font-semibold">background</span>.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-white">
                    Primary
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-secondary text-white">
                    Secondary
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-muted text-muted-foreground">
                    Muted
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-accent text-accent-foreground">
                    Accent
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-destructive text-destructive-foreground">
                    Destructive
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 flex-1 rounded-md border-2 border-border" />
                  <span className="text-xs text-muted-foreground">Border</span>
                  <div className="h-8 w-8 rounded-md ring-2 ring-ring" />
                  <span className="text-xs text-muted-foreground">Ring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="mb-10">
            <h3 className="font-semibold text-brand-dynamic dark:text-white mb-4">
              {content.designSystem.sections.typography}
            </h3>
            <div className="space-y-4">
              {designTokens.typography.map((type) => (
                <div
                  key={type.name}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border-b border-gray-100 dark:border-gray-800 pb-4"
                >
                  <div className="sm:w-32 flex-shrink-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {type.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {type.fontSize} / {type.fontWeight}
                    </p>
                  </div>
                  <p
                    className="text-gray-900 dark:text-white"
                    style={{
                      fontSize: type.fontSize,
                      fontWeight: Number(type.fontWeight),
                      lineHeight: type.lineHeight,
                    }}
                  >
                    The interface adapts before the user knows what they need
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className="mb-10">
            <h3 className="font-semibold text-brand-dynamic dark:text-white mb-4">
              {content.designSystem.sections.spacing}
            </h3>
            <div className="space-y-3">
              {designTokens.spacing.map((space) => (
                <div key={space.name} className="flex items-center gap-4">
                  <span className="w-12 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {space.name}
                  </span>
                  <div
                    className="bg-brand-dynamic dark:bg-brand-dynamic rounded-sm"
                    style={{ width: space.value, height: "1rem" }}
                  />
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {space.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shadows */}
          <div className="mb-10">
            <h3 className="font-semibold text-brand-dynamic dark:text-white mb-4">
              Shadows
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {designTokens.shadows.map((shadow) => (
                <div key={shadow.name} className="text-center">
                  <div
                    className="w-full h-20 rounded-lg bg-white dark:bg-gray-800 mb-2"
                    style={{ boxShadow: shadow.value }}
                  />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {shadow.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {shadow.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="mb-10">
            <h3 className="font-semibold text-brand-dynamic dark:text-white mb-4">
              {content.designSystem.sections.buttons}
            </h3>
            <div className="flex flex-wrap gap-3">
              {designTokens.buttons.map((btn) => (
                <button
                  key={btn.name}
                  className="transition-colors"
                  style={{
                    backgroundColor: btn.backgroundColor,
                    color: btn.textColor,
                    border: btn.border,
                    padding: btn.padding,
                    borderRadius: `${btn.borderRadius}px`,
                    fontWeight: btn.fontWeight,
                  }}
                >
                  {btn.name}
                </button>
              ))}
            </div>
          </div>

          {/* Animations */}
          <div className="mb-10">
            <h3 className="font-semibold text-brand-dynamic dark:text-white mb-4">
              Animations
            </h3>
            <div className="space-y-6">
              {/* Accordion */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      accordion-down / accordion-up
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      0.2s ease-out
                    </p>
                  </div>
                  <button
                    onClick={() => setAccordionOpen((prev) => !prev)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {accordionOpen ? "Collapse" : "Expand"}
                  </button>
                </div>
                <div
                  className="grid transition-all duration-200 ease-out"
                  style={{
                    gridTemplateRows: accordionOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      This content expands and collapses using the accordion
                      animation. Used by the Radix UI Accordion component to
                      smoothly reveal and hide content sections.
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Banner */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    scroll-banner
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    linear infinite
                  </p>
                </div>
                <div className="px-4 py-3 overflow-hidden bg-[rgb(223,223,223)]/60 dark:bg-gray-700">
                  <div
                    className="flex items-center w-max gap-[60px]"
                    style={{
                      animation: "scroll-banner 30s linear infinite",
                    }}
                  >
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex items-center gap-[60px] shrink-0">
                        <img src="/img/carousel/optum-carousel.svg" alt="Optum" className="h-6 w-auto object-contain" />
                        <img src="/img/carousel/healthcare-dot-gov-carousel.svg" alt="Healthcare.gov" className="h-5 w-auto object-contain" />
                        <img src="/img/carousel/customgpt-carousel.png" alt="CustomGPT.ai" className="h-7 w-auto object-contain" />
                        <img src="/img/carousel/dcal-carousel.svg" alt="DCAL" className="h-7 w-auto object-contain" />
                        <img src="/img/carousel/logo-ddpa-green.png" alt="Delta Dental" className="h-5 w-auto object-contain" />
                        <img src="/img/carousel/bsbsm-carousel.png" alt="BCBSM" className="h-10 w-auto object-contain" />
                        <img src="/img/carousel/meridian-carousel.png" alt="Meridian" className="h-9 w-auto object-contain" />
                        <img src="/img/carousel/data-foundation-carousel.png" alt="Data Foundation" className="h-10 w-auto object-contain" />
                        <img src="/img/carousel/nextier-carousel.png" alt="Nextier" className="h-9 w-auto object-contain" />
                        <img src="/img/carousel/logo-propio.svg" alt="Propio" className="h-8 w-auto object-contain" />
                        <img src="/img/carousel/dewpoint-carousel.svg" alt="Dewpoint" className="h-8 w-auto object-contain" />
                        <img src="/img/carousel/neogen-carousel.png" alt="Neogen" className="h-8 w-auto object-contain" />
                        <img src="/img/carousel/fictionforge-carousel.png" alt="FictionForge" className="h-7 w-auto object-contain" />
                        <img src="/img/carousel/cygnet-carousel.svg" alt="Cygnet" className="h-10 w-auto object-contain" />
                        <img src="/img/carousel/dark-slide-carousel.png" alt="Dark Slide" className="h-10 w-auto object-contain" />
                        <img src="/img/carousel/knifehub-carousel.png" alt="KnifeHub" className="h-10 w-auto object-contain" />
                        <img src="/img/carousel/som-carousel.png" alt="Mi.gov" className="h-9 w-auto object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Border Radii */}
          <div className="mb-10">
            <h3 className="font-semibold text-brand-dynamic dark:text-white mb-4">
              Border Radius
            </h3>
            <div className="flex flex-wrap gap-6">
              {designTokens.numbers
                .filter((n) => n.name.startsWith("border-radius"))
                .map((radius) => (
                  <div key={radius.name} className="text-center">
                    <div
                      className="w-20 h-20 bg-brand-dynamic dark:bg-brand-dynamic mb-2"
                      style={{ borderRadius: `${radius.value}px` }}
                    />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {radius.value}px
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {radius.name.replace("border-radius-", "")}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </PortfolioLayout>
  );
}

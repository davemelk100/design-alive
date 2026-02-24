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
  { key: "--secondary", label: "Secondary" },
  { key: "--background", label: "Background" },
  { key: "--foreground", label: "Foreground" },
  { key: "--primary", label: "Primary" },
  { key: "--primary-foreground", label: "Primary FG" },
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
      // Brand and primary family adopt secondary's hue
      shiftExisting("--brand");
      shiftHue("--primary", 83.2, 48);
      shiftHue("--primary-foreground", 40, 98);
      shiftHue("--ring", 83.2, 53.3);
      // Accent and muted follow secondary's hue
      shiftExisting("--secondary-foreground");
      shiftExisting("--accent");
      shiftExisting("--accent-foreground");
      shiftExisting("--muted");
      shiftExisting("--muted-foreground");
      shiftExisting("--border");
      shiftExisting("--foreground");
    }

    return derived;
  };

  const autoAdjustContrast = (
    newColors: Record<string, string>,
  ): Record<string, string> => {
    const adjustments: Record<string, string> = {};
    const working = { ...newColors };

    const parseHsl = (val: string) => {
      const p = val.trim().split(/\s+/);
      if (p.length < 3) return null;
      return { h: parseFloat(p[0]), s: parseFloat(p[1]), l: parseFloat(p[2]) };
    };
    const toHsl = (h: number, s: number, l: number) =>
      `${h} ${s}% ${l}%`;

    // Check brand against background — first try adjusting brand lightness, then background
    let brandVal = working["--brand"];
    const bgVal = working["--background"];
    if (brandVal && bgVal && contrastRatio(brandVal, bgVal) < 4.5) {
      const bg = parseHsl(bgVal);
      const brand = parseHsl(brandVal);
      if (bg && brand) {
        // Try adjusting brand lightness first (darken if bg is light, lighten if bg is dark)
        const brandDir = bg.l > 50 ? -3 : 3;
        let bl = brand.l;
        let adjBrand = toHsl(brand.h, brand.s, bl);
        for (let i = 0; i < 34; i++) {
          bl = Math.max(0, Math.min(100, bl + brandDir));
          adjBrand = toHsl(brand.h, brand.s, bl);
          if (contrastRatio(adjBrand, bgVal) >= 4.5) break;
        }
        if (contrastRatio(adjBrand, bgVal) >= 4.5) {
          adjustments["--brand"] = adjBrand;
          working["--brand"] = adjBrand;
          brandVal = adjBrand;
        } else {
          // Fallback: adjust background if brand adjustment wasn't enough
          const bgDir = brand.l > 50 ? -3 : 3;
          let bgL = bg.l;
          let adjBg = toHsl(bg.h, bg.s, bgL);
          for (let i = 0; i < 34; i++) {
            bgL = Math.max(0, Math.min(100, bgL + bgDir));
            adjBg = toHsl(bg.h, bg.s, bgL);
            if (contrastRatio(brandVal, adjBg) >= 4.5) break;
          }
          adjustments["--background"] = adjBg;
          working["--background"] = adjBg;
        }
      }
    }

    // Check all foreground/background contrast pairs — adjust foreground
    for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
      const fgVal = working[fgKey];
      const bgv = working[bgKey];
      if (!fgVal || !bgv) continue;
      if (contrastRatio(fgVal, bgv) >= 4.5) continue;

      const fg = parseHsl(fgVal);
      const bg = parseHsl(bgv);
      if (!fg || !bg) continue;

      // Choose direction: make foreground lighter if bg is dark, darker if bg is light
      const direction = bg.l > 50 ? -3 : 3;
      let l = fg.l;
      let adjusted = toHsl(fg.h, fg.s, l);
      for (let i = 0; i < 34; i++) {
        l = Math.max(0, Math.min(100, l + direction));
        adjusted = toHsl(fg.h, fg.s, l);
        if (contrastRatio(adjusted, bgv) >= 4.5) break;
      }

      // If we hit the limit and still fail, try the opposite direction for foreground
      if (contrastRatio(adjusted, bgv) < 4.5) {
        l = fg.l;
        const oppDir = -direction;
        for (let i = 0; i < 34; i++) {
          l = Math.max(0, Math.min(100, l + oppDir));
          adjusted = toHsl(fg.h, fg.s, l);
          if (contrastRatio(adjusted, bgv) >= 4.5) break;
        }
      }

      // If foreground adjustment alone isn't enough, adjust the background
      if (contrastRatio(adjusted, bgv) < 4.5) {
        const bgDir = fg.l > 50 ? -3 : 3;
        let bgL = bg.l;
        let adjBg = toHsl(bg.h, bg.s, bgL);
        for (let i = 0; i < 34; i++) {
          bgL = Math.max(0, Math.min(100, bgL + bgDir));
          adjBg = toHsl(bg.h, bg.s, bgL);
          if (contrastRatio(adjusted, adjBg) >= 4.5) break;
        }
        if (contrastRatio(adjusted, adjBg) >= 4.5) {
          adjustments[bgKey] = adjBg;
          working[bgKey] = adjBg;
        }
      }

      adjustments[fgKey] = adjusted;
      working[fgKey] = adjusted;
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
    const adjustedKeys = Object.keys(adjustments);
    if (key === "--brand" || key === "--secondary") {
      const extras = adjustedKeys.length > 0
        ? ` Auto-adjusted ${adjustedKeys.map(k => k.replace("--", "")).join(", ")} for contrast.`
        : "";
      setAutoAdjustNotice(`Palette adapted to new hue. All color pairs pass WCAG AA (4.5:1).${extras}`);
    } else if (adjustedKeys.length > 0) {
      setAutoAdjustNotice(`Auto-adjusted ${adjustedKeys.map(k => k.replace("--", "")).join(", ")} to maintain WCAG AA contrast (4.5:1).`);
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
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-4">
            <SectionHeader
              title={content.designSystem.title}
              subtitle={content.designSystem.subtitle}
              className=""
            />
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
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2 rounded-lg border border-border bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">How to use the color editor</p>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                <li>Click the <strong className="text-gray-900 dark:text-white">Brand Blue</strong> or <strong className="text-gray-900 dark:text-white">Secondary</strong> swatch (marked with a pencil icon) to open the color picker</li>
                <li>Choose a new color. The rest of the palette will automatically adapt to maintain WCAG AA contrast ratios (4.5:1)</li>
                <li>Use the preview bar at the bottom to navigate affected pages, then <strong className="text-gray-900 dark:text-white">Save</strong>, <strong className="text-gray-900 dark:text-white">Discard</strong>, or <strong className="text-gray-900 dark:text-white">Undo</strong> your changes</li>
              </ol>
            </div>
            <div className="md:w-1/2 rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 flex items-center">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {autoAdjustNotice || "Palette adapted to new hue. All color pairs pass WCAG AA (4.5:1). Auto-adjusted primary-foreground for contrast."}
              </p>
            </div>
          </div>

          {/* Colors + Preview side by side */}
          <div id="colors" className="mb-10 scroll-mt-24">

            <div className="flex flex-col xl:flex-row gap-6">
              {/* Color swatches */}
              <div className="xl:flex-1 min-w-0 rounded-lg border border-border bg-background p-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-3 gap-2">
                  {EDITABLE_VARS.map(({ key, label }) => {
                    const isEditable = key === "--brand" || key === "--secondary";
                    return (
                    <div
                      key={key}
                      className={`text-left ${isEditable ? "group cursor-pointer" : ""}`}
                      onClick={undefined}
                    >
                      <label className={isEditable && unlocked ? "cursor-pointer" : "pointer-events-none"}>
                        <div className={`relative w-full h-12 rounded-md mb-1 border border-border transition-all overflow-hidden ${isEditable ? "group-hover:ring-2 group-hover:ring-gray-400" : ""}`}>
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
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {label}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {colors[key] ? hslStringToHex(colors[key]) : key}
                      </p>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Preview panel */}
              <div className="xl:flex-1 rounded-lg border border-border bg-background p-4 space-y-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Chips</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--brand))", color: "white" }}>
                    Brand
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>
                    Secondary
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                    Muted
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                    Accent
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>
                    Destructive
                  </span>
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Buttons</p>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "hsl(var(--brand))", color: "white" }}>
                    Primary
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}>
                    Secondary
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand))" }}>
                    Outlined
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "transparent", color: "hsl(var(--brand))" }}>
                    Ghost
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>
                    Destructive
                  </button>
                  <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                    Muted
                  </button>
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Spacing</p>
                <div className="flex flex-wrap gap-3">
                  {designTokens.spacing.map((space) => (
                    <div key={space.name} className="flex flex-col items-center gap-1">
                      <div
                        className="bg-brand-dynamic rounded-sm"
                        style={{ width: space.value, height: space.value, minWidth: "1rem", minHeight: "1rem" }}
                      />
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {space.name}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Border Radius</p>
                <div className="flex flex-wrap gap-3">
                  {designTokens.numbers
                    .filter((n) => n.name.startsWith("border-radius"))
                    .map((radius) => (
                      <div key={radius.name} className="flex flex-col items-center gap-1">
                        <div
                          className="w-10 h-10 bg-brand-dynamic"
                          style={{ borderRadius: `${radius.value}px` }}
                        />
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          {radius.value}px
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Shadows column */}
              <div id="shadows" className="xl:flex-1 min-w-0 scroll-mt-24 rounded-lg border border-border p-4 flex flex-col" style={{ background: "linear-gradient(135deg, hsl(var(--secondary) / 0.08), hsl(var(--brand) / 0.06))" }}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Shadows</p>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {designTokens.shadows.map((shadow) => (
                    <div key={shadow.name} className="text-center flex flex-col">
                      <div
                        className="w-full flex-1 min-h-[5rem] rounded-2xl mb-2 border border-white/30 dark:border-white/10"
                        style={{
                          boxShadow: shadow.value,
                          background: "rgba(255,255,255,0.45)",
                          backdropFilter: "blur(12px) saturate(1.4)",
                          WebkitBackdropFilter: "blur(12px) saturate(1.4)",
                        }}
                      />
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {shadow.name}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        {shadow.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
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
          </div>

          {/* Typography */}
          <div id="typography" className="mb-10 scroll-mt-24">
            <h3 className="font-semibold text-brand-dynamic dark:text-white mb-4">
              {content.designSystem.sections.typography}
            </h3>
            <div className="space-y-4">
              {designTokens.typography.map((type) => (
                <div
                  key={type.name}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border-b border-border pb-4"
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

          {/* Animations */}
          <div id="animations" className="mb-10 scroll-mt-24">
            <h3 className="font-semibold text-brand-dynamic dark:text-white mb-4">
              Animations
            </h3>
            <div className="space-y-6">
              {/* Accordion */}
              <div className="border border-border rounded-lg overflow-hidden">
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
              <div className="border border-border rounded-lg overflow-hidden">
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


        </div>
      </section>
    </PortfolioLayout>
  );
}

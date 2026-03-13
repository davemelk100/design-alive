import storage from "../storage";

export const TYPOGRAPHY_KEY = "ds-typography-v2";

export interface TypographyState {
  preset: "system" | "modern" | "classic" | "compact" | "editorial" | "custom";
  headingFamily: string;
  bodyFamily: string;
  baseFontSize: number;
  headingWeight: number;
  bodyWeight: number;
  lineHeight: number;
  letterSpacing: number;
  headingLetterSpacing: number;
}

export const DEFAULT_TYPOGRAPHY: TypographyState = {
  preset: "system",
  headingFamily: "inherit",
  bodyFamily: "inherit",
  baseFontSize: 17,
  headingWeight: 300,
  bodyWeight: 300,
  lineHeight: 1.5,
  letterSpacing: 0,
  headingLetterSpacing: 0,
};

export const TYPOGRAPHY_PRESETS: Record<string, TypographyState> = {
  system: { ...DEFAULT_TYPOGRAPHY, headingFamily: "inherit", bodyFamily: "inherit" },
  modern: {
    preset: "modern",
    headingFamily: "Roboto, sans-serif",
    bodyFamily: "Roboto, sans-serif",
    baseFontSize: 17,
    headingWeight: 300,
    bodyWeight: 300,
    lineHeight: 1.5,
    letterSpacing: 0,
    headingLetterSpacing: 0,
  },
  classic: {
    preset: "classic",
    headingFamily: "Georgia, serif",
    bodyFamily: "system-ui, sans-serif",
    baseFontSize: 17,
    headingWeight: 700,
    bodyWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0,
    headingLetterSpacing: 0,
  },
  compact: {
    preset: "compact",
    headingFamily: "system-ui, sans-serif",
    bodyFamily: "system-ui, sans-serif",
    baseFontSize: 15,
    headingWeight: 500,
    bodyWeight: 400,
    lineHeight: 1.35,
    letterSpacing: 0,
    headingLetterSpacing: 0,
  },
  editorial: {
    preset: "editorial",
    headingFamily: '"Playfair Display", serif',
    bodyFamily: "Georgia, serif",
    baseFontSize: 19,
    headingWeight: 700,
    bodyWeight: 400,
    lineHeight: 1.55,
    letterSpacing: 0,
    headingLetterSpacing: -0.02,
  },
};

export const FONT_FAMILY_OPTIONS = [
  { label: "Inherit (Host)", value: "inherit" },
  { label: "System Default", value: "system-ui, -apple-system, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Lato", value: "Lato, sans-serif" },
  { label: "DM Sans", value: '"DM Sans", sans-serif' },
  { label: "Merriweather", value: "Merriweather, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Playfair Display", value: '"Playfair Display", serif' },
  { label: "Space Grotesk", value: '"Space Grotesk", sans-serif' },
  { label: "Courier New", value: '"Courier New", monospace' },
  { label: "Segoe UI", value: '"Segoe UI", sans-serif' },
];

const GOOGLE_FONTS_TO_LOAD: Record<string, string> = {
  "Roboto, sans-serif": "Roboto:wght@300;400;500;700",
  "Inter, sans-serif": "Inter:wght@100;200;300;400;500;600;700;800;900",
  "Lato, sans-serif": "Lato:wght@100;300;400;700;900",
  '"DM Sans", sans-serif': "DM+Sans:wght@300;400;500;600;700",
  "Merriweather, serif": "Merriweather:wght@300;400;700;900",
  '"Playfair Display", serif': "Playfair+Display:wght@400;700",
  '"Space Grotesk", sans-serif': "Space+Grotesk:wght@300;400;500;600;700",
};

export function loadGoogleFont(family: string) {
  const spec = GOOGLE_FONTS_TO_LOAD[family];
  if (!spec) return;
  const id = `gf-${spec.replace(/[^a-zA-Z0-9]/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
  document.head.appendChild(link);
}

// ── Custom Google Fonts ──────────────────────────────────────────────

export interface CustomFontEntry {
  label: string;
  value: string;
  spec: string;
}

const CUSTOM_FONTS_KEY = "ds-custom-fonts";

export function getCustomFonts(): CustomFontEntry[] {
  try {
    const raw = localStorage.getItem(CUSTOM_FONTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomFonts(fonts: CustomFontEntry[]) {
  localStorage.setItem(CUSTOM_FONTS_KEY, JSON.stringify(fonts));
}

function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function validateGoogleFont(name: string): Promise<boolean> {
  const encoded = titleCase(name.trim()).replace(/\s+/g, "+");
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400`;
    link.onload = () => { link.remove(); resolve(true); };
    link.onerror = () => { link.remove(); resolve(false); };
    document.head.appendChild(link);
  });
}

export async function addCustomFont(name: string): Promise<CustomFontEntry> {
  const trimmed = titleCase(name.trim());
  const valid = await validateGoogleFont(trimmed);
  if (!valid) throw new Error(`"${trimmed}" not found on Google Fonts`);

  const encoded = trimmed.replace(/\s+/g, "+");
  const spec = `${encoded}:wght@100;200;300;400;500;600;700;800;900`;
  const value = trimmed.includes(" ")
    ? `"${trimmed}", sans-serif`
    : `${trimmed}, sans-serif`;
  const entry: CustomFontEntry = { label: trimmed, value, spec };

  // Register in runtime map and load
  GOOGLE_FONTS_TO_LOAD[value] = spec;
  loadGoogleFont(value);

  // Persist
  const fonts = getCustomFonts().filter((f) => f.label !== trimmed);
  fonts.push(entry);
  saveCustomFonts(fonts);

  return entry;
}

export function removeCustomFont(label: string) {
  const allFonts = getCustomFonts();
  const removed = allFonts.find((f) => f.label === label);
  if (removed) delete GOOGLE_FONTS_TO_LOAD[removed.value];
  saveCustomFonts(allFonts.filter((f) => f.label !== label));
}

export function initCustomFonts() {
  const fonts = getCustomFonts();
  for (const f of fonts) {
    GOOGLE_FONTS_TO_LOAD[f.value] = f.spec;
    loadGoogleFont(f.value);
  }
}

export function removeGoogleFontLinks() {
  document.querySelectorAll('link[id^="gf-"]').forEach((el) => el.remove());
}

const THEMAL_TYPO_STYLE_ID = "themal-typography";

/** Strip characters that could break out of a CSS font-family value. */
export function sanitizeFontFamily(name: string): string {
  return name.replace(/[{}<>;@\\:]/g, "");
}

export function applyTypography(state: TypographyState, root: HTMLElement = document.documentElement) {
  // Set CSS custom properties for apps that consume them
  root.style.setProperty("--font-heading", state.headingFamily);
  root.style.setProperty("--font-body", state.bodyFamily);
  root.style.setProperty("--font-size-base", `${state.baseFontSize}px`);
  root.style.setProperty("--font-weight-heading", String(state.headingWeight));
  root.style.setProperty("--font-weight-body", String(state.bodyWeight));
  root.style.setProperty("--line-height", String(state.lineHeight));
  root.style.setProperty("--letter-spacing", `${state.letterSpacing}em`);
  root.style.setProperty("--letter-spacing-heading", `${state.headingLetterSpacing}em`);

  // Inject global styles so typography applies to the entire page.
  // Always re-append to end of <head> so these rules come after site CSS.
  let styleEl = document.getElementById(THEMAL_TYPO_STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = THEMAL_TYPO_STYLE_ID;
  }
  document.head.appendChild(styleEl);

  /* Scoped rules under .ds-editor avoid !important so custom classes
     like .ds-h2 can override via natural specificity. Global rules also
     avoid !important and rely on specificity instead. */
  const safeBody = sanitizeFontFamily(state.bodyFamily);
  const safeHeading = sanitizeFontFamily(state.headingFamily);

  /* When font is "inherit", omit font-family so the host's CSS cascade applies
     (e.g. host sets h2 { font-family: "League Gothic" } — we don't want to override). */
  const bodyFontRule = safeBody === "inherit" ? "" : `font-family: ${safeBody};`;
  const headingFontRule = safeHeading === "inherit" ? "" : `font-family: ${safeHeading};`;

  styleEl.textContent = `
    .ds-editor {
      ${bodyFontRule}
      font-weight: ${state.bodyWeight};
      line-height: ${state.lineHeight};
      letter-spacing: ${state.letterSpacing}em;
    }
    .ds-editor h1, .ds-editor h2, .ds-editor h3,
    .ds-editor h4, .ds-editor h5, .ds-editor h6 {
      ${headingFontRule}
      font-weight: ${state.headingWeight};
      letter-spacing: ${state.headingLetterSpacing}em;
    }
    .ds-editor p, .ds-editor ul, .ds-editor ol, .ds-editor li,
    .ds-editor a:not(.ds-premium-tooltip a):not(.ds-nav-link),
    .ds-editor button:not(.ds-h2-btn), .ds-editor input, .ds-editor select,
    .ds-editor textarea, .ds-editor label,
    .ds-editor span:not(.ds-premium-tooltip span):not(.ds-h2):not(.ds-palette-label) {
      ${bodyFontRule}
      font-weight: ${state.bodyWeight};
      line-height: ${state.lineHeight};
    }
  `;

  loadGoogleFont(state.headingFamily);
  loadGoogleFont(state.bodyFamily);
  storage.set(TYPOGRAPHY_KEY, state);
}

export function removeTypographyProperties(root: HTMLElement = document.documentElement) {
  for (const prop of [
    "--font-heading", "--font-body", "--font-size-base",
    "--font-weight-heading", "--font-weight-body", "--line-height",
    "--letter-spacing", "--letter-spacing-heading",
  ]) {
    root.style.removeProperty(prop);
  }
  removeGoogleFontLinks();
  const styleEl = document.getElementById(THEMAL_TYPO_STYLE_ID);
  if (styleEl) styleEl.remove();
}

export function applyStoredTypography(root: HTMLElement = document.documentElement): TypographyState | null {
  const saved = storage.get<TypographyState>(TYPOGRAPHY_KEY);
  if (saved) {
    applyTypography(saved, root);
    return saved;
  }
  return null;
}

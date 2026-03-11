/**
 * Utilities for fetching and parsing icons from external sources.
 * Supports SVG sprites, icon fonts (CSS), and known CDN packages.
 */

export interface ImportedIconData {
  id: string;
  name: string;
  source: "sprite" | "font" | "cdn";
  sourceUrl: string;
  svgMarkup?: string;
  className?: string;
  fontStylesheet?: string;
}

// ---------------------------------------------------------------------------
// SVG sanitisation — strip scripts and event-handler attributes
// ---------------------------------------------------------------------------

// Whitelist of safe SVG elements
const SAFE_SVG_ELEMENTS = new Set([
  "svg", "g", "path", "circle", "ellipse", "rect", "line", "polyline",
  "polygon", "text", "tspan", "textPath", "defs", "symbol", "use",
  "clipPath", "mask", "pattern", "linearGradient", "radialGradient",
  "stop", "title", "desc", "metadata", "marker", "image",
]);

// Whitelist of safe SVG attributes
const SAFE_SVG_ATTRS = new Set([
  "id", "class", "style", "viewBox", "xmlns", "xmlns:xlink", "xml:space",
  "width", "height", "x", "y", "dx", "dy", "cx", "cy", "r", "rx", "ry",
  "x1", "y1", "x2", "y2", "d", "fill", "stroke", "stroke-width",
  "stroke-linecap", "stroke-linejoin", "stroke-dasharray", "stroke-dashoffset",
  "stroke-miterlimit", "stroke-opacity", "fill-opacity", "fill-rule",
  "clip-rule", "opacity", "transform", "points", "pathLength",
  "marker-start", "marker-mid", "marker-end", "clip-path", "mask",
  "filter", "color", "display", "visibility", "font-family", "font-size",
  "font-weight", "font-style", "text-anchor", "dominant-baseline",
  "alignment-baseline", "letter-spacing", "word-spacing", "text-decoration",
  "offset", "stop-color", "stop-opacity", "gradientUnits",
  "gradientTransform", "spreadMethod", "patternUnits", "patternTransform",
  "preserveAspectRatio", "markerWidth", "markerHeight", "refX", "refY",
  "orient", "overflow", "vector-effect",
]);

// Dangerous URI schemes
const DANGEROUS_URI_RE = /^\s*(javascript|data\s*:|vbscript)\s*:/i;

export function sanitizeSvg(svg: string): string {
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");

  // Check for parse errors (DOMParser returns an error document for invalid XML)
  const parseError = doc.querySelector("parsererror");
  if (parseError) return "";

  // Remove all elements not on the whitelist
  const allEls = Array.from(doc.querySelectorAll("*"));
  for (const el of allEls) {
    const tagName = el.localName.toLowerCase();
    if (!SAFE_SVG_ELEMENTS.has(tagName)) {
      el.remove();
      continue;
    }
    // Remove attributes not on the whitelist
    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
      const attrName = attr.name.toLowerCase();
      // Remove any event handlers (on*)
      if (attrName.startsWith("on")) {
        el.removeAttribute(attr.name);
        continue;
      }
      // Remove non-whitelisted attributes
      if (!SAFE_SVG_ATTRS.has(attrName)) {
        el.removeAttribute(attr.name);
        continue;
      }
      // Check for dangerous URI values in any attribute
      if (DANGEROUS_URI_RE.test(attr.value)) {
        el.removeAttribute(attr.name);
      }
    }
    // Also check href/xlink:href specifically (used by <use>, <image>, etc.)
    for (const hrefAttr of ["href", "xlink:href"]) {
      const val = el.getAttribute(hrefAttr);
      if (val && DANGEROUS_URI_RE.test(val)) {
        el.removeAttribute(hrefAttr);
      }
    }
  }
  return new XMLSerializer().serializeToString(doc.documentElement);
}

// ---------------------------------------------------------------------------
// 1. SVG Sprite
// ---------------------------------------------------------------------------

export async function parseSvgSprite(url: string): Promise<ImportedIconData[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch sprite: ${res.status}`);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");

  const symbols = doc.querySelectorAll("symbol");
  if (symbols.length === 0) {
    throw new Error("No <symbol> elements found in the SVG sprite.");
  }

  const icons: ImportedIconData[] = [];
  symbols.forEach((sym) => {
    const id = sym.getAttribute("id") || `symbol-${icons.length}`;
    const viewBox = sym.getAttribute("viewBox") || "0 0 24 24";
    const inner = sym.innerHTML;
    const svgMarkup = sanitizeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`,
    );
    icons.push({
      id: `sprite:${id}`,
      name: id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      source: "sprite",
      sourceUrl: url,
      svgMarkup,
    });
  });
  return icons;
}

// ---------------------------------------------------------------------------
// 2. Icon Font (CSS)
// ---------------------------------------------------------------------------

const FONT_AWESOME_RE = /\.(fa-[a-z0-9-]+)(?::+before)?\s*\{[^}]*content:\s*["']\\[0-9a-fA-F]+["']/g;
const BOOTSTRAP_ICON_RE = /\.(bi-[a-z0-9-]+)(?::+before)?\s*\{[^}]*content:\s*["']\\[0-9a-fA-F]+["']/g;
const MATERIAL_ICON_NAMES = [
  "home", "search", "settings", "person", "favorite", "star", "delete",
  "menu", "close", "check", "add", "edit", "visibility", "lock", "email",
  "phone", "info", "warning", "error", "help", "notifications", "cloud",
  "download", "upload", "share", "bookmark", "print", "code", "link",
  "shopping_cart", "account_circle", "dashboard", "description", "event",
  "flag", "grade", "language", "lightbulb", "palette", "schedule", "thumb_up",
];

function extractFontAwesomeClasses(css: string): string[] {
  const classes: string[] = [];
  let match;
  const re = new RegExp(FONT_AWESOME_RE.source, "g");
  while ((match = re.exec(css)) !== null) {
    classes.push(match[1]);
  }
  return [...new Set(classes)];
}

function extractBootstrapIconClasses(css: string): string[] {
  const classes: string[] = [];
  let match;
  const re = new RegExp(BOOTSTRAP_ICON_RE.source, "g");
  while ((match = re.exec(css)) !== null) {
    classes.push(match[1]);
  }
  return [...new Set(classes)];
}

export async function parseIconFont(cssUrl: string): Promise<ImportedIconData[]> {
  const res = await fetch(cssUrl);
  if (!res.ok) throw new Error(`Failed to fetch CSS: ${res.status}`);
  const css = await res.text();

  // Detect font type
  let classes: string[] = [];
  let prefix = "";

  if (css.includes("Font Awesome") || css.includes("fontawesome")) {
    classes = extractFontAwesomeClasses(css);
    prefix = "fa ";
  } else if (css.includes("bootstrap-icons") || css.includes("bi-")) {
    classes = extractBootstrapIconClasses(css);
    prefix = "";
  } else if (css.includes("Material Icons") || css.includes("material-icons")) {
    // Material Icons uses ligatures, return a curated set
    return MATERIAL_ICON_NAMES.map((name) => ({
      id: `font:material-${name}`,
      name: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      source: "font" as const,
      sourceUrl: cssUrl,
      className: "material-icons",
      fontStylesheet: cssUrl,
      svgMarkup: undefined,
    }));
  }

  if (classes.length === 0) {
    throw new Error("Could not detect icon classes in the CSS. Supported formats: Font Awesome, Bootstrap Icons, Material Icons.");
  }

  return classes.map((cls) => ({
    id: `font:${cls}`,
    name: cls.replace(/^(fa-|bi-)/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    source: "font" as const,
    sourceUrl: cssUrl,
    className: `${prefix}${cls}`.trim(),
    fontStylesheet: cssUrl,
  }));
}

// ---------------------------------------------------------------------------
// 3. CDN Package
// ---------------------------------------------------------------------------

export interface CdnLibrary {
  id: string;
  name: string;
  description: string;
}

export const CDN_LIBRARIES: CdnLibrary[] = [
  { id: "lucide", name: "Lucide", description: "Beautiful, consistent icons" },
  { id: "heroicons", name: "Heroicons", description: "By the makers of Tailwind CSS" },
  { id: "phosphor", name: "Phosphor", description: "Flexible icon family" },
];

async function fetchLucideIcons(): Promise<{ name: string; svgUrl: string }[]> {
  const res = await fetch("https://unpkg.com/lucide-static@latest/icon-nodes.json");
  if (!res.ok) throw new Error(`Failed to fetch Lucide icon index: ${res.status}`);
  const data: Record<string, unknown> = await res.json();
  return Object.keys(data).map((name) => ({
    name,
    svgUrl: `https://unpkg.com/lucide-static@latest/icons/${name}.svg`,
  }));
}

async function fetchHeroicons(): Promise<{ name: string; svgUrl: string }[]> {
  // Use the unpkg directory listing for the outline set
  const res = await fetch("https://unpkg.com/heroicons@latest/24/outline/");
  if (!res.ok) throw new Error(`Failed to fetch Heroicons index: ${res.status}`);
  const html = await res.text();
  const names: string[] = [];
  const re = /href="([^"]+\.svg)"/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    names.push(match[1].replace(".svg", ""));
  }
  return names.map((name) => ({
    name,
    svgUrl: `https://unpkg.com/heroicons@latest/24/outline/${name}.svg`,
  }));
}

async function fetchPhosphorIcons(): Promise<{ name: string; svgUrl: string }[]> {
  const res = await fetch("https://unpkg.com/@phosphor-icons/core@latest/assets/regular/");
  if (!res.ok) throw new Error(`Failed to fetch Phosphor index: ${res.status}`);
  const html = await res.text();
  const names: string[] = [];
  const re = /href="([^"]+\.svg)"/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    names.push(match[1].replace(".svg", ""));
  }
  return names.map((name) => ({
    name,
    svgUrl: `https://unpkg.com/@phosphor-icons/core@latest/assets/regular/${name}.svg`,
  }));
}

export async function fetchCdnIconIndex(
  library: string,
): Promise<{ name: string; svgUrl: string }[]> {
  switch (library) {
    case "lucide":
      return fetchLucideIcons();
    case "heroicons":
      return fetchHeroicons();
    case "phosphor":
      return fetchPhosphorIcons();
    default:
      throw new Error(`Unknown library: ${library}`);
  }
}

export async function fetchCdnIconSvg(svgUrl: string): Promise<string> {
  const res = await fetch(svgUrl);
  if (!res.ok) throw new Error(`Failed to fetch icon SVG: ${res.status}`);
  const text = await res.text();
  return sanitizeSvg(text);
}

export function cdnIconToImported(
  name: string,
  svgMarkup: string,
  library: string,
  svgUrl: string,
): ImportedIconData {
  return {
    id: `cdn:${library}:${name}`,
    name: name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    source: "cdn",
    sourceUrl: svgUrl,
    svgMarkup,
  };
}

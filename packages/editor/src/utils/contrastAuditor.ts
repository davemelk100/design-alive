/**
 * Lightweight contrast auditor that replaces axe-core's color-contrast rule.
 * Walks the DOM tree, checks computed foreground/background contrast, and
 * returns results in the same shape the editor already consumes.
 *
 * ~2KB vs axe-core's ~580KB.
 */

const WCAG_AA_RATIO = 4.5;
const WCAG_AA_LARGE_RATIO = 3.0;
// CSS px threshold for "large text" per WCAG: 18pt (24px) normal or 14pt (18.66px) bold
const LARGE_TEXT_PX = 24;
const LARGE_BOLD_TEXT_PX = 18.66;

interface AuditNode {
  target: string[];
  failureSummary: string;
}

interface AuditViolation {
  id: string;
  nodes: AuditNode[];
}

export interface AuditResults {
  violations: AuditViolation[];
}

function luminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function parseColor(color: string): [number, number, number, number] | null {
  const rgba = color.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/,
  );
  if (rgba) {
    return [
      Number(rgba[1]),
      Number(rgba[2]),
      Number(rgba[3]),
      rgba[4] !== undefined ? Number(rgba[4]) : 1,
    ];
  }
  return null;
}

/**
 * Walk up the ancestor chain to find the effective background color.
 * Returns null if the background can't be determined reliably
 * (e.g. background-image or gradient is present).
 */
function getEffectiveBgColor(el: HTMLElement): [number, number, number] | null {
  let node: HTMLElement | null = el;
  const layers: [number, number, number, number][] = [];
  while (node) {
    try {
      const style = getComputedStyle(node);
      // If any ancestor has a background image/gradient, we can't determine
      // the effective background reliably — bail out like axe-core does
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== "none") return null;

      const bg = style.backgroundColor;
      const parsed = parseColor(bg);
      if (parsed) {
        layers.push(parsed);
        if (parsed[3] >= 1) break;
      }
    } catch {
      // getComputedStyle can fail on detached or unusual elements
    }
    node = node.parentElement;
  }
  // Start from white and layer backgrounds on top
  let result: [number, number, number] = [255, 255, 255];
  for (let i = layers.length - 1; i >= 0; i--) {
    const [r, g, b, a] = layers[i];
    result = [
      Math.round(r * a + result[0] * (1 - a)),
      Math.round(g * a + result[1] * (1 - a)),
      Math.round(b * a + result[2] * (1 - a)),
    ];
  }
  return result;
}

function selectorFor(el: Element): string {
  if (el.id) return `#${CSS.escape(el.id)}`;
  const parts: string[] = [];
  let node: Element | null = el;
  for (let depth = 0; node && node !== document.documentElement && depth < 4; depth++) {
    let segment = node.tagName.toLowerCase();
    const parent = node.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (s) => s.tagName === node!.tagName,
      );
      if (siblings.length > 1) {
        const idx = siblings.indexOf(node) + 1;
        segment += `:nth-of-type(${idx})`;
      }
    }
    parts.unshift(segment);
    node = node.parentElement;
  }
  return parts.join(" > ");
}

function hasVisibleText(el: Element): boolean {
  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
      return true;
    }
  }
  return false;
}

/** Check if the element or any ancestor is hidden or off-screen */
function isHidden(el: HTMLElement): boolean {
  let node: HTMLElement | null = el;
  while (node) {
    const style = getComputedStyle(node);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0"
    ) {
      return true;
    }
    // Skip zero-size / clipped elements
    if (node === el) {
      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return true;
    }
    node = node.parentElement;
  }
  return false;
}

function isExcluded(el: Element, excludeEls: Set<Element>): boolean {
  let node: Element | null = el;
  while (node) {
    if (excludeEls.has(node)) return true;
    node = node.parentElement;
  }
  return false;
}

export function runContrastAudit(
  root: HTMLElement,
  excludeSelector = "[data-axe-exclude]",
): AuditResults {
  const violations: AuditNode[] = [];
  const excludeEls = new Set<Element>(
    root.querySelectorAll(excludeSelector),
  );

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node: Node | null = walker.nextNode();

  while (node) {
    const el = node as HTMLElement;

    // Skip excluded subtrees
    if (isExcluded(el, excludeEls)) {
      node = walker.nextNode();
      continue;
    }

    try {
      if (hasVisibleText(el) && !isHidden(el)) {
        const fgColor = parseColor(getComputedStyle(el).color);
        if (fgColor) {
          // Skip if background can't be determined (images, gradients)
          const bgRgb = getEffectiveBgColor(el);
          if (bgRgb) {
            const [fr, fg, fb, fa] = fgColor;
            const effectiveFg: [number, number, number] = fa < 1
              ? [
                  Math.round(fr * fa + bgRgb[0] * (1 - fa)),
                  Math.round(fg * fa + bgRgb[1] * (1 - fa)),
                  Math.round(fb * fa + bgRgb[2] * (1 - fa)),
                ]
              : [fr, fg, fb];

            const fgLum = luminance(...effectiveFg);
            const bgLum = luminance(...bgRgb);
            const lighter = Math.max(fgLum, bgLum);
            const darker = Math.min(fgLum, bgLum);
            const ratio = (lighter + 0.05) / (darker + 0.05);

            const style = getComputedStyle(el);
            const fontSize = parseFloat(style.fontSize);
            const fontWeight = parseInt(style.fontWeight, 10) || (style.fontWeight === "bold" ? 700 : 400);
            const isLarge =
              fontSize >= LARGE_TEXT_PX ||
              (fontSize >= LARGE_BOLD_TEXT_PX && fontWeight >= 700);
            const requiredRatio = isLarge ? WCAG_AA_LARGE_RATIO : WCAG_AA_RATIO;

            if (ratio < requiredRatio) {
              violations.push({
                target: [selectorFor(el)],
                failureSummary: `Contrast ratio ${ratio.toFixed(2)}:1 is below WCAG AA threshold of ${requiredRatio}:1`,
              });
            }
          }
        }
      }
    } catch {
      // Skip elements that cause errors (detached nodes, SVG quirks, etc.)
    }

    node = walker.nextNode();
  }

  if (violations.length === 0) {
    return { violations: [] };
  }

  return {
    violations: [
      {
        id: "color-contrast",
        nodes: violations,
      },
    ],
  };
}

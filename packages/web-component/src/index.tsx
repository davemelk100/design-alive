import React from "react";
import ReactDOM from "react-dom/client";
import { DesignSystemEditor } from "@themal/editor";
import type { DesignSystemEditorProps, CustomIcon } from "@themal/editor";

// Attribute name → React prop name mapping
const ATTR_TO_PROP: Record<string, keyof DesignSystemEditorProps> = {
  "license-key": "licenseKey",
  "pr-endpoint-url": "prEndpointUrl",
  "accessibility-audit": "accessibilityAudit",
  "show-nav-links": "showNavLinks",
  "show-header": "showHeader",
  "upgrade-url": "upgradeUrl",
  "sign-in-url": "signInUrl",
  "about-url": "aboutUrl",
  "icon-mode": "iconMode",
  "show-logo": "showLogo",
};

const OBSERVED_ATTRS = Object.keys(ATTR_TO_PROP);

const BOOLEAN_PROPS = new Set<string>(["accessibilityAudit", "showNavLinks", "showHeader", "showLogo"]);

function parseAttrValue(propName: string, value: string | null): string | boolean | undefined {
  if (value === null) return undefined;
  if (BOOLEAN_PROPS.has(propName)) {
    return value !== "false";
  }
  return value;
}

/** Sanitize an SVG string by removing dangerous elements and attributes */
function sanitizeSvgString(raw: string): string {
  const SAFE_ELEMENTS = new Set([
    "svg", "g", "path", "circle", "ellipse", "rect", "line", "polyline",
    "polygon", "text", "tspan", "textPath", "defs", "symbol", "use",
    "clipPath", "mask", "pattern", "linearGradient", "radialGradient",
    "stop", "title", "desc", "metadata", "marker", "image",
  ]);
  const SAFE_ATTRS = new Set([
    "id", "class", "style", "viewBox", "xmlns", "xmlns:xlink", "xml:space",
    "width", "height", "x", "y", "dx", "dy", "cx", "cy", "r", "rx", "ry",
    "x1", "y1", "x2", "y2", "d", "fill", "stroke", "stroke-width",
    "stroke-linecap", "stroke-linejoin", "stroke-dasharray", "stroke-dashoffset",
    "stroke-miterlimit", "stroke-opacity", "fill-opacity", "fill-rule",
    "clip-rule", "opacity", "transform", "points", "pathLength",
    "clip-path", "mask", "filter", "color", "display", "visibility",
    "font-family", "font-size", "font-weight", "font-style", "text-anchor",
    "dominant-baseline", "alignment-baseline", "offset", "stop-color",
    "stop-opacity", "gradientUnits", "gradientTransform", "spreadMethod",
    "preserveAspectRatio", "overflow", "vector-effect",
  ]);
  const DANGEROUS_URI = /^\s*(javascript|data\s*:|vbscript)\s*:/i;

  const doc = new DOMParser().parseFromString(raw, "image/svg+xml");
  if (doc.querySelector("parsererror")) return "";

  for (const el of Array.from(doc.querySelectorAll("*"))) {
    if (!SAFE_ELEMENTS.has(el.localName.toLowerCase())) { el.remove(); continue; }
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith("on") || !SAFE_ATTRS.has(name) || DANGEROUS_URI.test(attr.value)) {
        el.removeAttribute(attr.name);
      }
    }
    for (const h of ["href", "xlink:href"]) {
      const v = el.getAttribute(h);
      if (v && DANGEROUS_URI.test(v)) el.removeAttribute(h);
    }
  }
  return new XMLSerializer().serializeToString(doc.documentElement);
}

/** Create a React icon component from an SVG string (sanitized) */
function svgToComponent(svgString: string): React.FC<{ className?: string }> {
  const sanitized = sanitizeSvgString(svgString.trim());
  if (!sanitized) return () => null;
  return ({ className }) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = sanitized;
    const svg = wrapper.querySelector("svg");
    if (!svg) return null;
    const attrs: Record<string, string> = {};
    for (const attr of Array.from(svg.attributes)) {
      const name = attr.name === "class" ? "className" : attr.name;
      attrs[name] = attr.value;
    }
    if (className) attrs.className = className;
    return React.createElement("svg", {
      ...attrs,
      dangerouslySetInnerHTML: { __html: svg.innerHTML },
    });
  };
}

class ThemalEditorElement extends HTMLElement {
  private _root: ReactDOM.Root | null = null;
  private _mountPoint: HTMLDivElement | null = null;
  private _customIcons: CustomIcon[] = [];

  static get observedAttributes() {
    return OBSERVED_ATTRS;
  }

  /**
   * Set custom icons programmatically.
   *
   * Each entry needs a `name` and either:
   * - `svg`: an SVG string (e.g. '<svg viewBox="0 0 24 24">...</svg>')
   * - `icon`: a React component that accepts className
   *
   * @example
   * const editor = document.querySelector('themal-editor');
   * editor.setIcons([
   *   { name: "Heart", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
   *   { name: "Star", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
   * ]);
   */
  setIcons(icons: Array<{ name: string; svg?: string; icon?: React.FC<{ className?: string }> }>) {
    this._customIcons = icons.map((entry) => ({
      name: entry.name,
      icon: entry.icon || (entry.svg ? svgToComponent(entry.svg) : () => null),
    }));
    this._render();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    // Adopt all stylesheets from the document (Tailwind + editor CSS injected by the IIFE)
    // into the shadow DOM so the editor renders correctly.
    const sheets = Array.from(document.styleSheets);
    for (const sheet of sheets) {
      try {
        if (sheet.cssRules) {
          const style = document.createElement("style");
          const rules = Array.from(sheet.cssRules).map((r) => r.cssText).join("\n");
          style.textContent = rules;
          shadow.appendChild(style);
        }
      } catch {
        // Cross-origin sheets can't be read — skip them
      }
    }

    // Create mount point
    this._mountPoint = document.createElement("div");
    shadow.appendChild(this._mountPoint);

    // Create React root and render
    this._root = ReactDOM.createRoot(this._mountPoint);
    this._render();
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
      this._root = null;
    }
  }

  attributeChangedCallback() {
    this._render();
  }

  private _render() {
    if (!this._root) return;

    const props: Record<string, unknown> = {};
    for (const attr of OBSERVED_ATTRS) {
      const propName = ATTR_TO_PROP[attr];
      const value = parseAttrValue(propName, this.getAttribute(attr));
      if (value !== undefined) {
        props[propName] = value;
      }
    }

    if (this._customIcons.length > 0) {
      props.customIcons = this._customIcons;
    }

    // Default showLogo to false for web component usage
    if (props.showLogo === undefined) {
      props.showLogo = false;
    }

    this._root.render(
      React.createElement(DesignSystemEditor, props as DesignSystemEditorProps)
    );
  }
}

customElements.define("themal-editor", ThemalEditorElement);

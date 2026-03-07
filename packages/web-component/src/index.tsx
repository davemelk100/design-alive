import React from "react";
import ReactDOM from "react-dom/client";
import { DesignSystemEditor } from "@themal/editor";
import type { DesignSystemEditorProps } from "@themal/editor";

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
};

const OBSERVED_ATTRS = Object.keys(ATTR_TO_PROP);

const BOOLEAN_PROPS = new Set<string>(["accessibilityAudit", "showNavLinks", "showHeader"]);

function parseAttrValue(propName: string, value: string | null): string | boolean | undefined {
  if (value === null) return undefined;
  if (BOOLEAN_PROPS.has(propName)) {
    return value !== "false";
  }
  return value;
}

class ThemalEditorElement extends HTMLElement {
  private _root: ReactDOM.Root | null = null;
  private _mountPoint: HTMLDivElement | null = null;

  static get observedAttributes() {
    return OBSERVED_ATTRS;
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

    this._root.render(
      React.createElement(DesignSystemEditor, props as DesignSystemEditorProps)
    );
  }
}

customElements.define("themal-editor", ThemalEditorElement);

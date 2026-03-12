import storage from "../storage";

export const INTERACTION_STYLE_KEY = "ds-interaction-style";

export interface InteractionStyleState {
  preset: "subtle" | "elevated" | "bold" | "custom";
  hoverOpacity: number;
  hoverScale: number;
  activeScale: number;
  transitionDuration: number;
  focusRingWidth: number;
}

export const DEFAULT_INTERACTION_STYLE: InteractionStyleState = {
  preset: "subtle",
  hoverOpacity: 0.85,
  hoverScale: 1,
  activeScale: 0.97,
  transitionDuration: 150,
  focusRingWidth: 2,
};

export const INTERACTION_PRESETS: Record<string, InteractionStyleState> = {
  subtle: { ...DEFAULT_INTERACTION_STYLE },
  elevated: {
    preset: "elevated",
    hoverOpacity: 0.9,
    hoverScale: 1.02,
    activeScale: 0.97,
    transitionDuration: 200,
    focusRingWidth: 2,
  },
  bold: {
    preset: "bold",
    hoverOpacity: 1,
    hoverScale: 1.05,
    activeScale: 0.95,
    transitionDuration: 100,
    focusRingWidth: 3,
  },
};

const THEMAL_INTERACTION_STYLE_ID = "themal-interaction";

export function applyInteractionStyle(state: InteractionStyleState, root: HTMLElement = document.documentElement) {
  root.style.setProperty("--hover-opacity", String(state.hoverOpacity));
  root.style.setProperty("--hover-scale", String(state.hoverScale));
  root.style.setProperty("--active-scale", String(state.activeScale));
  root.style.setProperty("--transition-duration", `${state.transitionDuration}ms`);
  root.style.setProperty("--focus-ring-width", `${state.focusRingWidth}px`);
  root.style.setProperty("--focus-ring-color", "hsl(var(--ring))");

  let styleEl = document.getElementById(THEMAL_INTERACTION_STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = THEMAL_INTERACTION_STYLE_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `
    html button, html a, html [role="button"],
    html .ds-editor button, html .ds-editor a, html .ds-editor [role="button"] {
      transition: opacity var(--transition-duration) ease, transform var(--transition-duration) ease;
    }
    html button:hover, html a:hover, html [role="button"]:hover,
    html .ds-editor button:hover, html .ds-editor a:hover, html .ds-editor [role="button"]:hover {
      opacity: var(--hover-opacity);
      transform: scale(var(--hover-scale));
    }
    html button:active, html a:active, html [role="button"]:active,
    html .ds-editor button:active, html .ds-editor a:active, html .ds-editor [role="button"]:active {
      transform: scale(var(--active-scale));
    }
    html button:focus-visible, html a:focus-visible, html [role="button"]:focus-visible,
    html .ds-editor button:focus-visible, html .ds-editor a:focus-visible, html .ds-editor [role="button"]:focus-visible {
      outline: var(--focus-ring-width) solid var(--focus-ring-color);
      outline-offset: 2px;
    }
  `;

  storage.set(INTERACTION_STYLE_KEY, state);
}

export function removeInteractionStyleProperties(root: HTMLElement = document.documentElement) {
  for (const prop of [
    "--hover-opacity", "--hover-scale", "--active-scale",
    "--transition-duration", "--focus-ring-width", "--focus-ring-color",
  ]) {
    root.style.removeProperty(prop);
  }
  const styleEl = document.getElementById(THEMAL_INTERACTION_STYLE_ID);
  if (styleEl) styleEl.remove();
}

export function applyStoredInteractionStyle(root: HTMLElement = document.documentElement): InteractionStyleState | null {
  const saved = storage.get<InteractionStyleState>(INTERACTION_STYLE_KEY);
  if (saved) {
    applyInteractionStyle(saved, root);
    return saved;
  }
  return null;
}

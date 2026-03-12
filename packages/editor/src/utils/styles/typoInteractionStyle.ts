import storage from "../storage";

// ── Typography Interaction Styles ──

export const TYPO_INTERACTION_STYLE_KEY = "ds-typo-interaction-style";

export interface TypoInteractionStyleState {
  preset: "subtle" | "elevated" | "bold" | "custom";
  linkHoverOpacity: number;
  linkHoverScale: number;
  linkActiveScale: number;
  linkTransitionDuration: number;
  linkUnderline: "always" | "hover" | "none";
  headingHoverOpacity: number;
  headingHoverScale: number;
  headingTransitionDuration: number;
}

export const DEFAULT_TYPO_INTERACTION_STYLE: TypoInteractionStyleState = {
  preset: "subtle",
  linkHoverOpacity: 0.8,
  linkHoverScale: 1,
  linkActiveScale: 0.98,
  linkTransitionDuration: 150,
  linkUnderline: "hover",
  headingHoverOpacity: 1,
  headingHoverScale: 1,
  headingTransitionDuration: 150,
};

export const TYPO_INTERACTION_PRESETS: Record<string, TypoInteractionStyleState> = {
  subtle: { ...DEFAULT_TYPO_INTERACTION_STYLE },
  elevated: {
    preset: "elevated",
    linkHoverOpacity: 0.9,
    linkHoverScale: 1.01,
    linkActiveScale: 0.98,
    linkTransitionDuration: 200,
    linkUnderline: "hover",
    headingHoverOpacity: 0.85,
    headingHoverScale: 1.01,
    headingTransitionDuration: 200,
  },
  bold: {
    preset: "bold",
    linkHoverOpacity: 1,
    linkHoverScale: 1.03,
    linkActiveScale: 0.96,
    linkTransitionDuration: 100,
    linkUnderline: "always",
    headingHoverOpacity: 0.8,
    headingHoverScale: 1.02,
    headingTransitionDuration: 100,
  },
};

const THEMAL_TYPO_INTERACTION_STYLE_ID = "themal-typo-interaction";

export function applyTypoInteractionStyle(state: TypoInteractionStyleState, root: HTMLElement = document.documentElement) {
  root.style.setProperty("--link-hover-opacity", String(state.linkHoverOpacity));
  root.style.setProperty("--link-hover-scale", String(state.linkHoverScale));
  root.style.setProperty("--link-active-scale", String(state.linkActiveScale));
  root.style.setProperty("--link-transition-duration", `${state.linkTransitionDuration}ms`);
  root.style.setProperty("--heading-hover-opacity", String(state.headingHoverOpacity));
  root.style.setProperty("--heading-hover-scale", String(state.headingHoverScale));
  root.style.setProperty("--heading-transition-duration", `${state.headingTransitionDuration}ms`);

  let styleEl = document.getElementById(THEMAL_TYPO_INTERACTION_STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = THEMAL_TYPO_INTERACTION_STYLE_ID;
    document.head.appendChild(styleEl);
  }

  const underlineDefault = state.linkUnderline === "always" ? "underline" : "none";
  const underlineHover = state.linkUnderline === "none" ? "none" : "underline";

  styleEl.textContent = `
    html a:not(button):not([role="button"]) {
      text-decoration: ${underlineDefault};
      transition: opacity var(--link-transition-duration) ease, transform var(--link-transition-duration) ease;
    }
    html a:not(button):not([role="button"]):hover {
      opacity: var(--link-hover-opacity);
      transform: scale(var(--link-hover-scale));
      text-decoration: ${underlineHover};
    }
    html a:not(button):not([role="button"]):active {
      transform: scale(var(--link-active-scale));
    }
    html h1, html h2, html h3, html h4, html h5, html h6 {
      transition: opacity var(--heading-transition-duration) ease, transform var(--heading-transition-duration) ease;
    }
    html h1:hover, html h2:hover, html h3:hover, html h4:hover, html h5:hover, html h6:hover {
      opacity: var(--heading-hover-opacity);
      transform: scale(var(--heading-hover-scale));
    }
  `;

  storage.set(TYPO_INTERACTION_STYLE_KEY, state);
}

export function removeTypoInteractionStyleProperties(root: HTMLElement = document.documentElement) {
  for (const prop of [
    "--link-hover-opacity", "--link-hover-scale", "--link-active-scale",
    "--link-transition-duration", "--heading-hover-opacity", "--heading-hover-scale",
    "--heading-transition-duration",
  ]) {
    root.style.removeProperty(prop);
  }
  const styleEl = document.getElementById(THEMAL_TYPO_INTERACTION_STYLE_ID);
  if (styleEl) styleEl.remove();
}

export function applyStoredTypoInteractionStyle(root: HTMLElement = document.documentElement): TypoInteractionStyleState | null {
  const saved = storage.get<TypoInteractionStyleState>(TYPO_INTERACTION_STYLE_KEY);
  if (saved) {
    applyTypoInteractionStyle(saved, root);
    return saved;
  }
  return null;
}

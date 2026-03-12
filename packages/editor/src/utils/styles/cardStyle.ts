import storage from "../storage";

export const CARD_STYLE_KEY = "ds-card-style";

export interface CardStyleState {
  preset: "liquid-glass" | "solid" | "gradient" | "border-only" | "custom";
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  borderRadius: number;
  bgType: "solid" | "gradient" | "transparent";
  bgGradientAngle: number;
  borderWidth: number;
  backdropBlur: number;
  bgOpacity: number;
}

export const DEFAULT_CARD_STYLE: CardStyleState = {
  preset: "solid",
  shadowOffsetX: 0,
  shadowOffsetY: 2,
  shadowBlur: 8,
  shadowSpread: 0,
  shadowColor: "rgba(0,0,0,0.1)",
  borderRadius: 12,
  bgType: "solid",
  bgGradientAngle: 135,
  borderWidth: 0,
  backdropBlur: 0,
  bgOpacity: 1,
};

export const CARD_PRESETS: Record<string, Partial<CardStyleState>> = {
  "liquid-glass": {
    preset: "liquid-glass",
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowBlur: 16,
    shadowSpread: 0,
    shadowColor: "rgba(0,0,0,0.08)",
    borderRadius: 16,
    bgType: "solid",
    bgGradientAngle: 135,
    borderWidth: 1,
    backdropBlur: 16,
    bgOpacity: 0.25,
  },
  solid: {
    preset: "solid",
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    shadowBlur: 8,
    shadowSpread: 0,
    shadowColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    bgType: "solid",
    bgGradientAngle: 135,
    borderWidth: 0,
    backdropBlur: 0,
    bgOpacity: 1,
  },
  gradient: {
    preset: "gradient",
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    shadowBlur: 8,
    shadowSpread: 0,
    shadowColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    bgType: "gradient",
    bgGradientAngle: 135,
    borderWidth: 0,
    backdropBlur: 0,
    bgOpacity: 1,
  },
  "border-only": {
    preset: "border-only",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowSpread: 0,
    shadowColor: "rgba(0,0,0,0)",
    borderRadius: 12,
    bgType: "transparent",
    bgGradientAngle: 135,
    borderWidth: 2,
    backdropBlur: 0,
    bgOpacity: 0,
  },
};

export function applyCardStyle(
  state: CardStyleState,
  themeColors: Record<string, string>,
  root: HTMLElement = document.documentElement,
) {

  root.style.setProperty("--card-radius", `${state.borderRadius}px`);

  const shadow =
    state.shadowBlur === 0 && state.shadowOffsetX === 0 && state.shadowOffsetY === 0 && state.shadowSpread === 0
      ? "none"
      : `${state.shadowOffsetX}px ${state.shadowOffsetY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}`;
  root.style.setProperty("--card-shadow", shadow);

  const cardHsl = themeColors["--card"] || "0 0% 100%";
  const brandHsl = themeColors["--brand"] || "220 70% 50%";
  const secondaryHsl = themeColors["--secondary"] || "220 30% 60%";
  const accentHsl = themeColors["--accent"] || "220 50% 55%";

  let bg: string;
  if (state.bgType === "transparent") {
    bg = "transparent";
  } else if (state.bgType === "gradient") {
    bg = `linear-gradient(${state.bgGradientAngle}deg, hsl(${brandHsl}), hsl(${secondaryHsl}), hsl(${accentHsl}))`;
  } else {
    if (state.bgOpacity < 1) {
      const parts = cardHsl.trim().split(/\s+/);
      if (parts.length >= 3) {
        bg = `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, ${state.bgOpacity})`;
      } else {
        bg = `hsl(${cardHsl})`;
      }
    } else {
      bg = `hsl(${cardHsl})`;
    }
  }
  root.style.setProperty("--card-bg", bg);

  const borderColor = themeColors["--border"] || "0 0% 80%";
  const border =
    state.borderWidth > 0
      ? `${state.borderWidth}px solid hsl(${borderColor})`
      : "none";
  root.style.setProperty("--card-border", border);

  const backdrop =
    state.backdropBlur > 0
      ? `blur(${state.backdropBlur}px)`
      : "none";
  root.style.setProperty("--card-backdrop", backdrop);

  storage.set(CARD_STYLE_KEY, state);
}

export function removeCardStyleProperties(root: HTMLElement = document.documentElement) {
  for (const prop of ["--card-radius", "--card-shadow", "--card-bg", "--card-border", "--card-backdrop"]) {
    root.style.removeProperty(prop);
  }
}

export function applyStoredCardStyle(themeColors: Record<string, string>, root: HTMLElement = document.documentElement): CardStyleState | null {
  const saved = storage.get<CardStyleState>(CARD_STYLE_KEY);
  if (saved) {
    applyCardStyle(saved, themeColors, root);
    return saved;
  }
  return null;
}

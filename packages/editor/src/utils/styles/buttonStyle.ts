import storage from "../storage";

// ── Button Style ──

export const BUTTON_STYLE_KEY = "ds-button-style";

export interface ButtonStyleState {
  preset: "subtle" | "elevated" | "bold" | "custom";
  paddingX: number;
  paddingY: number;
  fontSize: number;
  fontWeight: number;
  borderRadius: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  borderWidth: number;
}

export const DEFAULT_BUTTON_STYLE: ButtonStyleState = {
  preset: "subtle",
  paddingX: 16,
  paddingY: 8,
  fontSize: 14,
  fontWeight: 300,
  borderRadius: 12,
  shadowOffsetX: 0,
  shadowOffsetY: 1,
  shadowBlur: 3,
  shadowSpread: 0,
  shadowColor: "rgba(0,0,0,0.1)",
  borderWidth: 0,
};

export const BUTTON_PRESETS: Record<string, ButtonStyleState> = {
  subtle: { ...DEFAULT_BUTTON_STYLE },
  elevated: {
    preset: "elevated",
    paddingX: 20,
    paddingY: 10,
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 8,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowBlur: 12,
    shadowSpread: 0,
    shadowColor: "rgba(0,0,0,0.15)",
    borderWidth: 0,
  },
  bold: {
    preset: "bold",
    paddingX: 24,
    paddingY: 12,
    fontSize: 16,
    fontWeight: 600,
    borderRadius: 16,
    shadowOffsetX: 0,
    shadowOffsetY: 6,
    shadowBlur: 20,
    shadowSpread: 2,
    shadowColor: "rgba(0,0,0,0.2)",
    borderWidth: 0,
  },
};

export function applyButtonStyle(state: ButtonStyleState, root: HTMLElement = document.documentElement) {
  root.style.setProperty("--btn-px", `${state.paddingX}px`);
  root.style.setProperty("--btn-py", `${state.paddingY}px`);
  root.style.setProperty("--btn-font-size", `${state.fontSize}px`);
  root.style.setProperty("--btn-font-weight", String(state.fontWeight));
  root.style.setProperty("--btn-radius", `${state.borderRadius}px`);
  const shadow =
    state.shadowBlur === 0 && state.shadowOffsetX === 0 && state.shadowOffsetY === 0 && state.shadowSpread === 0
      ? "none"
      : `${state.shadowOffsetX}px ${state.shadowOffsetY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}`;
  root.style.setProperty("--btn-shadow", shadow);
  root.style.setProperty("--btn-border-width", `${state.borderWidth}px`);
  storage.set(BUTTON_STYLE_KEY, state);
}

export function removeButtonStyleProperties(root: HTMLElement = document.documentElement) {
  for (const prop of ["--btn-px", "--btn-py", "--btn-font-size", "--btn-font-weight", "--btn-radius", "--btn-shadow", "--btn-border-width"]) {
    root.style.removeProperty(prop);
  }
}

export function applyStoredButtonStyle(root: HTMLElement = document.documentElement): ButtonStyleState | null {
  const saved = storage.get<ButtonStyleState>(BUTTON_STYLE_KEY);
  if (saved) {
    applyButtonStyle(saved, root);
    return saved;
  }
  return null;
}

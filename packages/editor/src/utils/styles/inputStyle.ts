import storage from "../storage";

// ── Input Style ──────────────────────────────────────────────────────

export const INPUT_STYLE_KEY = "ds-input-style";

export interface InputStyleState {
  preset: "rounded" | "sharp" | "pill" | "custom";
  borderRadius: number;
  borderWidth: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  focusRingWidth: number;
}

export const DEFAULT_INPUT_STYLE: InputStyleState = {
  preset: "rounded",
  borderRadius: 8,
  borderWidth: 1,
  paddingX: 12,
  paddingY: 8,
  fontSize: 15,
  focusRingWidth: 2,
};

export const INPUT_PRESETS: Record<string, InputStyleState> = {
  rounded: { ...DEFAULT_INPUT_STYLE },
  sharp: {
    preset: "sharp",
    borderRadius: 0,
    borderWidth: 1,
    paddingX: 12,
    paddingY: 8,
    fontSize: 15,
    focusRingWidth: 2,
  },
  pill: {
    preset: "pill",
    borderRadius: 999,
    borderWidth: 1,
    paddingX: 16,
    paddingY: 8,
    fontSize: 15,
    focusRingWidth: 2,
  },
};

export function applyInputStyle(state: InputStyleState, root: HTMLElement = document.documentElement) {
  root.style.setProperty("--input-radius", `${state.borderRadius}px`);
  root.style.setProperty("--input-border-width", `${state.borderWidth}px`);
  root.style.setProperty("--input-px", `${state.paddingX}px`);
  root.style.setProperty("--input-py", `${state.paddingY}px`);
  root.style.setProperty("--input-font-size", `${state.fontSize}px`);
  root.style.setProperty("--input-focus-ring", `${state.focusRingWidth}px`);
  storage.set(INPUT_STYLE_KEY, state);
}

export function removeInputStyleProperties(root: HTMLElement = document.documentElement) {
  for (const prop of ["--input-radius", "--input-border-width", "--input-px", "--input-py", "--input-font-size", "--input-focus-ring"]) {
    root.style.removeProperty(prop);
  }
}

export function applyStoredInputStyle(root: HTMLElement = document.documentElement): InputStyleState | null {
  const saved = storage.get<InputStyleState>(INPUT_STYLE_KEY);
  if (saved) {
    applyInputStyle(saved, root);
    return saved;
  }
  return null;
}

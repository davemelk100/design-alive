import storage from "../storage";

export const ALERT_STYLE_KEY = "ds-alert-style";

export interface AlertStyleState {
  preset: "filled" | "soft" | "outline" | "minimal" | "custom";
  borderRadius: number;
  borderWidth: number;
  iconStyle: "circle" | "plain";
  padding: number;
}

export const DEFAULT_ALERT_STYLE: AlertStyleState = {
  preset: "filled",
  borderRadius: 8,
  borderWidth: 0,
  iconStyle: "circle",
  padding: 16,
};

export const ALERT_PRESETS: Record<string, AlertStyleState> = {
  filled: { ...DEFAULT_ALERT_STYLE },
  soft: {
    preset: "soft",
    borderRadius: 8,
    borderWidth: 0,
    iconStyle: "circle",
    padding: 16,
  },
  outline: {
    preset: "outline",
    borderRadius: 8,
    borderWidth: 2,
    iconStyle: "plain",
    padding: 16,
  },
  minimal: {
    preset: "minimal",
    borderRadius: 0,
    borderWidth: 0,
    iconStyle: "plain",
    padding: 16,
  },
};

export function applyAlertStyle(state: AlertStyleState, root: HTMLElement = document.documentElement) {
  root.style.setProperty("--alert-radius", `${state.borderRadius}px`);
  root.style.setProperty("--alert-border-width", `${state.borderWidth}px`);
  root.style.setProperty("--alert-padding", `${state.padding}px`);
  storage.set(ALERT_STYLE_KEY, state);
}

export function removeAlertStyleProperties(root: HTMLElement = document.documentElement) {
  for (const prop of ["--alert-radius", "--alert-border-width", "--alert-padding"]) {
    root.style.removeProperty(prop);
  }
}

export function applyStoredAlertStyle(root: HTMLElement = document.documentElement): AlertStyleState | null {
  const saved = storage.get<AlertStyleState>(ALERT_STYLE_KEY);
  if (saved) {
    applyAlertStyle(saved, root);
    return saved;
  }
  return null;
}

export const TOAST_STYLE_KEY = "ds-toast-style";

export type ToastStyleState = AlertStyleState;

export const DEFAULT_TOAST_STYLE: ToastStyleState = {
  preset: "filled",
  borderRadius: 8,
  borderWidth: 0,
  iconStyle: "circle",
  padding: 16,
};

export const TOAST_PRESETS: Record<string, ToastStyleState> = {
  filled: { ...DEFAULT_TOAST_STYLE },
  soft: { preset: "soft", borderRadius: 8, borderWidth: 0, iconStyle: "circle", padding: 16 },
  outline: { preset: "outline", borderRadius: 8, borderWidth: 2, iconStyle: "plain", padding: 16 },
  minimal: { preset: "minimal", borderRadius: 0, borderWidth: 0, iconStyle: "plain", padding: 16 },
};

export function applyToastStyle(state: ToastStyleState, root: HTMLElement = document.documentElement) {
  root.style.setProperty("--toast-radius", `${state.borderRadius}px`);
  root.style.setProperty("--toast-border-width", `${state.borderWidth}px`);
  root.style.setProperty("--toast-padding", `${state.padding}px`);
  storage.set(TOAST_STYLE_KEY, state);
}

export function removeToastStyleProperties(root: HTMLElement = document.documentElement) {
  for (const prop of ["--toast-radius", "--toast-border-width", "--toast-padding"]) {
    root.style.removeProperty(prop);
  }
}

export function applyStoredToastStyle(root: HTMLElement = document.documentElement): ToastStyleState | null {
  const saved = storage.get<ToastStyleState>(TOAST_STYLE_KEY);
  if (saved) {
    applyToastStyle(saved, root);
    return saved;
  }
  return null;
}

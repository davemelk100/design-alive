/**
 * Platform detection utilities for Capacitor native vs web.
 */

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform(): boolean;
      getPlatform(): string;
    };
  }
}

export function isNativePlatform(): boolean {
  try {
    return window.Capacitor?.isNativePlatform() ?? false;
  } catch {
    return false;
  }
}

export function getPlatform(): "ios" | "android" | "web" {
  try {
    const platform = window.Capacitor?.getPlatform();
    if (platform === "ios" || platform === "android") return platform;
  } catch {
    // fallback
  }
  return "web";
}

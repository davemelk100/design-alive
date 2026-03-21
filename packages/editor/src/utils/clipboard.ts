/**
 * Cross-platform clipboard abstraction for the editor package.
 * Uses @capacitor/clipboard on native, navigator.clipboard on web.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNativePlatform(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cap = (window as any).Capacitor;
    return cap != null && typeof cap.isNativePlatform === "function" && cap.isNativePlatform();
  } catch {
    return false;
  }
}

export async function copyToClipboard(text: string): Promise<void> {
  if (isNativePlatform()) {
    const { Clipboard } = await import("@capacitor/clipboard");
    await Clipboard.write({ string: text });
  } else {
    await navigator.clipboard.writeText(text);
  }
}

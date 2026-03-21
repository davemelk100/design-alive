/**
 * Cross-platform clipboard abstraction.
 * Uses @capacitor/clipboard on native, navigator.clipboard on web.
 */

import { isNativePlatform } from "./platform";

export async function copyToClipboard(text: string): Promise<void> {
  if (isNativePlatform()) {
    const { Clipboard } = await import("@capacitor/clipboard");
    await Clipboard.write({ string: text });
  } else {
    await navigator.clipboard.writeText(text);
  }
}

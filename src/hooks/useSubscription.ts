import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { generateLicenseKey } from "@design-alive/editor";

const ALPHABET = "2345679ABCDEFGHJKMNPQRSTUVWXYZ";

function checksumSegment(seg1: string, seg2: string): string {
  let hash = 0;
  const combined = seg1 + seg2;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i) * (i + 1)) >>> 0;
  }
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += ALPHABET[hash % ALPHABET.length];
    hash = Math.floor(hash / ALPHABET.length);
  }
  return result;
}

/** Derive a deterministic THEEMEL license key from a stable user ID. */
function deriveKey(userId: string): string {
  let h = 0;
  for (let i = 0; i < userId.length; i++) {
    h = (h * 31 + userId.charCodeAt(i)) >>> 0;
  }

  let seg1 = "";
  for (let i = 0; i < 4; i++) {
    seg1 += ALPHABET[h % ALPHABET.length];
    h = Math.floor(h / ALPHABET.length);
  }

  h = 0;
  for (let i = 0; i < userId.length; i++) {
    h = (h * 37 + userId.charCodeAt(i) * (i + 3)) >>> 0;
  }

  let seg2 = "";
  for (let i = 0; i < 4; i++) {
    seg2 += ALPHABET[h % ALPHABET.length];
    h = Math.floor(h / ALPHABET.length);
  }

  const seg3 = checksumSegment(seg1, seg2);
  return `THEEMEL-${seg1}-${seg2}-${seg3}`;
}

const DEV_PRO_KEY = "theemel_dev_pro";

interface SubscriptionState {
  isPro: boolean;
  licenseKey: string | undefined;
  isLoaded: boolean;
  user: ReturnType<typeof useUser>["user"];
  /** Dev-only: toggle pro mode for testing */
  toggleDevPro: () => void;
  /** Whether dev pro override is active */
  isDevPro: boolean;
}

export function useSubscription(): SubscriptionState {
  const { user, isLoaded } = useUser();
  const [devPro, setDevPro] = useState(() => localStorage.getItem(DEV_PRO_KEY) === "true");
  // Stable fallback key for when devPro is active but user hasn't loaded yet
  const fallbackKey = useMemo(() => generateLicenseKey(), []);

  const toggleDevPro = useCallback(() => {
    setDevPro(prev => {
      const next = !prev;
      if (next) {
        localStorage.setItem(DEV_PRO_KEY, "true");
      } else {
        localStorage.removeItem(DEV_PRO_KEY);
      }
      return next;
    });
  }, []);

  // Expose toggle on window for console access in dev
  useEffect(() => {
    if (import.meta.env.DEV) {
      (window as any).__togglePro = toggleDevPro;
    }
  }, [toggleDevPro]);

  if (!isLoaded) {
    return {
      isPro: devPro,
      licenseKey: devPro ? fallbackKey : undefined,
      isLoaded: false,
      user: null,
      toggleDevPro,
      isDevPro: devPro,
    };
  }

  const plan = user ? (user.publicMetadata as { plan?: string }).plan : undefined;
  const isPro = devPro || plan === "pro";
  const licenseKey = isPro
    ? (user ? deriveKey(user.id) : fallbackKey)
    : undefined;

  return { isPro, licenseKey, isLoaded, user: user ?? null, toggleDevPro, isDevPro: devPro };
}

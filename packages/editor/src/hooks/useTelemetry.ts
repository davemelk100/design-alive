import { useEffect, useRef } from "react";

const SESSION_KEY = "ds-telemetry-session";

/**
 * Calls the onMount callback once per browser session with the editor version.
 * The callback is provided by the consuming app — the editor itself makes no
 * network requests, keeping the published package free of fetch() calls.
 */
export function useTelemetry(
  onMount: ((version: string) => void) | undefined,
  version: string,
) {
  const fired = useRef(false);

  useEffect(() => {
    if (!onMount || fired.current) return;

    // Dedupe within the same browser tab session
    if (typeof sessionStorage !== "undefined") {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    }

    fired.current = true;

    try {
      onMount(version);
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    } catch {
      // Never let telemetry affect UX
    }
  }, [onMount, version]);
}

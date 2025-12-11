// import React from "react";
import ReactDOM from "react-dom/client";
import AppWithRouter from "./App";
import "./globals.css";

// Storage migration removed - no longer needed
// Migration system was removed with authentication system

// Register service worker for caching and offline support
// Defer to after page is interactive to avoid blocking critical path
if ("serviceWorker" in navigator) {
  // Use requestIdleCallback with fallback to defer registration
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(
      () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // Check for updates
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    // New service worker available
                    if (
                      confirm("A new version is available. Reload to update?")
                    ) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
          })
          .catch(() => {
            // Silently fail - app will still work without service worker
          });
      },
      { timeout: 3000 }
    );
  } else {
    // Fallback: defer with setTimeout
    setTimeout(() => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silently fail
      });
    }, 2000);
  }
}

// Fix back/forward cache restoration
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    // Page was restored from back/forward cache
    // Trigger visibility change to refresh any state-dependent components
    const visibilityEvent = new Event("visibilitychange", { bubbles: true });
    document.dispatchEvent(visibilityEvent);
  }
});

// Optimize page unload for better back/forward cache
window.addEventListener("pagehide", (event) => {
  // Clean up any timers or listeners that might prevent bfcache
  if (event.persisted) {
    // Page is entering bfcache - minimal cleanup
  }
});

// Add error boundary for unhandled errors
window.addEventListener("error", (event) => {
  // Suppress harmless Chrome extension messaging errors
  if (
    event.message &&
    typeof event.message === "string" &&
    (event.message.includes("Could not establish connection") ||
      event.message.includes("Receiving end does not exist") ||
      event.message.includes("runtime.lastError"))
  ) {
    // Silently ignore browser extension errors - they're harmless
    return;
  }
  console.error("Unhandled error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  // Suppress harmless Chrome extension messaging errors
  if (
    event.reason &&
    typeof event.reason === "string" &&
    (event.reason.includes("Could not establish connection") ||
      event.reason.includes("Receiving end does not exist") ||
      event.reason.includes("runtime.lastError"))
  ) {
    // Silently ignore browser extension errors - they're harmless
    return;
  }
  console.error("Unhandled promise rejection:", event.reason);
});

// Suppress console errors from browser extensions
if (typeof console !== "undefined" && console.error) {
  const originalError = console.error;
  console.error = function (...args: any[]) {
    const message = args.join(" ");
    // Filter out Chrome extension messaging errors
    if (
      typeof message === "string" &&
      (message.includes("Could not establish connection") ||
        message.includes("Receiving end does not exist") ||
        message.includes("runtime.lastError") ||
        message.includes("Unchecked runtime.lastError"))
    ) {
      // Silently ignore - this is from browser extensions, not our code
      return;
    }
    // Log all other errors normally
    originalError.apply(console, args as any);
  };
}

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWithRouter />);

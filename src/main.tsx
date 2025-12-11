// import React from "react";
import ReactDOM from "react-dom/client";
import AppWithRouter from "./App";
import "./globals.css";

// Defer storage migration to avoid blocking initial render
// Load after page is fully interactive
setTimeout(() => {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(
      () => {
        import("./utils/storageMigration").catch(() => {
          // Silently fail if migration can't be loaded
        });
      },
      { timeout: 2000 }
    );
  } else {
    setTimeout(() => {
      import("./utils/storageMigration").catch(() => {
        // Silently fail if migration can't be loaded
      });
    }, 2000);
  }
}, 0);

// Register service worker for caching and offline support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
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
                if (confirm("A new version is available. Reload to update?")) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
        // Continue without service worker - app will still work
      });
  });
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
  console.error("Unhandled error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWithRouter />);

import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./globals.css";
import "../packages/editor/src/styles/editor.css";
import { isNativePlatform } from "./utils/platform";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

function MissingClerkKey() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        background: "#f5f5f5",
        color: "#333",
      }}
    >
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <h1 style={{ fontSize: 18, marginBottom: 12 }}>Missing Clerk key</h1>
        <p style={{ marginBottom: 16, lineHeight: 1.5 }}>
          Copy <code style={{ background: "#eee", padding: "2px 6px" }}>.env.example</code> to{" "}
          <code style={{ background: "#eee", padding: "2px 6px" }}>.env</code> and set{" "}
          <code style={{ background: "#eee", padding: "2px 6px" }}>VITE_CLERK_PUBLISHABLE_KEY</code> (get a
          publishable key from{" "}
          <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer">
            dashboard.clerk.com
          </a>
          ). See SETUP.md for details.
        </p>
        <p style={{ fontSize: 14, color: "#666" }}>
          Until then, the app cannot load because auth is required.
        </p>
      </div>
    </div>
  );
}

// Hide Capacitor splash screen once the app shell is ready
if (isNativePlatform()) {
  import("@capacitor/splash-screen").then(({ SplashScreen }) => {
    SplashScreen.hide();
  });
}

// Register service worker in production only (skip on native — no SW support)
if (import.meta.env.PROD && !isNativePlatform() && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
} else if (import.meta.env.DEV && "serviceWorker" in navigator) {
  // Unregister any stale service workers in dev
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

const root = document.getElementById("root")!;
if (!PUBLISHABLE_KEY) {
  ReactDOM.createRoot(root).render(<MissingClerkKey />);
} else {
  ReactDOM.createRoot(root).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>,
  );
}

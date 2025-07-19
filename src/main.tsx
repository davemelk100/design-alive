import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";

// Register service worker for caching and offline support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
        .then((registration) => {
    // Service worker registered successfully
  })
  .catch((registrationError) => {
    // Service worker registration failed
  });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

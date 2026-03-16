import { useState, useEffect } from "react";
import { DesignSystemEditor } from "@themal/editor";
import "@themal/editor/style.css";

const presets: Record<string, Record<string, string>> = {
  light: {
    "--background": "0 0% 100%",
    "--foreground": "0 0% 5%",
    "--card": "0 0% 100%",
    "--card-foreground": "0 0% 5%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "0 0% 5%",
    "--primary": "210 80% 42%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "210 15% 90%",
    "--secondary-foreground": "0 0% 10%",
    "--muted": "210 15% 95%",
    "--muted-foreground": "0 0% 40%",
    "--accent": "210 60% 50%",
    "--accent-foreground": "0 0% 5%",
    "--destructive": "0 70% 45%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 50% 32%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 80% 50%",
    "--warning-foreground": "0 0% 10%",
    "--border": "0 0% 85%",
    "--input": "0 0% 90%",
    "--ring": "210 80% 55%",
    "--brand": "210 80% 42%",
  },
  dark: {
    "--background": "0 0% 10%",
    "--foreground": "0 0% 95%",
    "--card": "0 0% 13%",
    "--card-foreground": "0 0% 95%",
    "--popover": "0 0% 13%",
    "--popover-foreground": "0 0% 95%",
    "--primary": "210 80% 45%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "210 15% 20%",
    "--secondary-foreground": "0 0% 90%",
    "--muted": "0 0% 18%",
    "--muted-foreground": "0 0% 65%",
    "--accent": "210 60% 42%",
    "--accent-foreground": "0 0% 95%",
    "--destructive": "0 60% 50%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 50% 35%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 80% 55%",
    "--warning-foreground": "0 0% 10%",
    "--border": "0 0% 22%",
    "--input": "0 0% 18%",
    "--ring": "210 80% 60%",
    "--brand": "210 80% 60%",
  },
  grey: {
    "--background": "0 0% 87%",
    "--foreground": "0 0% 0%",
    "--card": "0 0% 87%",
    "--card-foreground": "0 0% 0%",
    "--popover": "0 0% 87%",
    "--popover-foreground": "0 0% 0%",
    "--primary": "199 83% 30%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "199 16% 27%",
    "--secondary-foreground": "0 0% 100%",
    "--muted": "199 18% 95%",
    "--muted-foreground": "0 0% 15%",
    "--accent": "199 64% 30%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 21% 35%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 17% 35%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 20% 40%",
    "--warning-foreground": "0 0% 99%",
    "--border": "0 0% 78%",
    "--input": "214 32% 91%",
    "--ring": "199 83% 53%",
    "--brand": "199 19% 26%",
  },
  blue: {
    "--background": "220 30% 18%",
    "--foreground": "220 20% 95%",
    "--card": "220 30% 22%",
    "--card-foreground": "220 20% 95%",
    "--popover": "220 30% 22%",
    "--popover-foreground": "220 20% 95%",
    "--primary": "210 80% 45%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "220 20% 28%",
    "--secondary-foreground": "220 15% 90%",
    "--muted": "220 20% 25%",
    "--muted-foreground": "220 15% 70%",
    "--accent": "210 70% 42%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 60% 50%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 50% 35%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 80% 55%",
    "--warning-foreground": "0 0% 10%",
    "--border": "220 15% 28%",
    "--input": "220 20% 25%",
    "--ring": "210 80% 60%",
    "--brand": "210 70% 65%",
  },
};

function applyTheme(vars: Record<string, string>) {
  for (const [key, value] of Object.entries(vars)) {
    document.documentElement.style.setProperty(key, value);
  }
}

export default function App() {
  const [showHeader, setShowHeader] = useState(true);
  const [showSectionNav, setShowSectionNav] = useState(true);
  const [showNavLinks, setShowNavLinks] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [activeTheme, setActiveTheme] = useState("grey");

  // Apply default theme on mount
  useEffect(() => {
    applyTheme(presets[activeTheme]);
  }, []);

  return (
    <div>
      {/* Controls bar */}
      <div
        style={{
          position: "relative",
          zIndex: 100,
          padding: "12px 20px",
          background: "#1a1a2e",
          color: "#eee",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          fontSize: "13px",
          borderBottom: "2px solid #333",
        }}
      >
        <strong style={{ marginRight: 8 }}>Plugin Test</strong>

        {/* Theme presets */}
        {Object.keys(presets).map((name) => (
          <button
            key={name}
            onClick={() => {
              setActiveTheme(name);
              applyTheme(presets[name]);
            }}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              border: "1px solid #555",
              background: activeTheme === name ? "#4a6fa5" : "#2a2a3e",
              color: "#eee",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {name}
          </button>
        ))}

        <span style={{ borderLeft: "1px solid #555", height: 20 }} />

        {/* Prop toggles */}
        <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="checkbox"
            checked={showHeader}
            onChange={(e) => setShowHeader(e.target.checked)}
          />
          showHeader
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="checkbox"
            checked={showSectionNav}
            onChange={(e) => setShowSectionNav(e.target.checked)}
          />
          showSectionNav
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="checkbox"
            checked={showNavLinks}
            onChange={(e) => setShowNavLinks(e.target.checked)}
          />
          showNavLinks
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
          />
          premium
        </label>
      </div>

      {/* Editor */}
      <div
        style={{
          background: `hsl(${presets[activeTheme]["--background"]})`,
          minHeight: "100vh",
        }}
      >
        <DesignSystemEditor
          defaultColors={presets[activeTheme]}
          showHeader={showHeader}
          showSectionNav={showSectionNav}
          showNavLinks={showNavLinks}
          headerRight={
            <button
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                border: "1px solid grey",
                background: "transparent",
                color: "inherit",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          }
          licenseKey={isPremium ? "THEMAL-TEST-DEV2-JPZQ" : undefined}
          prEndpointUrl="https://example.com/api/pr"
          onChange={(colors) => {
            console.log("[plugin] colors changed:", Object.keys(colors).length, "tokens");
          }}
        />
      </div>
    </div>
  );
}

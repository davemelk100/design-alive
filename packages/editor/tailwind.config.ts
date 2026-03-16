import type { Config } from "tailwindcss";

const config: Config = {
  important: ".ds-editor",
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    /* Let the host site control font-family — preflight will emit "inherit" instead of a system stack */
    fontFamily: {
      sans: ["inherit"],
      mono: ["inherit"],
    },
    /* Explicit screens so editor breakpoints are documented and never drift
       from the values used in editor.css media queries or JS checks. */
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      fontSize: {
        // rem-based so the editor inherits the consuming app's root font-size.
        xs: ["0.8125rem", { lineHeight: "1.5" }],   // ~13px at 16px root
        sm: ["0.875rem", { lineHeight: "1.5" }],    // ~14px at 16px root
        base: ["1rem", { lineHeight: "1.5" }],       // 16px at 16px root
        lg: ["1.25rem", { lineHeight: "1.4" }],      // ~20px at 16px root
        xl: ["1.4375rem", { lineHeight: "1.35" }],   // ~23px at 16px root
      },
      colors: {
        brand: "hsl(var(--brand))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

export default config;

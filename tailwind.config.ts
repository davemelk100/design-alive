import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/editor/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
      },
      screens: {
        xs: "410px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        // rem-based scale so all sizes inherit from root font-size.
        // Consuming apps control the entire scale by setting font-size on <html>.
        xs: ["0.8125rem", { lineHeight: "1.5" }],   // ~13px at 16px root
        sm: ["0.875rem", { lineHeight: "1.5" }],    // ~14px at 16px root
        base: ["1rem", { lineHeight: "1.5" }],       // 16px at 16px root
        lg: ["1.25rem", { lineHeight: "1.4" }],      // ~20px at 16px root
        xl: ["1.4375rem", { lineHeight: "1.35" }],   // ~23px at 16px root
        "2xl": ["1.75rem", { lineHeight: "1.3" }],   // ~28px at 16px root
        "3xl": ["2.125rem", { lineHeight: "1.25" }], // ~34px at 16px root
        "4xl": ["2.5rem", { lineHeight: "1.2" }],    // ~40px at 16px root
        "5xl": ["3.25rem", { lineHeight: "1.1" }],   // ~52px at 16px root
        "6xl": ["4rem", { lineHeight: "1" }],         // ~64px at 16px root
        "7xl": ["5rem", { lineHeight: "1" }],         // ~80px at 16px root
        "8xl": ["6.5rem", { lineHeight: "1" }],       // ~104px at 16px root
        "9xl": ["8.5rem", { lineHeight: "1" }],       // ~136px at 16px root
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      keyframes: {
        "scroll-banner": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "scroll-banner": "scroll-banner 25s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

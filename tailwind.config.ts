import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
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
        title: [
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Arial",
          "sans-serif",
        ],
        card: [
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Arial",
          "sans-serif",
        ],
        serif: ["Roboto", "Georgia", "Times", "Times New Roman", "serif"],
        roboto: [
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Arial",
          "sans-serif",
        ],
        "roboto-slab": [
          "Roboto",
          "Georgia",
          "Times",
          "Times New Roman",
          "serif",
        ],
        aeonik: [
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        // 17px base with ~1.2 major third scale
        xs: ["13px", { lineHeight: "1.5" }],
        sm: ["15px", { lineHeight: "1.5" }],
        base: ["17px", { lineHeight: "1.5" }],
        lg: ["20px", { lineHeight: "1.4" }],
        xl: ["23px", { lineHeight: "1.35" }],
        "2xl": ["28px", { lineHeight: "1.3" }],
        "3xl": ["34px", { lineHeight: "1.25" }],
        "4xl": ["40px", { lineHeight: "1.2" }],
        "5xl": ["52px", { lineHeight: "1.1" }],
        "6xl": ["64px", { lineHeight: "1" }],
        "7xl": ["80px", { lineHeight: "1" }],
        "8xl": ["104px", { lineHeight: "1" }],
        "9xl": ["136px", { lineHeight: "1" }],
        "card-title": ["28px", { lineHeight: "1.4", fontWeight: "400" }],
        "card-body": ["17px", { lineHeight: "1.5" }],
        nav: ["17px", { lineHeight: "1.25" }],
        caption: ["15px", { lineHeight: "1.4" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
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
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
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

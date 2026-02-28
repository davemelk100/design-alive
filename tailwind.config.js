/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6da9fd",
        secondary: "#C03221",
        accent: "#F9C22E",
        success: "#4CAF50",
        neutral: "#828E82",
        background: "hsl(var(--background))",
      },
    },
  },
  plugins: [],
};

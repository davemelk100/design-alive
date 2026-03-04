/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@design-alive/editor", replacement: path.resolve(__dirname, "packages/editor/src/index.ts") },
      { find: "@", replacement: path.resolve(__dirname, "./") },
      { find: /^lucide-react$/, replacement: path.resolve(__dirname, "src/lib/lucide-icons.ts") },
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "packages/*/src/**/*.test.{ts,tsx}"],
    css: true,
  },
});

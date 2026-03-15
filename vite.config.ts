import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
  base: "/",
  resolve: {
    alias: [
      { find: "@design-alive/editor", replacement: path.resolve(__dirname, "packages/editor/src/index.ts") },
      { find: "@", replacement: path.resolve(__dirname, "./") },
      // Redirect lucide-react barrel to custom barrel with deep imports only
      // This reduces the bundle from 648KB to ~30KB by avoiding the full icon barrel
      { find: /^lucide-react$/, replacement: path.resolve(__dirname, "src/lib/lucide-icons.ts") },
    ],
  },
  build: {
    target: "esnext",
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      treeshake: {
        moduleSideEffects: (id) => {
          const normalizedId = id.replace(/\\/g, "/");

          if (
            (normalizedId.includes("/content.ts") ||
              normalizedId.endsWith("content.ts")) &&
            !normalizedId.includes("node_modules")
          ) {
            return true;
          }
          if (normalizedId.endsWith(".css")) {
            return true;
          }
          if (normalizedId.includes("node_modules/lucide-react")) {
            return false;
          }
          if (normalizedId.includes("node_modules")) {
            return true;
          }
          return true;
        },
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom")) return "react-dom";
            if (id.includes("react-router")) return "react-router";

            if (id.includes("@clerk")) return "clerk";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
  },
});

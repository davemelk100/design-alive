import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/.netlify/functions": {
        target: "http://localhost:8888",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/\.netlify\/functions/, ""),
      },
      "/uploads": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "esnext", // Use modern JS for better tree-shaking and performance improvement
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      treeshake: {
        moduleSideEffects: (id) => {
          // Normalize path separators for cross-platform compatibility
          const normalizedId = id.replace(/\\/g, "/");

          // Preserve content.ts as it has side effects (data exports)
          // This is critical - content.ts must not be tree-shaken away
          if (
            (normalizedId.includes("/content.ts") ||
              normalizedId.endsWith("content.ts")) &&
            !normalizedId.includes("node_modules")
          ) {
            return true;
          }
          // Preserve other data files
          if (
            normalizedId.includes("/data/") &&
            !normalizedId.includes("node_modules")
          ) {
            return true;
          }
          // Preserve CSS imports (they have side effects)
          if (normalizedId.endsWith(".css")) {
            return true;
          }
          // Preserve all node_modules - they may have side effects
          // This prevents empty vendor chunks and ensures dependencies work
          if (normalizedId.includes("node_modules")) {
            return true;
          }
          // Preserve application code - don't tree-shake it away
          // Only tree-shake unused exports, not entire modules
          return true;
        },
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false, // Disable to speed up builds
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "react-router-dom"],
    // Exclude large dependencies that are only used in lazy-loaded components
    // This prevents them from being pre-bundled and blocking the critical path in dev mode
    exclude: [
      "lucide-react",
      "@radix-ui/react-icons",
      "framer-motion", // Only used in lazy-loaded pages/components
    ],
    // Force exclude to prevent pre-bundling even if imported
    esbuildOptions: {
      // This helps ensure excluded packages aren't pre-bundled
    },
  },
});

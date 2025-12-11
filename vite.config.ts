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
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        manualChunks: (id) => {
          // Vendor chunks - split more granularly to reduce critical path
          if (id.includes("node_modules")) {
            // Core React - highest priority, smallest chunk
            if (
              id.includes("react/jsx-runtime") ||
              id.includes("react/jsx-dev-runtime")
            ) {
              return "vendor-react-runtime";
            }
            if (id.includes("/react/") && !id.includes("react-dom")) {
              return "vendor-react-core";
            }
            if (id.includes("react-dom")) {
              return "vendor-react-dom";
            }
            // React Router - separate from React core to allow parallel loading
            if (id.includes("react-router")) {
              return "vendor-router";
            }
            // Framer Motion - large, defer loading
            if (id.includes("framer-motion")) {
              return "vendor-motion";
            }
            // Icons - large bundles, lazy loaded
            if (id.includes("lucide-react")) {
              return "vendor-icons-lucide";
            }
            if (id.includes("@radix-ui")) {
              return "vendor-icons-radix";
            }
            // Other node_modules
            return "vendor";
          }
          // Split content.ts into its own chunk to allow better caching
          if (id.includes("/content.ts")) {
            return "content";
          }
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssMinify: false, // Disabled - esbuild minifier doesn't handle Tailwind @layer/@apply well
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    // Exclude large dependencies that are only used in lazy-loaded components
    // This prevents them from being pre-bundled and blocking the critical path in dev mode
    exclude: [
      "lucide-react",
      "@radix-ui/react-icons",
      "framer-motion", // Only used in lazy-loaded pages/components
    ],
  },
});

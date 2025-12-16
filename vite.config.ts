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
    target: "esnext", // Use modern JS for better tree-shaking
    rollupOptions: {
      treeshake: {
        moduleSideEffects: (id) => {
          // Normalize path separators for cross-platform compatibility
          const normalizedId = id.replace(/\\/g, "/");

          // Preserve all node_modules - they may have side effects
          // This prevents empty vendor chunks
          if (normalizedId.includes("node_modules")) {
            return true;
          }

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
          // Don't split content.ts into its own chunk - it causes empty chunk issues
          // with aggressive tree-shaking. Let it be included in the main bundle or
          // shared chunks where it will be properly preserved.
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
        passes: 3, // More passes for better minification
        unsafe: true, // Enable unsafe optimizations
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        collapse_vars: true,
        reduce_vars: true,
        dead_code: true,
        unused: true,
      },
      format: {
        comments: false, // Remove all comments
        ecma: 2020, // Use modern ECMAScript
        safari10: false, // Don't add Safari 10 workarounds
      },
      mangle: {
        safari10: false, // Don't add Safari 10 workarounds
      },
    },
    cssMinify: false, // Disable CSS minification - esbuild minifier has issues with Tailwind @layer/@apply
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false, // Disable to speed up builds
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
    // Force exclude to prevent pre-bundling even if imported
    esbuildOptions: {
      // This helps ensure excluded packages aren't pre-bundled
    },
  },
});

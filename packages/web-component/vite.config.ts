import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // Inline the extracted CSS into the IIFE bundle
    {
      name: "inline-css-into-iife",
      enforce: "post",
      generateBundle(_options, bundle) {
        let cssCode = "";
        const cssFiles: string[] = [];

        // Collect all CSS assets
        for (const [fileName, asset] of Object.entries(bundle)) {
          if (fileName.endsWith(".css") && asset.type === "asset") {
            cssCode += asset.source;
            cssFiles.push(fileName);
          }
        }

        // Remove CSS files from bundle
        for (const f of cssFiles) {
          delete bundle[f];
        }

        // Inject CSS into the JS entry
        if (cssCode) {
          for (const [, chunk] of Object.entries(bundle)) {
            if (chunk.type === "chunk" && chunk.isEntry) {
              const injection = `(function(){var s=document.createElement("style");s.textContent=${JSON.stringify(cssCode)};document.head.appendChild(s)})();`;
              chunk.code = injection + chunk.code;
              break;
            }
          }
        }
      },
    },
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "ThemalEditor",
      formats: ["iife"],
      fileName: () => "themal-editor.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false,
    minify: "esbuild",
  },
  resolve: {
    alias: {
      "@themal/editor": path.resolve(__dirname, "../editor/src"),
    },
  },
});

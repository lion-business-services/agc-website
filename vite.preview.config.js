import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Builds the whole site into ONE html file for sharing as a demo: npm run build:preview
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: "dist-preview", assetsInlineLimit: 100000000, copyPublicDir: false, target: "es2018",
    rollupOptions: { output: { format: "iife", inlineDynamicImports: true } },
  },
});

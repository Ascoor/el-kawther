import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // run visualizer only when you need it:
    mode === "analyze" &&
      visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ].filter(Boolean),

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom"], // helps the createContext error
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react") || id.includes("react-dom")) return "react-vendor";
          if (id.includes("@radix-ui")) return "radix-vendor";
          if (id.includes("react-router") || id.includes("@remix-run/router")) return "router";
          if (id.includes("@tanstack/react-query")) return "react-query";
          if (id.includes("react-hook-form") || id.includes("zod")) return "forms";
          if (id.includes("recharts") || id.includes("d3")) return "charts";
          if (id.includes("quill") || id.includes("slate") || id.includes("tiptap")) return "editor";
          if (id.includes("lucide-react")) return "icons";

          return "vendor";
        },
      },
    },
  },
}));

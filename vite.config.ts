import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";


export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [react(), mode === "development" && componentTagger()
    visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
        
          // core react
          if (id.includes("react") || id.includes("react-dom")) return "react-vendor";
        
          // radix/shadcn UI
          if (id.includes("@radix-ui")) return "radix-vendor";
        
          // router (if you use it)
          if (id.includes("react-router") || id.includes("@remix-run/router"))
            return "router";
        
          // data fetching (if you use it)
          if (id.includes("@tanstack/react-query")) return "react-query";
        
          // forms/validation (if you use them)
          if (id.includes("react-hook-form") || id.includes("zod")) return "forms";
        
          // charts/editors (common heavy deps)
          if (id.includes("recharts") || id.includes("d3")) return "charts";
          if (id.includes("quill") || id.includes("slate") || id.includes("tiptap"))
            return "editor";
        
          // icons
          if (id.includes("lucide-react")) return "icons";
        
          return "vendor";
        }
        
      },
    },

    // optional: if you only want to silence the warning (not required)
    // chunkSizeWarningLimit: 1500,
  },
}));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // keep React ecosystem together
            if (id.includes("react") || id.includes("react-dom"))
              return "react-vendor";

            // radix/shadcn dependencies
            if (id.includes("@radix-ui")) return "radix-vendor";

            // icons
            if (id.includes("lucide-react")) return "icons";

            // everything else from node_modules
            return "vendor";
          }
        },
      },
    },

    // optional: if you only want to silence the warning (not required)
    // chunkSizeWarningLimit: 1500,
  },
}));

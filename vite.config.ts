import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Changed to HTTP
        changeOrigin: true,
        secure: false, // Added this line
        rewrite: (path) => path.replace(/^\/api/, ""),
        // Additional headers if needed
        headers: {
          Connection: "keep-alive",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

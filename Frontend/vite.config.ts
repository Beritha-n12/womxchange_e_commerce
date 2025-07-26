import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Polyfill __dirname for ESM
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: mode === 'development' ? [] : [],
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
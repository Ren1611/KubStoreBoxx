import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  // Настройки для Firebase и i18n
  define: {
    global: "globalThis",
  },

  resolve: {
    alias: {
      // Алиасы для i18n
      "@": path.resolve(__dirname, "./src"),
      "@i18n": path.resolve(__dirname, "./src/i18n"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },

  // Настройки для i18n
  optimizeDeps: {
    include: ["i18next", "react-i18next"],
    exclude: ["firebase"],
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          i18n: [
            "i18next",
            "react-i18next",
            "i18next-browser-languagedetector",
          ],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
        },
      },
    },
  },
});

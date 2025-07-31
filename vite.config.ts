import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/vk-marusya-cinema/", // замените на название вашего репозитория
  build: {
    outDir: "dist",
    // Простое разделение только на React и остальное
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: ["react-router-dom", "@tanstack/react-query"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});

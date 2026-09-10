import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      "/toj-api": {
        target: "https://localhost:44301",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/toj-api/, ""),
      },
    },
  },
});
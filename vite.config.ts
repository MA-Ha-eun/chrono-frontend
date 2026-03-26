import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://chrono.name",
        changeOrigin: true,
        secure: false,
        headers: {
          referer: "https://chrono.name",
          origin: "https://chrono.name",
        },
      },
    },
  },
  resolve: {
    // react 관련 패키지 중복 로딩 방지
    dedupe: ["react", "react-dom", "react-router-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

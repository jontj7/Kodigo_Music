import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/itunes": {
        target: "https://itunes.apple.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/itunes/, ""),
      },
    },
  },
});

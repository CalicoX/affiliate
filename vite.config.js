import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5177,
    strictPort: true,
  },
  build: {
    chunkSizeWarningLimit: 1800,
    // Vite 8 默认 lightningcss 会丢掉成对声明里的标准 backdrop-filter，
    // Chrome 只认未前缀写法，Vercel 生产毛玻璃会全没（vite#22649）。
    cssMinify: "esbuild",
  },
});

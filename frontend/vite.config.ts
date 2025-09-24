import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**']
    },
    host: true,
    port: 3000,
    allowedHosts: [
      'api.fingertrace.app',
      'chat.fingertrace.app',
      'localhost',
      '127.0.0.1'
    ],
    proxy: {
      '/api/chat': {
        target: 'https://chat.fingertrace.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, '/ask-trace')
      }
    }
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
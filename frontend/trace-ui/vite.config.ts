import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";


// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**']
    },
    host: true,
    port: 3000
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

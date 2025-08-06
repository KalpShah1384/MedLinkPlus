import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: '/admin/',
  plugins: [tailwindcss()],
  server: { port: 5174 },
});

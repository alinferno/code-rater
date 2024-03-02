import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// change

export default defineConfig({
  plugins: [react()],
  base: "/code-rater/",
  server: {
    port: 3000,
  },
});

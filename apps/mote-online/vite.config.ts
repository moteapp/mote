import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfig from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: (process.env.CDN_URL ?? "") + "/static/",
  publicDir: "../../server/static",
  plugins: [
    react(),
    tsconfig()
  ],
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
  build: {
    outDir: "../../dist/mote-online",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        index: "./src/main.tsx",
      },
    },
  }
})

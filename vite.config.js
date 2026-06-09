import { resolve } from "node:path";

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        capabilities: resolve(__dirname, "capabilities.html"),
        safety: resolve(__dirname, "safety.html"),
        desktop: resolve(__dirname, "desktop.html"),
      },
    },
  },
});

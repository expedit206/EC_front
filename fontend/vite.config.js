import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  define: {
    "import.meta.env": process.env,
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/vue")) {
            return "vue";
          }
          if (id.includes("node_modules/vue-router")) {
            return "vue-router";
          }
          if (id.includes("node_modules/pinia")) {
            return "pinia";
          }
          if (id.includes("node_modules/vue-toastification")) {
            return "vue-toastification";
          }
          if (id.includes("node_modules/axios")) {
            return "axios";
          }
          if (id.includes("src/views") || id.includes("src/components")) {
            return "app-components";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1100,
  },
});

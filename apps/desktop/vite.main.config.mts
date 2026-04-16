import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      // AdonisJS backend runs at runtime via Node.js — don't bundle it
      external: ['@boilerplate/backend'],
    },
  },
});

import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { tanstackRouter } from '@tanstack/router-vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rollup/plugin-babel'

/**
 * Renderer-only vite config. Main + preload are built by tsdown
 * (see tsdown.config.ts) because tsdown handles electron's ESM quirks
 * and `electron-updater`'s side-effecting imports cleanly.
 */
export default defineConfig({
  base: './',
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/renderer'),
    emptyOutDir: true,
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      plugins: ['babel-plugin-react-compiler'],
      include: ['src/**/*'],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})

import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/main.ts'],
    outDir: 'dist',
    format: 'esm',
    platform: 'node',
    deps: {
      neverBundle: [/^electron/, /^@boilerplate/, /^electron-updater/],
    },
    clean: true,
  },
  {
    entry: ['src/preload.ts'],
    outDir: 'dist',
    format: 'cjs',
    platform: 'node',
    deps: {
      neverBundle: [/^electron/],
    },
  },
])

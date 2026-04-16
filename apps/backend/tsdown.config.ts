import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./server.ts', './adonisrc.ts', './app/**/*.ts', './config/**/*.ts', './start/**/*.ts'],
  unbundle: true,
  outExtensions: () => ({ js: '.js' }),
  dts: {
    entry: ['./server.ts'],
  },
  skipNodeModulesBundle: true,
})

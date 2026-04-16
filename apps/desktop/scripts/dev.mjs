#!/usr/bin/env node
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
/**
 * Dev launcher for the Electron app.
 *
 * 1. Starts Vite programmatically (renderer HMR).
 * 2. Spawns Electron with VITE_DEV_SERVER_URL pointing at Vite.
 * 3. Kills Vite when Electron exits.
 *
 * Main + preload are pre-built by `tsdown` in the pnpm `dev` script before
 * this runs. If you need watch mode for main.ts, run `tsdown --watch` in a
 * second terminal.
 */
import { spawn } from 'node:child_process'
import electronPath from 'electron'

const configFile = fileURLToPath(new URL('../vite.config.ts', import.meta.url))

const viteServer = await createServer({ configFile })
await viteServer.listen()

const address = viteServer.httpServer?.address()
if (!address || typeof address === 'string') {
  throw new Error('Vite did not return an address object')
}

const url = `http://localhost:${address.port}`
viteServer.printUrls()

const electron = spawn(electronPath, ['.'], {
  stdio: 'inherit',
  env: { ...process.env, VITE_DEV_SERVER_URL: url },
})

const shutdown = async (code = 0) => {
  try {
    await viteServer.close()
  } catch {}
  process.exit(code)
}

electron.on('close', (code) => shutdown(code ?? 0))
process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

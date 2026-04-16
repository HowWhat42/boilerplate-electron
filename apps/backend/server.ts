import 'reflect-metadata'
import pc from 'picocolors'
import { createRequire } from 'node:module'
import { Ignitor, prettyPrintError } from '@adonisjs/core'

const require = createRequire(import.meta.url)
const { version } = require('@boilerplate/backend/package.json')

/**
 * Configuration options for the local DevTools server.
 */
export interface DevToolsOptions {
  port?: number
  host?: string
  dbPath?: string
}

function printStartupBanner() {
  console.log()
  console.log(`  ${pc.cyan(pc.bold('Boilerplate'))} ${pc.dim(`v${version}`)}`)
  console.log(`  ${pc.dim('Backend for your app.')}`)
  console.log()

  console.log()
}

/**
 * Boots the AdonisJS-based DevTools HTTP server with DuckDB
 * storage, OTLP ingestion, and the Studio UI.
 */
export async function startServer(options: DevToolsOptions = {}) {
  const port = options.port ?? 4200
  const host = options.host ?? '127.0.0.1'

  const APP_ROOT = new URL('./', import.meta.url)
  const IMPORTER = (filePath: string) => {
    if (filePath.startsWith('./') || filePath.startsWith('../')) {
      return import(new URL(filePath, APP_ROOT).href)
    }
    return import(filePath)
  }

  process.env.PORT = String(port)
  process.env.HOST = host
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  process.env.APP_KEY = process.env.APP_KEY || 'devtools-local-key-not-used-for-security'

  /**
   * Force exit on CTRL+C. Close DuckDB first.
   */
  process.on('SIGINT', async () => {
    console.log(`\n  ${pc.dim('Shutting down...')}`)
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    process.exit(0)
  })

  new Ignitor(APP_ROOT, { importer: IMPORTER })
    .tap((app) => {
      app.ready(async () => {
        printStartupBanner()
      })
    })
    .httpServer()
    .start()
    .catch((error) => {
      process.exitCode = 1
      prettyPrintError(error)
    })
}

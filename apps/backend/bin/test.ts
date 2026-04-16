process.env.NODE_ENV = 'test'
process.env.APP_KEY = process.env.APP_KEY || 'test-app-key-not-used-for-security'

import 'reflect-metadata'
import { configure, processCLIArgs, run } from '@japa/runner'
import { apiClient } from '@japa/api-client'
import { Ignitor, prettyPrintError } from '@adonisjs/core'

const APP_ROOT = new URL('../', import.meta.url)
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.listen('SIGTERM', () => app.terminate())
    app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
  })
  .testRunner()
  .configure(async (app) => {
    const { assert } = await import('@japa/assert')
    const { pluginAdonisJS } = await import('@japa/plugin-adonisjs')

    processCLIArgs(process.argv.splice(2))
    configure({
      files: ['tests/**/*.spec.ts'],
      plugins: [assert(), apiClient('http://127.0.0.1:3333'), pluginAdonisJS(app)],
      teardown: [() => app.terminate()],
    })
  })
  .run(() => run())
  .catch(async (error) => {
    process.exitCode = 1
    await prettyPrintError(error)
  })

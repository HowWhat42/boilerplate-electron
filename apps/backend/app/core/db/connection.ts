import pc from 'picocolors'
import { dirname } from 'node:path'
import { mkdirSync } from 'node:fs'
import { DuckDbDialect } from 'kysely-duckdb'
import { Kysely } from 'kysely'
import { DuckDBInstance } from '@duckdb/node-api'

import type { Database } from './types.ts'

let db: Kysely<Database> | null = null

/**
 * Initializes a DuckDB connection at the given file path
 * and returns a typed Kysely instance.
 */
export async function initConnection(dbPath: string) {
  mkdirSync(dirname(dbPath), { recursive: true })

  let instance: DuckDBInstance
  try {
    instance = await DuckDBInstance.create(dbPath)
  } catch (error: any) {
    const pidMatch = error?.message?.match(/PID (\d+)/)
    if (pidMatch) {
      const pid = pidMatch[1]
      console.error(`\n  ${pc.red(`Another instance is already running (PID ${pid}).`)}`)
      console.error(`  Run ${pc.bold(`kill ${pid}`)} to stop it, then try again.\n`)
      process.exit(1)
    }

    throw error
  }

  db = new Kysely<Database>({
    dialect: new DuckDbDialect({ database: instance, tableMappings: {} }),
  })

  return db
}

/**
 * Returns the active DuckDB Kysely instance, or throws
 * if the connection has not been initialized yet.
 */
export function getDb(): Kysely<Database> {
  if (!db) throw new Error('DuckDB connection not initialized. Call initConnection() first.')
  return db
}

/**
 * Gracefully destroys the DuckDB connection and resets the singleton.
 */
export async function closeConnection() {
  if (db) {
    await db.destroy()
    db = null
  }
}

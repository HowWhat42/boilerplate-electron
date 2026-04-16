import type { Kysely } from 'kysely'
import type { Database } from '#app/core/db/types'

import { initializeSchema } from '#app/core/db/schema'
import { initConnection, closeConnection, getDb } from '#app/core/db/connection'

/**
 * Initializes an in-memory DuckDB instance for tests
 * using the real initConnection, so getDb() works everywhere.
 */
export async function setupTestDb(): Promise<Kysely<Database>> {
  const db = await initConnection(':memory:')
  await initializeSchema(db)
  return db
}

export { getDb as getTestDb, closeConnection as teardownTestDb }

/**
 * Truncates all tables in the test DB.
 */
export async function truncateAll() {
  const db = getDb()
  await db.deleteFrom('notes').execute()
}

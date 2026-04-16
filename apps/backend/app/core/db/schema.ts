import { sql, type Kysely } from 'kysely'

import type { Database } from './types.ts'

/**
 * Example schema bootstrap. Replace with your own tables/migrations strategy.
 */
export async function initializeSchema(db: Kysely<Database>) {
  await sql`
    CREATE SEQUENCE IF NOT EXISTS notes_id_seq
  `.execute(db)

  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id         INTEGER PRIMARY KEY DEFAULT nextval('notes_id_seq'),
      title      VARCHAR NOT NULL,
      body       VARCHAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `.execute(db)
}

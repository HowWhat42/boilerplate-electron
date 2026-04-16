import type { Generated } from 'kysely'

/**
 * Example table. Replace with your own domain tables.
 */
export interface NotesTable {
  id: Generated<number>
  title: string
  body: string | null
  created_at: Generated<string>
}

export interface Database {
  notes: NotesTable
}

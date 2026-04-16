import type { HttpContext } from '@adonisjs/core/http'

import vine from '@vinejs/vine'
import { getDb } from '#app/core/db/connection'

/**
 * Example CRUD controller demonstrating:
 *   - VineJS validation
 *   - Kysely query building against DuckDB
 *   - JSON responses via the API serializer
 */
const createNoteValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(1).maxLength(200),
    body: vine.string().optional(),
  }),
)

export default class NotesController {
  async index() {
    return getDb().selectFrom('notes').selectAll().orderBy('id', 'desc').execute()
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createNoteValidator)

    const [note] = await getDb()
      .insertInto('notes')
      .values({ title: payload.title, body: payload.body ?? null })
      .returningAll()
      .execute()

    return response.created(note)
  }
}

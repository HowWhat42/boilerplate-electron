import type { HttpContext } from '@adonisjs/core/http'

import Note from '#core/models/notes'

import { createNoteValidator } from '../validators/note.ts'

export default class NotesController {
  async index() {
    return Note.all()
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createNoteValidator)

    const note = await Note.create(payload)
    return response.created(note)
  }
}

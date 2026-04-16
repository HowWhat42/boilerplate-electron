import vine from '@vinejs/vine'

export const createNoteValidator = vine.create(
  vine.object({
    title: vine.string().minLength(1).maxLength(200),
    body: vine.string().optional(),
  }),
)

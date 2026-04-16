import { queryOptions } from '@tanstack/react-query'

import { queryClient } from '@/lib/tuyau'

/**
 * Example query + mutation matching the generic backend endpoints.
 *
 * Swap to the tuyau-generated client (`tuyau.api.notes.*`) once the backend's
 * tuyau registry has been regenerated for your own routes.
 */
export type Note = {
  id: number
  title: string
  body: string | null
  created_at: string
}

const API_BASE = 'http://localhost:4200'

export const getNotesQueryOptions = () =>
  queryOptions({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/notes`)
      if (!response.ok) throw new Error(`Failed to fetch notes: ${response.status}`)
      return (await response.json()) as Note[]
    },
  })

export async function createNote(input: { title: string; body?: string }): Promise<Note> {
  const response = await fetch(`${API_BASE}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) throw new Error(`Failed to create note: ${response.status}`)

  const note = (await response.json()) as Note
  await queryClient.invalidateQueries({ queryKey: getNotesQueryOptions().queryKey })
  return note
}

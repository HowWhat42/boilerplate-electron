import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

import { setupTestDb, teardownTestDb, truncateAll } from './helpers/test_db.ts'

let closeServer: (() => Promise<void>) | null = null

test.group('NotesController', (group) => {
  group.setup(async () => {
    await setupTestDb()
    closeServer = await testUtils.httpServer().start()
  })

  group.each.setup(async () => {
    await truncateAll()
  })

  group.teardown(async () => {
    await closeServer?.()
    closeServer = null
    await teardownTestDb()
  })

  test('POST /api/notes creates a note', async ({ client, assert }) => {
    const response = await client.post('/api/notes').json({ title: 'hello', body: 'world' })

    response.assertStatus(201)
    assert.properties(response.body(), ['id', 'title', 'body', 'created_at'])
    assert.equal(response.body().title, 'hello')
  })

  test('GET /api/notes returns stored notes newest first', async ({ client, assert }) => {
    await client.post('/api/notes').json({ title: 'first' })
    await client.post('/api/notes').json({ title: 'second' })

    const response = await client.get('/api/notes')

    response.assertStatus(200)
    assert.lengthOf(response.body(), 2)
    assert.equal(response.body()[0].title, 'second')
  })

  test('POST /api/notes rejects missing title', async ({ client }) => {
    const response = await client.post('/api/notes').json({ body: 'no title' })
    response.assertStatus(422)
  })
})

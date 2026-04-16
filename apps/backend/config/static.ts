import { defineConfig } from '@adonisjs/static'

export default defineConfig({
  enabled: true,
  immutable: true,
  maxAge: '1y',
  cacheControl: true,
  etag: true,
  headers: (path) => {
    if (!path.endsWith('.html')) return {}

    return {
      'Cache-Control': 'no-cache, must-revalidate',
    }
  },
})

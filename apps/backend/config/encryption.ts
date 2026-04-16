import { defineConfig, drivers } from '@adonisjs/core/encryption'

export default defineConfig({
  default: 'app',
  list: {
    app: drivers.aes256gcm({
      id: 'app',
      keys: [process.env.APP_KEY!],
    }),
  },
})

import { defineConfig } from '@adonisjs/core/bodyparser'

const config: any = defineConfig({
  json: {
    limit: '10mb',
    types: ['application/json'],
  },
})

export default config

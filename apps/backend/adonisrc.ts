import { generateRegistry } from '@tuyau/core/hooks'
import { defineConfig } from '@adonisjs/core/app'
import { indexEntities } from '@adonisjs/core'

export default defineConfig({
  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('@adonisjs/core/providers/vinejs_provider'),
    () => import('@adonisjs/static/static_provider'),
    () => import('@adonisjs/lucid/database_provider'),
  ],
  commands: [() => import('@adonisjs/core/commands'), () => import('@adonisjs/lucid/commands')],
  preloads: [
    () => import('#app/core/providers/api_provider'),
    () => import('./start/kernel.js'),
    () => import('./start/routes.js'),
  ],
  hooks: {
    init: [
      indexEntities({
        transformers: {
          enabled: true,
          source: './app',
          glob: ['**/*_transformer.ts'],
          importAlias: '#app',
        },
        controllers: {
          enabled: true,
          source: './app',
          glob: ['**/*_controller.ts'],
          importAlias: '#app',
        },
      }),
      generateRegistry(),
    ],
  },
})

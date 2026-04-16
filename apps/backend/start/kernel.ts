import server from '@adonisjs/core/services/server'

server.errorHandler(() => import('#app/core/error_handler'))

server.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/static/static_middleware'),
])

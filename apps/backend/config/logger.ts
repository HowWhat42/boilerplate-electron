import { defineConfig, targets } from '@adonisjs/core/logger'

const config: any = defineConfig({
  default: 'app',
  loggers: {
    app: {
      enabled: true,
      name: 'monocle-devtools',
      level: 'info',
      transport: {
        targets: targets().push(targets.pretty()).toArray(),
      },
    },
  },
})

export default config

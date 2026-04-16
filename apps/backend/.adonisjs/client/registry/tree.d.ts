/* eslint-disable */
import type { routes } from './index.ts'

export interface ApiDefinition {
  otlp: {
    traces: (typeof routes)['otlp.traces']
    logs: (typeof routes)['otlp.logs']
  }
  traces: {
    index: (typeof routes)['traces.index']
    show: (typeof routes)['traces.show']
  }
  queries: {
    index: (typeof routes)['queries.index']
  }
  exceptions: {
    index: (typeof routes)['exceptions.index']
  }
  logs: {
    index: (typeof routes)['logs.index']
  }
  services: {
    index: (typeof routes)['services.index']
  }
  jobs: {
    index: (typeof routes)['jobs.index']
  }
  commands: {
    index: (typeof routes)['commands.index']
  }
  external_calls: {
    index: (typeof routes)['external_calls.index']
  }
  events: {
    stream: (typeof routes)['events.stream']
  }
}

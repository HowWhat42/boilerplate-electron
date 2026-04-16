/* eslint-disable */
import type { AdonisEndpoint } from '@tuyau/core/types'

import type { ApiDefinition } from './tree.d.ts'
import type { Registry } from './schema.d.ts'

const placeholder: any = {}

const routes = {
  'otlp.traces': {
    methods: ['POST'],
    pattern: '/v1/traces',
    tokens: [
      { old: '/v1/traces', type: 0, val: 'v1', end: '' },
      { old: '/v1/traces', type: 0, val: 'traces', end: '' },
    ],
    types: placeholder as Registry['otlp.traces']['types'],
  },
  'otlp.logs': {
    methods: ['POST'],
    pattern: '/v1/logs',
    tokens: [
      { old: '/v1/logs', type: 0, val: 'v1', end: '' },
      { old: '/v1/logs', type: 0, val: 'logs', end: '' },
    ],
    types: placeholder as Registry['otlp.logs']['types'],
  },
  'traces.index': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/traces',
    tokens: [
      { old: '/api/traces', type: 0, val: 'api', end: '' },
      { old: '/api/traces', type: 0, val: 'traces', end: '' },
    ],
    types: placeholder as Registry['traces.index']['types'],
  },
  'traces.show': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/traces/:traceId',
    tokens: [
      { old: '/api/traces/:traceId', type: 0, val: 'api', end: '' },
      { old: '/api/traces/:traceId', type: 0, val: 'traces', end: '' },
      { old: '/api/traces/:traceId', type: 1, val: 'traceId', end: '' },
    ],
    types: placeholder as Registry['traces.show']['types'],
  },
  'queries.index': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/queries',
    tokens: [
      { old: '/api/queries', type: 0, val: 'api', end: '' },
      { old: '/api/queries', type: 0, val: 'queries', end: '' },
    ],
    types: placeholder as Registry['queries.index']['types'],
  },
  'exceptions.index': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/exceptions',
    tokens: [
      { old: '/api/exceptions', type: 0, val: 'api', end: '' },
      { old: '/api/exceptions', type: 0, val: 'exceptions', end: '' },
    ],
    types: placeholder as Registry['exceptions.index']['types'],
  },
  'logs.index': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/logs',
    tokens: [
      { old: '/api/logs', type: 0, val: 'api', end: '' },
      { old: '/api/logs', type: 0, val: 'logs', end: '' },
    ],
    types: placeholder as Registry['logs.index']['types'],
  },
  'services.index': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/services',
    tokens: [
      { old: '/api/services', type: 0, val: 'api', end: '' },
      { old: '/api/services', type: 0, val: 'services', end: '' },
    ],
    types: placeholder as Registry['services.index']['types'],
  },
  'jobs.index': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/jobs',
    tokens: [
      { old: '/api/jobs', type: 0, val: 'api', end: '' },
      { old: '/api/jobs', type: 0, val: 'jobs', end: '' },
    ],
    types: placeholder as Registry['jobs.index']['types'],
  },
  'commands.index': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/commands',
    tokens: [
      { old: '/api/commands', type: 0, val: 'api', end: '' },
      { old: '/api/commands', type: 0, val: 'commands', end: '' },
    ],
    types: placeholder as Registry['commands.index']['types'],
  },
  'external_calls.index': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/external-calls',
    tokens: [
      { old: '/api/external-calls', type: 0, val: 'api', end: '' },
      { old: '/api/external-calls', type: 0, val: 'external-calls', end: '' },
    ],
    types: placeholder as Registry['external_calls.index']['types'],
  },
  'events.stream': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/events',
    tokens: [
      { old: '/api/events', type: 0, val: 'api', end: '' },
      { old: '/api/events', type: 0, val: 'events', end: '' },
    ],
    types: placeholder as Registry['events.stream']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}

/* eslint-disable */

import type {
  TraceListItem,
  SpanDetail,
  QueryListItem,
  ExceptionListItem,
  JobListItem,
  CommandListItem,
  ExternalCallListItem,
} from '#app/core/types/spans'
import type { LogEntry } from '#app/core/types/logs'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'otlp.traces': {
    methods: ['POST']
    pattern: '/v1/traces'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: { partialSuccess: { rejectedSpans: number; errorMessage: string } }
      errorResponse: unknown
    }
  }
  'otlp.logs': {
    methods: ['POST']
    pattern: '/v1/logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: { partialSuccess: { rejectedLogRecords: number; errorMessage: string } }
      errorResponse: unknown
    }
  }
  'traces.index': {
    methods: ['GET', 'HEAD']
    pattern: '/api/traces'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: { limit?: number; offset?: number; traceId?: string }
      response: { data: TraceListItem[] }
      errorResponse: unknown
    }
  }
  'traces.show': {
    methods: ['GET', 'HEAD']
    pattern: '/api/traces/:traceId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { traceId: ParamValue }
      query: {}
      response: { data: SpanDetail[] }
      errorResponse: unknown
    }
  }
  'queries.index': {
    methods: ['GET', 'HEAD']
    pattern: '/api/queries'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: { limit?: number; offset?: number; traceId?: string; dbSystem?: string }
      response: { data: QueryListItem[] }
      errorResponse: unknown
    }
  }
  'exceptions.index': {
    methods: ['GET', 'HEAD']
    pattern: '/api/exceptions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: { limit?: number; offset?: number; traceId?: string }
      response: { data: ExceptionListItem[] }
      errorResponse: unknown
    }
  }
  'logs.index': {
    methods: ['GET', 'HEAD']
    pattern: '/api/logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {
        limit?: number
        offset?: number
        severity?: string
        search?: string
        traceId?: string
      }
      response: { data: LogEntry[] }
      errorResponse: unknown
    }
  }
  'services.index': {
    methods: ['GET', 'HEAD']
    pattern: '/api/services'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: { data: string[] }
      errorResponse: unknown
    }
  }
  'jobs.index': {
    methods: ['GET', 'HEAD']
    pattern: '/api/jobs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: { limit?: number; offset?: number; traceId?: string }
      response: { data: JobListItem[] }
      errorResponse: unknown
    }
  }
  'commands.index': {
    methods: ['GET', 'HEAD']
    pattern: '/api/commands'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: { limit?: number; offset?: number; traceId?: string }
      response: { data: CommandListItem[] }
      errorResponse: unknown
    }
  }
  'external_calls.index': {
    methods: ['GET', 'HEAD']
    pattern: '/api/external-calls'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: { limit?: number; offset?: number; traceId?: string }
      response: { data: ExternalCallListItem[] }
      errorResponse: unknown
    }
  }
  'events.stream': {
    methods: ['GET', 'HEAD']
    pattern: '/api/events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
}

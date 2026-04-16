import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'otlp.traces': { paramsTuple?: []; params?: {} }
    'otlp.logs': { paramsTuple?: []; params?: {} }
    'services.index': { paramsTuple?: []; params?: {} }
    'traces.index': { paramsTuple?: []; params?: {} }
    'traces.show': { paramsTuple: [ParamValue]; params: { traceId: ParamValue } }
    'queries.index': { paramsTuple?: []; params?: {} }
    'exceptions.index': { paramsTuple?: []; params?: {} }
    'jobs.index': { paramsTuple?: []; params?: {} }
    'commands.index': { paramsTuple?: []; params?: {} }
    'external_calls.index': { paramsTuple?: []; params?: {} }
    'logs.index': { paramsTuple?: []; params?: {} }
    'data.clear': { paramsTuple?: []; params?: {} }
    'events.stream': { paramsTuple?: []; params?: {} }
    'mcp.handle': { paramsTuple?: []; params?: {} }
    'mcp.stream': { paramsTuple?: []; params?: {} }
    'mcp.delete': { paramsTuple?: []; params?: {} }
    'spa.fallback': { paramsTuple: [...ParamValue[]]; params: { '*': ParamValue[] } }
  }
  POST: {
    'otlp.traces': { paramsTuple?: []; params?: {} }
    'otlp.logs': { paramsTuple?: []; params?: {} }
    'mcp.handle': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'services.index': { paramsTuple?: []; params?: {} }
    'traces.index': { paramsTuple?: []; params?: {} }
    'traces.show': { paramsTuple: [ParamValue]; params: { traceId: ParamValue } }
    'queries.index': { paramsTuple?: []; params?: {} }
    'exceptions.index': { paramsTuple?: []; params?: {} }
    'jobs.index': { paramsTuple?: []; params?: {} }
    'commands.index': { paramsTuple?: []; params?: {} }
    'external_calls.index': { paramsTuple?: []; params?: {} }
    'logs.index': { paramsTuple?: []; params?: {} }
    'events.stream': { paramsTuple?: []; params?: {} }
    'mcp.stream': { paramsTuple?: []; params?: {} }
    'spa.fallback': { paramsTuple: [...ParamValue[]]; params: { '*': ParamValue[] } }
  }
  HEAD: {
    'services.index': { paramsTuple?: []; params?: {} }
    'traces.index': { paramsTuple?: []; params?: {} }
    'traces.show': { paramsTuple: [ParamValue]; params: { traceId: ParamValue } }
    'queries.index': { paramsTuple?: []; params?: {} }
    'exceptions.index': { paramsTuple?: []; params?: {} }
    'jobs.index': { paramsTuple?: []; params?: {} }
    'commands.index': { paramsTuple?: []; params?: {} }
    'external_calls.index': { paramsTuple?: []; params?: {} }
    'logs.index': { paramsTuple?: []; params?: {} }
    'events.stream': { paramsTuple?: []; params?: {} }
    'mcp.stream': { paramsTuple?: []; params?: {} }
    'spa.fallback': { paramsTuple: [...ParamValue[]]; params: { '*': ParamValue[] } }
  }
  DELETE: {
    'data.clear': { paramsTuple?: []; params?: {} }
    'mcp.delete': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}

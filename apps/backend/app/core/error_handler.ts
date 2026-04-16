import type { HttpContext } from '@adonisjs/core/http'

import { ExceptionHandler } from '@adonisjs/core/http'

export default class HttpErrorHandler extends ExceptionHandler {
  protected debug = false

  protected renderStatusPages = false

  #shouldRenderAsJson(request: HttpContext['request']) {
    if (request.url().startsWith('/api/')) return true
    return request.accepts(['json', 'application/vnd.api+json']) !== null
  }

  async handle(error: unknown, ctx: HttpContext) {
    const httpError = this.toHttpError(error)

    if (this.#shouldRenderAsJson(ctx.request)) {
      ctx.response.status(httpError.status).send({ error: httpError.message })
      return
    }

    return super.handle(error, ctx)
  }
}

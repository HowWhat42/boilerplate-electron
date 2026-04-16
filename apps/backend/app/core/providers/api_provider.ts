import { BaseSerializer } from '@adonisjs/core/transformers'
import { HttpContext } from '@adonisjs/core/http'

class ApiSerializer extends BaseSerializer<{ Wrap: undefined }> {
  wrap: undefined = undefined

  definePaginationMetaData(metaData: unknown) {
    return metaData
  }
}

const serializer = new ApiSerializer()

HttpContext.instanceProperty('serialize', serializer.serialize.bind(serializer))

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    serialize: ApiSerializer['serialize']
  }
}

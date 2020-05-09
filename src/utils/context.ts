import { FastifyRequest, FastifyReply } from 'fastify'
import { Http2ServerResponse } from 'http2'

declare module 'fastify' {
  interface FastifyRequest {}
}

export interface BaseContext {
  req: FastifyRequest
  res: FastifyReply<Http2ServerResponse>
}

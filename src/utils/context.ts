import { FastifyRequest, FastifyReply } from 'fastify'
import { Http2ServerResponse } from 'http2'

import { User } from '../modules/user/user.entity'

declare module 'fastify' {
  interface FastifyRequest {
    user: User
  }
}

export interface BaseContext {
  req: FastifyRequest
  res: FastifyReply<Http2ServerResponse>
}

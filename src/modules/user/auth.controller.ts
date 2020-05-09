import { FastifyInstance } from 'fastify'
import { sign } from 'jsonwebtoken'

import config from '../../config'

const authController = async (server: FastifyInstance) => {
  server.post('/login', async (request, reply) => {
    const { id, password } = request.body
    let payload: Object, token: string

    if (id === config.admin.username && password === config.admin.password) {
      payload = { type: 'admin', username: config.admin.username }
      token = sign(payload, config.admin.loginJWT!)
    } else {
      token = 'INVALID'
    }

    return reply.status(200).send({ type: 'success', token })
  })
}

export default authController

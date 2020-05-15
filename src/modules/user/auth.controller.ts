import { FastifyInstance } from 'fastify'
import { sign } from 'jsonwebtoken'

import { User } from './User.entity'
import config from '../../config'

const authController = async (server: FastifyInstance) => {
  // server.post('/email/verification', async () => {})
  // server.post('/email/verification-resend', async () => {})

  server.post('/login', async (request, reply) => {
    const { id, password } = request.body
    let payload: Object, token: string

    if (id === config.admin.username && password === config.admin.password) {
      payload = { type: 'admin', username: config.admin.username }
      token = sign(payload, config.admin.loginJWT!)
    } else {
      const user = await User.createQueryBuilder('user')
        .where(`user.username = :id OR user.email = :id`, { id })
        .getOne()

      if (!user || (user && !(await user.comparePassword(password)))) {
        return reply.status(400).send({ type: 'error', token: 'INCORRECT_CREDENTIALS' })
      }
      if (!user.confirmed) {
        return reply.status(400).send({ type: 'error', token: 'NOT_CONFIRMED' })
      }
      if (!user.active) {
        return reply.status(400).send({ type: 'error', token: 'DEACTIVATED' })
      }

      if (user.two_step) {
        user.two_step_code = `${Math.floor(100000 + Math.random() * 900000)}`
        await user.save()

        payload = { type: 'token', id: user.id }
        token = sign(payload, config.user.twoStepJWT!)
      } else {
        payload = { type: 'user', id: user.id, username: user.username }
        token = sign(payload, config.user.loginJWT!)
      }
    }

    return reply.status(200).send({ type: 'success', token })
  })

  // server.post('/login/two-step', async () => {})
  // server.post('/password/forgot', async () => {})
}

export default authController

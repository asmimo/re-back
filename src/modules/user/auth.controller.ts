import { FastifyInstance } from 'fastify'
import { sign, verify } from 'jsonwebtoken'

import { User } from './user.entity'
import config from '../../config'
import sendEmailVerification from '../../utils/mail_templates/sendEmailVerification'
import sendTwoStepCode from '../../utils/mail_templates/sendTwoStepCode'

const authController = async (server: FastifyInstance) => {
  server.post('/email/verification', async (request, reply) => {
    const { token } = request.query

    try {
      const { id }: any = await verify(token, config.user.registerJWT!)
      const user = await User.createQueryBuilder('user').where(`user.id = :id`, { id }).getOne()

      if (!user) {
        return reply.status(400).send({ token: 'NOT_FOUND' })
      }
      if (user.confirmed) {
        return reply.status(400).send({ token: 'ALREADY_VERIFIED' })
      }

      user.confirmed = true
      await user.save()

      return reply.status(200).send({ token: 'ACTION_SUCCESSFUL' })
    } catch (error) {
      return reply.status(400).send({ token: 'INVALID_TOKEN' })
    }
  })

  server.post('/email/verification-resend', async (request, reply) => {
    const { id } = request.body

    const user = await User.createQueryBuilder('user').where(`user.username = :id OR user.email = :id`, { id }).getOne()

    if (!user) {
      return reply.status(400).send({ token: 'NOT_FOUND' })
    }
    if (user.confirmed) {
      return reply.status(400).send({ token: 'ALREADY_VERIFIED' })
    }

    sendEmailVerification(user)
    return reply.status(200).send({ token: 'ACTION_SUCCESSFUL' })
  })

  server.post('/login', async (request, reply) => {
    const { id, password } = request.body

    if (id === config.admin.username && password === config.admin.password) {
      const payload = { role: 'admin', id: 1, username: config.admin.username }
      const token = sign(payload, config.admin.loginJWT!)

      return reply.status(200).send({ type: 'success', token })
    }

    const user = await User.createQueryBuilder('user').where(`user.username = :id OR user.email = :id`, { id }).getOne()

    if (!user || (user && !(await user.comparePassword(password)))) {
      return reply.status(400).send({ token: 'INCORRECT_CREDENTIALS' })
    }
    if (!user.confirmed) {
      return reply.status(400).send({ token: 'NOT_CONFIRMED' })
    }
    if (!user.active) {
      return reply.status(400).send({ token: 'DEACTIVATED' })
    }

    if (user.two_step) {
      user.two_step_code = `${Math.floor(100000 + Math.random() * 900000)}`
      await user.save()

      sendTwoStepCode(user)

      const payload = { id: user.id }
      const token = sign(payload, config.user.twoStepJWT!)

      return reply.status(200).send({ type: 'twoStep', token })
    }

    const payload = { role: 'user', id: user.id, username: user.username }
    const token = sign(payload, config.user.loginJWT!)

    return reply.status(200).send({ type: 'success', token })
  })

  server.post('/login/two-step', async (request, reply) => {
    const { twoStepToken, code } = request.body

    try {
      const { id }: any = await verify(twoStepToken, config.user.twoStepJWT!)
      const user = await User.createQueryBuilder('user').where(`user.id = :id`, { id }).getOne()

      if (!user) {
        return reply.status(400).send({ token: 'INCORRECT_CREDENTIALS' })
      }
      if (user.two_step_code !== code) {
        return reply.status(400).send({ token: 'INVALID_CODE' })
      }

      const payload = { role: 'user', id: user.id, username: user.username }
      const token = sign(payload, config.user.loginJWT!)

      return reply.status(200).send({ type: 'success', token })
    } catch (error) {
      return reply.status(400).send({ token: 'INVALID_TOKEN' })
    }
  })

  // server.post('/password/forgot', async () => {})
}

export default authController

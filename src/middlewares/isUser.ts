import { MiddlewareFn, ResolverData, NextFn } from 'type-graphql'
import { AuthenticationError } from 'apollo-server-fastify'
import { verify } from 'jsonwebtoken'

import { BaseContext } from '../utils/context'
import { User } from '../modules/user/User.entity'
import config from '../config'

export const UserMiddleware: MiddlewareFn<BaseContext> = async (
  { context }: ResolverData<BaseContext>,
  next: NextFn,
) => {
  const token = context.req.headers['authorization']

  if (!token) {
    throw new AuthenticationError('NO_TOKEN')
  }
  try {
    const { type, id }: any = verify(token, config.user.loginJWT!)
    const user = await User.createQueryBuilder('user').where(`user.id = :id`, { id }).getOne()

    if (type !== 'user' || !user) {
      throw new AuthenticationError('INVALID_TOKEN')
    }

    context.req.user = user
    next()
  } catch (error) {
    throw new AuthenticationError('INVALID_TOKEN')
  }
}

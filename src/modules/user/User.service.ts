import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { GraphQLResolveInfo } from 'graphql'
import { format } from 'date-fns'
import parseResolve from '../../utils/parseResolve'

import { User } from './User.entity'
import { CreateUserDTO, UserFilterDTO, UserPaginationDTO, UpdateUserDTO, UpdateUserPasswordDTO } from './user.dto'
import errorHandler from '../../utils/errorHandler'

@Service('UserService')
export class UserService {
  @InjectRepository(User)
  protected readonly userRepo: Repository<User>

  async createUser(dto: CreateUserDTO): Promise<User> {
    const { username, email, password, confirm, admin } = dto
    const user = new User()

    if (password !== confirm) {
      throw errorHandler({ message: 'DONOT_MATCH' })
    }

    user.username = username
    user.email = email
    user.password = password
    user.admin = admin

    try {
      await user.hashPassword()
      await user.save()

      return user
    } catch (error) {
      throw errorHandler({ error })
    }
  }

  async getUser(id: string, info?: GraphQLResolveInfo): Promise<User> {
    const query = this.userRepo.createQueryBuilder('user').where(`user.id = :id`, { id })

    if (info) {
      const relations = parseResolve(info, [])
      relations &&
        relations.map((relation) => {
          query.leftJoinAndSelect(`user.${relation}`, relation)
        })
    }

    const user = await query.getOne()
    if (!user) {
      throw errorHandler({ message: 'NOT_FOUND' })
    }

    return user
  }

  async getUsers(filter: UserFilterDTO, pagination: UserPaginationDTO, info: GraphQLResolveInfo): Promise<User[]> {
    const query = this.userRepo.createQueryBuilder('user')

    if (filter) {
      const { username, email, two_step, active, confirmed, admin, from, to } = filter

      if (username != null) {
        query.where(`user.username ILIKE :username`, { username: `%${username}%` })
      }
      if (email != null) {
        query.andWhere(`user.email ILIKE :email`, { email: `%${email}%` })
      }
      if (two_step != null) {
        query.andWhere(`user.two_step = :two_step`, { two_step })
      }
      if (active != null) {
        query.andWhere(`user.active = :active`, { active })
      }
      if (confirmed != null) {
        query.andWhere(`user.confirmed = :confirmed`, { confirmed })
      }
      if (admin != null) {
        query.andWhere(`user.admin = :admin`, { admin })
      }
      if (from || to) {
        const date = {
          from: from ? `${format(from, `yyyy-MM-dd`)}T00:00:00.000Z` : '2020-01-01T00:00:00.000Z',
          to: to ? `${format(to, `yyyy-MM-dd`)}T23:59:59.999Z` : new Date(),
        }
        query.andWhere(`user.created_at BETWEEN :from AND :to`, date)
      }
    }

    const { take, skip, sort, by } = pagination
    query.take(take).skip(skip).orderBy(`user.${by}`, sort)

    if (info) {
      const relations = parseResolve(info, [])
      relations &&
        relations.map((relation) => {
          query.leftJoinAndSelect(`user.${relation}`, relation)
        })
    }

    return query.getMany()
  }

  async updateUser(dto: UpdateUserDTO, password?: string): Promise<User> {
    const { id, username, email, two_step, active } = dto
    const user = await this.getUser(id)

    if (password && !(await user.comparePassword(password))) {
      throw errorHandler({ message: 'INCORRECT_CREDENTIALS' })
    }

    user.username = username
    user.email = email
    user.two_step = two_step
    user.active = active
    if (email) {
      user.confirmed = false
    }

    try {
      await user.save()

      return user
    } catch (error) {
      throw errorHandler({ error })
    }
  }

  async updateUserPassword(dto: UpdateUserPasswordDTO, password?: string): Promise<User> {
    const { id, new_password, confirm } = dto
    const user = await this.getUser(id)

    if (new_password !== confirm) {
      throw errorHandler({ message: 'DONOT_MATCH' })
    }
    if (password && !(await user.comparePassword(password))) {
      throw errorHandler({ message: 'INCORRECT_CREDENTIALS' })
    }

    user.password = new_password

    try {
      await user.hashPassword()
      await user.save()

      return user
    } catch (error) {
      throw errorHandler({ error })
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await this.userRepo.delete(id)
      return result.affected === 0 ? false : true
    } catch (error) {
      throw errorHandler({ error })
    }
  }
}

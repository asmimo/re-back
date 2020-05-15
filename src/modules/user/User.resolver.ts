import { Resolver, Mutation, Query, Info, Args, Arg } from 'type-graphql'
import { Inject } from 'typedi'
import { GraphQLResolveInfo } from 'graphql'

import { User } from './User.entity'
import { UserService } from './User.service'
import { CreateUserDTO, UserFilterDTO, UserPaginationDTO, UpdateUserDTO, UpdateUserPasswordDTO } from './user.dto'
import { IdDto } from '../../utils/global.dto'

@Resolver(User)
export class UserResolver {
  @Inject('UserService')
  public readonly userService: UserService

  @Mutation(() => User)
  async createAUser(@Args() dto: CreateUserDTO): Promise<User> {
    return this.userService.createUser(dto)
  }

  @Query(() => User)
  async getUser(@Args() { id }: IdDto, @Info() info: GraphQLResolveInfo): Promise<User> {
    return this.userService.getUser(id, info)
  }

  @Query(() => [User])
  async getUsers(
    @Arg('filter', { nullable: true }) filter: UserFilterDTO,
    @Args() pagination: UserPaginationDTO,
    @Info() info: GraphQLResolveInfo,
  ): Promise<User[]> {
    return this.userService.getUsers(filter, pagination, info)
  }

  @Mutation(() => User)
  async updateUser(@Args() dto: UpdateUserDTO, @Arg('password') password: string): Promise<User> {
    return this.userService.updateUser(dto, password)
  }

  @Mutation(() => User)
  async updateUserPassword(@Args() dto: UpdateUserPasswordDTO, @Arg('password') password: string): Promise<User> {
    return this.userService.updateUserPassword(dto, password)
  }

  @Mutation(() => User)
  async updateAUser(@Args() dto: UpdateUserDTO): Promise<User> {
    return this.userService.updateUser(dto)
  }

  @Mutation(() => User)
  async updateAUserPassword(@Args() dto: UpdateUserPasswordDTO): Promise<User> {
    return this.userService.updateUserPassword(dto)
  }

  @Mutation(() => Boolean)
  async deleteAUser(@Args() { id }: IdDto): Promise<boolean> {
    return this.userService.deleteUser(id)
  }
}

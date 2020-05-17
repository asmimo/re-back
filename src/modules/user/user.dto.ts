import { ArgsType, InputType, Field, ID } from 'type-graphql'
import { Length, Matches, IsEmail, IsUUID, IsIn } from 'class-validator'

import { DateFilterDTO, PaginationDTO } from '../../utils/global.dto'

@ArgsType()
export class CreateUserDTO {
  @Field()
  @Length(5, 15)
  @Matches(/^\S*$/, { message: 'Username must not include spaces' })
  username: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string

  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  confirm: string

  @Field({ defaultValue: false })
  admin: boolean

  @Field(() => ID)
  @IsUUID()
  organization_id: string
}

@InputType()
export class UserFilterDTO extends DateFilterDTO {
  @Field({ nullable: true })
  username?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  two_step?: boolean

  @Field({ nullable: true })
  active?: boolean

  @Field({ nullable: true })
  confirmed?: boolean

  @Field({ nullable: true })
  admin?: boolean

  @Field({ nullable: true })
  @IsUUID()
  organization_id?: string
}

@ArgsType()
export class UserPaginationDTO extends PaginationDTO {
  @Field({ defaultValue: 'created_at' })
  @IsIn(['username', 'email', 'two_step', 'active', 'confirmed', 'created_at', 'updated_at'])
  by: string
}

@ArgsType()
export class UpdateUserDTO {
  @Field(() => ID)
  @IsUUID()
  id: string

  @Field()
  @Length(5, 15)
  @Matches(/^\S*$/, { message: 'Username must not include spaces' })
  username: string

  @Field({ nullable: true })
  @IsEmail()
  email?: string

  @Field()
  two_step: boolean

  @Field()
  active: boolean
}

@ArgsType()
export class UpdateUserPasswordDTO {
  @Field(() => ID)
  @IsUUID()
  id: string

  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  new_password: string

  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  confirm: string
}

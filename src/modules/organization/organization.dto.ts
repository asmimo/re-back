import { ArgsType, InputType, Field, ID } from 'type-graphql'
import { IsEmail, IsIn, IsPhoneNumber } from 'class-validator'

import { DateFilterDTO, PaginationDTO } from '../../utils/global.dto'
import countries from '../../config/country'

@ArgsType()
export class CreateOrganizationDTO {
  @Field()
  name: string

  @Field({ nullable: true })
  @IsEmail()
  email?: string

  @Field()
  @IsPhoneNumber('ZZ')
  contact: string

  @Field({ nullable: true })
  @IsPhoneNumber('ZZ')
  contact1?: string

  @Field()
  @IsIn(countries.map((country) => country.name))
  country: string

  @Field()
  address: string

  @Field({ nullable: true })
  address1?: string
}

@InputType()
export class OrganizationFilterDTO extends DateFilterDTO {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  contact?: string

  @Field({ nullable: true })
  contact1?: string

  @Field({ nullable: true })
  country: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  address1?: string

  @Field({ nullable: true })
  active?: boolean
}

@ArgsType()
export class OrganizationPaginationDTO extends PaginationDTO {
  @Field({ defaultValue: 'created_at' })
  @IsIn([
    'name',
    'email',
    'contact',
    'contact1',
    'country',
    'address',
    'address1',
    'active',
    'created_at',
    'updated_at',
  ])
  by: string
}

@ArgsType()
export class UpdateOrganizationDTO {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  @IsEmail()
  email?: string

  @Field()
  @IsPhoneNumber('ZZ')
  contact: string

  @Field({ nullable: true })
  @IsPhoneNumber('ZZ')
  contact1?: string

  @Field()
  @IsIn(countries.map((country) => country.name))
  country: string

  @Field()
  address: string

  @Field({ nullable: true })
  address1?: string
}

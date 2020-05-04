import { ArgsType, InputType, Field, registerEnumType, ID, Int } from 'type-graphql'
import { IsUUID, IsIn, IsDate } from 'class-validator'

@ArgsType()
export class IdDto {
  @Field(() => ID)
  @IsUUID()
  id: string
}

export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}
registerEnumType(Sort, { name: 'Sort' })
@ArgsType()
export class PaginationDTO {
  @Field(() => Int, { defaultValue: 0 })
  take: number

  @Field(() => Int, { defaultValue: 0 })
  skip: number

  @Field(() => Sort, { defaultValue: Sort.DESC })
  @IsIn([Sort.ASC, Sort.DESC])
  sort: Sort
}

@InputType()
export class DateFilterDTO {
  @Field(() => Date, { nullable: true })
  @IsDate()
  from?: Date

  @Field(() => Date, { nullable: true })
  @IsDate()
  to?: Date
}

import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'

import { Organization } from '../organization/organization.entity'

@ObjectType()
@Entity()
export class Subscription extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column()
  type: 'medium' | 'large'

  @Field()
  @Column()
  web: boolean

  @Field(() => String)
  @Column('date')
  expires_on: string

  @Field()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date

  @Field()
  @Column()
  organization_id: string

  @Field(() => Organization)
  @OneToOne(() => Organization, (organization) => organization.subscription)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization
}

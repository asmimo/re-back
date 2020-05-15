import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
@Entity()
export class Organization extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ unique: true })
  name: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string

  @Field()
  @Column()
  contact: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  contact1?: string

  @Field()
  @Column()
  country: string

  @Field()
  @Column()
  address: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  address1?: string

  @Field()
  @Column({ default: true })
  active: boolean

  @Field()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date
}

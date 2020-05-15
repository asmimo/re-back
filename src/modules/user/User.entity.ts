import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import bcrypt from 'bcryptjs'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ unique: true })
  username: string

  @Field()
  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Field()
  @Column({ default: false })
  two_step: boolean

  @Field({ nullable: true })
  @Column({ nullable: true })
  two_step_code?: string

  @Field()
  @Column({ default: false })
  active: boolean

  @Field()
  @Column({ default: false })
  confirmed: boolean

  @Field()
  @Column()
  admin: boolean

  @Field()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date

  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }
}

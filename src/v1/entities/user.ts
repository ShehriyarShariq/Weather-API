import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm'
import * as bcrypt from 'bcrypt'

export enum UserRoleEnumType {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserSubscriptionEnumType {
  HOBBY = 'free',
  PREMIUM = 'premium',
  BUSINESSES = 'businesses',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column({
    unique: true,
  })
  email: string

  @Column()
  password: string

  @Column({
    type: 'enum',
    enum: UserRoleEnumType,
    default: UserRoleEnumType.USER,
  })
  role: UserRoleEnumType.USER

  @Column({
    type: 'enum',
    enum: UserSubscriptionEnumType,
    default: UserSubscriptionEnumType.HOBBY,
  })
  subscription: UserSubscriptionEnumType.HOBBY

  @Column({ type: 'timestamptz' })
  created_at: Date

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12)
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string,
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword)
  }
}

require('dotenv').config()
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import config from 'config'

const postgresConfig = config.get<{
  host: string
  port: number
  username: string
  password: string
  database: string
}>('postgresConfig')

export const AppDataSource = new DataSource({
  ...postgresConfig,
  type: 'postgres',
  synchronize: true,
  // migrationsRun: true,
  logging: false,
  entities: ['src/v1/entities/**/*.entity.{ts,js}'],
  migrations: ['src/v1/migrations/**/*.{ts,js}'],
  // subscribers: ['src/subscribers/**/*{.ts,.js}'],
})

require('dotenv').config()
import config from 'config'
import validateEnv from './v1/utils/validate_env'
import express, { Response } from 'express'
import cors from 'cors'
import { AppDataSource } from './v1/db/db_config'
import redisClient from './v1/db/redis_config'
import verifyJWT from './v1/middleware/auth.middleware'

AppDataSource.initialize()
  .then(async () => {
    validateEnv()

    const app = express()

    app.use(cors())
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())

    app.get('/', async (_, res: Response) => {
      res.status(200).json({
        status: 'success',
        message: 'Hello World!',
      })
    })

    app.use(verifyJWT)

    app.get('/authenticated', async (_, res: Response) => {
      res.status(200).json({
        status: 'success',
        message: 'Authenticated Hello World!',
      })
    })

    const port = config.get<number>('port')
    app.listen(port)

    console.log(`Server started on port: ${port}`)
  })
  .catch((error) => console.log(error))

require('dotenv').config()
import express, { Response } from 'express'
import config from 'config'
import validateEnv from './utils/validate_env'
import { AppDataSource } from './db/db_config'
import redisClient from './db/redis_config'

// AppDataSource.initialize()
//   .then(async () => {
//     validateEnv()

//     const app = express()

//     app.get('/', async (_, res: Response) => {
//       res.status(200).json({
//         status: 'success',
//         message: 'Hello World!',
//       })
//     })

//     const port = config.get<number>('port')
//     app.listen(port)
//   })
//   .catch((error) => console.log(error))

const app = express()

app.get('/', async (_, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello World!',
  })
})

const port = config.get<number>('port')
app.listen(port)

console.log(`Server started on port: ${port}`)

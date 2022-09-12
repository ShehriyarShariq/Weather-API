require('dotenv').config()
import config from 'config'
import validateEnv from './v1/utils/validate_env'
import express, { Response } from 'express'
import cors from 'cors'
import { AppDataSource } from './v1/db/db_config'
import AuthRouter from './v1/routes/auth'
import AirQualityRouter from './v1/routes/air_quality'
import AdminRouter from './v1/routes/admin'
import { createAdminIfDoesNotExist } from './v1/controllers/admin.controller'

import verifyJWT from './v1/middleware/auth.middleware'
import { logger } from './v1/middleware/logs.middleware'

// Perform Database Connection and Initialization
AppDataSource.initialize()
  .then(async () => {
    validateEnv()

    await createAdminIfDoesNotExist(
      config.get<string>('adminUser'),
      config.get<string>('adminPassword'),
    )

    const app = express()

    // Logger Middleware
    app.use(logger)

    // Cross Origin Resource Sharing
    app.use(cors())

    // built-in middleware to handle urlencoded form data
    app.use(express.urlencoded({ extended: false }))

    // built-in middleware for json
    app.use(express.json())

    // Authentication Endpoints
    app.use('/v1/auth', AuthRouter)
    app.use('/v1/admin', AdminRouter)

    // Middle for checking presence of Authorization JWT Token in Header
    app.use(verifyJWT)
    app.use('/v1/air_quality', AirQualityRouter)

    // Get PORT from .env file
    const port = config.get<number>('port')
    app.listen(port)

    console.log(`Server started on port: ${port}`)
  })
  .catch((error) => console.log(error))

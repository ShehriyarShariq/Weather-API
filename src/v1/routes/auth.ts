import * as express from 'express'

const AuthRouter = express.Router()
import {
  handleLogin,
  handleRegister,
  handleTokenRefresh,
} from './../controllers/auth_controller'

AuthRouter.post('/login', handleLogin)
AuthRouter.post('/register', handleRegister)
AuthRouter.post('/refresh', handleTokenRefresh)

export default AuthRouter

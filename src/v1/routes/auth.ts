import * as express from 'express'

const AuthRouter = express.Router()
import {
  handleLogin,
  handleRegister,
  handleLogout,
} from './../controllers/auth_controller'

AuthRouter.post('/login', handleLogin)
AuthRouter.post('/register', handleRegister)
AuthRouter.post('/register', handleLogout)

export default AuthRouter

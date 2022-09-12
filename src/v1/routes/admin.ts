import * as express from 'express'

const AdminRouter = express.Router()
import { handleLogin } from './../controllers/admin.controller'

AdminRouter.post('/login', handleLogin)

export default AdminRouter

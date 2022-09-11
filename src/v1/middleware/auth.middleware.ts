require('dotenv').config()
import { Request, Response, NextFunction } from 'express'
import config from 'config'
import DataStoredInToken from '../interfaces/data_stored_in_token'

import * as jwt from 'jsonwebtoken'

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]
  jwt.verify(
    token,
    config.get<string>('jwtAccessTokenSecret'),
    (err, decoded) => {
      if (err) return res.sendStatus(403) //invalid token
      req.body.user = (decoded as DataStoredInToken)._id
      next()
    },
  )
}

export default verifyJWT

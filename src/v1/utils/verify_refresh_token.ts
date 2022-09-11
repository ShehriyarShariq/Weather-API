require('dotenv').config()
import config from 'config'
import * as jwt from 'jsonwebtoken'
import DataStoredInToken from '../interfaces/data_stored_in_token'

export const verifyRefresh = (id: string, token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      config.get<string>('jwtRefreshTokenSecret'),
    )

    return (decoded as DataStoredInToken)._id == id
  } catch (error) {
    return false
  }
}

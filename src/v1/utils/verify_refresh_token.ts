require('dotenv').config()
import config from 'config'
import * as jwt from 'jsonwebtoken'
import DataStoredInToken from '../interfaces/data_stored_in_token'

// Verify that the provided refresh token belongs to the valid user.
export const verifyRefresh = (id: string, token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      config.get<string>('jwtRefreshTokenSecret'),
    )

    return (decoded as DataStoredInToken).id == id
  } catch (error) {
    return false
  }
}

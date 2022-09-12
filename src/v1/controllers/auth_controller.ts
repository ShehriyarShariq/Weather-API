require('dotenv').config()
import config from 'config'
import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import redisClient from './../db/redis_config'
import { AppDataSource } from '../db/db_config'
import { User } from '../entities/user.entity'
import { verifyRefresh } from '../utils/verify_refresh_token'
import { time_remaining_until_month_end_in_seconds } from '../utils/date_utils'

const usersRepository = AppDataSource.getRepository(User)

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password)
    return res
      .status(400)
      .json({ status: 'failure', message: 'Email and password are required.' })

  let foundUser: User
  try {
    const user = await usersRepository.findOneBy({
      email: email,
    })

    if (user == null) {
      return res.sendStatus(401) //Unauthorized
    }

    foundUser = user
  } catch (error) {
    return res.sendStatus(401) //Unauthorized
  }

  await usersRepository
    .findOneBy({
      email: email,
    })
    .then((value) => {
      if (value == null) {
        return res.sendStatus(401) //Unauthorized
      }

      foundUser = value
    })
    .catch(() => {
      return res.sendStatus(401) //Unauthorized
    })

  // evaluate password
  const match: boolean = await bcrypt.compare(password, foundUser.password)
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      { id: foundUser.id },
      config.get<string>('jwtAccessTokenSecret'),
      { expiresIn: '1200s' },
    )
    const refreshToken = jwt.sign(
      { id: foundUser.id },
      config.get<string>('jwtRefreshTokenSecret'),
      { expiresIn: '7d' },
    )

    await usersRepository.update(
      {
        id: foundUser.id,
      },
      {
        refresh_token: refreshToken,
      },
    )

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
        accessTokenExpiry: '1200s',
        refreshTokenExpiry: '7d',
      },
    })
  } else {
    res.sendStatus(401)
  }
}

export const handleRegister = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({
      status: 'failure',
      message: 'Username and password are required.',
    })

  try {
    const user = await usersRepository.findOneBy({
      email: email,
    })

    console.log(user)

    if (user != null) {
      return res.sendStatus(409) //Conflict
    }
  } catch (error) {}

  try {
    //store the new user
    const newUser = usersRepository.create({
      email: email,
      password: password,
    })

    const user: User = await usersRepository.save(newUser)

    // Add User Max Monthly API Calls Limit Expiry to Redis
    await redisClient.set(`MONTHLY_LIMIT_USER_${user.id}`, 0)
    await redisClient.expire(
      `MONTHLY_LIMIT_USER_${user.id}`,
      time_remaining_until_month_end_in_seconds(),
    )

    res
      .status(201)
      .json({ status: 'success', message: `New user ${email} created!` })
  } catch (err) {
    res.status(500).json({ status: 'failure', message: (err as any).message })
  }
}

export const handleTokenRefresh = async (req: Request, res: Response) => {
  const { id, refresh_token } = req.body
  if (!id || !refresh_token)
    return res.status(400).json({
      status: 'failure',
      message: 'User ID and Refresh token are required.',
    })

  const isValid = verifyRefresh(id, refresh_token)

  if (!isValid)
    return res
      .status(401)
      .json({ status: 'failure', message: 'Invalid refresh token.' })

  const accessToken = jwt.sign(
    { id },
    config.get<string>('jwtAccessTokenSecret'),
    { expiresIn: '1200s' },
  )

  res.status(200).json({ status: 'success', data: { accessToken } })
}

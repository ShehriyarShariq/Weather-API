require('dotenv').config()
import config from 'config'
import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { AppDataSource } from '../db/db_config'
import {
  User,
  UserRoleEnumType,
  UserSubscriptionEnumType,
} from '../entities/user.entity'

const usersRepository = AppDataSource.getRepository(User)

export const createAdminIfDoesNotExist = async (
  email: string,
  password: string,
) => {
  let foundAdmin = await usersRepository.findOneBy({
    email: email,
  })
  if (!foundAdmin) {
    const newUser = usersRepository.create({
      email: email,
      password: password,
      role: UserRoleEnumType.ADMIN,
      subscription: UserSubscriptionEnumType.BUSINESSES,
    })

    await usersRepository.save(newUser)
  }
}

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password)
    return res
      .status(400)
      .json({ status: 'failure', message: 'Email and password are required.' })

  let foundAdmin: User
  try {
    const user = await usersRepository.findOneBy({
      email: email,
    })

    if (user == null) {
      return res.sendStatus(401) //Unauthorized
    }

    foundAdmin = user
  } catch (error) {
    return res.sendStatus(401) //Unauthorized
  }

  // evaluate password
  const match: boolean = await bcrypt.compare(password, foundAdmin.password)
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      { id: foundAdmin.id },
      config.get<string>('jwtAccessTokenSecret'),
    )

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
      },
    })
  } else {
    res.sendStatus(401)
  }
}

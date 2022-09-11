require('dotenv').config()

import express, { Request, Response } from 'express'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import redisClient from './../db/redis_config'

export const handleLogin = async (req: Request, res: Response) => {}

export const handleRegister = async (req: Request, res: Response) => {}

export const handleLogout = async (req: Request, res: Response) => {}

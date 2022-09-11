require('dotenv').config()
import redisClient from './../db/redis_config'

import express, { Request, Response } from 'express'

export const handleFetchAirQualityByCoordinates = async (
  req: Request,
  res: Response,
) => {}

export const handleFetchMostPollutedTime = async (
  req: Request,
  res: Response,
) => {}

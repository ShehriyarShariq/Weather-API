require('dotenv').config()
import { Request, Response } from 'express'
import redisClient from './../db/redis_config'
import Constants from '../utils/constants'
import { AppDataSource } from '../db/db_config'
import { LocationAirQuality } from '../entities/location_air_quality.entity'
import { fetchAirQualityByCoordinatesService } from '../services/air_quality_by_coordinates.service'

const locationAirQualityRepository = AppDataSource.getRepository(
  LocationAirQuality,
)

export const handleFetchAirQualityByCoordinates = async (
  req: Request,
  res: Response,
) => {
  const { user } = res.locals
  const lat: string = req.query.lat as string
  const lng: string = req.query.lng as string

  if (!lat || !lng)
    return res.status(400).json({
      status: 'failure',
      message: 'Latitude and Longitude coordinates are required.',
    })

  const currentRate: string | null = await redisClient.get(
    `RATE_LIMIT_USER_${user}`,
  )

  if (!currentRate) {
    await redisClient.set(`RATE_LIMIT_USER_${user}`, 1)
    await redisClient.expire(`RATE_LIMIT_USER_${user}`, 60)
  } else if (parseInt(currentRate) == Constants.rate_limiting['minute']) {
    return res.status(429).json({
      status: 'failure',
      message: 'API limit reached. Please try again in a minute.',
    })
  } else {
    await redisClient.incr(`RATE_LIMIT_USER_${user}`)
  }

  const locations: LocationAirQuality[] = await locationAirQualityRepository.query(
    `
      SELECT * , ST_Distance(ST_MakePoint(${lat}, ${lng}), location) AS dist 
      FROM location_air_quality  
      WHERE ST_Distance(ST_MakePoint(${lat}, ${lng}), location) <= 100000
      ORDER BY dist 
      LIMIT 1
    `,
  )

  if (locations.length > 0) {
    return res
      .status(200)
      .json({ status: 'success', data: locations[0].toJSON() })
  }

  const locationResponse = await fetchAirQualityByCoordinatesService(lat, lng)

  if (!locationResponse)
    return res
      .status(404)
      .json({ status: 'failure', message: 'Location not available.' })

  const locationAirQuality = await locationAirQualityRepository.create(
    locationResponse,
  )

  const savedLocation: LocationAirQuality = await locationAirQualityRepository.save(
    locationAirQuality,
  )

  return res
    .status(200)
    .json({ status: 'success', data: savedLocation.toJSON() })
}

export const handleFetchMostPollutedTime = async (
  req: Request,
  res: Response,
) => {
  const { city } = req.body

  if (!city)
    return res
      .status(400)
      .json({ status: 'failure', message: 'City name is required.' })

  const mostPollutedLocations: LocationAirQuality[] = await locationAirQualityRepository.query(
    `
      SELECT *
      FROM location_air_quality
      WHERE city = ${city}
      ORDER BY aqius DESC
      LIMIT 1
    `,
  )

  if (mostPollutedLocations.length > 0) {
    return res.status(200).json({
      status: 'success',
      data: mostPollutedLocations[0].ts,
    })
  } else {
    return res.status(404).json({
      status: 'failure',
      message: `No data available for ${city}.`,
    })
  }
}

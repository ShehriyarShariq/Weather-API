import * as express from 'express'

const AirQualityRouter = express.Router()
import {
  handleFetchAirQualityByCoordinates,
  handleFetchMostPollutedTime,
} from './../controllers/air_quality_controller'

AirQualityRouter.get('/', handleFetchAirQualityByCoordinates)
AirQualityRouter.get('/most_polluted', handleFetchMostPollutedTime)

export default AirQualityRouter

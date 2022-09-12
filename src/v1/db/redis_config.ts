require('dotenv').config()
import { createClient } from 'redis'
import config from 'config'

const port = config.get<number>('redisPort')

const redisUrl = `redis://redis:${port}`

const redisClient = createClient({
  url: redisUrl,
})

const connectRedis = async () => {
  try {
    await redisClient.connect()
  } catch (error) {
    console.log(error)
    setTimeout(connectRedis, 5000)
  }
}

connectRedis()

export default redisClient

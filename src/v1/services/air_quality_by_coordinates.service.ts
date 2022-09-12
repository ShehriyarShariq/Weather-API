require('dotenv').config()
import config from 'config'

import { Point } from 'geojson'
import fetch from 'node-fetch'

// Fetch data from the IQ Air API
export const fetchAirQualityByCoordinatesService = async (
  lat: string,
  lng: string,
) => {
  const url = `http://api.airvisual.com/v2/nearest_city?key=${config.get<
    string
  >('iqAirAPIKey')}&lat=${lat}&lon=${lng}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    // Spatial Column
    const location: Point = {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)],
    }

    if (data['status'] == 'success') {
      return {
        city: data['data']['city'],
        country: data['data']['country'],
        // location: data['data']['location'],
        location: location,
        ts: data['data']['current']['pollution']['ts'],
        aqius: data['data']['current']['pollution']['aqius'],
        mainus: data['data']['current']['pollution']['mainus'],
        aqicn: data['data']['current']['pollution']['aqicn'],
        maincn: data['data']['current']['pollution']['maincn'],
      }
    } else {
      return null
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

import axios from 'axios'

export const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'

export const weatherClient = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
})

export const geoClient = axios.create({
  baseURL: GEO_URL,
  timeout: 12000,
})

// Attach the API key to every request automatically
function attachKey(config) {
  config.params = { ...config.params, appid: API_KEY }
  return config
}

weatherClient.interceptors.request.use(attachKey)
geoClient.interceptors.request.use(attachKey)

export class WeatherApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'WeatherApiError'
    this.status = status
  }
}

export function normalizeError(error) {
  if (!API_KEY) {
    return new WeatherApiError(
      'No OpenWeatherMap API key found. Add VITE_OPENWEATHER_API_KEY to your .env file.',
      'NO_KEY'
    )
  }
  if (error.response) {
    const status = error.response.status
    if (status === 401) {
      return new WeatherApiError(
        'Invalid API key. New OpenWeatherMap keys can take up to 2 hours to activate.',
        401
      )
    }
    if (status === 404) {
      return new WeatherApiError('Location not found. Try a different search.', 404)
    }
    if (status === 429) {
      return new WeatherApiError('Rate limit reached. Please wait a moment and try again.', 429)
    }
    return new WeatherApiError(error.response.data?.message || 'Weather service error.', status)
  }
  if (error.request) {
    return new WeatherApiError('Network error. Check your connection and try again.', 'NETWORK')
  }
  return new WeatherApiError(error.message || 'Unexpected error.', 'UNKNOWN')
}

import { weatherClient, geoClient, normalizeError } from './apiClient'

/**
 * Get current weather by coordinates.
 */
export async function getCurrentWeatherByCoords(lat, lon, units = 'metric') {
  try {
    const { data } = await weatherClient.get('/weather', {
      params: { lat, lon, units },
    })
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Get current weather by city name (e.g. "London", "London,GB").
 */
export async function getCurrentWeatherByCity(city, units = 'metric') {
  try {
    const { data } = await weatherClient.get('/weather', {
      params: { q: city, units },
    })
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Get current weather by zip/postal code (e.g. "94040,us").
 */
export async function getCurrentWeatherByZip(zip, units = 'metric') {
  try {
    const { data } = await weatherClient.get('/weather', {
      params: { zip, units },
    })
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Air Quality Index + pollutant breakdown by coordinates.
 */
export async function getAirQuality(lat, lon) {
  try {
    const { data } = await weatherClient.get('/air_pollution', {
      params: { lat, lon },
    })
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Direct geocoding: turn a free-text query into a list of place matches.
 * Used for search auto-suggestions.
 */
export async function searchPlaces(query, limit = 5) {
  if (!query || query.trim().length < 2) return []
  try {
    const { data } = await geoClient.get('/direct', {
      params: { q: query, limit },
    })
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Reverse geocoding: turn coordinates into a human-readable place name.
 */
export async function reverseGeocode(lat, lon) {
  try {
    const { data } = await geoClient.get('/reverse', {
      params: { lat, lon, limit: 1 },
    })
    return data?.[0] || null
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Geocode a zip/postal code into coordinates + place name.
 */
export async function geocodeZip(zip) {
  try {
    const { data } = await geoClient.get('/zip', {
      params: { zip },
    })
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

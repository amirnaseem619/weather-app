import { weatherClient, normalizeError } from './apiClient'

/**
 * Raw 5-day / 3-hour forecast from OpenWeatherMap's free Forecast API.
 * Returns ~40 timestamped entries (every 3 hours).
 */
export async function getForecastByCoords(lat, lon, units = 'metric') {
  try {
    const { data } = await weatherClient.get('/forecast', {
      params: { lat, lon, units },
    })
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

export async function getForecastByCity(city, units = 'metric') {
  try {
    const { data } = await weatherClient.get('/forecast', {
      params: { q: city, units },
    })
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Take the raw 3-hour list and slice the next 24 hours for the
 * hourly forecast strip.
 */
export function extractHourly(forecastData, hours = 24) {
  if (!forecastData?.list) return []
  return forecastData.list.slice(0, Math.ceil(hours / 3)).map((entry) => ({
    dt: entry.dt,
    time: new Date(entry.dt * 1000),
    temp: Math.round(entry.main.temp),
    feelsLike: Math.round(entry.main.feels_like),
    condition: entry.weather[0].main,
    conditionId: entry.weather[0].id,
    description: entry.weather[0].description,
    icon: entry.weather[0].icon,
    pop: Math.round((entry.pop || 0) * 100), // probability of precipitation
    windSpeed: entry.wind.speed,
    humidity: entry.main.humidity,
  }))
}

/**
 * Collapse the 3-hour list into per-day highs/lows/dominant condition.
 * OpenWeather's free 5-day/3-hour forecast endpoint only covers ~5 calendar
 * days of data (and the first/last day may be partial), so this returns
 * however many full days are available rather than padding to 7.
 * A 7-day forecast on the free tier would require the One Call API,
 * which needs a separate paid subscription.
 */
export function extractDaily(forecastData) {
  if (!forecastData?.list) return []

  const byDay = {}
  forecastData.list.forEach((entry) => {
    const dateKey = new Date(entry.dt * 1000).toISOString().split('T')[0]
    if (!byDay[dateKey]) byDay[dateKey] = []
    byDay[dateKey].push(entry)
  })

  const days = Object.entries(byDay).map(([dateKey, entries]) => {
    const temps = entries.map((e) => e.main.temp)
    const high = Math.round(Math.max(...temps))
    const low = Math.round(Math.min(...temps))

    // Pick the condition from the entry closest to midday as "representative"
    const midday = entries.reduce((best, e) => {
      const hour = new Date(e.dt * 1000).getHours()
      const bestHour = new Date(best.dt * 1000).getHours()
      return Math.abs(hour - 13) < Math.abs(bestHour - 13) ? e : best
    }, entries[0])

    const avgWind =
      entries.reduce((sum, e) => sum + e.wind.speed, 0) / entries.length
    const avgHumidity =
      entries.reduce((sum, e) => sum + e.main.humidity, 0) / entries.length
    const maxPop = Math.max(...entries.map((e) => e.pop || 0))

    return {
      date: new Date(dateKey),
      dateKey,
      high,
      low,
      condition: midday.weather[0].main,
      conditionId: midday.weather[0].id,
      description: midday.weather[0].description,
      icon: midday.weather[0].icon,
      windSpeed: Math.round(avgWind * 10) / 10,
      humidity: Math.round(avgHumidity),
      pop: Math.round(maxPop * 100),
    }
  })

  return days
}

/**
 * Build time-series arrays suitable for Recharts: temperature, humidity,
 * wind speed, and rain probability trends across the forecast window.
 */
export function buildTrendSeries(forecastData) {
  if (!forecastData?.list) return []
  return forecastData.list.map((entry) => ({
    time: new Date(entry.dt * 1000).toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
    }),
    temp: Math.round(entry.main.temp),
    humidity: entry.main.humidity,
    wind: Math.round(entry.wind.speed * 10) / 10,
    rain: Math.round((entry.pop || 0) * 100),
  }))
}

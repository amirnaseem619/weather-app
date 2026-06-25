import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import {
  getCurrentWeatherByCoords,
  getAirQuality,
  reverseGeocode,
} from '../services/weatherApi'
import { getForecastByCoords } from '../services/forecastApi'
import { getCurrentPosition } from '../services/geolocation'

const WeatherContext = createContext(null)

const UNITS_KEY = 'weather-app:units'

export function WeatherProvider({ children }) {
  const [units, setUnits] = useState(
    () => localStorage.getItem(UNITS_KEY) || 'metric'
  )
  const [location, setLocation] = useState(null) // { lat, lon, name, country, state }
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [airQuality, setAirQuality] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [usingGeolocation, setUsingGeolocation] = useState(false)

  useEffect(() => {
    localStorage.setItem(UNITS_KEY, units)
  }, [units])

  const toggleUnits = useCallback(() => {
    setUnits((prev) => (prev === 'metric' ? 'imperial' : 'metric'))
  }, [])

  /**
   * Fetches everything needed for a location in parallel and updates
   * the shared state that every page reads from.
   */
  const loadLocation = useCallback(
    async (lat, lon, displayName) => {
      setLoading(true)
      setError(null)
      try {
        const [currentData, forecastData, aqData] = await Promise.all([
          getCurrentWeatherByCoords(lat, lon, units),
          getForecastByCoords(lat, lon, units),
          getAirQuality(lat, lon),
        ])

        let name = displayName
        if (!name) {
          const place = await reverseGeocode(lat, lon).catch(() => null)
          name = place
            ? `${place.name}${place.state ? ', ' + place.state : ''}, ${place.country}`
            : currentData.name
        }

        setCurrent(currentData)
        setForecast(forecastData)
        setAirQuality(aqData)
        setLocation({ lat, lon, name })
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    },
    [units]
  )

  // Re-fetch automatically when units change, so temps convert correctly
  // (OpenWeather returns pre-converted values per unit system).
  useEffect(() => {
    if (location) {
      loadLocation(location.lat, location.lon, location.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units])

  const locateMe = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { lat, lon } = await getCurrentPosition()
      setUsingGeolocation(true)
      await loadLocation(lat, lon)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }, [loadLocation])

  const selectPlace = useCallback(
    (place) => {
      setUsingGeolocation(false)
      const name = `${place.name}${place.state ? ', ' + place.state : ''}, ${place.country}`
      loadLocation(place.lat, place.lon, name)
    },
    [loadLocation]
  )

  return (
    <WeatherContext.Provider
      value={{
        units,
        toggleUnits,
        location,
        current,
        forecast,
        airQuality,
        loading,
        error,
        usingGeolocation,
        loadLocation,
        locateMe,
        selectPlace,
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  const ctx = useContext(WeatherContext)
  if (!ctx) throw new Error('useWeather must be used within a WeatherProvider')
  return ctx
}

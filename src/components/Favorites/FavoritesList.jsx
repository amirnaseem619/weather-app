import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiMapPin } from 'react-icons/fi'
import { useFavorites } from '../../context/FavoritesContext'
import { useWeather } from '../../context/WeatherContext'
import { getCurrentWeatherByCoords } from '../../services/weatherApi'
import { getWeatherVisual } from '../../utils/weatherVisuals'
import { formatTemp, unitSymbol } from '../../utils/formatters'

/**
 * Fetches a lightweight current-conditions snapshot for each favorite
 * so the list shows live temps without loading the full dashboard.
 */
function useFavoritesSnapshot(favorites, units) {
  const [snapshots, setSnapshots] = useState({})
  const [loadingIds, setLoadingIds] = useState(new Set())

  useEffect(() => {
    let cancelled = false
    async function loadAll() {
      const ids = favorites.map((f) => `${f.lat}-${f.lon}`)
      setLoadingIds(new Set(ids))
      const results = await Promise.allSettled(
        favorites.map((f) => getCurrentWeatherByCoords(f.lat, f.lon, units))
      )
      if (cancelled) return
      const next = {}
      results.forEach((res, idx) => {
        const key = ids[idx]
        if (res.status === 'fulfilled') next[key] = res.value
      })
      setSnapshots(next)
      setLoadingIds(new Set())
    }
    if (favorites.length) loadAll()
    return () => {
      cancelled = true
    }
  }, [favorites, units])

  return { snapshots, loadingIds }
}

export default function FavoritesList() {
  const { favorites, removeFavorite } = useFavorites()
  const { units, selectPlace } = useWeather()
  const { snapshots, loadingIds } = useFavoritesSnapshot(favorites, units)

  if (favorites.length === 0) {
    return (
      <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-10 text-center text-white/70">
        <FiMapPin size={32} className="mx-auto mb-3 text-white/40" />
        <p className="font-medium">No favorite cities yet</p>
        <p className="text-sm text-white/50 mt-1">
          Tap the heart on any city's weather card to save it here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {favorites.map((place) => {
          const key = `${place.lat}-${place.lon}`
          const snapshot = snapshots[key]
          const isLoading = loadingIds.has(key)
          const visual = snapshot
            ? getWeatherVisual(snapshot.weather[0].id, snapshot.weather[0].icon)
            : null

          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-3xl bg-white/15 dark:bg-white/5 backdrop-blur-2xl border border-white/15 p-5 text-white relative overflow-hidden group"
            >
              <button
                onClick={() => removeFavorite(place.lat, place.lon)}
                aria-label={`Remove ${place.name} from favorites`}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 text-white/60 hover:text-red-400 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
              >
                <FiTrash2 size={14} />
              </button>

              <button
                onClick={() => selectPlace(place)}
                className="w-full text-left"
              >
                <p className="font-semibold pr-6">{place.name}</p>
                <p className="text-xs text-white/50 mb-3">{place.country}</p>

                {isLoading && <div className="h-12 bg-white/10 rounded-xl animate-pulse" />}

                {!isLoading && snapshot && (
                  <div className="flex items-center gap-3">
                    <visual.Icon size={36} />
                    <div>
                      <p className="text-2xl font-semibold">
                        {formatTemp(snapshot.main.temp, units)}
                        {unitSymbol(units)}
                      </p>
                      <p className="text-xs text-white/60 capitalize">
                        {snapshot.weather[0].description}
                      </p>
                    </div>
                  </div>
                )}

                {!isLoading && !snapshot && (
                  <p className="text-sm text-white/50">Couldn't load weather</p>
                )}
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

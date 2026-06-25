import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const FavoritesContext = createContext(null)

const FAVORITES_KEY = 'weather-app:favorites'
const HISTORY_KEY = 'weather-app:recent'
const MAX_HISTORY = 8

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => readStorage(FAVORITES_KEY, []))
  const [recent, setRecent] = useState(() => readStorage(HISTORY_KEY, []))

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(recent))
  }, [recent])

  const isFavorite = useCallback(
    (lat, lon) =>
      favorites.some(
        (f) => Math.abs(f.lat - lat) < 0.01 && Math.abs(f.lon - lon) < 0.01
      ),
    [favorites]
  )

  const addFavorite = useCallback((place) => {
    setFavorites((prev) => {
      if (prev.some((f) => Math.abs(f.lat - place.lat) < 0.01 && Math.abs(f.lon - place.lon) < 0.01)) {
        return prev
      }
      return [...prev, place]
    })
  }, [])

  const removeFavorite = useCallback((lat, lon) => {
    setFavorites((prev) =>
      prev.filter((f) => !(Math.abs(f.lat - lat) < 0.01 && Math.abs(f.lon - lon) < 0.01))
    )
  }, [])

  const toggleFavorite = useCallback(
    (place) => {
      if (isFavorite(place.lat, place.lon)) {
        removeFavorite(place.lat, place.lon)
      } else {
        addFavorite(place)
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  )

  const addToRecent = useCallback((place) => {
    setRecent((prev) => {
      const filtered = prev.filter(
        (p) => !(Math.abs(p.lat - place.lat) < 0.01 && Math.abs(p.lon - place.lon) < 0.01)
      )
      return [place, ...filtered].slice(0, MAX_HISTORY)
    })
  }, [])

  const clearRecent = useCallback(() => setRecent([]), [])

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        recent,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        addToRecent,
        clearRecent,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider')
  return ctx
}

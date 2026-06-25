import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiMapPin, FiX } from 'react-icons/fi'
import { useDebounce } from '../../hooks/useDebounce'
import { searchPlaces, geocodeZip } from '../../services/weatherApi'
import { useWeather } from '../../context/WeatherContext'
import { useFavorites } from '../../context/FavoritesContext'

const ZIP_PATTERN = /^\d{4,6}$|^\d{4,6},[a-zA-Z]{2}$/

export default function SearchBar({ onSelect, autoFocus = false }) {
  const { register, watch, setValue } = useForm({ defaultValues: { query: '' } })
  const query = watch('query')
  const debouncedQuery = useDebounce(query, 350)

  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const containerRef = useRef(null)

  const { selectPlace } = useWeather()
  const { addToRecent } = useFavorites()

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([])
      return
    }

    let cancelled = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        if (ZIP_PATTERN.test(debouncedQuery.trim())) {
          const place = await geocodeZip(debouncedQuery.trim())
          if (!cancelled && place) {
            setResults([
              { name: place.name, country: place.country, lat: place.lat, lon: place.lon },
            ])
          }
        } else {
          const places = await searchPlaces(debouncedQuery.trim())
          if (!cancelled) setResults(places)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  function handleSelect(place) {
    selectPlace(place)
    addToRecent(place)
    onSelect?.(place)
    setValue('query', '')
    setResults([])
    setIsOpen(false)
  }

  function clear() {
    setValue('query', '')
    setResults([])
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 bg-white/15 dark:bg-white/5 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/20 focus-within:border-sky/60 transition-colors">
        <FiSearch className="text-white/70 shrink-0" size={18} />
        <input
          {...register('query')}
          autoFocus={autoFocus}
          type="text"
          placeholder="Search city, country, or zip code"
          onFocus={() => setIsOpen(true)}
          className="bg-transparent outline-none w-full text-white placeholder:text-white/50 text-sm"
          aria-label="Search for a location"
        />
        {query && (
          <button onClick={clear} aria-label="Clear search" className="text-white/60 hover:text-white">
            <FiX size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query?.length >= 2) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute z-30 mt-2 w-full rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
          >
            {loading && (
              <div className="p-4 text-sm text-slate-400">Searching…</div>
            )}
            {!loading && error && (
              <div className="p-4 text-sm text-red-500">{error}</div>
            )}
            {!loading && !error && results.length === 0 && (
              <div className="p-4 text-sm text-slate-400">No matches found.</div>
            )}
            {!loading &&
              results.map((place, idx) => (
                <button
                  key={`${place.lat}-${place.lon}-${idx}`}
                  onClick={() => handleSelect(place)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <FiMapPin className="text-primary shrink-0" size={16} />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-700 dark:text-slate-100 truncate">
                      {place.name}
                      {place.state ? `, ${place.state}` : ''}
                    </p>
                    <p className="text-xs text-slate-400">{place.country}</p>
                  </div>
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

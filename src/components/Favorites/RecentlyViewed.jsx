import { FiClock, FiX } from 'react-icons/fi'
import { useFavorites } from '../../context/FavoritesContext'
import { useWeather } from '../../context/WeatherContext'

export default function RecentlyViewed() {
  const { recent, clearRecent } = useFavorites()
  const { selectPlace } = useWeather()

  if (recent.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-display font-semibold text-lg flex items-center gap-2">
          <FiClock size={18} /> Recently Viewed
        </h2>
        <button onClick={clearRecent} className="text-xs text-white/60 hover:text-white flex items-center gap-1">
          <FiX size={12} /> Clear
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {recent.map((place) => (
          <button
            key={`${place.lat}-${place.lon}`}
            onClick={() => selectPlace(place)}
            className="shrink-0 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
          >
            {place.name}
          </button>
        ))}
      </div>
    </div>
  )
}

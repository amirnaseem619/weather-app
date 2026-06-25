import { motion } from 'framer-motion'
import { FiMapPin, FiHeart } from 'react-icons/fi'
import { WiHumidity, WiStrongWind, WiBarometer, WiSunrise } from 'react-icons/wi'
import { getWeatherVisual } from '../../utils/weatherVisuals'
import { formatTemp, unitSymbol, windSpeedLabel, formatFullDate } from '../../utils/formatters'
import { useWeather } from '../../context/WeatherContext'
import { useFavorites } from '../../context/FavoritesContext'

export default function WeatherCard() {
  const { current, location, units } = useWeather()
  const { isFavorite, toggleFavorite } = useFavorites()

  if (!current) return null

  const { Icon, label } = getWeatherVisual(current.weather[0].id, current.weather[0].icon)
  const temp = formatTemp(current.main.temp, units)
  const feelsLike = formatTemp(current.main.feels_like, units)
  const symbol = unitSymbol(units)
  const favorited = location ? isFavorite(location.lat, location.lon) : false

  const stats = [
    { Icon: WiHumidity, label: 'Humidity', value: `${current.main.humidity}%` },
    { Icon: WiStrongWind, label: 'Wind', value: windSpeedLabel(current.wind.speed, units) },
    { Icon: WiBarometer, label: 'Pressure', value: `${current.main.pressure} hPa` },
    {
      Icon: WiSunrise,
      label: 'Visibility',
      value: current.visibility ? `${(current.visibility / 1000).toFixed(1)} km` : '--',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-3xl bg-white/15 dark:bg-white/5 backdrop-blur-2xl border border-white/20 p-6 sm:p-8 text-white"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-white/80 text-sm font-medium">
            <FiMapPin size={14} />
            {location?.name}
          </div>
          <p className="text-white/60 text-xs mt-1">{formatFullDate(new Date())}</p>
        </div>
        <button
          onClick={() =>
            location &&
            toggleFavorite({ name: location.name.split(',')[0], lat: location.lat, lon: location.lon, country: '' })
          }
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <FiHeart
            size={20}
            className={favorited ? 'fill-red-400 text-red-400' : 'text-white/70'}
          />
        </button>
      </div>

      <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon size={88} className="text-white drop-shadow-lg" />
          </motion.div>
          <div>
            <div className="flex items-start font-display">
              <span className="text-6xl sm:text-7xl font-semibold leading-none">{temp}</span>
              <span className="text-3xl mt-1">{symbol}</span>
            </div>
            <p className="text-white/80 capitalize mt-1">{current.weather[0].description || label}</p>
          </div>
        </div>
        <p className="text-white/70 text-sm">
          Feels like {feelsLike}
          {symbol}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white/10 p-3 flex flex-col items-center gap-1 text-center"
          >
            <stat.Icon size={26} className="text-sky" />
            <span className="text-sm font-semibold">{stat.value}</span>
            <span className="text-[11px] text-white/60">{stat.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

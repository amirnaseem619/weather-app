import { motion } from 'framer-motion'
import FavoritesList from '../../components/Favorites/FavoritesList'
import RecentlyViewed from '../../components/Favorites/RecentlyViewed'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import { useWeather } from '../../context/WeatherContext'
import { getWeatherVisual } from '../../utils/weatherVisuals'

export default function Favorites() {
  const { current } = useWeather()
  const scene = current
    ? getWeatherVisual(current.weather[0].id, current.weather[0].icon).scene
    : 'cloudy'

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground scene={scene} />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 space-y-10">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-display font-semibold text-2xl"
        >
          Favorite Cities
        </motion.h1>

        <FavoritesList />
        <RecentlyViewed />
      </div>
    </div>
  )
}

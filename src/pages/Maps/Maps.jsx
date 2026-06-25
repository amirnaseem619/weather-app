import { motion } from 'framer-motion'
import WeatherMap from '../../components/WeatherMap/WeatherMap'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import { useWeather } from '../../context/WeatherContext'
import { getWeatherVisual } from '../../utils/weatherVisuals'

export default function Maps() {
  const { current, location } = useWeather()
  const scene = current
    ? getWeatherVisual(current.weather[0].id, current.weather[0].icon).scene
    : 'cloudy'

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground scene={scene} />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-display font-semibold text-2xl mb-1"
        >
          Weather Map
        </motion.h1>
        <p className="text-white/60 text-sm mb-8">
          Switch layers to see temperature, rain, wind, and cloud cover overlays.
        </p>
        <WeatherMap location={location} />
      </div>
    </div>
  )
}

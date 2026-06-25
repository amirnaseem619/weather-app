import { motion } from 'framer-motion'
import AlertBanner from '../../components/Alerts/AlertBanner'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import { useWeather } from '../../context/WeatherContext'
import { useWeatherNotifications } from '../../hooks/useWeatherNotifications'
import { getWeatherVisual } from '../../utils/weatherVisuals'

export default function Alerts() {
  const { current, forecast } = useWeather()
  const notifications = useWeatherNotifications(current, forecast)
  const scene = current
    ? getWeatherVisual(current.weather[0].id, current.weather[0].icon).scene
    : 'cloudy'

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground scene={scene} />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-display font-semibold text-2xl mb-1"
        >
          Weather Alerts
        </motion.h1>
        <p className="text-white/60 text-sm mb-8">
          Live conditions are checked against storm, heat, cold, wind, and rain thresholds.
        </p>
        <AlertBanner notifications={notifications} />
      </div>
    </div>
  )
}

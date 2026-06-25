import { motion } from 'framer-motion'
import { useWeather } from '../../context/WeatherContext'
import WeatherChart from '../../components/WeatherChart/WeatherChart'
import HourlyForecast from '../../components/ForecastCard/HourlyForecast'
import DailyForecast from '../../components/ForecastCard/DailyForecast'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import { getWeatherVisual } from '../../utils/weatherVisuals'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'

export default function Forecast() {
  const { current, forecast, loading, location } = useWeather()

  const scene = current
    ? getWeatherVisual(current.weather[0].id, current.weather[0].icon).scene
    : 'sunny'

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground scene={scene} />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-display font-semibold text-2xl mb-1"
        >
          Weather Analytics
        </motion.h1>
        <p className="text-white/60 text-sm mb-8">
          {location ? `Trends for ${location.name}` : 'Search a city to see trends'}
        </p>

        {loading && !forecast && <LoadingScreen label="Crunching the forecast…" />}

        {forecast && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <WeatherChart />
              <DailyForecast />
            </div>
            <div>
              <HourlyForecast />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

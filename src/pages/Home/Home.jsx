import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiAlertCircle } from 'react-icons/fi'
import { useWeather } from '../../context/WeatherContext'
import SearchBar from '../../components/SearchBar/SearchBar'
import WeatherCard from '../../components/WeatherCard/WeatherCard'
import HourlyForecast from '../../components/ForecastCard/HourlyForecast'
import DailyForecast from '../../components/ForecastCard/DailyForecast'
import AirQualityCard from '../../components/AirQualityCard/AirQualityCard'
import SunMoonCard from '../../components/SunMoon/SunMoonCard'
import ConditionsCard from '../../components/AirQualityCard/ConditionsCard'
import { HeroSkeleton, CardSkeleton, StripSkeleton } from '../../components/LoadingScreen/LoadingScreen'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import { getWeatherVisual } from '../../utils/weatherVisuals'

export default function Home() {
  const { current, loading, error, locateMe, location } = useWeather()

  useEffect(() => {
    if (!location && !loading) {
      locateMe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scene = current
    ? getWeatherVisual(current.weather[0].id, current.weather[0].icon).scene
    : 'sunny'

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground scene={scene} />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <SearchBar />
          <button
            onClick={locateMe}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium transition-colors backdrop-blur-xl"
          >
            <FiMapPin size={16} /> Weather Near Me
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 rounded-2xl bg-red-500/20 border border-red-400/40 p-4 flex items-center gap-3 text-red-100"
          >
            <FiAlertCircle size={20} className="shrink-0" />
            <p className="text-sm">{error.message}</p>
          </motion.div>
        )}

        {loading && !current && (
          <div className="space-y-6">
            <HeroSkeleton />
            <StripSkeleton />
            <div className="grid sm:grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        )}

        {current && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <WeatherCard />
              <HourlyForecast />
              <DailyForecast />
            </div>
            <div className="space-y-6">
              <SunMoonCard />
              <AirQualityCard />
              <ConditionsCard />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

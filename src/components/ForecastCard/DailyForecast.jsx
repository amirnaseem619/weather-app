import { motion } from 'framer-motion'
import { getWeatherVisual } from '../../utils/weatherVisuals'
import { formatTemp, formatDayName } from '../../utils/formatters'
import { useWeather } from '../../context/WeatherContext'
import { extractDaily } from '../../services/forecastApi'
import { WiRaindrop } from 'react-icons/wi'

export default function DailyForecast() {
  const { forecast, units } = useWeather()
  if (!forecast) return null

  const daily = extractDaily(forecast)
  const overallHigh = Math.max(...daily.map((d) => d.high))
  const overallLow = Math.min(...daily.map((d) => d.low))

  return (
    <div>
      <h2 className="text-white font-display font-semibold text-lg mb-3">
        {daily.length}-Day Forecast
      </h2>
      <div className="rounded-3xl bg-white/15 dark:bg-white/5 backdrop-blur-2xl border border-white/15 divide-y divide-white/10 overflow-hidden">
        {daily.map((day, idx) => {
          const { Icon } = getWeatherVisual(day.conditionId, day.icon)
          const range = overallHigh - overallLow || 1
          const leftPct = ((day.low - overallLow) / range) * 100
          const widthPct = ((day.high - day.low) / range) * 100

          return (
            <motion.div
              key={day.dateKey}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className="flex items-center gap-4 px-5 py-3.5 text-white"
            >
              <span className="w-12 text-sm font-medium">
                {idx === 0 ? 'Today' : formatDayName(day.date)}
              </span>
              <Icon size={28} className="shrink-0" />
              <span className="flex items-center gap-0.5 text-xs text-sky w-12 shrink-0">
                <WiRaindrop size={15} />
                {day.pop}%
              </span>
              <span className="text-xs w-10 text-right text-white/60">
                {formatTemp(day.low, units)}°
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-white/15 relative">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-sky to-sun"
                  style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 6)}%` }}
                />
              </div>
              <span className="text-sm w-10 font-semibold">{formatTemp(day.high, units)}°</span>
            </motion.div>
          )
        })}
      </div>
      <p className="text-white/50 text-xs mt-2 px-1">
        Based on OpenWeatherMap's free 5-day forecast. For a full 7-day outlook, upgrade to the One Call API.
      </p>
    </div>
  )
}

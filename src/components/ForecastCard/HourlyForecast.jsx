import { motion } from 'framer-motion'
import { getWeatherVisual } from '../../utils/weatherVisuals'
import { formatTemp, unitSymbol, formatTime } from '../../utils/formatters'
import { useWeather } from '../../context/WeatherContext'
import { extractHourly } from '../../services/forecastApi'
import { WiRaindrop } from 'react-icons/wi'

export default function HourlyForecast() {
  const { forecast, units } = useWeather()
  if (!forecast) return null

  const hourly = extractHourly(forecast, 24)
  const symbol = unitSymbol(units)

  return (
    <div>
      <h2 className="text-white font-display font-semibold text-lg mb-3">Next 24 Hours</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {hourly.map((hour, idx) => {
          const { Icon } = getWeatherVisual(hour.conditionId, hour.icon)
          return (
            <motion.div
              key={hour.dt}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
              className="shrink-0 w-20 rounded-2xl bg-white/15 dark:bg-white/5 backdrop-blur-xl border border-white/15 p-3 flex flex-col items-center gap-1.5 text-white"
            >
              <span className="text-xs text-white/70">{idx === 0 ? 'Now' : formatTime(hour.time)}</span>
              <Icon size={28} />
              <span className="font-semibold text-sm">
                {formatTemp(hour.temp, units)}
                {symbol}
              </span>
              <span className="flex items-center gap-0.5 text-[11px] text-sky">
                <WiRaindrop size={14} />
                {hour.pop}%
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

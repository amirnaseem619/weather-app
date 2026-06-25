import { motion } from 'framer-motion'
import { useWeather } from '../../context/WeatherContext'
import { dewPoint, unitSymbol } from '../../utils/formatters'

export default function ConditionsCard() {
  const { current, units } = useWeather()
  if (!current) return null

  const dp = dewPoint(current.main.temp, current.main.humidity)
  const symbol = unitSymbol(units)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl bg-white/15 dark:bg-white/5 backdrop-blur-2xl border border-white/15 p-6 text-white"
    >
      <h2 className="font-display font-semibold text-lg mb-4">Conditions</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-xs text-white/60 mb-1">Dew Point</p>
          <p className="text-2xl font-semibold">
            {dp}
            {symbol}
          </p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-xs text-white/60 mb-1">Cloud Cover</p>
          <p className="text-2xl font-semibold">{current.clouds?.all ?? '--'}%</p>
        </div>
      </div>
      <p className="text-white/40 text-[11px] mt-3">
        UV Index requires OpenWeatherMap's One Call API (paid tier) and isn't included with this key.
      </p>
    </motion.div>
  )
}

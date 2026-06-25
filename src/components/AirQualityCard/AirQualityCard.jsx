import { motion } from 'framer-motion'
import { useWeather } from '../../context/WeatherContext'
import { getAqiInfo } from '../../utils/formatters'

const POLLUTANTS = [
  { key: 'pm2_5', label: 'PM2.5', unit: 'μg/m³' },
  { key: 'pm10', label: 'PM10', unit: 'μg/m³' },
  { key: 'o3', label: 'Ozone', unit: 'μg/m³' },
  { key: 'co', label: 'Carbon Monoxide', unit: 'μg/m³' },
]

export default function AirQualityCard() {
  const { airQuality } = useWeather()
  if (!airQuality?.list?.length) return null

  const reading = airQuality.list[0]
  const aqi = reading.main.aqi
  const info = getAqiInfo(aqi)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-white/15 dark:bg-white/5 backdrop-blur-2xl border border-white/15 p-6 text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">Air Quality</h2>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: `${info.color}33`, color: info.color }}
        >
          {info.label}
        </span>
      </div>

      <p className="text-white/70 text-sm mb-5">{info.description}</p>

      <div className="grid grid-cols-2 gap-3">
        {POLLUTANTS.map((p) => (
          <div key={p.key} className="rounded-2xl bg-white/10 p-3">
            <p className="text-[11px] text-white/60">{p.label}</p>
            <p className="font-semibold text-sm mt-0.5">
              {reading.components[p.key]?.toFixed(1) ?? '--'}
              <span className="text-[10px] text-white/50 ml-1">{p.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

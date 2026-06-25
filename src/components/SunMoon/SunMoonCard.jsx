import { motion } from 'framer-motion'
import { WiSunrise, WiSunset } from 'react-icons/wi'
import { useWeather } from '../../context/WeatherContext'
import { formatTime, dayLength, getMoonPhase } from '../../utils/formatters'

export default function SunMoonCard() {
  const { current } = useWeather()
  if (!current?.sys) return null

  const sunrise = new Date(current.sys.sunrise * 1000)
  const sunset = new Date(current.sys.sunset * 1000)
  const length = dayLength(current.sys.sunrise, current.sys.sunset)
  const moon = getMoonPhase()

  const now = Date.now() / 1000
  const progress = Math.min(
    100,
    Math.max(
      0,
      ((now - current.sys.sunrise) / (current.sys.sunset - current.sys.sunrise)) * 100
    )
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl bg-white/15 dark:bg-white/5 backdrop-blur-2xl border border-white/15 p-6 text-white"
    >
      <h2 className="font-display font-semibold text-lg mb-5">Sun &amp; Moon</h2>

      <div className="relative h-20 mb-4">
        <div className="absolute top-1/2 left-0 right-0 h-1 rounded-full bg-white/15" />
        <motion.div
          className="absolute top-1/2 w-4 h-4 -mt-2 rounded-full bg-sun shadow-[0_0_16px_4px_rgba(250,204,21,0.6)]"
          style={{ left: `calc(${progress}% - 8px)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <div className="absolute -top-1 left-0 flex flex-col items-center text-xs text-white/70">
          <WiSunrise size={26} />
          {formatTime(sunrise)}
        </div>
        <div className="absolute -top-1 right-0 flex flex-col items-center text-xs text-white/70">
          <WiSunset size={26} />
          {formatTime(sunset)}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-white/80 mb-4">
        <span>Day length</span>
        <span className="font-semibold">{length}</span>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
        <span className="text-3xl">{moon.emoji}</span>
        <div>
          <p className="text-xs text-white/60">Moon Phase</p>
          <p className="font-semibold text-sm">{moon.name}</p>
        </div>
      </div>
    </motion.div>
  )
}

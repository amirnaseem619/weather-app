import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWeather } from '../../context/WeatherContext'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import AnimatedBackground from '../../components/common/AnimatedBackground'

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Urdu', 'Arabic']
const NOTIF_KEY = 'weather-app:notifications'
const LANG_KEY = 'weather-app:language'

function Row({ title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-white/10 last:border-0">
      <div>
        <p className="text-white font-medium text-sm">{title}</p>
        {description && <p className="text-white/50 text-xs mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { units, toggleUnits } = useWeather()
  const { isDark } = useTheme()

  const [language, setLanguage] = useState(
    () => localStorage.getItem(LANG_KEY) || 'English'
  )
  const [notifPrefs, setNotifPrefs] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(NOTIF_KEY)) || {
          rain: true,
          storm: true,
          tempSwings: false,
        }
      )
    } catch {
      return { rain: true, storm: true, tempSwings: false }
    }
  })

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language)
  }, [language])

  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifPrefs))
  }, [notifPrefs])

  function toggleNotif(key) {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground scene={isDark ? 'night' : 'cloudy'} />
      <div className="max-w-2xl mx-auto px-4 sm:px-8 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-display font-semibold text-2xl mb-8"
        >
          Settings
        </motion.h1>

        <div className="rounded-3xl bg-white/15 dark:bg-white/5 backdrop-blur-2xl border border-white/15 p-6">
          <Row title="Temperature Units" description="Switch between Celsius and Fahrenheit">
            <button
              onClick={toggleUnits}
              className="px-4 py-2 rounded-full bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition-colors"
            >
              {units === 'metric' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
            </button>
          </Row>

          <Row title="Dark Mode" description="Toggle the app's color theme">
            <ThemeToggle />
          </Row>

          <Row title="Language" description="Display language for the interface">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/15 text-white text-sm rounded-full px-3 py-2 outline-none border border-white/20"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="text-slate-800">
                  {lang}
                </option>
              ))}
            </select>
          </Row>

          <Row title="Rain notifications" description="Alert when rain is expected soon">
            <Switch checked={notifPrefs.rain} onChange={() => toggleNotif('rain')} />
          </Row>
          <Row title="Storm warnings" description="Alert during active severe weather">
            <Switch checked={notifPrefs.storm} onChange={() => toggleNotif('storm')} />
          </Row>
          <Row title="Temperature swings" description="Alert on large day-to-day changes">
            <Switch checked={notifPrefs.tempSwings} onChange={() => toggleNotif('tempSwings')} />
          </Row>
        </div>

        <p className="text-white/40 text-xs mt-4 px-1">
          Language selection currently changes display preference only; full interface translation isn't wired up yet.
        </p>
      </div>
    </div>
  )
}

function Switch({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-white/20'
      }`}
    >
      <motion.div
        className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

export function formatTemp(celsius, unit = 'metric') {
  if (celsius === null || celsius === undefined) return '--'
  if (unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32)
  }
  return Math.round(celsius)
}

export function convertTemp(celsius, unit) {
  return unit === 'imperial' ? (celsius * 9) / 5 + 32 : celsius
}

export function unitSymbol(unit) {
  return unit === 'imperial' ? '°F' : '°C'
}

export function windSpeedLabel(speedMs, unit) {
  if (unit === 'imperial') {
    return `${Math.round(speedMs * 2.237)} mph`
  }
  return `${Math.round(speedMs * 3.6)} km/h`
}

export function formatTime(date, opts = {}) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    ...opts,
  }).format(date)
}

export function formatDayName(date, opts = {}) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', ...opts }).format(date)
}

export function formatFullDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * AQI scale per OpenWeather's Air Pollution API (1-5 index).
 */
export const AQI_LEVELS = {
  1: { label: 'Good', color: '#22c55e', description: 'Air quality is satisfactory.' },
  2: { label: 'Fair', color: '#84cc16', description: 'Air quality is acceptable.' },
  3: { label: 'Moderate', color: '#facc15', description: 'Sensitive groups may notice effects.' },
  4: { label: 'Poor', color: '#f97316', description: 'Health effects possible for everyone.' },
  5: { label: 'Very Poor', color: '#ef4444', description: 'Health warnings of emergency conditions.' },
}

export function getAqiInfo(aqi) {
  return AQI_LEVELS[aqi] || AQI_LEVELS[3]
}

export function dewPoint(tempC, humidity) {
  // Magnus-Tetens approximation
  const a = 17.27
  const b = 237.7
  const alpha = (a * tempC) / (b + tempC) + Math.log(humidity / 100)
  return Math.round((b * alpha) / (a - alpha))
}

export function dayLength(sunrise, sunset) {
  const diffMs = sunset * 1000 - sunrise * 1000
  const hours = Math.floor(diffMs / 3600000)
  const minutes = Math.floor((diffMs % 3600000) / 60000)
  return `${hours}h ${minutes}m`
}

/**
 * Approximate moon phase (0 = new moon, 0.5 = full moon, 1 = next new moon)
 * using a simple synodic-month calculation. Good enough for a UI badge,
 * not for astronomical precision.
 */
export function getMoonPhase(date = new Date()) {
  const synodicMonth = 29.53058867
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime()
  const diffDays = (date.getTime() - knownNewMoon) / 86400000
  const phase = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth
  const fraction = phase / synodicMonth

  if (fraction < 0.03 || fraction > 0.97) return { name: 'New Moon', emoji: '🌑' }
  if (fraction < 0.22) return { name: 'Waxing Crescent', emoji: '🌒' }
  if (fraction < 0.28) return { name: 'First Quarter', emoji: '🌓' }
  if (fraction < 0.47) return { name: 'Waxing Gibbous', emoji: '🌔' }
  if (fraction < 0.53) return { name: 'Full Moon', emoji: '🌕' }
  if (fraction < 0.72) return { name: 'Waning Gibbous', emoji: '🌖' }
  if (fraction < 0.78) return { name: 'Last Quarter', emoji: '🌗' }
  return { name: 'Waning Crescent', emoji: '🌘' }
}

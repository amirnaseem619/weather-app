import {
  WiDaySunny,
  WiNightClear,
  WiCloud,
  WiCloudy,
  WiDayCloudyHigh,
  WiNightAltCloudy,
  WiRain,
  WiShowers,
  WiThunderstorm,
  WiSnow,
  WiFog,
  WiDust,
  WiStrongWind,
} from 'react-icons/wi'

/**
 * Maps OpenWeatherMap's condition codes (https://openweathermap.org/weather-conditions)
 * to an icon component and a "scene" key used to drive the animated background.
 */
export function getWeatherVisual(conditionCode, icon) {
  const isNight = icon?.endsWith('n')
  const code = Number(conditionCode)

  if (code >= 200 && code < 300) {
    return { Icon: WiThunderstorm, scene: 'thunderstorm', label: 'Thunderstorm' }
  }
  if (code >= 300 && code < 400) {
    return { Icon: WiShowers, scene: 'rain', label: 'Drizzle' }
  }
  if (code >= 500 && code < 600) {
    return { Icon: WiRain, scene: 'rain', label: 'Rain' }
  }
  if (code >= 600 && code < 700) {
    return { Icon: WiSnow, scene: 'snow', label: 'Snow' }
  }
  if (code >= 700 && code < 800) {
    if (code === 731 || code === 761 || code === 762) {
      return { Icon: WiDust, scene: 'mist', label: 'Dust' }
    }
    return { Icon: WiFog, scene: 'mist', label: 'Mist' }
  }
  if (code === 800) {
    return isNight
      ? { Icon: WiNightClear, scene: 'night', label: 'Clear' }
      : { Icon: WiDaySunny, scene: 'sunny', label: 'Clear' }
  }
  if (code === 801 || code === 802) {
    return isNight
      ? { Icon: WiNightAltCloudy, scene: 'night-cloudy', label: 'Partly Cloudy' }
      : { Icon: WiDayCloudyHigh, scene: 'cloudy', label: 'Partly Cloudy' }
  }
  if (code === 803 || code === 804) {
    return { Icon: WiCloudy, scene: 'cloudy', label: 'Cloudy' }
  }
  return { Icon: WiCloud, scene: 'cloudy', label: 'Cloudy' }
}

export const SCENE_GRADIENTS = {
  sunny: 'from-sky-400 via-sky-300 to-sun/40',
  cloudy: 'from-slate-400 via-slate-300 to-cloud',
  'night-cloudy': 'from-slate-800 via-slate-700 to-dusk',
  rain: 'from-slate-600 via-sky-700 to-sky-deep',
  thunderstorm: 'from-slate-800 via-slate-700 to-dark',
  snow: 'from-sky-100 via-cloud to-frost',
  mist: 'from-slate-300 via-cloud to-mist',
  night: 'from-night via-night-soft to-dusk',
}

export function isWindy(windSpeedMs) {
  return windSpeedMs >= 10.8 // ~ Beaufort 6+, "strong wind"
}

export const WindIcon = WiStrongWind

import { useMemo } from 'react'

/**
 * Derives plain-language notifications from live data: rain expected soon,
 * severe conditions now, large temperature swings, and any official alerts
 * the API returned. This stands in for push notifications, which need a
 * service worker + backend to deliver outside the browser tab.
 */
export function useWeatherNotifications(current, forecast) {
  return useMemo(() => {
    const notifications = []
    if (!current) return notifications

    const code = current.weather?.[0]?.id
    const description = current.weather?.[0]?.description

    if (code >= 200 && code < 300) {
      notifications.push({
        id: 'storm-now',
        type: 'severe',
        title: 'Thunderstorm warning',
        message: `Active thunderstorm conditions: ${description}. Avoid open areas.`,
      })
    }

    if (current.main?.temp >= 38) {
      notifications.push({
        id: 'heat-now',
        type: 'warning',
        title: 'Extreme heat',
        message: `It's currently ${Math.round(current.main.temp)}°. Stay hydrated and limit sun exposure.`,
      })
    }

    if (current.main?.temp <= -10) {
      notifications.push({
        id: 'cold-now',
        type: 'warning',
        title: 'Extreme cold',
        message: `It's currently ${Math.round(current.main.temp)}°. Dress in layers and limit time outdoors.`,
      })
    }

    if (current.wind?.speed >= 17) {
      notifications.push({
        id: 'wind-now',
        type: 'warning',
        title: 'High wind advisory',
        message: 'Strong winds are active in your area. Secure loose outdoor objects.',
      })
    }

    if (forecast?.list?.length) {
      const next6h = forecast.list.slice(0, 2)
      const rainComing = next6h.find((entry) => (entry.pop || 0) >= 0.6)
      if (rainComing && !(code >= 500 && code < 600)) {
        const hour = new Date(rainComing.dt * 1000).toLocaleTimeString('en-US', {
          hour: 'numeric',
        })
        notifications.push({
          id: 'rain-soon',
          type: 'info',
          title: 'Rain expected',
          message: `${Math.round(rainComing.pop * 100)}% chance of rain around ${hour}.`,
        })
      }
    }

    return notifications
  }, [current, forecast])
}

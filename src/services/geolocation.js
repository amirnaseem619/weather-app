/**
 * Wraps the browser Geolocation API in a promise so it can be awaited
 * like any other async data source.
 */
export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (error) => {
        const messages = {
          1: 'Location access was denied. Enable it in your browser settings to use "Weather Near Me".',
          2: 'Your location could not be determined right now.',
          3: 'The location request timed out. Please try again.',
        }
        reject(new Error(messages[error.code] || 'Unable to retrieve your location.'))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
        ...options,
      }
    )
  })
}

/**
 * Watches the user's position over time. Returns an unsubscribe function.
 */
export function watchPosition(onUpdate, onError) {
  if (!('geolocation' in navigator)) {
    onError?.(new Error('Geolocation is not supported by this browser.'))
    return () => {}
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onUpdate({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      })
    },
    (error) => onError?.(error),
    { enableHighAccuracy: true, maximumAge: 5 * 60 * 1000 }
  )

  return () => navigator.geolocation.clearWatch(watchId)
}

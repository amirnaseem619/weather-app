import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { API_KEY } from '../../services/apiClient'

// Leaflet's default marker icons reference image paths that don't resolve
// correctly through Vite's bundler, so they're rebuilt from CDN URLs here.
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const LAYERS = {
  temp_new: { label: 'Temperature' },
  precipitation_new: { label: 'Rain' },
  wind_new: { label: 'Wind' },
  clouds_new: { label: 'Clouds' },
}

function RecenterOnChange({ lat, lon }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lon) map.setView([lat, lon], map.getZoom())
  }, [lat, lon, map])
  return null
}

export default function WeatherMap({ location }) {
  const [layer, setLayer] = useState('temp_new')
  const center = location ? [location.lat, location.lon] : [20, 0]
  const zoom = location ? 8 : 2

  if (!API_KEY) {
    return (
      <div className="rounded-3xl bg-white/10 border border-white/15 p-10 text-center text-white/70">
        Add your OpenWeatherMap API key to see live map layers.
      </div>
    )
  }

  return (
    <div className="rounded-3xl overflow-hidden border border-white/15 relative">
      <div className="absolute top-3 right-3 z-[1000] flex gap-1 bg-slate-900/80 backdrop-blur-xl rounded-full p-1">
        {Object.entries(LAYERS).map(([key, l]) => (
          <button
            key={key}
            onClick={() => setLayer(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              layer === key ? 'bg-white text-slate-800' : 'text-white/80 hover:text-white'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileLayer
          url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`}
          opacity={0.65}
        />
        {location && (
          <Marker position={[location.lat, location.lon]} icon={markerIcon}>
            <Popup>{location.name}</Popup>
          </Marker>
        )}
        <RecenterOnChange lat={location?.lat} lon={location?.lon} />
      </MapContainer>
    </div>
  )
}

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { useWeather } from '../../context/WeatherContext'
import { buildTrendSeries } from '../../services/forecastApi'

const METRICS = {
  temp: { label: 'Temperature', color: '#38bdf8', unit: '°' },
  humidity: { label: 'Humidity', color: '#2563eb', unit: '%' },
  wind: { label: 'Wind Speed', color: '#0ea5e9', unit: 'm/s' },
  rain: { label: 'Rain Probability', color: '#facc15', unit: '%' },
}

export default function WeatherChart() {
  const { forecast } = useWeather()
  const [metric, setMetric] = useState('temp')

  const data = useMemo(() => (forecast ? buildTrendSeries(forecast) : []), [forecast])

  if (!forecast) return null
  const config = METRICS[metric]

  return (
    <div className="rounded-3xl bg-white/15 dark:bg-white/5 backdrop-blur-2xl border border-white/15 p-6 text-white">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-display font-semibold text-lg">{config.label} Trend</h2>
        <div className="flex gap-1 bg-white/10 rounded-full p-1">
          {Object.entries(METRICS).map(([key, m]) => (
            <button
              key={key}
              onClick={() => setMetric(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                metric === key ? 'bg-white text-slate-800' : 'text-white/70 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={Math.ceil(data.length / 8)}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(15,23,42,0.9)',
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontSize: 12,
              }}
              formatter={(value) => [`${value}${config.unit}`, config.label]}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={config.color}
              strokeWidth={2.5}
              fill="url(#chartFill)"
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

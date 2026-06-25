import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { SCENE_GRADIENTS } from '../../utils/weatherVisuals'

/**
 * The signature element of this app: a living sky behind the dashboard.
 * Instead of a static illustration per condition, this renders procedural
 * layers (sun rays, drifting clouds, falling rain/snow, lightning flicker,
 * starfield) so the backdrop always matches the *actual* current weather,
 * not a stock photo.
 */
export default function AnimatedBackground({ scene = 'sunny' }) {
  const gradient = SCENE_GRADIENTS[scene] || SCENE_GRADIENTS.cloudy

  const clouds = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        top: 8 + i * 14 + Math.random() * 6,
        scale: 0.6 + Math.random() * 0.9,
        duration: 30 + Math.random() * 25,
        delay: -Math.random() * 30,
        opacity: 0.25 + Math.random() * 0.35,
      })),
    [scene]
  )

  const drops = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 0.6 + Math.random() * 0.5,
        delay: Math.random() * 2,
      })),
    [scene]
  )

  const snowflakes = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 4,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 6,
      })),
    [scene]
  )

  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        top: Math.random() * 70,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 3,
      })),
    [scene]
  )

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Sun rays */}
          {scene === 'sunny' && (
            <motion.div
              className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-sun/70 blur-2xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.85, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Stars for night scenes */}
          {(scene === 'night' || scene === 'night-cloudy') &&
            stars.map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full bg-white"
                style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: s.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}

          {(scene === 'night' || scene === 'night-cloudy') && (
            <div className="absolute top-10 right-12 w-16 h-16 rounded-full bg-slate-100 shadow-[0_0_40px_10px_rgba(255,255,255,0.3)]" />
          )}

          {/* Drifting clouds */}
          {['cloudy', 'night-cloudy', 'rain', 'thunderstorm', 'mist'].includes(scene) &&
            clouds.map((c) => (
              <motion.div
                key={c.id}
                className="absolute rounded-full bg-white blur-md"
                style={{
                  top: `${c.top}%`,
                  width: 160 * c.scale,
                  height: 60 * c.scale,
                  opacity: c.opacity,
                }}
                initial={{ x: '-20%' }}
                animate={{ x: '120%' }}
                transition={{
                  duration: c.duration,
                  delay: c.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}

          {/* Rain */}
          {scene === 'rain' &&
            drops.map((d) => (
              <motion.div
                key={d.id}
                className="absolute w-px h-8 bg-white/50"
                style={{ left: `${d.left}%`, top: '-5%' }}
                animate={{ top: '105%' }}
                transition={{
                  duration: d.duration,
                  delay: d.delay,
                  repeat: Infinity,
                  ease: 'easeIn',
                }}
              />
            ))}

          {/* Snow */}
          {scene === 'snow' &&
            snowflakes.map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full bg-white/80"
                style={{ left: `${s.left}%`, top: '-5%', width: s.size, height: s.size }}
                animate={{ top: '105%', x: [0, 15, -15, 0] }}
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}

          {/* Lightning flicker */}
          {scene === 'thunderstorm' && (
            <motion.div
              className="absolute inset-0 bg-white"
              animate={{ opacity: [0, 0, 0.5, 0, 0.25, 0] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 4, times: [0, 0.1, 0.12, 0.14, 0.16, 0.2] }}
            />
          )}

          {/* Mist veil */}
          {scene === 'mist' && (
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

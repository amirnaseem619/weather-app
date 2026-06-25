import { motion } from 'framer-motion'

export function HeroSkeleton() {
  return (
    <div className="rounded-3xl bg-white/10 backdrop-blur-xl p-8 animate-pulse">
      <div className="h-5 w-40 bg-white/20 rounded mb-4" />
      <div className="h-16 w-32 bg-white/20 rounded mb-6" />
      <div className="h-4 w-56 bg-white/20 rounded mb-2" />
      <div className="h-4 w-44 bg-white/15 rounded" />
    </div>
  )
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`rounded-2xl bg-white/10 backdrop-blur-xl p-5 animate-pulse ${className}`}>
      <div className="h-3 w-20 bg-white/20 rounded mb-3" />
      <div className="h-8 w-16 bg-white/20 rounded" />
    </div>
  )
}

export function StripSkeleton({ count = 8 }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 w-20 h-28 rounded-2xl bg-white/10 backdrop-blur-xl animate-pulse"
        />
      ))}
    </div>
  )
}

export default function LoadingScreen({ label = 'Fetching the sky…' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <motion.div
        className="w-14 h-14 rounded-full border-4 border-sky/30 border-t-sky"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-slate-500 dark:text-slate-400 font-medium">{label}</p>
    </div>
  )
}

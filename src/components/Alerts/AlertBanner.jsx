import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi'

const STYLES = {
  severe: { bg: 'bg-red-500/20', border: 'border-red-400/40', text: 'text-red-200', Icon: FiAlertTriangle },
  warning: { bg: 'bg-orange-500/20', border: 'border-orange-400/40', text: 'text-orange-200', Icon: FiAlertTriangle },
  info: { bg: 'bg-sky/20', border: 'border-sky/40', text: 'text-sky-100', Icon: FiInfo },
}

export default function AlertBanner({ notifications }) {
  const [dismissed, setDismissed] = useState(new Set())
  const visible = notifications.filter((n) => !dismissed.has(n.id))

  if (visible.length === 0) {
    return (
      <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-8 text-center text-white/70">
        <FiInfo size={28} className="mx-auto mb-2 text-white/40" />
        <p className="font-medium">No active alerts</p>
        <p className="text-sm text-white/50 mt-1">You'll see storm, heat, and flood warnings here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {visible.map((alert) => {
          const style = STYLES[alert.type] || STYLES.info
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={`rounded-2xl ${style.bg} border ${style.border} p-4 flex items-start gap-3 backdrop-blur-xl`}
            >
              <style.Icon className={`${style.text} shrink-0 mt-0.5`} size={20} />
              <div className="flex-1">
                <p className={`font-semibold text-sm ${style.text}`}>{alert.title}</p>
                <p className="text-white/70 text-sm mt-0.5">{alert.message}</p>
              </div>
              <button
                onClick={() => setDismissed((prev) => new Set(prev).add(alert.id))}
                className="text-white/50 hover:text-white shrink-0"
                aria-label="Dismiss alert"
              >
                <FiX size={16} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

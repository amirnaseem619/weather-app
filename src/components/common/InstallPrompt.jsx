import { motion, AnimatePresence } from 'framer-motion'
import { FiDownload, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

export default function InstallPrompt() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  return (
    <AnimatePresence>
      {canInstall && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 p-4 flex items-center gap-3 shadow-2xl"
        >
          <div className="w-10 h-10 rounded-xl bg-sky/20 flex items-center justify-center shrink-0">
            <FiDownload className="text-sky" size={18} />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Install Skyline</p>
            <p className="text-white/60 text-xs">Get the app experience, even offline.</p>
          </div>
          <button
            onClick={promptInstall}
            className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary/90"
          >
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss install prompt"
            className="text-white/40 hover:text-white"
          >
            <FiX size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

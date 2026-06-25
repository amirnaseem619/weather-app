import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-14 h-8 rounded-full bg-white/15 dark:bg-white/10 border border-white/20 flex items-center px-1"
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-700"
        animate={{ x: isDark ? 22 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? <FiMoon size={13} /> : <FiSun size={13} className="text-sun" />}
      </motion.div>
    </button>
  )
}

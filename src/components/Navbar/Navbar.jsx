import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiCloudRain } from 'react-icons/fi'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/forecast', label: 'Analytics' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/maps', label: 'Maps' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/settings', label: 'Settings' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="relative z-40 px-4 sm:px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 text-white font-display font-semibold text-lg">
          <FiCloudRain className="text-sky" size={22} />
          Skyline
        </NavLink>

        <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-xl rounded-full px-2 py-1.5 border border-white/15">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-slate-800'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 overflow-hidden"
          >
            <div className="flex flex-col p-2">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium ${
                      isActive ? 'bg-white text-slate-800' : 'text-white/90'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-white/80">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'

import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { WeatherProvider } from './context/WeatherContext'

import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import InstallPrompt from './components/common/InstallPrompt'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'

import Home from './pages/Home/Home'
// Heavier pages (charts, maps) are lazy-loaded so the home dashboard
// stays fast on first load.
const Forecast = lazy(() => import('./pages/Forecast/Forecast'))
const Favorites = lazy(() => import('./pages/Favorites/Favorites'))
const Maps = lazy(() => import('./pages/Maps/Maps'))
const Alerts = lazy(() => import('./pages/Alerts/Alerts'))
const Settings = lazy(() => import('./pages/Settings/Settings'))

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen label="Loading…" />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/forecast" element={<PageTransition><Forecast /></PageTransition>} />
          <Route path="/favorites" element={<PageTransition><Favorites /></PageTransition>} />
          <Route path="/maps" element={<PageTransition><Maps /></PageTransition>} />
          <Route path="/alerts" element={<PageTransition><Alerts /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <WeatherProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-dark">
              <Navbar />
              <AnimatedRoutes />
              <Footer />
              <InstallPrompt />
            </div>
          </BrowserRouter>
        </WeatherProvider>
      </FavoritesProvider>
    </ThemeProvider>
  )
}

export default App

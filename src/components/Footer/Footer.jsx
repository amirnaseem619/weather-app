export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 px-4 sm:px-8 py-8 text-center text-white/60 text-sm">
      <p>
        Weather data provided by{' '}
        <a
          href="https://openweathermap.org"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-white"
        >
          OpenWeatherMap
        </a>
      </p>
      <p className="mt-1">Skyline Weather — built with React, Tailwind & Framer Motion</p>
    </footer>
  )
}

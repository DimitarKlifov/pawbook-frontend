import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Image, Scissors, CalendarClock, ClipboardList, GalleryHorizontal } from 'lucide-react'
import SiteControlPanel from '../components/dashboard/SiteControlPanel'
import ServicesPanel from '../components/dashboard/ServicesPanel'
import WorkdaysPanel from '../components/dashboard/WorkdaysPanel'
import BookingsPanel from '../components/dashboard/BookingsPanel'
import GalleryPanel from '../components/dashboard/GalleryPanel'

const SECTIONS = [
  { id: 'site', label: 'Site Content', icon: Image, component: SiteControlPanel },
  { id: 'services', label: 'Services & Pricing', icon: Scissors, component: ServicesPanel },
  { id: 'workdays', label: 'Working Hours', icon: CalendarClock, component: WorkdaysPanel },
  { id: 'bookings', label: 'Bookings', icon: ClipboardList, component: BookingsPanel },
  { id: 'gallery', label: 'Gallery', icon: GalleryHorizontal, component: GalleryPanel },
]

function GroomerDashboardPage() {
  const [activeId, setActiveId] = useState('site')
  const active = SECTIONS.find((s) => s.id === activeId)
  const ActiveComponent = active.component

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-text mb-6 sm:mb-8">
        Groomer Dashboard
      </h1>

      {/* Mobile: horizontal scrollable tab bar */}
      <nav className="md:hidden -mx-4 px-4 mb-6 overflow-x-auto">
        <ul className="flex gap-2 w-max">
          {SECTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = id === activeId
            return (
              <li key={id}>
                <button
                  onClick={() => setActiveId(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-body text-sm font-semibold whitespace-nowrap transition-colors duration-150
                    ${isActive
                      ? 'bg-primary text-white shadow-sm shadow-primary/30'
                      : 'bg-surface border border-border text-text-muted'}`}
                >
                  <Icon size={16} strokeWidth={2} />
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex gap-8">
        {/* Desktop: sidebar */}
        <nav className="hidden md:block w-56 shrink-0">
          <ul className="space-y-1">
            {SECTIONS.map(({ id, label, icon: Icon }) => {
              const isActive = id === activeId
              return (
                <li key={id}>
                  <button
                    onClick={() => setActiveId(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-semibold transition-colors duration-150
                      ${isActive
                        ? 'bg-primary text-white shadow-sm shadow-primary/30'
                        : 'text-text-muted hover:bg-surface hover:text-text'}`}
                  >
                    <Icon size={18} strokeWidth={2} />
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Active panel */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <h2 className="font-display text-lg sm:text-xl font-semibold text-text mb-4">
                {active.label}
              </h2>
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default GroomerDashboardPage
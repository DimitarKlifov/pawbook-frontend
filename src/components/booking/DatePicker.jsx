import { useState, useEffect } from 'react'
import { getWorkDaysByMonth } from '../../lib/api/workdays'

function toISODate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatYearMonth(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export default function DatePicker({ selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(new Date())
  const [workDays, setWorkDays] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getWorkDaysByMonth(formatYearMonth(viewDate))
      .then((list) => {
        const map = {}
        list.forEach((wd) => { map[wd.date] = wd })
        setWorkDays(map)
      })
      .finally(() => setLoading(false))
  }, [viewDate])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7

  const now = new Date()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)

  const monthLabel = viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="px-2 py-1 rounded hover:bg-background text-text"
          aria-label="Previous month"
        >
          ←
        </button>
        <p className="font-display font-semibold text-text">{monthLabel}</p>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="px-2 py-1 rounded hover:bg-background text-text"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {loading ? (
        <p className="text-text-muted text-sm text-center py-8">Loading...</p>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="text-xs text-text-muted font-semibold text-center py-1">{d}</div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />

            const iso = toISODate(year, month, day)
            const wd = workDays[iso]
            const cellDate = new Date(year, month, day)
            const isPastDay = cellDate < today
            const isToday = cellDate.getTime() === today.getTime()
            const isSelected = selectedDate === iso

            let hasClosedForToday = false
            if (isToday && wd?.open && wd.endTime) {
              // endTime format "HH:mm:ss" — build a Date for today's closing time and compare to now
              const [h, m] = wd.endTime.split(':').map(Number)
              const closeTime = new Date()
              closeTime.setHours(h, m, 0, 0)
              hasClosedForToday = now >= closeTime
            }

            const isOpen = wd?.open === true && !hasClosedForToday
            const isDisabled = isPastDay || hasClosedForToday || !isOpen

            let cellClasses = 'text-text-muted/30 cursor-not-allowed' // past days
            if (!isPastDay) {
              cellClasses = isOpen
                ? 'bg-success/10 text-text hover:bg-success/20'
                : 'bg-background text-text-muted/60 cursor-not-allowed'
            }
            if (isSelected) {
              cellClasses = 'bg-primary text-white font-semibold'
            }

            return (
              <button
                key={iso}
                disabled={isDisabled}
                onClick={() => onSelectDate(iso)}
                className={`aspect-square rounded-lg text-sm flex flex-col items-center justify-center gap-0.5 transition-colors ${cellClasses}`}
              >
                <span>{day}</span>
                {!isPastDay && (
                  <span className={`text-[9px] ${isSelected ? 'text-white/80' : isOpen ? 'text-success' : 'text-text-muted/70'}`}>
                    {isOpen ? 'open' : 'closed'}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-success/10 border border-success/30"></span>
          Open
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-background border border-border"></span>
          Closed
        </span>
      </div>
    </div>
  )
}
import { useState } from 'react'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toISODate(year, month, day) {
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

function DatePicker({ selectedDate, onSelectDate }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7

  const todayISO = toISODate(today.getFullYear(), today.getMonth(), today.getDate())

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const cells = []
  for (let i = 0; i < startOffset; i++) {
    cells.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day)
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="p-2 rounded-full hover:bg-background transition-colors duration-200"
          aria-label="Previous month"
        >
          ←
        </button>
        <p className="font-display font-semibold text-text">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </p>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-background transition-colors duration-200"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center font-body text-xs font-semibold text-text-muted">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />
          }

          const iso = toISODate(viewYear, viewMonth, day)
          const isPast = iso < todayISO
          const isSelected = iso === selectedDate

          return (
            <button
              type="button"
              key={iso}
              disabled={isPast}
              onClick={() => onSelectDate(iso)}
              className={`
                aspect-square rounded-lg font-body text-sm transition-colors duration-200
                ${isPast ? 'text-text-muted/30 cursor-not-allowed' : 'text-text hover:bg-primary/10 cursor-pointer'}
                ${isSelected ? 'bg-primary text-white hover:bg-primary' : ''}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DatePicker
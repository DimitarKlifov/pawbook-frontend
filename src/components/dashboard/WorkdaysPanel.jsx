import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

function formatYearMonth(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function toISODate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function DayEditorModal({ date, existing, onSaved, onClose }) {
  const [open, setOpen] = useState(existing?.open ?? true)
  const [startTime, setStartTime] = useState(existing?.startTime?.slice(0, 5) || '09:00')
  const [endTime, setEndTime] = useState(existing?.endTime?.slice(0, 5) || '17:00')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const { setWorkDay } = await import('../../lib/api/workdays')
      await setWorkDay(date, open, open ? startTime : null, open ? endTime : null)
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-text/40 backdrop-blur-sm z-50 flex items-center justify-center px-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface rounded-2xl shadow-xl max-w-sm w-full p-6"
        >
          <p className="font-display font-semibold text-text mb-4">
            {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <label className="flex items-center gap-2 mb-4 text-sm text-text">
            <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)} />
            Open this day
          </label>

          {open && (
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-xs text-text-muted mb-1">Start</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-text-muted mb-1">End</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-error mb-3">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-sm font-semibold text-text-muted hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function WorkdaysPanel() {
  const [viewDate, setViewDate] = useState(new Date())
  const [workDays, setWorkDays] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingDate, setEditingDate] = useState(null)

  const loadMonth = async () => {
    setLoading(true)
    const { getWorkDaysByMonth } = await import('../../lib/api/workdays')
    const list = await getWorkDaysByMonth(formatYearMonth(viewDate))
    const map = {}
    list.forEach((wd) => { map[wd.date] = wd })
    setWorkDays(map)
    setLoading(false)
  }

  useEffect(() => { loadMonth() }, [viewDate])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)

  const monthLabel = viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const editingWd = editingDate ? workDays[editingDate] : null

  return (
    <div className="bg-surface border border-border rounded-lg p-3 sm:p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="px-2 py-1 rounded hover:bg-background text-text"
        >
          ←
        </button>
        <p className="font-display font-semibold text-text text-sm sm:text-base">{monthLabel}</p>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="px-2 py-1 rounded hover:bg-background text-text"
        >
          →
        </button>
      </div>

      {loading ? (
        <p className="text-text-muted text-sm">Loading...</p>
      ) : (
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="text-[10px] sm:text-xs text-text-muted font-semibold py-1">{d}</div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />
            const iso = toISODate(year, month, day)
            const wd = workDays[iso]

            return (
              <button
                key={iso}
                onClick={() => setEditingDate(iso)}
                className={`aspect-square rounded text-xs sm:text-sm flex flex-col items-center justify-center
                  ${wd?.open ? 'bg-primary/10 text-text' : wd ? 'bg-background text-text-muted' : 'text-text-muted'}
                  hover:ring-2 hover:ring-primary/40`}
              >
                <span>{day}</span>
                {wd?.open && <span className="text-[8px] sm:text-[10px] text-primary hidden sm:block">open</span>}
                {wd && !wd.open && <span className="text-[8px] sm:text-[10px] hidden sm:block">closed</span>}
              </button>
            )
          })}
        </div>
      )}

      {editingDate && (
        <DayEditorModal
          date={editingDate}
          existing={editingWd}
          onSaved={() => { setEditingDate(null); loadMonth() }}
          onClose={() => setEditingDate(null)}
        />
      )}
    </div>
  )
}
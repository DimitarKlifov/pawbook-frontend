import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { X, CalendarX } from 'lucide-react'
import { getMyBookings, cancelBooking } from '../lib/api/bookings'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import ErrorState from '../components/ui/ErrorState'
import { SkeletonGrid } from '../components/ui/Skeleton'

const STATUS_STYLES = {
  CONFIRMED: 'bg-success/20 text-success',
  CANCELLED: 'bg-error/20 text-error',
  COMPLETED: 'bg-primary/10 text-primary',
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmCancelId, setConfirmCancelId] = useState(null)
  const { i18n } = useTranslation()
  const isMk = i18n.language === 'mk'

  const loadBookings = () => {
    setLoading(true)
    getMyBookings()
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadBookings, [])

  const handleCancel = async (id) => {
    setConfirmCancelId(null)
    setCancellingId(id)
    try {
      await cancelBooking(id)
      loadBookings()
    } finally {
      setCancellingId(null)
    }
  }

  const sorted = [...bookings].sort((a, b) => new Date(b.startTime) - new Date(a.startTime))

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-text mb-8">My Bookings</h1>

      {loading && <SkeletonGrid count={3} cols="" />}
      {error && <ErrorState message={error} onRetry={loadBookings} />}

      {!loading && !error && sorted.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <CalendarX className="mx-auto text-text-muted/40" size={40} strokeWidth={1.5} />
          <p className="font-body text-text-muted">You don't have any bookings yet.</p>
        </div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence>
            {sorted.map((b) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between bg-surface border border-border rounded-2xl p-4"
              >
                <div>
                  <p className="font-display font-semibold text-text">
                    {b.petName} — {isMk ? b.serviceNameMk : b.serviceNameEn}
                  </p>
                  <p className="font-body text-sm text-text-muted">{formatDateTime(b.startTime)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[b.status]}`}>
                    {b.status}
                  </span>
                  {b.status === 'CONFIRMED' && (
                    <button
                      onClick={() => setConfirmCancelId(b.id)}
                      disabled={cancellingId === b.id}
                      className="inline-flex items-center gap-1 text-sm text-error hover:bg-error/10 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    >
                      <X size={14} />
                      {cancellingId === b.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        open={confirmCancelId !== null}
        title="Cancel this booking?"
        message="This will free up the time slot. You can always book a new appointment later."
        confirmLabel="Cancel Booking"
        onConfirm={() => handleCancel(confirmCancelId)}
        onCancel={() => setConfirmCancelId(null)}
      />
    </div>
  )
}

export default MyBookingsPage
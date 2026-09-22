import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { X, Phone } from 'lucide-react'
import { getAllBookings, cancelBooking } from '../../lib/api/bookings'
import ConfirmDialog from '../ui/ConfirmDialog'
import { SkeletonGrid } from '../ui/Skeleton'

const STATUS_STYLES = {
  CONFIRMED: 'bg-success/20 text-success',
  CANCELLED: 'bg-error/20 text-error',
  COMPLETED: 'bg-primary/10 text-primary',
}

const SIZE_LABELS = {
  mk: { SMALL: 'Мало', MEDIUM: 'Средно', LARGE: 'Големо' },
  en: { SMALL: 'Small', MEDIUM: 'Medium', LARGE: 'Large' },
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function BookingsPanel() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmCancelId, setConfirmCancelId] = useState(null)
  const { i18n } = useTranslation()
  const isMk = i18n.language === 'mk'

  const loadBookings = () => {
    setLoading(true)
    getAllBookings()
      .then(setBookings)
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

  const filtered = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter)
  const sorted = [...filtered].sort((a, b) => new Date(b.startTime) - new Date(a.startTime))

  if (loading) return <SkeletonGrid count={4} cols="" />

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-150
              ${filter === status ? 'bg-primary text-white' : 'bg-surface border border-border text-text-muted hover:bg-background'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <p className="text-text-muted text-sm">No bookings match this filter.</p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {sorted.map((b) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between border border-border rounded-xl p-3 bg-surface"
              >
                <div>
                  <p className="font-display font-semibold text-text">
                    {b.petName} ({SIZE_LABELS[isMk ? 'mk' : 'en'][b.petSize]}) — {isMk ? b.serviceNameMk : b.serviceNameEn}
                  </p>
                  <p className="text-sm text-text-muted">{formatDateTime(b.startTime)}</p>
                  <p className="text-sm text-text-muted flex items-center gap-1 mt-0.5">
                    <span>{b.clientName}</span>
                    {b.clientPhone ? (
                      <a href={'tel:' + b.clientPhone} className="inline-flex items-center gap-1 text-primary hover:underline ml-1">
                        <Phone size={12} />
                        <span>{b.clientPhone}</span>
                      </a>
                    ) : null}
                  </p>
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
        message="The client will need to be notified separately — this only updates the booking status."
        confirmLabel="Cancel Booking"
        onConfirm={() => handleCancel(confirmCancelId)}
        onCancel={() => setConfirmCancelId(null)}
      />
    </div>
  )
}
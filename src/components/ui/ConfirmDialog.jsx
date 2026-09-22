import { motion, AnimatePresence } from 'motion/react'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger = true }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-text/40 backdrop-blur-sm z-50 flex items-center justify-center px-6"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-2xl shadow-xl max-w-sm w-full p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${danger ? 'bg-error/10' : 'bg-primary/10'}`}>
                <AlertTriangle size={20} className={danger ? 'text-error' : 'text-primary'} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-text">{title}</h3>
                <p className="font-body text-sm text-text-muted mt-1">{message}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-full text-sm font-semibold text-text-muted hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors
                  ${danger ? 'bg-error hover:bg-error/90' : 'bg-primary hover:bg-primary-dark'}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
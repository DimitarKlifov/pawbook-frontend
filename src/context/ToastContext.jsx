import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const STYLES = {
  success: 'bg-success/10 border-success/30 text-success',
  error: 'bg-error/10 border-error/30 text-error',
  info: 'bg-primary/10 border-primary/30 text-primary',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 items-center sm:items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type]
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className={`pointer-events-auto flex items-center gap-2 border rounded-2xl px-4 py-3 shadow-lg bg-surface w-full sm:w-auto sm:min-w-[280px] max-w-sm ${STYLES[toast.type]}`}
              >
                <Icon size={18} className="shrink-0" />
                <p className="font-body text-sm text-text flex-1">{toast.message}</p>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="shrink-0 text-text-muted hover:text-text"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
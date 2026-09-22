import { useTranslation } from 'react-i18next'
import { WifiOff, RefreshCw } from 'lucide-react'

export default function ErrorState({ message, onRetry }) {
  const { i18n } = useTranslation()
  const isMk = i18n.language === 'mk'

  return (
    <div className="text-center py-12 space-y-3">
      <WifiOff className="mx-auto text-error/50" size={36} strokeWidth={1.5} />
      <p className="font-body text-text-muted">
        {message || (isMk ? 'Нешто тргна наопаку. Проверете ја врската.' : "Something went wrong. Check your connection.")}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:bg-primary/10 px-4 py-2 rounded-full transition-colors"
        >
          <RefreshCw size={14} />
          {isMk ? 'Обиди се повторно' : 'Try again'}
        </button>
      )}
    </div>
  )
}
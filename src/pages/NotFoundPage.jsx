import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PawPrint } from 'lucide-react'

function NotFoundPage() {
  const { i18n } = useTranslation()
  const isMk = i18n.language === 'mk'

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="text-center max-w-md space-y-6">
        <PawPrint className="mx-auto text-primary/30" size={64} strokeWidth={1.5} />
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold text-text">404</h1>
          <h2 className="font-display text-xl font-semibold text-text">
            {isMk ? 'Оваа страница не постои' : "This page doesn't exist"}
          </h2>
          <p className="font-body text-text-muted">
            {isMk
              ? 'Изгледа дека кучето ја откопало страницата што ја баравте.'
              : 'Looks like this page got dug up and buried somewhere else.'}
          </p>
        </div>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200"
        >
          {isMk ? 'Назад кон почетна' : 'Back to Home'}
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
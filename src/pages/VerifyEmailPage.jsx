import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, XCircle } from 'lucide-react'
import { verifyEmail } from '../lib/api/auth'
import { useAuth } from '../context/AuthContext'

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading') // loading | success | error
  const { login } = useAuth()
  const { i18n } = useTranslation()
  const isMk = i18n.language === 'mk'

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    verifyEmail(token)
      .then(async (data) => {
        await login(data.token)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="text-center max-w-md space-y-6">
        {status === 'loading' && (
          <p className="font-body text-text-muted">
            {isMk ? 'Го потврдуваме вашиот е-маил...' : 'Verifying your email...'}
          </p>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto text-success" size={56} strokeWidth={1.5} />
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold text-text">
                {isMk ? 'Е-маилот е потврден!' : 'Email Verified!'}
              </h1>
              <p className="font-body text-text-muted">
                {isMk
                  ? 'Вашата сметка е активна. Можете да продолжите на почетна страница.'
                  : 'Your account is now active. You can head to the homepage.'}
              </p>
            </div>
            <Link
              to="/"
              className="inline-block bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200"
            >
              {isMk ? 'Кон почетна' : 'Go to Homepage'}
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="mx-auto text-error" size={56} strokeWidth={1.5} />
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold text-text">
                {isMk ? 'Врската не е валидна' : 'Invalid Link'}
              </h1>
              <p className="font-body text-text-muted">
                {isMk
                  ? 'Оваа врска за потврда е невалидна или веќе искористена.'
                  : "This verification link is invalid or has already been used."}
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200"
            >
              {isMk ? 'Кон најава' : 'Go to Login'}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmailPage
import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { resetPassword } from '../lib/api/auth'

function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { i18n } = useTranslation()
  const isMk = i18n.language === 'mk'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError(isMk ? 'Лозинките не се совпаѓаат.' : 'Passwords do not match.')
      return
    }

    if (!token) {
      setError(isMk ? 'Невалидна врска.' : 'Invalid link.')
      return
    }

    setSubmitting(true)
    try {
      await resetPassword(token, newPassword)
      setSuccess(true)
    } catch (err) {
        const cleanMessage = err.message.includes(':') ? err.message.split(':').slice(1).join(':').trim() : err.message
        setError(cleanMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16 text-center">
        <div className="space-y-4">
          <h1 className="font-display text-2xl font-bold text-text">
            {isMk ? 'Невалидна врска' : 'Invalid Link'}
          </h1>
          <p className="font-body text-text-muted">
            {isMk ? 'Оваа врска за ресетирање не е валидна.' : 'This reset link is invalid.'}
          </p>
          <Link to="/login" className="text-primary font-semibold hover:underline">
            {isMk ? 'Кон најава' : 'Go to Login'}
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-md space-y-6">
          <CheckCircle2 className="mx-auto text-success" size={56} strokeWidth={1.5} />
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold text-text">
              {isMk ? 'Лозинката е сменета!' : 'Password Changed!'}
            </h1>
            <p className="font-body text-text-muted">
              {isMk
                ? 'Вашата лозинка е успешно ажурирана. Сега можете да се најавите.'
                : 'Your password has been updated. You can now log in.'}
            </p>
          </div>
          <Link
            to="/login"
            className="inline-block bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200"
          >
            {isMk ? 'Кон најава' : 'Go to Login'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-text">
            {isMk ? 'Нова лозинка' : 'Reset Password'}
          </h1>
          <p className="font-body text-text-muted">
            {isMk ? 'Внесете нова лозинка за вашата сметка.' : 'Enter a new password for your account.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-sm font-semibold text-text mb-1">
              {isMk ? 'Нова лозинка' : 'New Password'}
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
          </div>

          <div>
            <label className="block font-body text-sm font-semibold text-text mb-1">
              {isMk ? 'Потврди лозинка' : 'Confirm Password'}
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
          </div>

          {error && <p className="font-body text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors duration-200"
          >
            {submitting ? (isMk ? 'Се менува...' : 'Resetting...') : (isMk ? 'Смени лозинка' : 'Reset Password')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
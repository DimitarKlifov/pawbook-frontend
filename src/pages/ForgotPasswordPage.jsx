import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../lib/api/auth'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="font-display text-2xl font-bold text-text">Check your email</h1>
          <p className="font-body text-text-muted">
            If an account exists for <strong>{email}</strong>, we've sent a link to reset your password. The link expires in 1 hour.
          </p>
          <Link to="/login" className="inline-block text-primary font-semibold hover:text-primary-dark">
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-text">Forgot Password</h1>
          <p className="font-body text-text-muted">
            Enter your email and we'll send you a link to reset it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-body text-sm font-semibold text-text mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
          </div>

          {error && <p className="font-body text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors duration-200"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center font-body text-sm text-text-muted">
          Remembered your password?{' '}
          <Link to="/login" className="text-primary font-semibold hover:text-primary-dark">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
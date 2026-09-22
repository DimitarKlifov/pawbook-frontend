import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as loginApi } from '../lib/api/auth'
import { useAuth } from '../context/AuthContext'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  const emailError = touched.email && !EMAIL_REGEX.test(email) ? 'Please enter a valid email address.' : null
  const passwordError = touched.password && password.length === 0 ? 'Password is required.' : null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setTouched({ email: true, password: true })

    if (!EMAIL_REGEX.test(email) || password.length === 0) return

    setLoading(true)
    try {
      const data = await loginApi(email, password)
      await login(data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-text">
            Welcome back
          </h1>
          <p className="font-body text-text-muted">
            Log in to manage your bookings
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              onBlur={() => setTouched({ ...touched, email: true })}
              className={`w-full px-4 py-3 rounded-xl border bg-surface font-body text-text focus:outline-none focus:ring-2 transition-all duration-200
                ${emailError ? 'border-error focus:ring-error' : 'border-border focus:ring-primary'}`}
            />
            {emailError && <p className="font-body text-xs text-error mt-1">{emailError}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block font-body text-sm font-semibold text-text">
                Password
              </label>
              <Link to="/forgot-password" className="font-body text-sm text-primary hover:text-primary-dark">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched({ ...touched, password: true })}
              className={`w-full px-4 py-3 rounded-xl border bg-surface font-body text-text focus:outline-none focus:ring-2 transition-all duration-200
                ${passwordError ? 'border-error focus:ring-error' : 'border-border focus:ring-primary'}`}
            />
            {passwordError && <p className="font-body text-xs text-error mt-1">{passwordError}</p>}
          </div>

          {error && (
            <p className="font-body text-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center font-body text-sm text-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:text-primary-dark">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
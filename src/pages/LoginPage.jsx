import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as loginApi } from '../lib/api/auth'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await loginApi(email, password)
      login(data.token)
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

          <div>
            <label htmlFor="password" className="block font-body text-sm font-semibold text-text mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
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
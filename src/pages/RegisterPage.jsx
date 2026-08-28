import { useState } from 'react'
import { register } from '../lib/api/auth'

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await register(formData.name, formData.email, formData.password, formData.phoneNumber)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-text">
            Check your email!
          </h1>
          <p className="font-body text-text-muted">
            We've sent a verification link to <strong>{formData.email}</strong>.
            Click it to activate your account, then come back to log in.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-text">
            Create your account
          </h1>
          <p className="font-body text-text-muted">
            Book grooming appointments for your dog
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-body text-sm font-semibold text-text mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-body text-sm font-semibold text-text mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block font-body text-sm font-semibold text-text mb-1">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-body text-sm font-semibold text-text mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
            <p className="font-body text-xs text-text-muted mt-1">
              At least 8 characters, with an uppercase letter, a number, and a special character.
            </p>
          </div>

          {error && (
            <p className="font-body text-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
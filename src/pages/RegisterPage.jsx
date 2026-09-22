import { useState } from 'react'
import { register } from '../lib/api/auth'
import { AlertCircle } from 'lucide-react'

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^(\+389\s?7\d(\s?\d){6}|07\d(\s?\d){6})$/

function validateField(name, value) {
  switch (name) {
    case 'name':
      return value.trim().length < 2 ? 'Please enter your full name.' : null
    case 'email':
      return !EMAIL_REGEX.test(value) ? 'Please enter a valid email address.' : null
    case 'phoneNumber':
        return !PHONE_REGEX.test(value.trim())
            ? 'Enter a valid Macedonian number, e.g. 078 123 123 or +389 78 123 123.'
            : null
    case 'password':
      return !PASSWORD_REGEX.test(value)
        ? 'At least 8 characters, with an uppercase letter, a number, and a special character.'
        : null
    default:
      return null
  }
}

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  })
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleBlur(e) {
    setTouched({ ...touched, [e.target.name]: true })
  }

  const fieldError = (name) => (touched[name] ? validateField(name, formData[name]) : null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const allTouched = { name: true, email: true, phoneNumber: true, password: true }
    setTouched(allTouched)

    const hasErrors = Object.keys(formData).some((key) => validateField(key, formData[key]))
    if (hasErrors) return

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

        {error && (
          <div className="flex items-start gap-2 bg-error/10 border border-error/30 rounded-xl px-4 py-3">
            <AlertCircle size={18} className="text-error shrink-0 mt-0.5" />
            <p className="font-body text-sm text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-xl border bg-surface font-body text-text focus:outline-none focus:ring-2 transition-all duration-200
                ${fieldError('name') ? 'border-error focus:ring-error' : 'border-border focus:ring-primary'}`}
            />
            {fieldError('name') && <p className="font-body text-xs text-error mt-1">{fieldError('name')}</p>}
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
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-xl border bg-surface font-body text-text focus:outline-none focus:ring-2 transition-all duration-200
                ${fieldError('email') ? 'border-error focus:ring-error' : 'border-border focus:ring-primary'}`}
            />
            {fieldError('email') && <p className="font-body text-xs text-error mt-1">{fieldError('email')}</p>}
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
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-xl border bg-surface font-body text-text focus:outline-none focus:ring-2 transition-all duration-200
                ${fieldError('phoneNumber') ? 'border-error focus:ring-error' : 'border-border focus:ring-primary'}`}
            />
            {fieldError('phoneNumber') && <p className="font-body text-xs text-error mt-1">{fieldError('phoneNumber')}</p>}
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
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-xl border bg-surface font-body text-text focus:outline-none focus:ring-2 transition-all duration-200
                ${fieldError('password') ? 'border-error focus:ring-error' : 'border-border focus:ring-primary'}`}
            />
            <p className="font-body text-xs text-text-muted mt-1">
              At least 8 characters, with an uppercase letter, a number, and a special character.
            </p>
            {fieldError('password') && <p className="font-body text-xs text-error mt-1">{fieldError('password')}</p>}
          </div>

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
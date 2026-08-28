import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/images/logo.jpg'

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isLoggedIn, logout } = useAuth()

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
  ]

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="PawBook logo"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="font-display text-xl font-bold text-text hidden sm:block">
              PawBook
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/book"
                  className="bg-primary text-white px-6 py-2.5 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200"
                >
                  Book an Appointment
                </Link>
                <button
                  onClick={logout}
                  className="font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/book"
                  className="bg-primary text-white px-6 py-2.5 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200"
                >
                  Book an Appointment
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  to="/book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-primary text-white px-6 py-2.5 rounded-full font-display font-semibold text-center hover:bg-primary-dark transition-colors duration-200"
                >
                  Book an Appointment
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-primary text-white px-6 py-2.5 rounded-full font-display font-semibold text-center hover:bg-primary-dark transition-colors duration-200"
                >
                  Book an Appointment
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
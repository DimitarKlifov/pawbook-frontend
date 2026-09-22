import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import logo from '../../assets/images/logo.jpg'

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isLoggedIn, isGroomer, logout } = useAuth()
  const { t, i18n } = useTranslation()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const navLinks = [
    { name: t('nav.home'), href: '/#home' },
    { name: t('nav.about'), href: '/#about' },
    { name: t('nav.gallery'), href: '/#gallery' },
  ]

  function toggleLanguage() {
    const newLang = i18n.language === 'mk' ? 'en' : 'mk'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  function handleLogout() {
    logout()
    navigate('/')
    showToast(i18n.language === 'mk' ? 'Успешно се одјавивте' : "You've been logged out", 'info')
  }

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={logo}
              alt="PawBook logo"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="font-display text-lg xl:text-xl font-bold text-text hidden sm:block whitespace-nowrap">
              PawBook
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="font-body font-semibold text-secondary hover:text-primary transition-colors duration-200 whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn && (
              <>
                <Link
                  to="/my-pets"
                  className="font-body font-semibold text-secondary hover:text-primary transition-colors duration-200 whitespace-nowrap"
                >
                  {t('nav.myPets')}
                </Link>
                <Link
                  to="/my-bookings"
                  className="font-body font-semibold text-secondary hover:text-primary transition-colors duration-200 whitespace-nowrap"
                >
                  {t('nav.myBookings')}
                </Link>
              </>
            )}
          </div>

          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors duration-200 whitespace-nowrap"
              aria-label="Toggle language"
            >
              <Languages size={16} />
              {i18n.language === 'mk' ? 'EN' : 'МК'}
            </button>
            {isLoggedIn ? (
              <>
                {isGroomer && (
                  <Link
                    to="/dashboard"
                    className="font-body font-semibold text-secondary hover:text-primary transition-colors duration-200 whitespace-nowrap ml-2"
                  >
                    {t('nav.dashboard')}
                  </Link>
                )}
                <Link
                  to="/book"
                  className="bg-primary text-white px-5 py-2.5 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200 whitespace-nowrap ml-2"
                >
                  {t('nav.bookAppointment')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-body font-semibold text-secondary hover:text-primary transition-colors duration-200 whitespace-nowrap ml-2"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-body font-semibold text-secondary hover:text-primary transition-colors duration-200 whitespace-nowrap ml-2"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/book"
                  className="bg-primary text-white px-5 py-2.5 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200 whitespace-nowrap ml-2"
                >
                  {t('nav.bookAppointment')}
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-text shrink-0"
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
          <div className="xl:hidden pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn && (
              <>
                <Link
                  to="/my-pets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
                >
                  {t('nav.myPets')}
                </Link>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
                >
                  {t('nav.myBookings')}
                </Link>
              </>
            )}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors duration-200"
            >
              <Languages size={16} />
              {i18n.language === 'mk' ? 'Switch to English' : 'Смени на македонски'}
            </button>
            {isLoggedIn ? (
              <>
                {isGroomer && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
                  >
                    {t('nav.dashboard')}
                  </Link>
                )}
                <Link
                  to="/book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-primary text-white px-6 py-2.5 rounded-full font-display font-semibold text-center hover:bg-primary-dark transition-colors duration-200"
                >
                  {t('nav.bookAppointment')}
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-body font-semibold text-secondary hover:text-primary transition-colors duration-200"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-primary text-white px-6 py-2.5 rounded-full font-display font-semibold text-center hover:bg-primary-dark transition-colors duration-200"
                >
                  {t('nav.bookAppointment')}
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
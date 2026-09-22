import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.jpg'

function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="PawBook logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-display text-lg font-bold">
                PawBook
              </span>
            </div>
            <p className="font-body text-secondary-light text-sm">
              Gentle, professional dog grooming with a personal touch.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display font-semibold text-white">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="font-body text-secondary-light hover:text-white transition-colors duration-200 text-sm">
                Home
              </Link>
              <Link to="/#about" className="font-body text-secondary-light hover:text-white transition-colors duration-200 text-sm">
                About
              </Link>
              <Link to="/#gallery" className="font-body text-secondary-light hover:text-white transition-colors duration-200 text-sm">
                Gallery
              </Link>
              <Link to="/book" className="font-body text-secondary-light hover:text-white transition-colors duration-200 text-sm">
                Book an Appointment
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-display font-semibold text-white">
              Contact
            </h3>
            <div className="font-body text-secondary-light text-sm space-y-1">
              <p>Skopje, North Macedonia</p>
              <p>+389 XX XXX XXX</p>
              <p>hello@pawbook.example</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-secondary-light text-sm">
            © {new Date().getFullYear()} PawBook. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="font-body text-secondary-light hover:text-white transition-colors duration-200 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="font-body text-secondary-light hover:text-white transition-colors duration-200 text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
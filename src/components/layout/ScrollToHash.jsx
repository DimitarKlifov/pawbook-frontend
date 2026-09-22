import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        // slight delay so the page has fully rendered before scrolling
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50)
      }
    }
  }, [location])

  return null
}

export default ScrollToHash
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToHash from './components/layout/ScrollToHash'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import MyPetsPage from './pages/MyPetsPage'
import MyBookingsPage from './pages/MyBookingsPage'
import BookPage from './pages/BookPage'
import GroomerDashboardPage from './pages/GroomerDashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ScrollToHash />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
            <Route path="/verify" element={<PageTransition><VerifyEmailPage /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
            <Route path="/my-pets" element={
              <ProtectedRoute>
                <PageTransition><MyPetsPage /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <PageTransition><MyBookingsPage /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/book" element={
              <ProtectedRoute>
                <PageTransition><BookPage /></PageTransition>
              </ProtectedRoute>
            } />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute groomerOnly>
                  <PageTransition><GroomerDashboardPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
            <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
<Route path="/terms" element={<PageTransition><TermsOfServicePage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
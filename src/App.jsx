import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import MyPetsPage from './pages/MyPetsPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-pets" element={
  <ProtectedRoute>
    <MyPetsPage />
  </ProtectedRoute>
} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
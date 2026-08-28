import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="font-body text-text-muted">Loading...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
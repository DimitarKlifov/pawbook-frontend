import { createContext, useContext, useState, useEffect } from 'react'
import apiRequest from '../lib/api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      fetchRole()
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchRole() {
    try {
      const user = await apiRequest('/auth/me')
      setRole(user.role)
    } catch {
      localStorage.removeItem('token')
      setToken(null)
      setRole(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(newToken) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setLoading(true)
    await fetchRole()
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setRole(null)
  }

  const value = {
    token,
    role,
    isLoggedIn: !!token,
    isGroomer: role === 'GROOMER',
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
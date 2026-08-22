import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('devboard_user')
    if (token) {
      try {
        const userData = JSON.parse(atob(token))
        setUser(userData)
      } catch {
        localStorage.removeItem('devboard_user')
      }
    }
    setLoading(false)
  }, [])

  if (loading) return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '40vh' }}>
      Loading...
    </div>
  )
  if (!user) return <Navigate to="/login" />
  return children
}

export default ProtectedRoute

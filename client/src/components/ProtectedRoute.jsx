import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('devboard_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp * 1000 > Date.now()) {
          setUser(payload)
        } else {
          localStorage.removeItem('devboard_token')
        }
      } catch {
        localStorage.removeItem('devboard_token')
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
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function AuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      localStorage.setItem('devboard_user', token)
      navigate('/standup')
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '40vh' }}>
      Signing you in...
    </div>
  )
}

export default AuthCallback
import { useNavigate } from 'react-router-dom'
import { UserContext } from '@/store/UserStore'
import { useContext, useEffect } from 'react'
import type { ReactNode } from 'react'

interface MiddlewareProps {
  children: ReactNode
}

function Middleware({ children }: MiddlewareProps) {
  const navigate = useNavigate()
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("UserContext not found")
  }
  const { username } = context

  useEffect(() => {
    if (username === '') {
      navigate('/', { replace: true })
    }
  }, [username, navigate])

  if (username === '') {
    return null
  } else {
    return <>{children}</>
  }
}

export default Middleware

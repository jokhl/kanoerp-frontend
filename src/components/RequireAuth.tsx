import { ReactElement, useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// Contexts
import { BackendContext } from '../providers/BackendProvider'

interface ProtectedRouteProps {
  children: ReactElement
}

const RequireAuth = (props: ProtectedRouteProps) => {
  const { user } = useContext(BackendContext)
  const location = useLocation()

  if (user && user.isLoggedIn === true) {
    return props.children
  } else {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />
  }
}

export default RequireAuth

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthState } from '../store/AuthContext.jsx'

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthState()

  // If the user is authenticated, render the child route (e.g., Dashboard).
  // Otherwise, redirect them to the login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute
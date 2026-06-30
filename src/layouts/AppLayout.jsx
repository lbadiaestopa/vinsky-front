import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

function AppLayout() {
  const { token, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flex: 1 }}></div>
      <Outlet />
    </div>
  )
}

export default AppLayout
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
    <div className="flex">
      <Sidebar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function AppLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
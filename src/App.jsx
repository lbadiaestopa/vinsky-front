import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import OrchestraDashboard from './pages/OrchestraDashboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Routes>

      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Private app routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/orchestras/:id" element={<OrchestraDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

    </Routes>
  )
}

export default App
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import OrchestraDashboard from './pages/OrchestraDashboard'

function App() {
  return (
    <Routes>

      {/* Public routes */}
      <Route element={<PublicLayout />}>
      </Route>

      {/* Private app routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/orchestras/:id" element={<OrchestraDashboard />} />
      </Route>

    </Routes>
  )
}

export default App
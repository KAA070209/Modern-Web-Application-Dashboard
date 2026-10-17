import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Analytics from './pages/Analytics.jsx'
import Users from './pages/Users.jsx'
import Reports from './pages/Reports.jsx'
import Integrations from './pages/Integrations.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<Users />} />
        <Route path="reports" element={<Reports />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

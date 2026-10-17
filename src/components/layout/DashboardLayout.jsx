import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import { useProfile } from '../../context/ProfileContext.jsx'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/users': 'Users',
  '/reports': 'Reports',
  '/integrations': 'Integrations',
  '/settings': 'Settings',
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const { profile } = useProfile()

  // Tutup sidebar otomatis ketika berpindah halaman di mobile.
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Sinkronkan title browser dengan nama perusahaan + halaman aktif.
  useEffect(() => {
    const page = PAGE_TITLES[pathname] ?? 'Dashboard'
    document.title = `${profile.company} | ${page}`
  }, [profile.company, pathname])

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

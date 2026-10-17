import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Plug,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext.jsx'

export const navItems = [
  { to: '/', label: 'Dashboard Overview', icon: LayoutDashboard, end: true },
  { to: '/analytics', label: 'Analytics & Trends', icon: BarChart3 },
  { to: '/users', label: 'Users & Teams', icon: Users },
  { to: '/reports', label: 'Reports & Exports', icon: FileText },
  { to: '/integrations', label: 'Integrations', icon: Plug },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  const { profile } = useProfile()

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-white/5 dark:bg-surface-card-dark lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between px-5 pb-5 pt-6">
          <div>
            <p className="text-lg font-extrabold leading-tight text-slate-900 dark:text-white">
              {profile.company}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Analytics Suite
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Menu
          </p>
          <ul className="space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-[18px] w-[18px] ${
                          isActive
                            ? 'text-brand-600 dark:text-brand-300'
                            : 'text-slate-400'
                        }`}
                      />
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Calendar,
  ChevronDown,
  LifeBuoy,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useProfile } from '../../context/ProfileContext.jsx'
import { notifications as initialNotifications } from '../../data/dashboardData.js'

const RANGES = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year']
const RANGE_KEY = 'nexora-date-range'

export default function Navbar({ onMenuClick }) {
  const { isDark, toggleTheme } = useTheme()
  const toast = useToast()
  const navigate = useNavigate()
  const { profile, initials } = useProfile()
  const [range, setRange] = useState(() => window.localStorage.getItem(RANGE_KEY) || 'Last 30 Days')
  const [openRange, setOpenRange] = useState(false)
  const [openNotif, setOpenNotif] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [query, setQuery] = useState('')
  const [notifList, setNotifList] = useState(initialNotifications)

  const rangeRef = useRef(null)
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClick(event) {
      if (rangeRef.current && !rangeRef.current.contains(event.target)) setOpenRange(false)
      if (notifRef.current && !notifRef.current.contains(event.target)) setOpenNotif(false)
      if (profileRef.current && !profileRef.current.contains(event.target)) setOpenProfile(false)
    }
    function handleKey(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.getElementById('global-search')?.focus()
      }
      if (event.key === 'Escape') {
        setOpenRange(false)
        setOpenNotif(false)
        setOpenProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const unread = notifList.filter((n) => n.unread).length

  function selectRange(item) {
    setRange(item)
    setOpenRange(false)
    window.localStorage.setItem(RANGE_KEY, item)
    toast.info(`Rentang tanggal diatur ke "${item}"`)
  }

  function handleSearchSubmit(event) {
    event.preventDefault()
    const q = query.trim()
    if (!q) {
      toast.info('Ketik kata kunci untuk mencari pengguna, laporan, atau integrasi.')
      return
    }
    const lower = q.toLowerCase()
    if (lower.includes('laporan') || lower.includes('report')) {
      navigate('/reports')
      toast.info(`Membuka laporan untuk pencarian "${q}"`)
    } else if (lower.includes('integrasi') || lower.includes('integration')) {
      navigate('/integrations')
      toast.info(`Membuka integrasi untuk pencarian "${q}"`)
    } else if (lower.includes('analitik') || lower.includes('analytics') || lower.includes('tren')) {
      navigate('/analytics')
      toast.info(`Membuka analytics untuk pencarian "${q}"`)
    } else if (lower.includes('pengaturan') || lower.includes('setting')) {
      navigate('/settings')
      toast.info('Membuka pengaturan')
    } else {
      navigate(`/users?q=${encodeURIComponent(q)}`)
      toast.info(`Mencari "${q}" di Users`)
    }
  }

  function openNotification() {
    setOpenNotif((v) => !v)
  }

  function markAllRead() {
    setNotifList((list) => list.map((n) => ({ ...n, unread: false })))
    toast.success('Semua notifikasi ditandai telah dibaca')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-white/5 dark:bg-surface-dark/85">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="focus-ring shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative min-w-0 flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="global-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search telemetry, users, reports..."
            className="focus-ring w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-14 text-sm text-slate-700 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400 dark:border-white/10 dark:bg-white/5 sm:block">
            ⌘K
          </kbd>
        </form>

        <div className="relative hidden md:block" ref={rangeRef}>
          <button
            type="button"
            onClick={() => setOpenRange((v) => !v)}
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <Calendar className="h-4 w-4 text-slate-400" />
            {range}
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          {openRange && (
            <div className="absolute right-0 mt-2 w-44 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-card dark:border-white/10 dark:bg-surface-card-dark">
              {RANGES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => selectRange(item)}
                  className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
                    item === range ? 'font-semibold text-brand-600 dark:text-brand-300' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Ganti tema"
            title="Ganti tema"
            className="focus-ring rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={openNotification}
              aria-label="Notifikasi"
              className="focus-ring relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-surface-card-dark" />
              )}
            </button>

            {openNotif && (
              <div className="absolute right-0 mt-2 w-72 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-card dark:border-white/10 dark:bg-surface-card-dark">
                <div className="flex items-center justify-between px-4 py-2">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Notifikasi</p>
                  {unread > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="focus-ring rounded text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>
                {notifList.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        n.unread ? 'bg-brand-500' : 'bg-slate-300 dark:bg-white/20'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-200">{n.title}</p>
                      <p className="text-xs text-slate-400">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mx-1 hidden h-8 w-px bg-slate-200 dark:bg-white/10 sm:block" />

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setOpenProfile((v) => !v)}
              className="focus-ring flex items-center gap-3 rounded-lg px-1.5 py-1 transition hover:bg-slate-100 dark:hover:bg-white/10"
              aria-label="Menu profil"
            >
              <div className="hidden text-right leading-tight sm:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{profile.name}</p>
                <p className="text-xs text-slate-400">{profile.role}</p>
              </div>
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="h-9 w-9 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                  {initials}
                </div>
              )}
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-2 w-52 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-card dark:border-white/10 dark:bg-surface-card-dark">
                <button
                  type="button"
                  onClick={() => {
                    setOpenProfile(false)
                    navigate('/settings')
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Profil Saya
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenProfile(false)
                    navigate('/settings')
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Pengaturan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenProfile(false)
                    toast.info('Pusat bantuan akan segera hadir.')
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  <LifeBuoy className="h-4 w-4 text-slate-400" />
                  Bantuan
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-white/5" />
                <button
                  type="button"
                  onClick={() => {
                    setOpenProfile(false)
                    toast.success('Berhasil keluar dari akun (demo).')
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

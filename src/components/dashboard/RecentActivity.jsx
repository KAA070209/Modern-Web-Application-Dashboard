import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Cloud,
  FileText,
  Mail,
  Receipt,
  Ticket,
  UserPlus,
} from 'lucide-react'
import { activityTabs, systemActivities, systemHealth } from '../../data/dashboardData.js'
import { useToast } from '../../context/ToastContext.jsx'
import Badge from '../ui/Badge.jsx'
import Card from '../ui/Card.jsx'

const ICONS = {
  'user-plus': UserPlus,
  file: FileText,
  receipt: Receipt,
  cloud: Cloud,
  ticket: Ticket,
  mail: Mail,
}

const ICON_TONES = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
  slate: 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300',
}

const TAB_TONES = {
  active:
    'border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white',
  idle: 'border border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
}

/**
 * Log aktivitas sistem & transaksi dengan filter kategori (tabs)
 * dan indikator kesehatan sistem di bagian bawah.
 */
export default function RecentActivity({ items = systemActivities }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [tab, setTab] = useState('Semua')
  const [expanded, setExpanded] = useState(false)

  const filtered = useMemo(() => {
    const base = tab === 'Semua' ? items : items.filter((item) => item.category === tab)
    return expanded ? base : base.slice(0, 4)
  }, [items, tab, expanded])

  const tabs = ['Semua', ...activityTabs]

  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 pb-0">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Aktivitas Sistem &amp; Log Transaksi
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Aktivitas telemetri dan log peristiwa operasional terkini
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setExpanded((v) => !v)
            toast.info(expanded ? 'Menampilkan ringkasan aktivitas' : 'Semua aktivitas ditampilkan')
          }}
          className="focus-ring inline-flex shrink-0 items-center gap-1 rounded-lg text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-300"
        >
          {expanded ? 'Ringkas' : 'Lihat semua'}
          <ArrowRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 p-5 pb-0">
        {tabs.map((name) => {
          const count = name === 'Semua' ? items.length : items.filter((i) => i.category === name).length
          return (
            <button
              key={name}
              type="button"
              onClick={() => setTab(name)}
              className={`focus-ring rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === name ? TAB_TONES.active : TAB_TONES.idle
              }`}
            >
              {name} ({count})
            </button>
          )
        })}
      </div>

      <div className="flex-1 p-5">
        <ul className="space-y-1">
          {filtered.length === 0 && (
            <li className="py-10 text-center text-sm text-slate-400">
              Tidak ada aktivitas pada kategori ini.
            </li>
          )}

          {filtered.map((item) => {
            const Icon = ICONS[item.icon] ?? ArrowRight
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                    ICON_TONES[item.tone] ?? ICON_TONES.slate
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="truncate text-xs text-slate-400">{item.detail}</p>
                </div>

                <span className="hidden shrink-0 text-xs text-slate-400 sm:block">{item.time}</span>
                <Badge>{item.status}</Badge>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mx-5 mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-white/5">
        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {systemHealth.status}
        </span>
        <span className="text-xs text-slate-400">
          Latensi: <span className="font-semibold text-slate-600 dark:text-slate-300">{systemHealth.latency}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            navigate('/analytics')
            toast.info('Membuka Analytics untuk detail sistem')
          }}
          className="focus-ring ml-auto rounded-lg text-xs font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-300"
        >
          Detail Analytics →
        </button>
      </div>
    </Card>
  )
}

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Check, Download, Filter, ShieldCheck } from 'lucide-react'
import StatCard from '../components/dashboard/StatCard.jsx'
import RevenueChart from '../components/dashboard/RevenueChart.jsx'
import RecentActivity from '../components/dashboard/RecentActivity.jsx'
import UserDistribution from '../components/dashboard/UserDistribution.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Button from '../components/ui/Button.jsx'
import Dropdown, { DropdownButton, DropdownItem } from '../components/ui/Dropdown.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { monthlyActivity, stats } from '../data/dashboardData.js'
import { downloadCsv, downloadJson, stamp } from '../utils/download.js'

const jtTick = (value) => (value === 0 ? '0' : `${value} jt`)

const PERIOD_OPTIONS = [
  { label: '3 Bulan Terakhir', months: 3 },
  { label: '6 Bulan Terakhir', months: 6 },
  { label: '12 Bulan Terakhir', months: 12 },
  { label: 'Semua Data', months: Infinity },
]

const FILTER_OPTIONS = [
  { id: 'all', label: 'Semua Metrik' },
  { id: 'up', label: 'Tren Naik Saja' },
  { id: 'down', label: 'Tren Turun Saja' },
]

function LiveSyncBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
      </span>
      Live Sync
    </span>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const toast = useToast()
  const [period, setPeriod] = useState(PERIOD_OPTIONS[1])
  const [trendFilter, setTrendFilter] = useState('all')

  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const chartData = useMemo(() => {
    if (period.months === Infinity) return monthlyActivity
    return monthlyActivity.slice(-period.months)
  }, [period])

  const trendTemplate = useMemo(() => Object.fromEntries(stats.map((s) => [s.id, s])), [])

  // KPI/stat cards dihitung ulang mengikuti periode yang dipilih (filter).
  const periodStats = useMemo(() => {
    const months = chartData.length
    if (!months) return []

    const first = chartData[0]
    const last = chartData[months - 1]
    const sumBy = (rows, key) => rows.reduce((acc, d) => acc + d[key], 0)

    const totalUsers = sumBy(chartData, 'users')
    const totalRevenue = sumBy(chartData, 'revenue')
    const totalSessions = sumBy(chartData, 'sessions')
    const totalTarget = sumBy(chartData, 'target')
    const targetPct = totalTarget ? (totalRevenue / totalTarget) * 100 : 0
    const avgSessions = Math.round(totalSessions / months)

    // Jendela periode sebelumnya (panjang sama) untuk menghitung perubahan.
    const prevRows = monthlyActivity.slice(
      Math.max(0, monthlyActivity.length - months * 2),
      monthlyActivity.length - months,
    )
    const hasPrev = prevRows.length === months
    const changeOf = (cur, key, fallback) => {
      if (!hasPrev) return fallback
      const prev = sumBy(prevRows, key)
      if (!prev) return fallback
      return Math.round(((cur - prev) / prev) * 1000) / 10
    }

    const isAll = chartData.length === monthlyActivity.length
    const periodLabel = isAll
      ? `Semua data (${first.month}–${last.month})`
      : `${months} bulan (${first.month}–${last.month})`

    const built = [
      {
        ...trendTemplate.users,
        value: totalUsers,
        change: changeOf(totalUsers, 'users', trendTemplate.users.change),
        helper: periodLabel,
      },
      {
        ...trendTemplate.revenue,
        value: totalRevenue * 1_000_000,
        change: changeOf(totalRevenue, 'revenue', trendTemplate.revenue.change),
        progress: Math.round(targetPct),
        footer: `${targetPct.toFixed(1)}%`,
        helper: `Target Rp ${totalTarget.toFixed(1)} jt`,
      },
      {
        ...trendTemplate.sessions,
        label: 'Total Sesi',
        value: totalSessions,
        change: changeOf(totalSessions, 'sessions', trendTemplate.sessions.change),
        helper: periodLabel,
        footer: `Rata-rata ${avgSessions}/bln`,
      },
      {
        ...trendTemplate.conversion,
        label: 'Pencapaian Target',
        value: Math.round(targetPct * 10) / 10,
        change: Math.round((targetPct - 100) * 10) / 10,
        helper: `Target Rp ${totalTarget.toFixed(1)} jt`,
        footer: targetPct >= 100 ? 'Target tercapai' : 'Di bawah target',
        footerTone: targetPct >= 100 ? 'success' : 'muted',
      },
    ]

    return built.map((s) => ({ ...s, trend: s.change >= 0 ? 'up' : 'down' }))
  }, [chartData, trendTemplate])

  const visibleStats = useMemo(() => {
    if (trendFilter === 'up') return periodStats.filter((s) => s.trend === 'up')
    if (trendFilter === 'down') return periodStats.filter((s) => s.trend === 'down')
    return periodStats
  }, [periodStats, trendFilter])

  const footerItems = useMemo(() => {
    const total = chartData.reduce((sum, d) => sum + d.revenue, 0)
    const avg = chartData.length ? total / chartData.length : 0
    const metTarget = chartData.filter((d) => d.revenue >= d.target).length
    const targetPct = chartData.length ? (metTarget / chartData.length) * 100 : 0
    return [
      {
        id: 'total',
        label: `Total (${chartData.length} bln)`,
        value: `Rp ${total.toFixed(1)} Juta`,
        dot: 'bg-brand-600',
        text: 'text-slate-800 dark:text-slate-100',
      },
      {
        id: 'avg',
        label: 'Rata-rata Bulanan',
        value: `Rp ${avg.toFixed(1)} Juta/bln`,
        dot: 'bg-slate-300 dark:bg-white/30',
        text: 'text-slate-800 dark:text-slate-100',
      },
      {
        id: 'target',
        label: 'Status Target',
        value: `${targetPct.toFixed(1)}% Terpenuhi`,
        icon: true,
        text: 'text-emerald-600 dark:text-emerald-400',
      },
    ]
  }, [chartData])

  function downloadDashboard(format) {
    if (format === 'json') {
      downloadJson(
        {
          generatedAt: new Date().toISOString(),
          period: period.label,
          trendFilter,
          stats: periodStats,
          monthlyActivity: chartData,
        },
        `nexora-dashboard-${stamp()}.json`,
      )
      toast.success('Laporan dashboard (JSON) berhasil diunduh')
      return
    }
    downloadCsv(
      chartData,
      [
        { key: 'month', header: 'Bulan' },
        { key: 'users', header: 'Pengguna' },
        { key: 'revenue', header: 'Pendapatan (jt)' },
        { key: 'sessions', header: 'Sesi' },
        { key: 'target', header: 'Target (jt)' },
      ],
      `nexora-dashboard-${stamp()}.csv`,
    )
    toast.success('Laporan dashboard (CSV) berhasil diunduh')
  }

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Dashboard Overview"
        subtitle={
          <>
            Ringkasan performa aplikasi<span className="mx-1.5">•</span>
            {today}
          </>
        }
        action={
          <>
            <Dropdown
              align="right"
              trigger={({ open, toggle }) => (
                <DropdownButton icon={CalendarDays} label={period.label} onClick={toggle} />
              )}
            >
              {({ close }) =>
                PERIOD_OPTIONS.map((opt) => (
                  <DropdownItem
                    key={opt.label}
                    active={period.label === opt.label}
                    onClick={() => {
                      setPeriod(opt)
                      close()
                      toast.info(`Dashboard & kartu KPI menampilkan ${opt.label.toLowerCase()}`)
                    }}
                  >
                    {opt.label}
                    {period.label === opt.label && <Check className="h-4 w-4" />}
                  </DropdownItem>
                ))
              }
            </Dropdown>

            <Dropdown
              align="right"
              trigger={({ toggle }) => (
                <DropdownButton
                  icon={Filter}
                  label={FILTER_OPTIONS.find((f) => f.id === trendFilter)?.label ?? 'Filter'}
                  onClick={toggle}
                />
              )}
            >
              {({ close }) =>
                FILTER_OPTIONS.map((opt) => (
                  <DropdownItem
                    key={opt.id}
                    active={trendFilter === opt.id}
                    onClick={() => {
                      setTrendFilter(opt.id)
                      close()
                      toast.info(`Filter statistik: ${opt.label}`)
                    }}
                  >
                    {opt.label}
                    {trendFilter === opt.id && <Check className="h-4 w-4" />}
                  </DropdownItem>
                ))
              }
            </Dropdown>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="md" onClick={() => downloadDashboard('csv')}>
                <Download className="h-4 w-4" />
                Unduh CSV
              </Button>
              <Button variant="primary" size="md" onClick={() => downloadDashboard('json')}>
                <Download className="h-4 w-4" />
                Unduh Laporan
              </Button>
            </div>
          </>
        }
      />

      {visibleStats.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-surface-card-dark">
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            Tidak ada statistik pada filter ini
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Ubah filter tren untuk menampilkan kartu statistik.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visibleStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </section>
      )}

      <RevenueChart
        data={chartData}
        dataKey="revenue"
        name="Pendapatan"
        type="area"
        color="#2563eb"
        unit=" jt"
        title="Aktivitas Pendapatan Bulanan"
        subtitle={`Tren pertumbuhan pendapatan dan volume transaksi — ${period.label.toLowerCase()}`}
        badge={<LiveSyncBadge />}
        compareKey="target"
        compareName="Target"
        showPeriodSelector={false}
        yTickFormatter={jtTick}
        yDomain={[0, 28]}
        yTicks={[0, 7, 14, 21, 28]}
        height={320}
        callout={
          <>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Oktober 2026 (Tertinggi)
            </div>
            <p className="mt-1 text-lg font-bold leading-tight">Rp 24.500.000</p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              1.420 transaksi aktif • +14.2% YoY
            </p>
          </>
        }
        footer={
          <div className="flex flex-nowrap items-center gap-x-5 overflow-x-auto whitespace-nowrap border-t border-slate-100 px-5 py-4 text-[13px] dark:border-white/5">
            {footerItems.map((item) => (
              <span key={item.id} className="flex shrink-0 items-center gap-2">
                {item.icon ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                ) : (
                  <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                )}
                <span className="text-slate-500 dark:text-slate-400">{item.label}:</span>
                <span className={`font-semibold ${item.text}`}>{item.value}</span>
              </span>
            ))}
            <button
              type="button"
              onClick={() => {
                navigate('/analytics')
                toast.info('Membuka Analytics & Trends')
              }}
              className="focus-ring ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-300"
            >
              Buka Analisis Mendalam
              <span aria-hidden="true">→</span>
            </button>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
        <UserDistribution />
      </section>
    </div>
  )
}

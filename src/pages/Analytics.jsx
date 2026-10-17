import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DollarSign, MousePointerClick, ShoppingCart, Users2 } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import DataTable from '../components/ui/DataTable.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { channelPerformance, yearlyActivity } from '../data/dashboardData.js'
import { formatCompactCurrency, formatNumber } from '../utils/format.js'

const PERIODS = [6, 12]
const CHANNEL_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#8b5cf6', '#0ea5e9']

function KpiCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="p-5">
      <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-800 dark:text-white">{value}</p>
    </Card>
  )
}

export default function Analytics() {
  const { isDark } = useTheme()
  const [period, setPeriod] = useState(6)

  const data = useMemo(
    () => (yearlyActivity.length > period ? yearlyActivity.slice(-period) : yearlyActivity),
    [period],
  )

  const summary = useMemo(() => {
    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
    const totalUsers = data.reduce((sum, d) => sum + d.users, 0)
    const totalOrders = data.reduce((sum, d) => sum + d.orders, 0)
    const avgSessions = Math.round(
      data.reduce((sum, d) => sum + d.sessions, 0) / (data.length || 1),
    )
    return { totalRevenue, totalUsers, totalOrders, avgSessions }
  }, [data])

  const axisColor = isDark ? '#64748b' : '#94a3b8'
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(148,163,184,0.2)'
  const tooltipStyle = {
    borderRadius: 12,
    border: 'none',
    background: isDark ? '#111a2e' : '#ffffff',
    boxShadow: '0 8px 24px -12px rgba(15,23,42,0.4)',
    fontSize: 12,
  }
  const axisCommon = (
    <>
      <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
      <XAxis dataKey="month" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} width={40} />
      <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: gridColor }} />
    </>
  )

  const channelColumns = [
    { key: 'channel', header: 'Channel', sortable: true },
    {
      key: 'visits',
      header: 'Visits',
      sortable: true,
      render: (row) => formatNumber(row.visits),
    },
    {
      key: 'conversion',
      header: 'Conversion',
      sortable: true,
      render: (row) => `${row.conversion}%`,
    },
    {
      key: 'growth',
      header: 'Growth',
      sortable: true,
      render: (row) => <Badge tone={row.growth >= 0 ? 'emerald' : 'rose'}>{row.growth >= 0 ? '+' : ''}{row.growth}%</Badge>,
    },
  ]

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Analisis mendalam performa data dan tren pertumbuhan"
        action={
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`focus-ring rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  period === p
                    ? 'bg-white text-brand-600 shadow-sm dark:bg-white/10 dark:text-brand-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {p} Bulan
              </button>
            ))}
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCompactCurrency(summary.totalRevenue * 1_000_000)}
          color="bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"
        />
        <KpiCard
          icon={Users2}
          label="Total New Users"
          value={formatNumber(summary.totalUsers)}
          color="bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
        />
        <KpiCard
          icon={MousePointerClick}
          label="Avg. Sessions"
          value={formatNumber(summary.avgSessions)}
          color="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
        />
        <KpiCard
          icon={ShoppingCart}
          label="Total Orders"
          value={formatNumber(summary.totalOrders)}
          color="bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <Card.Header title="Revenue Trend" subtitle={`Perkembangan pendapatan ${period} bulan`} />
          <Card.Body>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  {axisCommon}
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue (jt)"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#revGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header title="Users vs Sessions" subtitle="Perbandingan pengguna dan sesi" />
          <Card.Body>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  {axisCommon}
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Users"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    name="Sessions"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <Card.Header title="Orders" subtitle="Jumlah order per bulan" />
          <Card.Body>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  {axisCommon}
                  <Bar dataKey="orders" name="Orders" radius={[6, 6, 0, 0]} maxBarSize={38}>
                    {data.map((_, index) => (
                      <Cell key={index} fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        <Card className="xl:col-span-3">
          <Card.Header title="Channel Performance" subtitle="Performa per sumber trafik" />
          <Card.Body className="pt-2">
            <DataTable
              columns={channelColumns}
              data={channelPerformance}
              pageSize={5}
              getRowKey={(row) => row.channel}
              emptyTitle="Belum ada data channel"
            />
          </Card.Body>
        </Card>
      </section>
    </div>
  )
}

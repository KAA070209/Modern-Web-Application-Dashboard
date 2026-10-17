import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../../context/ThemeContext.jsx'
import Card from '../ui/Card.jsx'

const PERIOD_LABELS = ['3B', '6B', '12B', 'Semua']
const PERIOD_COUNT = { '3B': 3, '6B': 6, '12B': 12, Semua: Infinity }

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-card backdrop-blur dark:border-white/10 dark:bg-surface-card-dark/95">
      <p className="mb-1 font-semibold text-slate-700 dark:text-slate-200">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-300"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: entry.stroke || entry.color }} />
          <span className="capitalize">{entry.name}</span>:
          <span className="font-semibold text-slate-700 dark:text-slate-100">
            {entry.value}
            {unit}
          </span>
        </p>
      ))}
    </div>
  )
}

/**
 * Kartu grafik interaktif (area/line/bar) dengan pemilih periode,
 * garis perbandingan putus-putus, callout sorotan, dan footer ringkasan.
 */
export default function RevenueChart({
  data = [],
  dataKey = 'revenue',
  name = 'Revenue',
  type = 'area',
  color = '#2563eb',
  unit = '',
  title = 'Monthly Activity',
  subtitle,
  badge,
  compareKey,
  compareName = 'Target',
  periods = PERIOD_LABELS,
  showPeriodSelector = true,
  defaultPeriod = '6B',
  yTickFormatter,
  yDomain,
  yTicks,
  height = 300,
  footer,
  callout,
}) {
  const { isDark } = useTheme()
  const [period, setPeriod] = useState(defaultPeriod)

  const chartData = useMemo(() => {
    const count = PERIOD_COUNT[period] ?? data.length
    return count === Infinity ? data : data.slice(-count)
  }, [data, period])

  const axisColor = isDark ? '#64748b' : '#94a3b8'
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(148,163,184,0.22)'
  const gradientId = `grad-${dataKey}`
  const dashedColor = isDark ? '#475569' : '#cbd5e1'

  const axisProps = {
    tick: { fill: axisColor, fontSize: 12 },
    tickLine: false,
    axisLine: false,
  }

  const grid = <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
  const xAxis = <XAxis dataKey="month" {...axisProps} dy={6} />
  const yAxis = (
    <YAxis
      {...axisProps}
      width={44}
      {...(yTickFormatter ? { tickFormatter: yTickFormatter } : {})}
      {...(yDomain ? { domain: yDomain } : {})}
      {...(yTicks ? { ticks: yTicks } : {})}
    />
  )
  const tooltip = <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: gridColor }} />
  const compare = compareKey ? (
    <Line
      type="monotone"
      dataKey={compareKey}
      name={compareName}
      stroke={dashedColor}
      strokeWidth={2}
      strokeDasharray="6 6"
      dot={false}
      activeDot={{ r: 3 }}
      isAnimationActive={false}
    />
  ) : null

  // Garis vertikal tipis pada titik data terakhir (periode berjalan).
  const lastMarker = chartData.length ? (
    <ReferenceLine
      x={chartData[chartData.length - 1].month}
      stroke={dashedColor}
      strokeDasharray="4 4"
    />
  ) : null

  const chartProps = {
    data: chartData,
    margin: { top: 8, right: 8, left: -8, bottom: 0 },
  }

  const renderChart = () => {
    // ComposedChart dipakai saat ada garis perbandingan karena AreaChart
    // tidak merender child <Line>.
    const Chart = compareKey ? ComposedChart : null

    if (type === 'bar') {
      return (
        <BarChart {...chartProps}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.95} />
              <stop offset="100%" stopColor={color} stopOpacity={0.55} />
            </linearGradient>
          </defs>
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          <Bar
            dataKey={dataKey}
            name={name}
            fill={`url(#${gradientId})`}
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
            isAnimationActive={false}
          />
        </BarChart>
      )
    }

    const mainLine = (
      <Line
        type="monotone"
        dataKey={dataKey}
        name={name}
        stroke={color}
        strokeWidth={3}
        dot={{ r: 3, strokeWidth: 2, fill: isDark ? '#0f1626' : '#fff' }}
        activeDot={{ r: 5 }}
        isAnimationActive={false}
      />
    )

    if (type === 'line') {
      const LineHost = Chart ?? LineChart
      return (
        <LineHost {...chartProps}>
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          {mainLine}
          {compare}
          {lastMarker}
        </LineHost>
      )
    }

    const mainArea = (
      <Area
        type="monotone"
        dataKey={dataKey}
        name={name}
        stroke={color}
        strokeWidth={3}
        fill={`url(#${gradientId})`}
        dot={{ r: 3.5, strokeWidth: 2, fill: isDark ? '#0f1626' : '#fff', stroke: color }}
        activeDot={{ r: 5 }}
        isAnimationActive={false}
      />
    )

    const AreaHost = Chart ?? AreaChart
    return (
      <AreaHost {...chartProps}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid}
        {xAxis}
        {yAxis}
        {tooltip}
        {mainArea}
        {compare}
        {lastMarker}
      </AreaHost>
    )
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 pb-0">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            {badge}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>

        {showPeriodSelector && (
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-white/5">
            {periods.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setPeriod(label)}
                className={`focus-ring rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  period === label
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative p-5">
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        {callout && (
          <div className="pointer-events-none absolute right-9 top-6 hidden rounded-xl bg-slate-900 px-4 py-3 text-white shadow-xl sm:block">
            {callout}
          </div>
        )}
      </div>

      {footer}
    </Card>
  )
}

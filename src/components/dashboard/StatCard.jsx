import { Activity, ArrowDownRight, ArrowUpRight, Target, Users, Wallet } from 'lucide-react'
import { formatByType } from '../../utils/format.js'

const ICONS = { users: Users, wallet: Wallet, activity: Activity, target: Target }

const COLORS = {
  brand: {
    wrap: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
    progress: 'bg-brand-600',
  },
  emerald: {
    wrap: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
    progress: 'bg-emerald-500',
  },
  amber: {
    wrap: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
    progress: 'bg-amber-500',
  },
  violet: {
    wrap: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
    progress: 'bg-violet-500',
  },
}

const FOOTER_TONES = {
  success: 'text-emerald-600 dark:text-emerald-400',
  muted: 'text-slate-700 dark:text-slate-300',
}

/**
 * Kartu statistik. Nilai, tren, dan warna berasal dari data (dynamic stat cards).
 */
export default function StatCard({ stat }) {
  const Icon = ICONS[stat.icon] ?? Activity
  const color = COLORS[stat.color] ?? COLORS.brand
  const isUp = stat.trend === 'up'

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-card dark:border-white/5 dark:bg-surface-card-dark">
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${color.wrap}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold ${
            isUp
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
          }`}
        >
          {isUp ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {Math.abs(stat.change)}%
        </span>
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {stat.label}
      </p>
      <p className="mt-1.5 text-[2rem] font-bold leading-none tracking-tight text-slate-900 dark:text-white">
        {formatByType(stat.value, stat.format)}
      </p>

      <div className="mt-auto pt-5">
        <div className="flex items-start justify-between gap-2 text-[11px] leading-snug">
          <span className="text-slate-400">{stat.helper}</span>
          <span
            className={`shrink-0 whitespace-nowrap text-right font-semibold ${
              FOOTER_TONES[stat.footerTone] ?? FOOTER_TONES.muted
            }`}
          >
            {stat.footer}
          </span>
        </div>

        {typeof stat.progress === 'number' && (
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className={`h-full rounded-full transition-all ${color.progress}`}
              style={{ width: `${stat.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

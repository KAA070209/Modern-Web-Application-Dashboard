import { useState } from 'react'
import { BarChart3, Info, MoreVertical } from 'lucide-react'
import { growthInsight, userDistribution } from '../../data/dashboardData.js'
import { useToast } from '../../context/ToastContext.jsx'
import { formatNumber } from '../../utils/format.js'
import Card from '../ui/Card.jsx'
import Dropdown, { DropdownItem } from '../ui/Dropdown.jsx'

/**
 * Distribusi pengguna berdasarkan sumber akuisisi trafik,
 * ditampilkan sebagai bar persentase per kanal.
 */
export default function UserDistribution({ data = userDistribution }) {
  const toast = useToast()
  const [sortBy, setSortBy] = useState('value')

  const sorted = [...data].sort((a, b) =>
    sortBy === 'name' ? a.name.localeCompare(b.name, 'id') : b.value - a.value,
  )

  return (
    <Card>
      <div className="flex items-start justify-between p-5 pb-0">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Distribusi Pengguna</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Berdasarkan sumber akuisisi trafik
          </p>
        </div>
        <Dropdown
          align="right"
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="Opsi lainnya"
              className="focus-ring rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          )}
        >
          {({ close }) => (
            <>
              <DropdownItem
                active={sortBy === 'value'}
                onClick={() => {
                  setSortBy('value')
                  close()
                  toast.info('Diurutkan berdasarkan persentase')
                }}
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-slate-400" />
                  Urutkan %
                </span>
              </DropdownItem>
              <DropdownItem
                active={sortBy === 'name'}
                onClick={() => {
                  setSortBy('name')
                  close()
                  toast.info('Diurutkan berdasarkan nama')
                }}
              >
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-slate-400" />
                  Urutkan Nama
                </span>
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>

      <ul className="space-y-5 p-5">
        {sorted.map((source) => (
          <li key={source.id}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-slate-700 dark:text-slate-200">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: source.color }}
                />
                <span className="truncate">{source.name}</span>
              </span>
              <span className="shrink-0 whitespace-nowrap text-slate-400">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{source.value}%</span>{' '}
                ({formatNumber(source.count)})
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${source.value}%`, background: source.color }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="px-5 pb-5">
        <div className="flex gap-3 rounded-xl bg-slate-50 p-4 dark:bg-white/5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-brand-600 shadow-sm dark:bg-white/10 dark:text-brand-300">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2Z" />
            </svg>
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {growthInsight.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {growthInsight.body}
              <span className="font-semibold text-brand-600 dark:text-brand-300">
                {growthInsight.highlight}
              </span>
              {growthInsight.tail}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

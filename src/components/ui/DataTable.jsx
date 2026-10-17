import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown, Inbox } from 'lucide-react'
import Button from './Button.jsx'
import Skeleton from './Skeleton.jsx'

/**
 * DataTable generik:
 * - Kolom dikonfigurasi lewat prop `columns`
 * - Mendukung sorting per kolom, pagination, loading state, dan empty state
 */
export default function DataTable({
  columns,
  data = [],
  loading = false,
  pageSize = 5,
  getRowKey = (row) => row.id,
  emptyTitle = 'Tidak ada data',
  emptyMessage = 'Belum ada data untuk ditampilkan.',
}) {
  const [sort, setSort] = useState({ key: null, direction: 'asc' })
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    if (!sort.key) return data
    const sortedData = [...data].sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      if (typeof av === 'number' && typeof bv === 'number') return av - bv
      return String(av).localeCompare(String(bv), 'id', { numeric: true })
    })
    return sort.direction === 'asc' ? sortedData : sortedData.reverse()
  }, [data, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const pageRows = sorted.slice(start, start + pageSize)

  function toggleSort(key, sortable) {
    if (!sortable) return
    setPage(1)
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500 dark:border-white/5 dark:text-slate-400">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 font-semibold ${col.className ?? ''}`}>
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key, col.sortable)}
                      className="focus-ring inline-flex items-center gap-1 rounded transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {col.header}
                      {sort.key === col.key ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-b border-slate-50 dark:border-white/5">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              pageRows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-white/5 dark:hover:bg-white/5"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-4 ${col.className ?? ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
          <div className="rounded-full bg-slate-100 p-4 dark:bg-white/5">
            <Inbox className="h-7 w-7 text-slate-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{emptyTitle}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
          </div>
        </div>
      )}

      {!loading && data.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-4 py-3 dark:border-white/5">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan {start + 1}–{Math.min(start + pageSize, data.length)} dari {data.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {currentPage}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

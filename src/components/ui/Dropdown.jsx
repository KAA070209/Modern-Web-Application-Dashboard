import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Dropdown generik: tombol + panel, tutup saat klik di luar / Escape.
 */
export default function Dropdown({ trigger, children, align = 'left', className = '' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onDoc(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {trigger({ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) })}
      {open && (
        <div
          className={`absolute z-50 mt-2 w-52 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-card dark:border-white/10 dark:bg-surface-card-dark ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </div>
  )
}

export function DropdownButton({ icon: Icon, label, onClick, variant = 'outline' }) {
  const styles =
    variant === 'outline'
      ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition ${styles}`}
    >
      {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      <span className="max-w-[10rem] truncate">{label}</span>
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </button>
  )
}

export function DropdownItem({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
        active ? 'font-semibold text-brand-600 dark:text-brand-300' : 'text-slate-600 dark:text-slate-300'
      }`}
    >
      {children}
    </button>
  )
}

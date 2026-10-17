import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

/**
 * Modal generik: overlay gelap penuh viewport, Escape untuk tutup, klik overlay untuk tutup.
 * Dirender melalui portal ke document.body agar tidak terkunci containing block
 * dari parent yang memiliki transform/animation (mis. .animate-fade-in).
 */
export default function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const width = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg'

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 flex max-h-[calc(100vh-2rem)] w-full ${width} animate-fade-in flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-white/10 dark:bg-surface-card-dark`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-white/5">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="focus-ring -m-1.5 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 dark:border-white/5 dark:bg-white/[0.02]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

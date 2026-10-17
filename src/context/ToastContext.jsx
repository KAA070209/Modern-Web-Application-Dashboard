import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const TONES = {
  success: {
    icon: CheckCircle2,
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200',
    iconClass: 'text-emerald-500',
  },
  error: {
    icon: AlertTriangle,
    className:
      'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200',
    iconClass: 'text-rose-500',
  },
  info: {
    icon: Info,
    className:
      'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200',
    iconClass: 'text-brand-500',
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, tone = 'info', duration = 3200) => {
      const id = ++idRef.current
      setToasts((prev) => [...prev, { id, message, tone }])
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  const toast = useMemo(
    () => ({
      success: (msg, duration) => push(msg, 'success', duration),
      error: (msg, duration) => push(msg, 'error', duration),
      info: (msg, duration) => push(msg, 'info', duration),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => {
          const tone = TONES[t.tone] ?? TONES.info
          const Icon = tone.icon
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-card animate-fade-in ${tone.className}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone.iconClass}`} />
              <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Tutup notifikasi"
                className="focus-ring rounded-md p-0.5 opacity-60 transition hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

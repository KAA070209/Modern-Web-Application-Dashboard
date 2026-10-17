export const fieldClass =
  'focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'

export function FormField({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  )
}

export function FormError({ children }) {
  if (!children) return null
  return (
    <p
      role="alert"
      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
    >
      {children}
    </p>
  )
}

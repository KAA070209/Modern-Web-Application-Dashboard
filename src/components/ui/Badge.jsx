const TONES = {
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
}

const STATUS_TONES = {
  Active: 'emerald',
  Connected: 'emerald',
  Paid: 'emerald',
  Ready: 'emerald',
  Done: 'emerald',
  Selesai: 'emerald',
  Lunas: 'emerald',
  Sukses: 'emerald',
  New: 'brand',
  Baru: 'brand',
  Terkirim: 'brand',
  Pending: 'amber',
  Processing: 'amber',
  Menunggu: 'amber',
  Inactive: 'rose',
  Failed: 'rose',
}

export default function Badge({ children, tone, className = '' }) {
  const resolved = tone ?? STATUS_TONES[children] ?? 'slate'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${TONES[resolved] ?? TONES.slate} ${className}`}
    >
      {children}
    </span>
  )
}

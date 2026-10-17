const VARIANTS = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20',
  outline:
    'border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5',
  ghost:
    'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800',
}

const SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
  icon: 'h-10 w-10 justify-center',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Tag = 'button',
  ...props
}) {
  return (
    <Tag
      className={`focus-ring inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

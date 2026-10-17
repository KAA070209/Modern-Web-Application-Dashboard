export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="text-[2rem] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex flex-wrap items-center gap-2.5">{action}</div>}
    </div>
  )
}

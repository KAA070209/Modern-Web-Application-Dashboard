export default function Card({ children, className = '', as: Tag = 'div' }) {
  return (
    <Tag
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-card transition-colors dark:border-white/5 dark:bg-surface-card-dark ${className}`}
    >
      {children}
    </Tag>
  )
}

Card.Header = function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 p-5 pb-0 ${className}`}>
      <div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>
}

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div
      className={`border-t border-slate-100 px-5 py-4 dark:border-white/5 ${className}`}
    >
      {children}
    </div>
  )
}

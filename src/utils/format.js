export function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(value)
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompactCurrency(value) {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)} M`
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)} jt`
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)} rb`
  return `Rp ${value}`
}

export function formatPercent(value) {
  return `${value}%`
}

export function formatByType(value, type) {
  switch (type) {
    case 'currency':
      return formatCompactCurrency(value)
    case 'percent':
      return formatPercent(value)
    default:
      return formatNumber(value)
  }
}

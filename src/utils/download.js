/**
 * Helper unduhan file di browser (tanpa backend).
 */

export function downloadBlob(content, filename, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function toCsv(rows, columns) {
  const escape = (value) => {
    const str = value == null ? '' : String(value)
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }
  const header = columns.map((col) => escape(col.header ?? col.key)).join(',')
  const body = rows
    .map((row) => columns.map((col) => escape(typeof col.value === 'function' ? col.value(row) : row[col.key])).join(','))
    .join('\n')
  return `${header}\n${body}`
}

export function downloadCsv(rows, columns, filename) {
  downloadBlob(toCsv(rows, columns), filename, 'text/csv;charset=utf-8')
}

export function downloadJson(data, filename) {
  downloadBlob(JSON.stringify(data, null, 2), filename, 'application/json;charset=utf-8')
}

export function stamp() {
  return new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
}

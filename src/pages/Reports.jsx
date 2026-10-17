import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Database, Download, FilePlus2, FileText, Loader } from 'lucide-react'
import DataTable from '../components/ui/DataTable.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Modal from '../components/ui/Modal.jsx'
import { FormError, FormField, fieldClass } from '../components/ui/FormField.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { channelPerformance, reports as initialReports } from '../data/dashboardData.js'
import { downloadCsv, downloadJson, stamp } from '../utils/download.js'
import { formatNumber } from '../utils/format.js'

const ICONS = { file: FileText, download: Download, loader: Loader, database: Database }
const ICON_TONES = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
}
const REPORT_TYPES = ['Performance', 'Analytics', 'Finance', 'Marketing']
const EMPTY_FORM = { title: '', period: '', type: 'Performance' }

export default function Reports() {
  const { isDark } = useTheme()
  const toast = useToast()
  const [reports, setReports] = useState(initialReports)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')

  const axisColor = isDark ? '#64748b' : '#94a3b8'
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(148,163,184,0.2)'

  const summary = useMemo(() => {
    const ready = reports.filter((r) => r.status === 'Ready').length
    const processing = reports.filter((r) => r.status === 'Processing').length
    return [
      { id: 'total', label: 'Total Laporan', value: reports.length, icon: 'file', color: 'brand' },
      { id: 'ready', label: 'Siap Diunduh', value: ready, icon: 'download', color: 'emerald' },
      { id: 'processing', label: 'Diproses', value: processing, icon: 'loader', color: 'amber' },
      { id: 'storage', label: 'Total Ukuran', value: '10.5 MB', icon: 'database', color: 'violet' },
    ]
  }, [reports])

  function downloadReport(row) {
    const payload = { id: row.id, title: row.title, period: row.period, type: row.type, generatedAt: new Date().toISOString(), channelPerformance }
    downloadJson(payload, `${row.id}-${stamp()}.json`)
    toast.success(`Laporan "${row.title}" berhasil diunduh`)
  }

  function downloadAllReady() {
    const ready = reports.filter((r) => r.status === 'Ready')
    if (!ready.length) {
      toast.error('Tidak ada laporan yang siap diunduh')
      return
    }
    downloadCsv(ready, [{ key: 'id', header: 'ID' }, { key: 'title', header: 'Laporan' }, { key: 'period', header: 'Periode' }, { key: 'type', header: 'Jenis' }, { key: 'size', header: 'Ukuran' }, { key: 'status', header: 'Status' }], `nexora-reports-${stamp()}.csv`)
    toast.success(`${ready.length} laporan diekspor (CSV)`)
  }

  function handleCloseCreate() {
    setCreateOpen(false)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  function handleCreate(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.period.trim()) {
      setFormError('Judul dan periode wajib diisi.')
      return
    }
    const id = `RPT-${String(reports.length + 1).padStart(3, '0')}`
    setReports((prev) => [
      { id, title: form.title.trim(), period: form.period.trim(), type: form.type, size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`, status: 'Processing', updated: new Date().toISOString().slice(0, 10) },
      ...prev,
    ])
    handleCloseCreate()
    toast.success(`Laporan "${form.title.trim()}" berhasil ditambahkan & sedang diproses`)
    window.setTimeout(() => {
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Ready' } : r)))
      toast.success(`Laporan ${id} siap diunduh`)
    }, 2500)
  }

  const columns = [
    { key: 'id', header: 'ID', render: (row) => <span className="font-mono text-xs text-slate-400">{row.id}</span> },
    { key: 'title', header: 'Laporan', sortable: true, render: (row) => (<div><p className="font-medium text-slate-700 dark:text-slate-200">{row.title}</p><p className="text-xs text-slate-400">{row.type}</p></div>) },
    { key: 'period', header: 'Periode', sortable: true },
    { key: 'size', header: 'Ukuran', render: (row) => <span className="text-slate-500 dark:text-slate-400">{row.size}</span> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <Badge>{row.status}</Badge> },
    { key: 'action', header: '', className: 'text-right', render: (row) => (<Button variant="ghost" size="sm" disabled={row.status !== 'Ready'} onClick={() => downloadReport(row)}><Download className="h-4 w-4" />Unduh</Button>) },
  ]

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Reports" subtitle="Laporan dan analisis data yang siap diunduh" action={<><Button variant="outline" size="md" onClick={downloadAllReady}><Download className="h-4 w-4" />Unduh Semua Siap</Button><Button variant="primary" size="md" onClick={() => setCreateOpen(true)}><FilePlus2 className="h-4 w-4" />Buat Laporan</Button></>} />
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = ICONS[item.icon] ?? FileText
          return (
            <Card key={item.id} className="flex items-center gap-4 p-5">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${ICON_TONES[item.color]}`}><Icon className="h-5 w-5" /></div>
              <div><p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p><p className="text-xl font-bold text-slate-800 dark:text-white">{item.value}</p></div>
            </Card>
          )
        })}
      </section>
      <Card>
        <Card.Header title="Analisis Channel" subtitle="Total kunjungan per sumber trafik" />
        <Card.Body>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelPerformance} layout="vertical" margin={{ top: 8, right: 16, left: 24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke={gridColor} horizontal={false} />
                <XAxis type="number" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}rb`} />
                <YAxis type="category" dataKey="channel" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} width={110} />
                <Tooltip cursor={{ fill: gridColor }} contentStyle={{ borderRadius: 12, border: 'none', background: isDark ? '#111a2e' : '#fff', fontSize: 12 }} formatter={(value) => [formatNumber(value), 'Visits']} />
                <Bar dataKey="visits" fill="#6366f1" radius={[0, 6, 6, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header title="Daftar Laporan" subtitle="Semua laporan yang tersedia" />
        <Card.Body className="pt-2">
          <DataTable columns={columns} data={reports} pageSize={5} emptyTitle="Belum ada laporan" />
        </Card.Body>
      </Card>
      <Modal
        open={createOpen}
        onClose={handleCloseCreate}
        title="Tambah Data Laporan"
        subtitle="Laporan akan diproses lalu tersedia untuk diunduh"
        footer={
          <>
            <Button variant="ghost" size="md" type="button" onClick={handleCloseCreate}>
              Batal
            </Button>
            <Button variant="primary" size="md" type="submit" form="create-report-form">
              Tambah
            </Button>
          </>
        }
      >
        <form id="create-report-form" onSubmit={handleCreate} className="space-y-4" noValidate>
          <FormError>{formError}</FormError>
          <FormField label="Judul Laporan">
            <input
              name="title"
              required
              className={fieldClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="cth. Laporan Kinerja Q4"
              autoFocus
            />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Periode">
              <input
                name="period"
                required
                className={fieldClass}
                value={form.period}
                onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                placeholder="cth. Q4 2026"
              />
            </FormField>
            <FormField label="Jenis">
              <select
                name="type"
                className={fieldClass}
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                {REPORT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </FormField>
          </div>
        </form>
      </Modal>
    </div>
  )
}
import { useState } from 'react'
import { Check, Download, Plus, RefreshCw } from 'lucide-react'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Modal from '../components/ui/Modal.jsx'
import { FormError, FormField, fieldClass } from '../components/ui/FormField.jsx'
import { integrations as initialIntegrations } from '../data/dashboardData.js'
import { useToast } from '../context/ToastContext.jsx'

const CATEGORY_ICONS = {
  'Data Source': 'brand',
  Automation: 'violet',
  Storage: 'brand',
  Finance: 'emerald',
  Analytics: 'amber',
  Content: 'slate',
}

const CATEGORY_CLASSES = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
}

const CATEGORY_OPTIONS = ['Data Source', 'Automation', 'Storage', 'Finance', 'Analytics', 'Content']

export default function Integrations() {
  const toast = useToast()
  const [items, setItems] = useState(initialIntegrations)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState('2 menit lalu')
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'Data Source', description: '' })
  const [formError, setFormError] = useState('')

  const connected = items.filter((item) => item.status === 'Connected').length

  function connect(id) {
    const target = items.find((i) => i.id === id)
    if (!target || target.status === 'Connected') return
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'Connected',
              connectedAt: 'Baru saja',
              latency: `${Math.floor(Math.random() * 200 + 40)}ms`,
            }
          : i,
      ),
    )
    toast.success(`${target.name} berhasil dihubungkan`)
  }

  function disconnect(id) {
    const target = items.find((i) => i.id === id)
    if (!target || target.status !== 'Connected') return
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: 'Available', connectedAt: 'Belum terhubung', latency: '—' } : i,
      ),
    )
    toast.info(`${target.name} diputuskan`)
  }

  function syncAll() {
    if (syncing) return
    setSyncing(true)
    toast.info('Menyinkronkan semua integrasi...')
    window.setTimeout(() => {
      setItems((prev) =>
        prev.map((i) =>
          i.status === 'Connected'
            ? { ...i, latency: `${Math.floor(Math.random() * 200 + 30)}ms` }
            : i,
        ),
      )
      setLastSync('baru saja')
      setSyncing(false)
      toast.success('Semua integrasi berhasil disinkronkan')
    }, 1400)
  }

  function handleCloseAdd() {
    setAddOpen(false)
    setForm({ name: '', category: 'Data Source', description: '' })
    setFormError('')
  }

  function handleAdd(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.description.trim()) {
      setFormError('Nama dan deskripsi wajib diisi.')
      return
    }
    const id = form.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
    if (items.some((i) => i.id === id)) {
      setFormError('Integrasi dengan nama tersebut sudah ada.')
      return
    }
    setItems((prev) => [
      ...prev,
      {
        id,
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        status: 'Available',
        connectedAt: 'Belum terhubung',
        latency: '—',
      },
    ])
    handleCloseAdd()
    toast.success(`Integrasi "${form.name.trim()}" berhasil ditambahkan`)
  }

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Integrations"
        subtitle="Hubungkan Nexora dengan layanan dan sumber data eksternal"
        action={
          <>
            <Button variant="outline" size="md" onClick={syncAll} disabled={syncing}>
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Menyinkronkan...' : 'Sinkronkan'}
            </Button>
            <Button variant="primary" size="md" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Tambah Integrasi
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const isConnected = item.status === 'Connected'
          const tone = CATEGORY_ICONS[item.category] ?? 'slate'

          return (
            <Card key={item.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${CATEGORY_CLASSES[tone]}`}
                  >
                    <span className="text-base font-bold">{item.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.category}</p>
                  </div>
                </div>
                <Badge>{item.status}</Badge>
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {item.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-white/5">
                <span className="text-slate-400">{item.connectedAt}</span>
                <span className="text-slate-400">
                  Latensi:{' '}
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{item.latency}</span>
                </span>
              </div>

              <Button
                variant={isConnected ? 'outline' : 'primary'}
                size="sm"
                className="mt-4 w-full"
                onClick={() => (isConnected ? disconnect(item.id) : connect(item.id))}
              >
                {isConnected ? (
                  <>
                    <Check className="h-4 w-4" />
                    Terhubung — Klik untuk putus
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Hubungkan
                  </>
                )}
              </Button>
            </Card>
          )
        })}
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {connected} dari {items.length} integrasi aktif
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Terakhir disinkronkan {lastSync} • Status: sehat
            </p>
          </div>
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-500"
              style={{ width: `${items.length ? (connected / items.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </Card>

      <Modal
        open={addOpen}
        onClose={handleCloseAdd}
        title="Tambah Data Integrasi"
        subtitle="Daftarkan sumber data atau layanan baru"
        footer={
          <>
            <Button variant="ghost" size="md" type="button" onClick={handleCloseAdd}>
              Batal
            </Button>
            <Button variant="primary" size="md" type="submit" form="add-integration-form">
              Tambah
            </Button>
          </>
        }
      >
        <form id="add-integration-form" onSubmit={handleAdd} className="space-y-4" noValidate>
          <FormError>{formError}</FormError>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Nama">
              <input
                name="name"
                required
                className={fieldClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="cth. Google Analytics"
                autoFocus
              />
            </FormField>
            <FormField label="Kategori">
              <select
                name="category"
                className={fieldClass}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Deskripsi">
            <textarea
              name="description"
              required
              className={`${fieldClass} min-h-[88px] resize-y`}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Jelaskan fungsi integrasi ini..."
            />
          </FormField>
        </form>
      </Modal>
    </div>
  )
}

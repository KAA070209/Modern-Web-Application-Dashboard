import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertTriangle, Download, Plus, RefreshCw, Search, Trash2, UserCircle2 } from 'lucide-react'
import DataTable from '../components/ui/DataTable.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Modal from '../components/ui/Modal.jsx'
import { FormError, FormField, fieldClass } from '../components/ui/FormField.jsx'
import { useDashboardData } from '../hooks/useDashboardData.js'
import { useToast } from '../context/ToastContext.jsx'
import { downloadCsv, downloadJson, stamp } from '../utils/download.js'

const ROLE_OPTIONS = ['Semua Role', 'Admin', 'Analyst', 'Editor', 'Viewer']
const STATUS_OPTIONS = ['Semua Status', 'Active', 'Inactive', 'Pending']
const ROLE_FORM_OPTIONS = ['Admin', 'Analyst', 'Editor', 'Viewer']
const STATUS_FORM_OPTIONS = ['Active', 'Inactive', 'Pending']

function initials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const EMPTY_FORM = { name: '', email: '', role: 'Viewer', status: 'Active' }

export default function Users() {
  const { users, loading, error, source, lastUpdated, refetch, addUser, removeUser } = useDashboardData()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [role, setRole] = useState('Semua Role')
  const [status, setStatus] = useState('Semua Status')
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')

  // Sinkronkan query dari URL (hasil pencarian global di Navbar).
  useEffect(() => {
    const q = searchParams.get('q')
    if (q != null) setQuery(q)
  }, [searchParams])

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const matchesQuery =
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      const matchesRole = role === 'Semua Role' || user.role === role
      const matchesStatus = status === 'Semua Status' || user.status === status
      return matchesQuery && matchesRole && matchesStatus
    })
  }, [users, query, role, status])

  function handleQueryChange(value) {
    setQuery(value)
    const next = new URLSearchParams(searchParams)
    if (value) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  function exportUsers(format) {
    if (format === 'json') {
      downloadJson(
        filtered.map(({ name, email, role, status, joined, company, city }) => ({
          name,
          email,
          role,
          status,
          joined,
          company,
          city,
        })),
        `nexora-users-${stamp()}.json`,
      )
      toast.success(`${filtered.length} pengguna diekspor (JSON)`)
      return
    }
    downloadCsv(
      filtered,
      [
        { key: 'name', header: 'Nama' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role' },
        { key: 'status', header: 'Status' },
        { key: 'joined', header: 'Terdaftar' },
      ],
      `nexora-users-${stamp()}.csv`,
    )
    toast.success(`${filtered.length} pengguna diekspor (CSV)`)
  }

  function handleCloseAdd() {
    setAddOpen(false)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  function handleAddSubmit(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Nama dan email wajib diisi.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormError('Format email tidak valid.')
      return
    }
    if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setFormError('Email sudah terdaftar.')
      return
    }
    addUser({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    })
    handleCloseAdd()
    toast.success(`Pengguna "${form.name.trim()}" berhasil ditambahkan`)
  }

  function handleRemove(row) {
    removeUser(row.id)
    toast.success(`Pengguna "${row.name}" dihapus dari daftar lokal`)
  }

  const columns = [
    {
      key: 'name',
      header: 'Pengguna',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-xs font-bold text-white">
            {initials(row.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-700 dark:text-slate-200">{row.name}</p>
            <p className="truncate text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <Badge>{row.status}</Badge>,
    },
    {
      key: 'joined',
      header: 'Terdaftar',
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 dark:text-slate-400">{formatDate(row.joined)}</span>
      ),
    },
    {
      key: 'action',
      header: '',
      className: 'text-right',
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => handleRemove(row)} title="Hapus pengguna">
          <Trash2 className="h-4 w-4 text-rose-500" />
        </Button>
      ),
    },
  ]

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Users"
        subtitle="Kelola pengguna, role, dan status akun"
        action={
          <>
            <Button variant="outline" size="md" onClick={refetch} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Muat Ulang
            </Button>
            <DropdownExport onExport={exportUsers} disabled={loading || filtered.length === 0} />
            <Button variant="primary" size="md" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Tambah Pengguna
            </Button>
          </>
        }
      />

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            <p className="text-xs opacity-80">
              Sumber data saat ini: <span className="font-mono uppercase">{source}</span>
              {lastUpdated && ` • diperbarui ${lastUpdated.toLocaleTimeString('id-ID')}`}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={refetch}>
            Coba lagi
          </Button>
        </div>
      )}

      <Card>
        <Card.Header
          title={`Daftar Pengguna (${filtered.length})`}
          subtitle="Data diambil dari API dan dirender secara dinamis"
          action={
            !error && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Sumber: {source}
              </span>
            )
          }
        />
        <Card.Body className="pt-4">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Cari nama atau email..."
                className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="focus-ring rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="focus-ring rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <DataTable
            columns={columns}
            data={filtered}
            loading={loading}
            pageSize={6}
            emptyTitle="Pengguna tidak ditemukan"
            emptyMessage={
              <span className="mt-1 inline-flex flex-col items-center gap-1">
                <UserCircle2 className="h-4 w-4" />
                Coba ubah kata kunci atau filter yang digunakan.
              </span>
            }
          />
        </Card.Body>
      </Card>

      <Modal
        open={addOpen}
        onClose={handleCloseAdd}
        title="Tambah Data Pengguna"
        subtitle="Tambahkan anggota baru ke workspace Nexora"
        footer={
          <>
            <Button variant="ghost" size="md" type="button" onClick={handleCloseAdd}>
              Batal
            </Button>
            <Button variant="primary" size="md" type="submit" form="add-user-form">
              Tambah
            </Button>
          </>
        }
      >
        <form id="add-user-form" onSubmit={handleAddSubmit} className="space-y-4" noValidate>
          <FormError>{formError}</FormError>
          <FormField label="Nama Lengkap">
            <input
              name="name"
              required
              className={fieldClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="cth. Sari Dewi"
              autoFocus
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              name="email"
              required
              className={fieldClass}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="nama@nexora.io"
            />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Role">
              <select
                name="role"
                className={fieldClass}
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              >
                {ROLE_FORM_OPTIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Status">
              <select
                name="status"
                className={fieldClass}
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {STATUS_FORM_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </FormField>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function DropdownExport({ onExport, disabled }) {
  return (
    <div className="relative group">
      <Button variant="outline" size="md" disabled={disabled} onClick={() => onExport('csv')}>
        <Download className="h-4 w-4" />
        Ekspor CSV
      </Button>
      <div className="absolute right-0 top-full z-50 hidden w-44 pt-1 group-focus-within:block group-hover:block">
        <div className="animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-card dark:border-white/10 dark:bg-surface-card-dark">
          <button
            type="button"
            onClick={() => onExport('json')}
            className="block w-full px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Ekspor JSON
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Bell, Check, Globe, Moon, Palette, Save, Sun, Trash2, User } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Modal from '../components/ui/Modal.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useProfile } from '../context/ProfileContext.jsx'

const PREFS_KEY = 'nexora-prefs'

function loadJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
        {description && <span className="block text-xs text-slate-400">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-white/20'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
      />
    </label>
  )
}

const DEFAULT_PREFS = {
  emailNotif: true,
  pushNotif: false,
  weeklyReport: true,
  language: 'id',
  timezone: 'wib',
}

export default function Settings() {
  const { isDark, setTheme } = useTheme()
  const toast = useToast()
  const { profile, setProfile, resetProfile, initials } = useProfile()
  const fileRef = useRef(null)

  const [saved, setSaved] = useState(false)
  const [prefs, setPrefs] = useState(() => loadJson(PREFS_KEY, DEFAULT_PREFS))
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  useEffect(() => {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  }, [prefs])

  function handleSave(event) {
    event.preventDefault()
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error('Nama dan email tidak boleh kosong')
      return
    }
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
    toast.success('Perubahan profil berhasil disimpan')
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProfile((p) => ({ ...p, photo: reader.result }))
      toast.success('Foto profil berhasil diperbarui')
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function removePhoto() {
    setProfile((p) => ({ ...p, photo: null }))
    toast.info('Foto profil dihapus')
  }

  function handleDeleteAccount() {
    if (confirmText.trim().toUpperCase() !== 'HAPUS') {
      toast.error('Ketik HAPUS untuk konfirmasi')
      return
    }
    resetProfile()
    window.localStorage.removeItem(PREFS_KEY)
    setPrefs(DEFAULT_PREFS)
    setConfirmText('')
    setDeleteOpen(false)
    toast.success('Akun demo berhasil direset ke setelan awal')
  }

  const fieldClass =
    'focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Settings" subtitle="Kelola profil, tampilan, dan preferensi aplikasi" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <Card.Header
              title="Profil Pengguna"
              subtitle="Informasi akun yang tampil di dashboard"
              action={<User className="h-5 w-5 text-slate-400" />}
            />
            <Card.Body>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="flex items-center gap-4">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt="Foto profil"
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-xl font-bold text-white">
                      {initials}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    <Button variant="outline" size="sm" type="button" onClick={() => fileRef.current?.click()}>
                      Ganti Foto
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={removePhoto}
                      disabled={!profile.photo}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Nama Lengkap"
                    value={profile.name}
                    onChange={(v) => setProfile((p) => ({ ...p, name: v }))}
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
                  />
                  <Field
                    label="Perusahaan"
                    value={profile.company}
                    onChange={(v) => setProfile((p) => ({ ...p, company: v }))}
                  />
                  <Field
                    label="Jabatan"
                    value={profile.role}
                    onChange={(v) => setProfile((p) => ({ ...p, role: v }))}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="primary" type="submit">
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
                  </Button>
                  {saved && (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <Check className="h-4 w-4" />
                      Perubahan disimpan
                    </span>
                  )}
                </div>
              </form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header
              title="Notifikasi"
              subtitle="Atur bagaimana Anda menerima pemberitahuan"
              action={<Bell className="h-5 w-5 text-slate-400" />}
            />
            <Card.Body className="divide-y divide-slate-100 pt-1 dark:divide-white/5">
              <Toggle
                label="Email Notifikasi"
                description="Kirim ringkasan aktivitas ke email"
                checked={prefs.emailNotif}
                onChange={(v) => {
                  setPrefs((p) => ({ ...p, emailNotif: v }))
                  toast.info(v ? 'Notifikasi email diaktifkan' : 'Notifikasi email dinonaktifkan')
                }}
              />
              <Toggle
                label="Push Notifikasi"
                description="Notifikasi real-time di browser"
                checked={prefs.pushNotif}
                onChange={(v) => {
                  setPrefs((p) => ({ ...p, pushNotif: v }))
                  toast.info(v ? 'Push notifikasi diaktifkan' : 'Push notifikasi dinonaktifkan')
                }}
              />
              <Toggle
                label="Laporan Mingguan"
                description="Terima laporan otomatis setiap Senin"
                checked={prefs.weeklyReport}
                onChange={(v) => {
                  setPrefs((p) => ({ ...p, weeklyReport: v }))
                  toast.info(v ? 'Laporan mingguan diaktifkan' : 'Laporan mingguan dinonaktifkan')
                }}
              />
            </Card.Body>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header
              title="Tampilan"
              subtitle="Pilih tema aplikasi"
              action={<Palette className="h-5 w-5 text-slate-400" />}
            />
            <Card.Body>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTheme('light')
                    toast.info('Tema terang diaktifkan')
                  }}
                  className={`focus-ring rounded-xl border p-3 text-left transition ${
                    !isDark
                      ? 'border-brand-500 ring-2 ring-brand-500/30'
                      : 'border-slate-200 dark:border-white/10'
                  }`}
                >
                  <Sun className="mb-2 h-5 w-5 text-amber-500" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Light</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('dark')
                    toast.info('Tema gelap diaktifkan')
                  }}
                  className={`focus-ring rounded-xl border p-3 text-left transition ${
                    isDark
                      ? 'border-brand-500 ring-2 ring-brand-500/30'
                      : 'border-slate-200 dark:border-white/10'
                  }`}
                >
                  <Moon className="mb-2 h-5 w-5 text-brand-500" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Dark</p>
                </button>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header
              title="Preferensi"
              subtitle="Bahasa dan zona waktu"
              action={<Globe className="h-5 w-5 text-slate-400" />}
            />
            <Card.Body className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Bahasa
                </span>
                <select
                  value={prefs.language}
                  onChange={(e) => {
                    setPrefs((p) => ({ ...p, language: e.target.value }))
                    toast.info(
                      e.target.value === 'id' ? 'Bahasa disetel ke Indonesia' : 'Language set to English',
                    )
                  }}
                  className={fieldClass}
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Zona Waktu
                </span>
                <select
                  value={prefs.timezone}
                  onChange={(e) => {
                    setPrefs((p) => ({ ...p, timezone: e.target.value }))
                    toast.info(`Zona waktu diatur ke ${e.target.value.toUpperCase()}`)
                  }}
                  className={fieldClass}
                >
                  <option value="wib">WIB (GMT+7)</option>
                  <option value="wita">WITA (GMT+8)</option>
                  <option value="wit">WIT (GMT+9)</option>
                </select>
              </label>
            </Card.Body>
          </Card>

          <Card className="border-rose-200 dark:border-rose-500/20">
            <Card.Body>
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">Danger Zone</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Menghapus akun bersifat permanen dan tidak dapat dikembalikan.
              </p>
              <Button variant="danger" size="sm" className="mt-3" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="h-4 w-4" />
                Hapus Akun
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setConfirmText('')
        }}
        title="Hapus Akun"
        subtitle="Tindakan ini tidak dapat dibatalkan"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                setDeleteOpen(false)
                setConfirmText('')
              }}
            >
              Batal
            </Button>
            <Button variant="danger" size="md" onClick={handleDeleteAccount} disabled={confirmText.trim().toUpperCase() !== 'HAPUS'}>
              Ya, Hapus
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Seluruh profil dan preferensi lokal pada aplikasi demo ini akan direset. Ketik{' '}
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">HAPUS</span> untuk
            melanjutkan.
          </p>
          <input
            className={fieldClass}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Ketik HAPUS"
            autoFocus
          />
        </div>
      </Modal>
    </div>
  )
}

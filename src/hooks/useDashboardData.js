import { useCallback, useEffect, useState } from 'react'
import { fallbackUsers } from '../data/dashboardData'

const API_URL = 'https://jsonplaceholder.typicode.com/users'

const ROLES = ['Admin', 'Analyst', 'Editor', 'Viewer']
const PLANS = ['Basic', 'Pro', 'Enterprise']
const STATUSES = ['Active', 'Active', 'Active', 'Inactive', 'Pending']

// Mengubah data mentah dari API menjadi bentuk yang dipakai dashboard.
// Nilai role/status/plan dibuat deterministik dari id agar tampilan stabil.
function mapApiUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: ROLES[user.id % ROLES.length],
    status: STATUSES[user.id % STATUSES.length],
    plan: PLANS[user.id % PLANS.length],
    joined: `2024-${String((user.id * 3) % 12 + 1).padStart(2, '0')}-${String(
      (user.id * 7) % 27 + 1,
    ).padStart(2, '0')}`,
    company: user.company?.name ?? 'Nexora Inc.',
    city: user.address?.city ?? '-',
  }
}

/**
 * Hook untuk mengambil data pengguna dari API dengan penanganan
 * loading, error, dan fallback ke data dummy bila API tidak tersedia.
 * Mendukung penambahan & penghapusan pengguna lokal (state sementara).
 */
export function useDashboardData() {
  const [apiUsers, setApiUsers] = useState([])
  const [localUsers, setLocalUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('api')
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchUsers = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL, { signal })
      if (!res.ok) throw new Error(`Request gagal dengan status ${res.status}`)
      const raw = await res.json()
      await new Promise((resolve) => setTimeout(resolve, 600)) // simulasi latency
      setApiUsers(raw.map(mapApiUser))
      setSource('api')
    } catch (err) {
      if (err.name === 'AbortError') return
      // Fallback agar UI tetap berfungsi walau API/offline.
      setApiUsers(fallbackUsers)
      setSource('fallback')
      setError('Gagal memuat data dari API. Menampilkan data contoh.')
    } finally {
      setLoading(false)
      setLastUpdated(new Date())
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchUsers(controller.signal)
    return () => controller.abort()
  }, [fetchUsers])

  const refetch = useCallback(() => fetchUsers(), [fetchUsers])

  const addUser = useCallback((user) => {
    const id = Date.now()
    setLocalUsers((prev) => [
      {
        id,
        company: 'Nexora Inc.',
        city: '-',
        ...user,
        joined: user.joined || new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ])
    return id
  }, [])

  const removeUser = useCallback((id) => {
    setLocalUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const users = [...localUsers, ...apiUsers]

  return { users, loading, error, source, lastUpdated, refetch, addUser, removeUser }
}

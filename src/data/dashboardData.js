// ---------------------------------------------------------------------------
// Nexora Analytics - Dummy data source
// Semua data di bawah ini adalah data contoh (dummy) dan bukan data bisnis nyata.
// Data ini dipakai sebagai fallback sekaligus sumber data awal untuk dashboard.
// ---------------------------------------------------------------------------

export const stats = [
  {
    id: 'users',
    label: 'Total Pengguna',
    value: 2450,
    format: 'number',
    change: 12.5,
    trend: 'up',
    color: 'brand',
    icon: 'users',
    helper: 'vs bulan lalu (2.178)',
    footer: 'Aktif 94%',
    footerTone: 'success',
  },
  {
    id: 'revenue',
    label: 'Pendapatan Total',
    value: 24500000,
    format: 'currency',
    change: 8.2,
    trend: 'up',
    color: 'emerald',
    icon: 'wallet',
    helper: 'Target Q4 (Rp30 jt)',
    footer: '82%',
    footerTone: 'muted',
    progress: 82,
  },
  {
    id: 'sessions',
    label: 'Sesi Aktif Real-time',
    value: 186,
    format: 'number',
    change: -3.1,
    trend: 'down',
    color: 'brand',
    icon: 'activity',
    helper: 'vs 24 jam lalu',
    footer: 'Rata-rata 4m 12s',
    footerTone: 'muted',
  },
  {
    id: 'conversion',
    label: 'Rasio Konversi',
    value: 4.8,
    format: 'percent',
    change: 1.4,
    trend: 'up',
    color: 'brand',
    icon: 'target',
    helper: 'Benchmark industri (3.2%)',
    footer: '+1.6% Unggul',
    footerTone: 'success',
  },
]

// Data aktivitas bulanan (6 bulan terakhir). Mei - Okt.
// `target` = garis perbandingan yang selalu berada di bawah realisasi.
export const monthlyActivity = [
  { month: 'Mei', users: 210, revenue: 12.4, sessions: 120, target: 11.8 },
  { month: 'Jun', users: 275, revenue: 15.1, sessions: 148, target: 13.6 },
  { month: 'Jul', users: 235, revenue: 13.8, sessions: 133, target: 13.0 },
  { month: 'Agu', users: 320, revenue: 18.6, sessions: 171, target: 16.5 },
  { month: 'Sep', users: 298, revenue: 21.2, sessions: 163, target: 18.6 },
  { month: 'Okt', users: 348, revenue: 24.5, sessions: 186, target: 21.0 },
]

// Dataset 12 bulan untuk halaman Analytics.
export const yearlyActivity = [
  { month: 'Jan', users: 180, revenue: 9.2, sessions: 98, orders: 142 },
  { month: 'Feb', users: 195, revenue: 10.1, sessions: 104, orders: 151 },
  { month: 'Mar', users: 205, revenue: 11.4, sessions: 112, orders: 160 },
  { month: 'Apr', users: 198, revenue: 10.9, sessions: 108, orders: 156 },
  { month: 'Mei', users: 210, revenue: 12.4, sessions: 120, orders: 168 },
  { month: 'Jun', users: 275, revenue: 15.1, sessions: 148, orders: 189 },
  { month: 'Jul', users: 235, revenue: 13.8, sessions: 133, orders: 176 },
  { month: 'Agu', users: 320, revenue: 18.6, sessions: 171, orders: 213 },
  { month: 'Sep', users: 298, revenue: 21.2, sessions: 163, orders: 205 },
  { month: 'Okt', users: 348, revenue: 24.5, sessions: 186, orders: 236 },
  { month: 'Nov', users: 365, revenue: 26.1, sessions: 194, orders: 248 },
  { month: 'Des', users: 402, revenue: 28.9, sessions: 208, orders: 271 },
]

// Ringkasan ringkas untuk footer grafik utama.
export const chartHighlights = [
  { id: 'total', label: 'Total Q3-Q4', value: 'Rp 114,8 Juta', color: 'brand' },
  { id: 'avg', label: 'Rata-rata Bulanan', value: 'Rp 19,1 Juta/bln', color: 'muted' },
  { id: 'target', label: 'Status Target', value: '103.4% Terpenuhi', color: 'success' },
]

// Distribusi pengguna berdasarkan sumber akuisisi trafik.
export const userDistribution = [
  { id: 'direct', name: 'Langsung (Direct URL)', value: 42, count: 1029, color: '#2563eb' },
  { id: 'organic', name: 'Pencarian Organik', value: 28, count: 688, color: '#16a34a' },
  { id: 'referral', name: 'Rujukan (Referral)', value: 18, count: 441, color: '#60a5fa' },
  { id: 'social', name: 'Media Sosial & Ads', value: 12, count: 294, color: '#ec4899' },
]

export const growthInsight = {
  title: 'Wawasan Pertumbuhan',
  body: 'Pertumbuhan rujukan mitra naik ',
  highlight: '+24%',
  tail: ' minggu ini setelah penyesuaian reward kuartalan. Direkomendasikan untuk menaikkan alokasi kuota tim pemasaran.',
}

export const systemHealth = {
  status: 'Semua sistem beroperasi normal',
  latency: '24ms',
}

// Log aktivitas sistem & transaksi, dikelompokkan berdasarkan kategori.
export const systemActivities = [
  {
    id: 1,
    category: 'Pengguna',
    title: 'User baru terdaftar',
    detail: 'Budi Setiawan • Enterprise Plan',
    time: '5 menit lalu',
    status: 'Baru',
    icon: 'user-plus',
    tone: 'brand',
  },
  {
    id: 2,
    category: 'Transaksi',
    title: 'Laporan bulanan digenerate',
    detail: 'Laporan Keuangan Q3 (PDF, 8.4MB)',
    time: '1 jam lalu',
    status: 'Selesai',
    icon: 'file',
    tone: 'emerald',
  },
  {
    id: 3,
    category: 'Transaksi',
    title: 'Pembayaran diterima — Rp4.250.000',
    detail: 'Invoice #INV-2026-089 • Bank Transfer',
    time: '3 jam lalu',
    status: 'Lunas',
    icon: 'receipt',
    tone: 'emerald',
  },
  {
    id: 4,
    category: 'Sistem',
    title: 'Cadangan sistem selesai',
    detail: 'Automated Database Snapshot 4.2GB',
    time: '6 jam lalu',
    status: 'Sukses',
    icon: 'cloud',
    tone: 'slate',
  },
  {
    id: 5,
    category: 'Sistem',
    title: 'Tiket dukungan baru dibuka',
    detail: 'Kendala integrasi Webhook API • #TKT-412',
    time: '9 jam lalu',
    status: 'Menunggu',
    icon: 'ticket',
    tone: 'rose',
  },
]

// Kategori filter untuk log aktivitas.
export const activityTabs = ['Pengguna', 'Transaksi', 'Sistem']

// Data pendukung pie/donut chart untuk sumber trafik (halaman Analytics).
export const trafficSources = [
  { name: 'Organic Search', value: 42, color: '#2563eb' },
  { name: 'Direct', value: 24, color: '#16a34a' },
  { name: 'Social Media', value: 19, color: '#f59e0b' },
  { name: 'Referral', value: 15, color: '#8b5cf6' },
]

// Ringkasan channel untuk halaman Reports.
export const channelPerformance = [
  { channel: 'Organic Search', visits: 12840, conversion: 4.9, growth: 12.4 },
  { channel: 'Direct', visits: 7320, conversion: 3.8, growth: 6.1 },
  { channel: 'Social Media', visits: 5810, conversion: 2.7, growth: -1.8 },
  { channel: 'Referral', visits: 4560, conversion: 5.4, growth: 9.6 },
  { channel: 'Email Campaign', visits: 3120, conversion: 6.8, growth: 14.2 },
]

export const activities = [
  {
    id: 1,
    title: 'New user registered',
    detail: 'User registration',
    time: '5 menit lalu',
    status: 'New',
    tone: 'brand',
  },
  {
    id: 2,
    title: 'Monthly report generated',
    detail: 'Reporting',
    time: '1 jam lalu',
    status: 'Done',
    tone: 'emerald',
  },
  {
    id: 3,
    title: 'Payment received — Rp4.250.000',
    detail: 'Billing',
    time: '3 jam lalu',
    status: 'Paid',
    tone: 'emerald',
  },
  {
    id: 4,
    title: 'System backup completed',
    detail: 'Infrastructure',
    time: '6 jam lalu',
    status: 'Done',
    tone: 'slate',
  },
  {
    id: 5,
    title: 'New support ticket opened',
    detail: 'Support',
    time: '9 jam lalu',
    status: 'Pending',
    tone: 'amber',
  },
]

export const notifications = [
  { id: 1, title: 'Daily report siap diunduh', time: 'Baru saja', unread: true },
  { id: 2, title: '3 pengguna baru menunggu verifikasi', time: '20 menit lalu', unread: true },
  { id: 3, title: 'Revenue bulan ini naik 8.2%', time: '2 jam lalu', unread: false },
]

// Fallback data pengguna. Digunakan jika API gagal / offline.
export const fallbackUsers = [
  { id: 1, name: 'Andi Pratama', email: 'andi.pratama@nexora.io', role: 'Admin', status: 'Active', plan: 'Enterprise', joined: '2024-01-12' },
  { id: 2, name: 'Siti Nurhaliza', email: 'siti.n@nexora.io', role: 'Analyst', status: 'Active', plan: 'Pro', joined: '2024-02-03' },
  { id: 3, name: 'Budi Santoso', email: 'budi.santoso@nexora.io', role: 'Editor', status: 'Inactive', plan: 'Pro', joined: '2024-02-18' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi.lestari@nexora.io', role: 'Viewer', status: 'Active', plan: 'Basic', joined: '2024-03-05' },
  { id: 5, name: 'Rizki Firmansyah', email: 'rizki.f@nexora.io', role: 'Analyst', status: 'Active', plan: 'Pro', joined: '2024-03-22' },
  { id: 6, name: 'Putri Anggraini', email: 'putri.a@nexora.io', role: 'Editor', status: 'Pending', plan: 'Basic', joined: '2024-04-09' },
  { id: 7, name: 'Agus Wijaya', email: 'agus.wijaya@nexora.io', role: 'Admin', status: 'Active', plan: 'Enterprise', joined: '2024-04-27' },
  { id: 8, name: 'Maya Sari', email: 'maya.sari@nexora.io', role: 'Viewer', status: 'Inactive', plan: 'Basic', joined: '2024-05-14' },
  { id: 9, name: 'Fajar Nugroho', email: 'fajar.n@nexora.io', role: 'Analyst', status: 'Active', plan: 'Pro', joined: '2024-06-01' },
  { id: 10, name: 'Intan Permata', email: 'intan.p@nexora.io', role: 'Editor', status: 'Active', plan: 'Pro', joined: '2024-06-19' },
  { id: 11, name: 'Hendra Gunawan', email: 'hendra.g@nexora.io', role: 'Viewer', status: 'Pending', plan: 'Basic', joined: '2024-07-08' },
  { id: 12, name: 'Rina Marlina', email: 'rina.marlina@nexora.io', role: 'Analyst', status: 'Active', plan: 'Enterprise', joined: '2024-07-25' },
]

export const reports = [
  {
    id: 'RPT-001',
    title: 'Monthly Performance Report',
    period: 'Oktober 2024',
    type: 'Performance',
    size: '2.4 MB',
    status: 'Ready',
    updated: '2024-10-31',
  },
  {
    id: 'RPT-002',
    title: 'User Growth Analysis',
    period: 'Q3 2024',
    type: 'Analytics',
    size: '1.8 MB',
    status: 'Ready',
    updated: '2024-10-05',
  },
  {
    id: 'RPT-003',
    title: 'Revenue & Billing Summary',
    period: 'September 2024',
    type: 'Finance',
    size: '3.1 MB',
    status: 'Ready',
    updated: '2024-10-01',
  },
  {
    id: 'RPT-004',
    title: 'Traffic Source Breakdown',
    period: 'October 2024',
    type: 'Marketing',
    size: '1.2 MB',
    status: 'Processing',
    updated: '2024-11-02',
  },
  {
    id: 'RPT-005',
    title: 'Customer Retention Cohort',
    period: 'Q3 2024',
    type: 'Analytics',
    size: '2.0 MB',
    status: 'Ready',
    updated: '2024-09-28',
  },
]

export const reportSummary = [
  { id: 'total', label: 'Total Laporan', value: 5, icon: 'file', color: 'brand' },
  { id: 'ready', label: 'Siap Diunduh', value: 4, icon: 'download', color: 'emerald' },
  { id: 'processing', label: 'Diproses', value: 1, icon: 'loader', color: 'amber' },
  { id: 'storage', label: 'Total Ukuran', value: '10.5 MB', icon: 'database', color: 'violet' },
]

// Data katalog integrasi untuk halaman Integrations.
export const integrations = [
  {
    id: 'rest-api',
    name: 'Nexora REST API',
    category: 'Data Source',
    description: 'Sinkronisasi realtime antarmuka dashboard dengan basis data produksi.',
    status: 'Connected',
    connectedAt: 'Sejak 12 Feb 2026',
    latency: '42ms',
  },
  {
    id: 'webhooks',
    name: 'Outbound Webhooks',
    category: 'Automation',
    description: 'Kirim event penting ke Slack, Email, atau endpoint kustom Anda.',
    status: 'Connected',
    connectedAt: 'Sejak 03 Mar 2026',
    latency: '88ms',
  },
  {
    id: 'warehouse',
    name: 'Cloud Data Warehouse',
    category: 'Storage',
    description: 'Agregasi historis mentah untuk laporan jangka panjang.',
    status: 'Connected',
    connectedAt: 'Sejak 20 Apr 2026',
    latency: '1.2s',
  },
  {
    id: 'billing',
    name: 'Billing & Payments',
    category: 'Finance',
    description: 'Rekonsiliasi invoice, pembayaran, dan refund otomatis.',
    status: 'Connected',
    connectedAt: 'Sejak 09 Jun 2026',
    latency: '210ms',
  },
  {
    id: 'bi-tool',
    name: 'Business Intelligence Suite',
    category: 'Analytics',
    description: 'Ekspor dataset terpilih ke alat BI eksternal secara berkala.',
    status: 'Available',
    connectedAt: 'Belum terhubung',
    latency: '—',
  },
  {
    id: 'cms',
    name: 'Headless CMS',
    category: 'Content',
    description: 'Sinkronisasi konten laporan, artikel, dan aset pemasaran.',
    status: 'Available',
    connectedAt: 'Belum terhubung',
    latency: '—',
  },
]

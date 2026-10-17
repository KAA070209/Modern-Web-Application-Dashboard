# Nexora Analytics — Modern Web Application Dashboard

Aplikasi dashboard **modern** dan **responsif** yang dibangun dengan praktik pengembangan frontend terkini menggunakan **React + Vite**. Proyek ini dibuat untuk **Task 6 (Advanced) – Modern Web Application Dashboard**.

> Preview konseptual. Semua angka & data di aplikasi adalah **data contoh (dummy)**, bukan data bisnis nyata.

---

## Fitur

| Fitur | Deskripsi |
| --- | --- |
| **Dashboard Overview** | Ringkasan statistik utama yang menyesuaikan periode terpilih (Total Pengguna, Pendapatan Total, Total Sesi, Pencapaian Target) dengan footer indikator. |
| **Analytics & Trends** | Grafik perkembangan data (area, line, bar), KPI, filter periode, dan tabel performa channel. |
| **Users & Teams** | Daftar pengguna dalam tabel dengan pencarian, filter role/status, sorting, dan pagination. |
| **Reports & Exports** | Ringkasan laporan, analisis channel, dan tabel laporan yang bisa diunduh. |
| **Integrations** | Katalog integrasi data eksternal beserta status koneksi dan latensinya. |
| **Settings** | Pengaturan profil, tampilan (tema), notifikasi, dan preferensi. |
| **Responsive Layout** | Tampilan menyesuaikan desktop, tablet, dan HP (sidebar off-canvas di mobile). |

### Alur layout Dashboard

1. **Navbar** — pencarian global (`⌘K`), pemilih rentang tanggal, toggle tema, notifikasi, dan profil pengguna.
2. **Page header** — judul halaman, tanggal hari ini, serta aksi cepat (*6 Bulan Terakhir*, *Filter*, *Unduh Laporan*).
3. **Stat cards** — 4 kartu metrik (KPI) dinamis yang **dihitung ulang mengikuti periode terpilih**, lengkap dengan indikator tren dan bar progres.
4. **Chart card** — grafik area `Aktivitas Pendapatan Bulanan` dengan badge *Live Sync*, pemilih periode (3B/6B/12B/Semua), garis target putus-putus, callout sorotan bulan tertinggi, dan footer ringkasan.
5. **Log & distribusi** — kartu `Aktivitas Sistem & Log Transaksi` bertab kategori di kiri, kartu `Distribusi Pengguna` dengan bar persentase + insight pertumbuhan di kanan.

### Checklist fitur interaktif (8/8)

- [x] **Sidebar navigation** — berpindah halaman tanpa reload penuh (React Router).
- [x] **Dynamic stat cards** — angka statistik berasal dari data (`src/data/dashboardData.js`).
- [x] **Interactive charts** — tooltip interaktif & pilihan periode via Recharts.
- [x] **Search and filter** — mencari & menyaring data pengguna berdasarkan role/status.
- [x] **Responsive sidebar** — sidebar dapat dibuka/tutup di layar HP.
- [x] **Loading and empty states** — skeleton loading, error banner, dan empty state tabel.
- [x] **Theme toggle** — beralih light mode / dark mode (disimpan di `localStorage`).
- [x] **API integration** — mengambil data pengguna dari API dengan penanganan error & fallback.

### Semua tombol & aksi berfungsi

| Halaman | Aksi Interaktif |
| --- | --- |
| **Navbar** | Pencarian global (Enter → rute relevan + `?q=`), date range tersimpan di `localStorage`, toggle tema, notifikasi (tandai dibaca), menu profil (Pengaturan/Bantuan/Keluar). |
| **Dashboard** | Dropdown periode (3/6/12/Semua) — **kartu KPI & grafik ikut berubah** sesuai periode, filter tren statistik, unduh laporan CSV & JSON, *Buka Analisis Mendalam* → `/analytics`. |
| **Analytics** | Filter periode 6/12 bulan (KPI + chart ikut berubah). |
| **Users** | Muat ulang API, ekspor CSV/JSON (terfilter), tambah pengguna (modal + validasi), hapus pengguna, sinkron query pencarian dengan URL `?q=`. |
| **Reports** | Buat laporan baru (modal → status *Processing* → *Ready*), unduh per laporan (JSON), unduh semua yang siap (CSV). |
| **Integrations** | Hubungkan / putuskan integrasi, sinkronkan semua (dengan spinner), tambah integrasi ke katalog. |
| **Settings** | Ganti/hapus foto profil (preview + validasi ukuran), simpan profil, toggle notifikasi, pilih tema, bahasa & zona waktu (persist `localStorage`), hapus akun dengan konfirmasi ketik `HAPUS`. |
| **Feedback** | Toast notifikasi sukses/info/error di semua aksi. |

---

## Teknologi

| Teknologi | Kegunaan |
| --- | --- |
| **React.js** | Membangun UI dan komponen |
| **Vite** | Development server & bundler |
| **JavaScript (ESM)** | Logika aplikasi |
| **Tailwind CSS** | Styling & responsive design |
| **Recharts** | Grafik dan visualisasi data |
| **React Router** | Navigasi antar halaman |
| **React Hooks** | State management & efek (`useState`, `useEffect`, `useMemo`, Context) |
| **Lucide React** | Ikon aplikasi |
| **Vercel** | Deployment aplikasi |

---

## Menjalankan Proyek

Pastikan **Node.js 18+** sudah terpasang.

```bash
# 1. Install dependency
npm install

# 2. Jalankan development server (buka http://localhost:5173)
npm run dev

# 3. Build untuk produksi
npm run build

# 4. Pratinjau hasil build
npm run preview
```

---

## Struktur Folder

```
nexora-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/                    # aset statis (logo)
│   ├── components/
│   │   ├── layout/                # Sidebar, Navbar, DashboardLayout
│   │   ├── dashboard/             # StatCard, RevenueChart, RecentActivity, UserDistribution
│   │   └── ui/                    # Button, Card, Badge, DataTable, Skeleton, PageHeader, Modal, Dropdown
│   ├── context/                   # ThemeContext, ToastContext
│   ├── data/                      # dashboardData.js (sumber data dummy)
│   ├── hooks/                     # useDashboardData.js (fetch + fallback + add/remove)
│   ├── layouts/                   # re-export layout aplikasi
│   ├── pages/                     # Dashboard, Analytics, Users, Reports, Integrations, Settings
│   ├── utils/                     # format.js, download.js (CSV/JSON export)
│   ├── App.jsx                    # konfigurasi routing
│   ├── main.jsx                   # entry point React
│   └── index.css                  # Tailwind + style global
├── README.md
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Alur Pengerjaan

1. **Design Dashboard Layout** — merancang sidebar, navbar, kartu statistik, grafik, tabel, dan sistem warna.
2. **Create Reusable UI Components** — memecah UI menjadi komponen modular (`Card`, `Button`, `Badge`, `DataTable`, `StatCard`, `RevenueChart`, dll).
3. **Integrate Dynamic Data Sources** — data dummy JSON + integrasi API (`jsonplaceholder`) dengan state, loading, dan error handling.
4. **Implement Charts and Analytics** — grafik area, line, dan bar interaktif dengan filter periode dan indikator perubahan data.
5. **Deploy and Present** — uji fitur, pastikan responsif, unggah ke GitHub, deploy ke Vercel, dan siapkan dokumentasi.

---

## Integrasi API

Halaman **Users** mengambil data dari:

```
https://jsonplaceholder.typicode.com/users
```

Data API dipetakan ke struktur pengguna aplikasi. Jika API gagal atau perangkat offline, aplikasi otomatis memakai **data fallback** (`fallbackUsers`) dan menampilkan banner peringatan, sehingga UI tetap berfungsi.

---

## Catatan

- Data pada aplikasi ini adalah **data contoh (dummy)** untuk keperluan demonstrasi.
- Tema terang/gelap mengikuti preferensi sistem saat pertama dibuka, lalu disimpan di `localStorage`.

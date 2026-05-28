<div align="center">

<img width="1919" height="639" alt="image" src="https://github.com/user-attachments/assets/066e85b9-80dd-497e-aad7-9f781b51fc97" />

# ✦ Peble
### *Hoax Data Center — Executive Information System*

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white"/>
</p>

<p>
  <a href="https://peble-production.up.railway.app/insight">
    <img src="https://img.shields.io/badge/◉ Live Demo-peble--production.up.railway.app-38BDF8?style=for-the-badge"/>
  </a>
</p>

> *Sistem informasi eksekutif untuk memantau, menganalisis, dan mengklarifikasi informasi hoaks secara real-time.*

</div>

---

## **Deskripsi Aplikasi** ★

**Peble** adalah *Executive Information System* (EIS) Platform yang hadir sebagai pusat data digital untuk mengelola arsip klarifikasi hoaks, menganalisis tren penyebaran misinformasi, dan menghasilkan insight berbasis data bagi para pemangku keputusan organisasi.

Sistem memiliki dua jenis pengguna: **Admin** yang mengelola seluruh database hoaks, berita, dan staff, serta **User** yang dapat mengakses dashboard insight dan laporan secara real-time.

> ◉ Live: [https://peble-production.up.railway.app/insight](https://peble-production.up.railway.app/insight)  
> ◉ Dibangun untuk: Masyarakat · 2026

---

## **Fitur Aplikasi** ⸝⸝.ᐟ⋆.ᐟ

### Features Checklist ᯓ★

**Fitur Utama:**
- [x] Dashboard Insight — visualisasi data hoaks dengan chart interaktif
- [x] Manajemen Berita & Hoaks — CRUD lengkap dengan star schema database
- [x] Halaman Laporan — generate & export laporan analisis hoaks
- [x] Admin Management — kelola data staff dan role pengguna
- [x] Autentikasi — login aman berbasis JWT session
- [x] Protected Routes — halaman terproteksi berdasarkan role

**Nilai Tambah:**
- [x] Holographic Card — efek kartu holografik interaktif pada hero section
- [x] Blur Text Animation — animasi teks blur-in menggunakan `motion/react`
- [x] Fading Video Loop — komponen video dengan efek fade in/out otomatis
- [x] HLS Video Streaming — streaming video adaptif via `hls.js`
- [x] Typing Messages Animation — animasi typewriter multi-pesan
- [x] Infinite Grid Background — grid animasi tak terbatas sebagai background
- [x] Liquid Glass UI — efek glassmorphism kustom di seluruh halaman
- [x] Landing Page cinematic — hero section sinematik + testimonial + stats
- [x] Deployment via Railway — produksi di Railway.app

---

## **Arsitektur & Tech Stack** ᯓ★

### Frontend ⍟

- [x] **React 18** — UI library utama
- [x] **Vite** — build tool & dev server super cepat
- [x] **TailwindCSS** — utility-first styling
- [x] **React Router DOM** — client-side routing
- [x] **motion/react** — animasi halaman & komponen
- [x] **Recharts** — chart visualisasi data (AreaChart, LineChart, BarChart)

### Backend ⍟

- [x] **Express.js** — REST API server
- [x] **better-sqlite3** — SQLite database dengan star schema
- [x] **TypeScript** — type safety untuk server

### Database — Star Schema ⍟

```
Fact Table:
└── fact_hoaks (id_berita, id_tag, id_waktu, id_sumber, id_topik, id_kategori, id_status_hoaks, tahun)

Dimension Tables:
├── dim_berita    — konten artikel & berita
├── dim_kategori  — kategori hoaks
├── dim_status_hoaks — Hoaks / Verifikasi / Unknown
├── dim_sumber    — sumber berita (Komdigi, dll.)
├── dim_tag       — tag hashtag
├── dim_topik     — topik (Kesehatan, Politik, dll.)
└── dim_waktu     — dimensi waktu (hari, bulan, tahun, quarter)
```

---

## **Komponen & UI** ⸝⸝.ᐟ⋆.ᐟ

### Komponen Custom ᯓ★

| Komponen | Deskripsi |
|----------|-----------|
| `HolographicCard` | Kartu dengan efek holografik 3D mengikuti gerakan kursor |
| `BlurText` | Animasi teks blur-to-clear word by word saat masuk viewport |
| `FadingVideo` | Video looping dengan transisi fade in/out otomatis |
| `HlsVideo` | Player video HLS adaptif menggunakan `hls.js` |
| `TypingMessages` | Typewriter effect untuk multiple pesan bergantian |
| `InfiniteGrid` | Background grid animasi tak terbatas |
| `ProtectedRoute` | Guard route berbasis autentikasi JWT |

### Halaman & Section ᯓ★

| Halaman | Deskripsi |
|---------|-----------|
| `Landing` | Halaman publik — Hero, Stats, Features, Testimonials, CTA |
| `Login` | Form autentikasi dengan validasi |
| `Dashboard` | Overview data dan ringkasan aktivitas |
| `Insight` | Visualisasi data hoaks multi-dimensi dengan Recharts |
| `Report` | Laporan mendalam berdasarkan filter waktu & topik |
| `AdminManagement` | Kelola data staff dan role pengguna |
| `Profile` | Profil & pengaturan akun pengguna |

### Landing Page Sections ᯓ★

| Section | Deskripsi |
|---------|-----------|
| `Hero` | Banner sinematik + HolographicCard + animasi kursor |
| `Stats` | Statistik nasional dengan chart Recharts |
| `FeaturesGrid` | Grid fitur dengan efek hover |
| `FeaturesChess` | Layout chess alternating untuk detail fitur |
| `Testimonials` | Kutipan & testimoni pengguna |
| `CtaFooter` | Call-to-action + footer |
| `Navbar` | Navigasi transparan dengan efek scroll |

---

## **Database Schema** ⊹ ࣪ ˖ ✔

```sql
-- Tabel Fakta
CREATE TABLE fact_hoaks (
  id_fact_hoaks   INTEGER PRIMARY KEY AUTOINCREMENT,
  id_berita       INTEGER REFERENCES dim_berita(id_berita),
  id_tag          INTEGER REFERENCES dim_tag(id_tag),
  id_waktu        INTEGER REFERENCES dim_waktu(id_waktu),
  id_sumber       INTEGER REFERENCES dim_sumber(id_sumber),
  id_topik        INTEGER REFERENCES dim_topik(id_topik),
  id_kategori     INTEGER REFERENCES dim_kategori(id_kategori),
  id_status_hoaks INTEGER REFERENCES dim_status_hoaks(id_status_hoaks),
  tahun           INTEGER
);

-- Tabel Dimensi
CREATE TABLE dim_berita (
  id_berita       INTEGER PRIMARY KEY AUTOINCREMENT,
  judul TEXT, isi TEXT, excerpt TEXT, author TEXT,
  link TEXT, slug TEXT UNIQUE, main_image_url TEXT, view_count TEXT
);

CREATE TABLE dim_status_hoaks (
  id_status_hoaks INTEGER PRIMARY KEY AUTOINCREMENT,
  status_hoaks TEXT  -- 'Hoaks' | 'Verifikasi' | 'Unknown'
);

CREATE TABLE dim_waktu (
  id_waktu INTEGER PRIMARY KEY AUTOINCREMENT,
  tanggal DATETIME, hari INTEGER, nama_hari INTEGER,
  bulan INTEGER, nama_bulan INTEGER, tahun INTEGER, quarter INTEGER
);

-- Auth
CREATE TABLE staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_lengkap VARCHAR(255), username VARCHAR(100) UNIQUE,
  password VARCHAR(255), kementerian VARCHAR(255),
  jabatan VARCHAR(100), role TEXT CHECK(role IN ('admin', 'user'))
);
```

---

## **Library Structure** ⊹ ࣪ ˖ ✔

```
pebble/
│
├── 📂 src/
│   ├── App.jsx                    → Router utama + layout
│   │
│   ├── 📂 components/
│   │   ├── 📂 auth/
│   │   │   └── ProtectedRoute.jsx → Guard route autentikasi
│   │   │
│   │   ├── 📂 common/
│   │   │   ├── BlurText.jsx       → Animasi blur text per kata
│   │   │   ├── FadingVideo.jsx    → Video loop dengan fade effect
│   │   │   ├── HlsVideo.jsx       → HLS adaptive video player
│   │   │   ├── HolographicCard.jsx → Kartu holografik interaktif
│   │   │   └── TypingMessages.jsx → Typewriter multi-message
│   │   │
│   │   ├── 📂 layout/
│   │   │   ├── BottomNav.jsx      → Navigasi bawah (mobile)
│   │   │   ├── DashboardLayout.jsx → Layout utama dashboard
│   │   │   └── DesktopSidebar.jsx → Sidebar navigasi desktop
│   │   │
│   │   ├── 📂 sections/           → Sections landing page
│   │   │   ├── Hero.jsx
│   │   │   ├── Stats.tsx
│   │   │   ├── FeaturesGrid.jsx
│   │   │   ├── FeaturesChess.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── CtaFooter.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   └── 📂 ui/
│   │       ├── HeroHighlight.jsx
│   │       └── InfiniteGrid.jsx   → Background grid animasi
│   │
│   ├── 📂 context/
│   │   └── AuthContext.jsx        → Global state autentikasi
│   │
│   ├── 📂 pages/
│   │   ├── Landing.jsx            → Halaman publik
│   │   ├── Login.tsx              → Form login
│   │   ├── Dashboard.jsx          → Ringkasan data
│   │   ├── Insight.jsx            → Visualisasi & analisis hoaks
│   │   ├── Report.jsx             → Laporan mendalam
│   │   ├── AdminManagement.jsx    → Kelola staff
│   │   └── Profile.jsx            → Profil pengguna
│   │
│   ├── 📂 routes/
│   │   ├── dashboard.js           → API routes dashboard
│   │   └── report.js              → API routes laporan
│   │
│   └── 📂 lib/
│       └── utils.ts               → Utility functions (cn, dll.)
│
├── db.ts                          → Inisialisasi & seed SQLite database
├── server.ts                      → Entry point Express server
├── index.html
├── vite.config.ts
└── tailwind.config.js
```

---

## **Program Flows** ⭑ & Graphical User Interface (GUI) —͟͟͞͞★

### Landing Page ⍟
> 📌 *Hero sinematik dengan HolographicCard, stats nasional, dan fitur-fitur PRK*
>
> <!-- INSERT POSTER / SCREENSHOT HERE -->

---

### Login Page ⍟
> 📌 *Form autentikasi dengan validasi role admin/user*
>
> <!-- INSERT SCREENSHOT HERE -->

---

### Dashboard ⍟
> 📌 *Ringkasan data hoaks, aktivitas terbaru, dan quick stats*
>
> <!-- INSERT SCREENSHOT HERE -->

---

### Insight — Visualisasi Data ⍟
> 📌 *Chart multi-dimensi: tren hoaks per tahun, distribusi topik, akurasi verifikasi, sumber terpercaya*
>
> <!-- INSERT SCREENSHOT HERE -->

---

### Report ⍟
> 📌 *Laporan mendalam dengan filter waktu, topik, dan kategori*
>
> <!-- INSERT SCREENSHOT HERE -->

---

### Admin Management ⍟
> 📌 *Kelola data staff: tambah, edit, hapus, atur role admin/user*
>
> <!-- INSERT SCREENSHOT HERE -->

---

### Poster ⍟
> 📌 *Poster Pebble PRK Data Center*
>
> <!-- INSERT POSTER HERE -->

---

## **Cara Menjalankan** ᯓ★

### Setup ⍟

**1. Clone repositori**
```bash
git clone https://github.com/[username]/pebble.git
cd pebble
```

**2. Install dependencies**
```bash
npm install
```

**3. Jalankan development server**
```bash
npm run dev
```

**4. Build untuk production**
```bash
npm run build
```

**5. Jalankan server production**
```bash
node server.js
```
---

## **Deployment** ⊹ ࣪ ˖ ✔

Aplikasi di-deploy ke **Railway.app** secara otomatis dari branch `main`.

```
◉ Production URL: https://peble-production.up.railway.app
◉ Platform: Railway.app
◉ Runtime: Node.js
◉ Database: SQLite (file-based, bundled)
```

---

<div align="center">

*© 2026 · Peble · BEM-KM Universitas Mulawarman*

**✦ pebble · research · data · insight ✦**

</div>

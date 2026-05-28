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
  <a href="https://peble-production.up.railway.app">
    <img src="https://img.shields.io/badge/◉ Live Demo-peble--production.up.railway.app-38BDF8?style=for-the-badge"/>
  </a>
  <a href="https://colab.research.google.com/drive/1ja2J7DLHCB-Umh8kIMoW_VTUUEOcToWi#scrollTo=xbS57XTIL3VA">
    <img src="https://img.shields.io/badge/◉ Open in Colab-ETL Notebook-F9AB00?style=for-the-badge"/>
  </a>
</p>

> *Sistem informasi eksekutif untuk memantau, menganalisis, dan mengklarifikasi informasi hoaks secara real-time — ditenagai oleh data warehouse yang dibangun dari nol.*

<br/>

| 31.000+ | 5 Sumber | 8 Tabel | 2 Layer |
|:-------:|:--------:|:-------:|:-------:|
| Total Berita | Media Digital | Star Schema | Frontend + ETL |

</div>

---

## ◆ Daftar Isi

**Bagian I — Aplikasi Fullstack**
- [Deskripsi Aplikasi](#-deskripsi-aplikasi-)
- [Fitur Aplikasi](#-fitur-aplikasi-)
- [Arsitektur & Tech Stack](#-arsitektur--tech-stack-)
- [Komponen & UI](#-komponen--ui-)
- [Database Schema](#-database-schema-)
- [Cara Menjalankan](#-cara-menjalankan-)
- [Deployment](#-deployment-)

**Bagian II — ETL Pipeline & Data Warehouse**
- [Tentang Notebook](#-tentang-notebook)
- [Sumber Data](#-sumber-data)
- [Alur ETL Pipeline](#-alur-etl-pipeline)
- [Struktur Data Warehouse](#-struktur-data-warehouse)
- [Verifikasi & Validasi](#-verifikasi--validasi)
- [Output File](#-output-file)
---

<br/>
<div align="center">

## — BAGIAN I —
# ✦ Peble Application
### *Frontend · Backend · Database*

</div>
<br/>

---

## **Deskripsi Aplikasi** ★

**Peble** adalah *Executive Information System* (EIS) Platform yang hadir sebagai pusat data digital untuk mengelola arsip klarifikasi hoaks, menganalisis tren penyebaran misinformasi, dan menghasilkan insight berbasis data bagi para pemangku keputusan organisasi.

Sistem memiliki dua jenis pengguna: **Admin** yang mengelola seluruh database hoaks, berita, dan staff, serta **User** yang dapat mengakses dashboard insight dan laporan secara real-time.

> ◉ Live: [https://peble-production.up.railway.app](https://peble-production.up.railway.app)  
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

<br/>
<div align="center">

## — BAGIAN II —
# ◈ ETL Pipeline & Data Warehouse
### *Dari Raw CSV Berita Hoaks → Star Schema Siap Deploy*

<p>
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/pandas-ETL-150458?style=for-the-badge&logo=pandas&logoColor=white"/>
  <img src="https://img.shields.io/badge/Google_Colab-Notebook-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-SQL_Dump-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
</p>

> *Kalau Peble adalah wajahnya — notebook ini adalah otaknya.*

</div>
<br/>

---

## ▸ Tentang Notebook

Notebook ini adalah **backend ETL engine** dari Peble. Tugasnya: ambil data berita hoaks dari 5 sumber media yang formatnya berbeda-beda, bersihkan, seragamkan, integrasikan, lalu bangun data warehouse berbasis **Star Schema** yang menjadi fondasi seluruh analisis di dashboard.

**Pertanyaan yang dijawab:**

- Bagaimana mengintegrasikan data dari 5 sumber media yang berbeda struktur kolom, format tanggal, dan encoding-nya?
- Bagaimana membangun Star Schema yang konsisten untuk analisis hoaks multidimensi?
- Bagaimana menghasilkan SQL dump yang langsung bisa di-import ke MySQL production?

---

## ▸ Sumber Data

Lima dataset dari media digital Indonesia, dikumpulkan dan diproses dalam satu pipeline terpadu.

| Dataset | Format | Peran di DW |
|---------|:------:|-------------|
| **Komdigi** | CSV | Sumber klarifikasi resmi pemerintah |
| **CNN Indonesia** | XLSX | Berita digital nasional |
| **Kompas** | XLSX | Berita cetak & digital terpercaya |
| **Tempo** | XLSX | Jurnalisme investigatif |
| **TurnBackHoax** | XLSX | Database hoaks terverifikasi |

### Tantangan Nyata di Lapangan

Setiap dataset punya "kepribadian" sendiri yang bikin preprocessing jadi seru:

| Masalah | Contoh |
|---------|--------|
| Nama kolom beda-beda | `title` vs `judul` vs `Title` |
| Format tanggal kacau | ISO 8601, format Indonesia, sampai yang nggak jelas |
| Multi-value tags | Satu berita = banyak tag, dipisah `;` |
| Missing values | Kolom `tag`, `kategori`, `topik` sering bolong |

---

## ▸ Arsitektur ETL

```
┌──────────────────────────────────┐
│         5 Source Datasets         │
│  Komdigi · CNN · Kompas · Tempo   │
│         · TurnBackHoax            │
└────────────────┬─────────────────┘
                 │  Extract
                 ▼
┌──────────────────────────────────┐
│       Google Colab Notebook       │
│                                   │
│  ① Setup & Extract               │
│  ② Data Understanding            │
│  ③ Preprocessing & Transform     │
│  ④ Integrasi Dataset             │
│  ⑤ Build Dimension Tables        │
│  ⑥ Generate Fact Table          │
│  ⑦ Export ke SQL                 │
│  ⑧ Verifikasi & Validasi        │
└────────────────┬─────────────────┘
                 │  Load
                 ▼
┌──────────────────────────────────┐
│      Star Schema · MySQL/SQLite   │
│   7 Dim Tables + 1 Fact Table    │
│   → eis_mysql_final.sql          │
│   → fact_[tahun].sql per tahun   │
└────────────────┬─────────────────┘
                 │  Seed
                 ▼
┌──────────────────────────────────┐
│    Peble EIS — React Dashboard    │
│  peble-production.up.railway.app  │
└──────────────────────────────────┘
```

---

## ▸ Alur ETL Pipeline

### ① Setup & Extract

```python
import pandas as pd
import numpy as np

df_komdigi  = pd.read_csv('/content/komdigi_hoaks.csv')
df_cnn      = pd.read_excel('/content/dataset_cnn_10k_cleaned.xlsx')
df_kompas   = pd.read_excel('/content/dataset_kompas_4k_cleaned.xlsx')
df_tempo    = pd.read_excel('/content/dataset_tempo_6k_cleaned.xlsx')
df_turnback = pd.read_excel('/content/dataset_turnbackhoax_10_cleaned.xlsx')
```

---

### ② Data Understanding

Sebelum sentuh data, pahami dulu kondisi lapangan. Pemeriksaan meliputi:

- **Shape & Kolom** — berapa baris, berapa kolom, namanya apa saja
- **Missing Values** — kolom mana yang bolong, seberapa parah
- **Tipe Data** — apakah sudah sesuai untuk analisis
- **Format Tanggal** — `published_at` vs `Timestamp`, berapa variasinya
- **Variasi Tag** — adakah multi-value dengan delimiter `;`

```python
for nama, df in datasets.items():
    print(f"DATASET : {nama}")
    print(f"Shape   : {df.shape}")
    print(df.isnull().sum())
    display(df.head())
```

---

### ③ Preprocessing & Transform

**Penambahan Kolom Sumber**
```python
df_komdigi['sumber']  = 'Komdigi'
df_cnn['sumber']      = 'CNN'
df_kompas['sumber']   = 'Kompas'
df_tempo['sumber']    = 'Tempo'
df_turnback['sumber'] = 'TurnBackHoax'
```

**Harmonisasi Nama Kolom** — menyamakan 5 struktur berbeda ke satu standar:

| Sebelum | Sesudah |
|---------|---------|
| `title`, `Title` | `judul` |
| `body_text`, `fulltext` | `isi` |
| `published_at`, `Timestamp` | `tanggal` |
| `url` | `link` |
| `tags`, `Tags` | `tag` |
| `category` | `kategori_asli` |

```python
def harmonisasi_kolom(df):
    df.columns = df.columns.str.lower()
    mapping = {
        'title': 'judul', 'body_text': 'isi', 'fulltext': 'isi',
        'published_at': 'tanggal', 'timestamp': 'tanggal',
        'url': 'link', 'tags': 'tag',
        'category': 'kategori_asli', 'hoax': 'label_hoaks'
    }
    return df.rename(columns=mapping)
```

**Parsing Tanggal Fleksibel** — menangani variasi format tanggal dari semua sumber secara otomatis.

**Fungsi `clean_tags()`** — memecah multi-value tag, strip whitespace, dan standarisasi ke lowercase.

---

### ④ Integrasi Dataset

```python
df_hoaks = pd.concat(
    [df_komdigi_clean, df_cnn_clean, df_kompas_clean,
     df_tempo_clean, df_turnback_clean],
    ignore_index=True
)

df_hoaks['id_berita'] = range(1, len(df_hoaks) + 1)
```

Setelah digabung, dibuat fitur tambahan: `tahun`, `bulan`, `panjang_isi`.

---

### ⑤ Build Dimension Tables

Tujuh tabel dimensi dibangun dari master dataset:

**`dim_sumber`** — identitas media sumber berita

**`dim_berita`** — konten artikel: judul, isi, excerpt, link, author, image, view_count

**`dim_tag`** — seluruh tag unik dari semua berita (hasil explode dari multi-value)

**`dim_waktu`** — dimensi kalender lengkap

```python
dim_waktu['hari']       = dim_waktu['tanggal'].dt.day
dim_waktu['nama_hari']  = dim_waktu['tanggal'].dt.day_name()
dim_waktu['bulan']      = dim_waktu['tanggal'].dt.month
dim_waktu['nama_bulan'] = dim_waktu['tanggal'].dt.month_name()
dim_waktu['tahun']      = dim_waktu['tanggal'].dt.year
dim_waktu['quarter']    = dim_waktu['tanggal'].dt.quarter
```

**`dim_kategori`** — klasifikasi jenis konten berita

**`dim_topik`** — topik berita (Kesehatan, Politik, Bencana, dll.)

**`dim_status_hoaks`** — label: `Hoaks` / `Verifikasi` / `Unknown`

---

### ⑥ Generate Fact Table

Join semua foreign key dari tabel dimensi ke satu fact table, lalu di-explode per tag karena satu berita bisa punya banyak tag.

```python
fact_hoaks = (fact_temp
    .merge(dim_berita,   on='id_berita',  how='left')
    .merge(dim_sumber,   on='sumber',     how='left')
    .merge(dim_kategori, on='kategori',   how='left')
    .merge(dim_topik,    on='topics',     how='left')
    .merge(dim_waktu,    on='tanggal',    how='left')
)
```

Setiap kombinasi `(id_berita, id_tag)` menjadi satu baris unik di fact table.

**Measures:**

| Measure | Tipe | Keterangan |
|---------|:----:|------------|
| `jumlah` | INT | Hitungan berita (selalu 1) |
| `panjang_isi` | INT | Panjang karakter isi berita |

---

### ⑦ Export ke SQL

```python
def sql_safe(value):
    # escape karakter khusus SQL
    ...

def mysql_dtype(col, dtype):
    # mapping dtype pandas → MySQL
    if col.startswith('id_'):   return 'INT'
    if 'tanggal' in col:        return 'DATETIME'
    if 'jumlah' in col:         return 'INT'
    return 'LONGTEXT'

def export_mysql_sql(df, table_name, file_name, create_table=True):
    # generate CREATE TABLE + INSERT INTO
    ...
```

Fact table juga dieksport terpisah per tahun untuk manajemen data skala besar:

```python
for tahun in years:
    temp = fact_export[fact_export['tahun'] == tahun]
    export_mysql_sql(temp, 'fact_hoaks', f'fact_{int(tahun)}.sql')
```

---

## ▸ Struktur Data Warehouse

Model **Star Schema** — satu fact table di tengah, dikelilingi tujuh tabel dimensi.

```
                         ┌──────────────┐
                         │  dim_sumber  │
                         └──────┬───────┘
                                │ id_sumber
              ┌─────────────────▼──────────────────┐
              │             fact_hoaks              │
              │                                     │
              │  id_fact_hoaks (PK)                 │
              │  id_berita · id_tag · id_waktu      │
              │  id_sumber · id_topik               │
              │  id_kategori · id_status_hoaks      │
              │  jumlah · panjang_isi               │
              └───┬──────┬───────┬────────┬─────────┘
                  │      │       │        │
    ┌─────────────▼─┐ ┌──▼───┐ ┌▼──────┐ ┌▼──────────────┐
    │   dim_berita  │ │dim_  │ │dim_   │ │   dim_waktu   │
    │               │ │tag   │ │topik  │ │               │
    └───────────────┘ └──────┘ └───────┘ └───────────────┘
              ┌──────────────┐  ┌─────────────────────┐
              │ dim_kategori │  │  dim_status_hoaks   │
              └──────────────┘  └─────────────────────┘
```

| Tabel | Jenis | Keterangan |
|-------|:-----:|------------|
| `fact_hoaks` | Fakta | Satu baris per kombinasi berita × tag |
| `dim_berita` | Dimensi | Konten artikel lengkap |
| `dim_sumber` | Dimensi | Identitas media (Komdigi, CNN, Kompas, Tempo, TurnBackHoax) |
| `dim_tag` | Dimensi | Semua tag unik dari seluruh berita |
| `dim_waktu` | Dimensi | Kalender: hari, bulan, tahun, quarter |
| `dim_kategori` | Dimensi | Klasifikasi kategori berita |
| `dim_topik` | Dimensi | Topik konten (Kesehatan, Politik, dll.) |
| `dim_status_hoaks` | Dimensi | Label: Hoaks / Verifikasi / Unknown |

---

## ▸ Verifikasi & Validasi

```python
# 1. Missing Value
print(fact_hoaks.isnull().sum())

# 2. Jumlah Record
print(len(fact_hoaks))

# 3. Nol Duplikasi
duplicate_fact = fact_hoaks.duplicated(subset=['id_berita', 'id_tag']).sum()
print(f"Duplicate: {duplicate_fact}")  # target: 0

# 4. Konsistensi Unique Key
assert len(fact_hoaks) == fact_hoaks[['id_berita','id_tag']].drop_duplicates().shape[0]

# 5. Distribusi Sumber
df_hoaks['sumber'].value_counts()
```

---

## ▸ Output File

| File | Isi |
|------|-----|
| `eis_mysql_final.sql` | Seluruh tabel dalam satu SQL dump |
| `dim_berita.sql` · `dim_sumber.sql` · `dim_waktu.sql` · ... | Satu file per tabel dimensi |
| `fact_hoaks.sql` | Full fact table |
| `fact_[tahun].sql` | Fact table dipartisi per tahun |

---

> **Mata Kuliah** — Business Intelligence  
> **Program Studi** — Sistem Informasi · Fakultas Teknik · Universitas Mulawarman · 2025/2026

---

<div align="center">

*© 2026 · Peble*

**✦ pebble · research · data · insight ✦**

</div>

import Database from 'better-sqlite3';

const db = new Database('bem_hoaks.sqlite');

// Initialize database schema
db.exec(`
  -- Dimension: Berita
  CREATE TABLE IF NOT EXISTS dim_berita (
    id_berita INTEGER PRIMARY KEY AUTOINCREMENT,
    judul TEXT NOT NULL,
    isi TEXT NOT NULL,
    excerpt TEXT,
    author TEXT,
    link TEXT,
    slug TEXT UNIQUE,
    main_image_url TEXT,
    view_count TEXT DEFAULT '0'
  );

  -- Dimension: Kategori
  CREATE TABLE IF NOT EXISTS dim_kategori (
    id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
    kategori TEXT NOT NULL
  );

  -- Dimension: Status Hoaks
  CREATE TABLE IF NOT EXISTS dim_status_hoaks (
    id_status_hoaks INTEGER PRIMARY KEY AUTOINCREMENT,
    status_hoaks TEXT NOT NULL
  );

  -- Dimension: Sumber
  CREATE TABLE IF NOT EXISTS dim_sumber (
    id_sumber INTEGER PRIMARY KEY AUTOINCREMENT,
    sumber TEXT NOT NULL
  );

  -- Dimension: Tag
  CREATE TABLE IF NOT EXISTS dim_tag (
    id_tag INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_tag TEXT NOT NULL
  );

  -- Dimension: Topik
  CREATE TABLE IF NOT EXISTS dim_topik (
    id_topik INTEGER PRIMARY KEY AUTOINCREMENT,
    topics TEXT NOT NULL
  );

  -- Dimension: Waktu
  CREATE TABLE IF NOT EXISTS dim_waktu (
    id_waktu INTEGER PRIMARY KEY AUTOINCREMENT,
    tanggal DATETIME NOT NULL,
    hari INTEGER,
    nama_hari INTEGER,
    bulan INTEGER,
    nama_bulan INTEGER,
    tahun INTEGER,
    quarter INTEGER
  );

  -- Fact: Hoaks
  CREATE TABLE IF NOT EXISTS fact_hoaks (
    id_fact_hoaks INTEGER PRIMARY KEY AUTOINCREMENT,
    id_berita INTEGER,
    id_tag INTEGER,
    id_waktu INTEGER,
    id_sumber INTEGER,
    id_topik INTEGER,
    id_kategori INTEGER,
    id_status_hoaks INTEGER,
    tahun INTEGER,
    FOREIGN KEY (id_berita) REFERENCES dim_berita(id_berita),
    FOREIGN KEY (id_tag) REFERENCES dim_tag(id_tag),
    FOREIGN KEY (id_waktu) REFERENCES dim_waktu(id_waktu),
    FOREIGN KEY (id_sumber) REFERENCES dim_sumber(id_sumber),
    FOREIGN KEY (id_topik) REFERENCES dim_topik(id_topik),
    FOREIGN KEY (id_kategori) REFERENCES dim_kategori(id_kategori),
    FOREIGN KEY (id_status_hoaks) REFERENCES dim_status_hoaks(id_status_hoaks)
  );

  -- Admin & Staff Table
  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_lengkap VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    kementerian VARCHAR(255),
    jabatan VARCHAR(100),
    role TEXT CHECK(role IN ('admin', 'user')) NOT NULL
  );
`);

// Seed initial staff if empty
const adminExists = db.prepare('SELECT * FROM staff WHERE username = ?').get('admin');

if (!adminExists) {
  const insertStaff = db.prepare('INSERT INTO staff (nama_lengkap, username, password, kementerian, jabatan, role) VALUES (?, ?, ?, ?, ?, ?)');
  insertStaff.run('HITHTHAN', 'hiththan', '670487', 'BEM KM', 'Presiden', 'user');
  insertStaff.run('Admin PRK', 'admin', 'admin123', 'Penelitian, Riset dan Kajian', 'Kepala Biro', 'admin');
  console.log('Admin user created/restored.');
}

const staffCount = db.prepare('SELECT count(*) as count FROM staff').get() as { count: number };
if (staffCount.count > 0 && !db.prepare('SELECT * FROM dim_kategori LIMIT 1').get()) {
  // Dimension Seeding (only if dimensions are empty but staff exists)
  db.prepare('INSERT INTO dim_kategori (kategori) VALUES (?)').run('Klarifikasi Hoaks');
  db.prepare('INSERT INTO dim_status_hoaks (status_hoaks) VALUES (?)').run('Verifikasi');
  db.prepare('INSERT INTO dim_status_hoaks (status_hoaks) VALUES (?)').run('Unknown');
  db.prepare('INSERT INTO dim_status_hoaks (status_hoaks) VALUES (?)').run('Hoaks');
  db.prepare('INSERT INTO dim_sumber (sumber) VALUES (?)').run('Komdigi');
  db.prepare('INSERT INTO dim_tag (nama_tag) VALUES (?)').run('#VaksinAman');
  db.prepare('INSERT INTO dim_topik (topics) VALUES (?)').run('Kesehatan');

  const now = new Date();
  db.prepare(`INSERT INTO dim_waktu (tanggal, hari, nama_hari, bulan, nama_bulan, tahun, quarter) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    now.toISOString(),
    now.getDate(),
    now.getDay(),
    now.getMonth() + 1,
    now.getMonth() + 1,
    now.getFullYear(),
    Math.floor((now.getMonth() + 3) / 3)
  );

  db.prepare(`INSERT INTO dim_berita (judul, isi, excerpt, author, link, slug, main_image_url, view_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    '[HOAKS] Vaksin TBC Mengandung Nanobots',
    'Penjelasan: Beredar sebuah unggahan di media sosial mengenai vaksin TBC mengandung nanobots.',
    'Penjelasan singkat tentang klaim nanobots pada vaksin TBC.',
    'Tim Komdigi',
    'https://www.komdigi.go.id/berita/berita-hoaks/detail/',
    'hoaks-vaksin-tbc-mengandung-nanobots',
    'https://web.komdigi.go.id/resource/thumb.jpg',
    '13'
  );

  // Fact Seeding
  db.prepare(`INSERT INTO fact_hoaks (id_berita, id_tag, id_waktu, id_sumber, id_topik, id_kategori, id_status_hoaks, tahun) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    1, 1, 1, 1, 1, 1, 1, 2026
  );

  console.log('Database seeded with initial data.');
}

export default db;


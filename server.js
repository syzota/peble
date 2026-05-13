import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());

// ─── MySQL Connection Pool ───────────────────────────────────────────────────
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bem_hoaks',
  waitForConnections: true,
  connectionLimit: 10,
});

pool.getConnection()
  .then(conn => { console.log('✅ Berhasil terhubung ke MySQL bem_hoaks.'); conn.release(); })
  .catch(err => console.error('❌ Gagal konek ke database:', err));

// ─── Helper ──────────────────────────────────────────────────────────────────
const query = (sql, params = []) => pool.query(sql, params).then(([rows]) => rows);

// ════════════════════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const rows = await query(
      'SELECT * FROM staff WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }
    const u = rows[0];
    res.json({
      success: true,
      user: {
        id: u.id,
        username: u.username,
        name: u.nama_lengkap,
        kementerian: u.kementerian,
        jabatan: u.jabatan,
        role: u.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [[{ totalHoaks }]] = await pool.query('SELECT COUNT(*) AS totalHoaks FROM fact_hoaks');
    const [[{ verified }]] = await pool.query(
      `SELECT COUNT(*) AS verified FROM fact_hoaks fh
       JOIN dim_status_hoaks sh ON fh.id_status_hoaks = sh.id_status_hoaks
       WHERE sh.status_hoaks = 'Verifikasi'`
    );
    const [[{ waiting }]] = await pool.query(
      `SELECT COUNT(*) AS waiting FROM fact_hoaks fh
       JOIN dim_status_hoaks sh ON fh.id_status_hoaks = sh.id_status_hoaks
       WHERE sh.status_hoaks = 'Unknown'`
    );
    const [[{ hoaks }]] = await pool.query(
      `SELECT COUNT(*) AS hoaks FROM fact_hoaks fh
       JOIN dim_status_hoaks sh ON fh.id_status_hoaks = sh.id_status_hoaks
       WHERE sh.status_hoaks = 'Hoaks'`
    );
    const [[{ sources }]] = await pool.query('SELECT COUNT(*) AS sources FROM dim_sumber');

    res.json({ totalHoaks, verified, waiting, hoaks, sources });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil statistik dashboard.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD — Tren per bulan (12 bulan terakhir)
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/dashboard/tren', async (req, res) => {
  try {
    const rows = await query(`
      SELECT w.bulan, w.tahun, COUNT(*) AS total
      FROM fact_hoaks fh
      JOIN dim_waktu w ON fh.id_waktu = w.id_waktu
      WHERE w.tanggal >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY w.tahun, w.bulan
      ORDER BY w.tahun, w.bulan
    `);
    const bulanNama = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    const result = rows.map(r => ({
      name: bulanNama[(r.bulan - 1)] || `Bln ${r.bulan}`,
      val: r.total,
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil tren.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD — Topik terbanyak
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/dashboard/topik', async (req, res) => {
  try {
    const rows = await query(`
      SELECT t.topics AS name, COUNT(*) AS value
      FROM fact_hoaks fh
      JOIN dim_topik t ON fh.id_topik = t.id_topik
      GROUP BY fh.id_topik, t.topics
      ORDER BY value DESC
      LIMIT 6
    `);
    const colors = ['#FFFFFF','#C0C0C0','#A0A0A0','#808080','#606060','#404040'];
    res.json(rows.map((r, i) => ({ ...r, color: colors[i] || '#404040' })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil topik.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD — Berita terbaru (timely insights)
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/dashboard/berita-terbaru', async (req, res) => {
  try {
    const rows = await query(`
      SELECT b.id_berita, b.judul, b.excerpt, b.author,
             sh.status_hoaks, w.tanggal
      FROM fact_hoaks fh
      JOIN dim_berita b ON fh.id_berita = b.id_berita
      JOIN dim_status_hoaks sh ON fh.id_status_hoaks = sh.id_status_hoaks
      JOIN dim_waktu w ON fh.id_waktu = w.id_waktu
      ORDER BY w.tanggal DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil berita terbaru.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// INSIGHT — Fact Hoaks (join semua dimensi, dengan filter)
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/insight', async (req, res) => {
  try {
    const { kategori, topik, status, tahun, q } = req.query;
    let sql = `
      SELECT fh.id_fact_hoaks, fh.tahun,
             b.id_berita, b.judul, b.excerpt, b.isi, b.author, b.link, b.main_image_url, b.view_count,
             k.kategori, s.sumber, t.topics,
             sh.status_hoaks, w.tanggal,
             tg.nama_tag
      FROM fact_hoaks fh
      LEFT JOIN dim_berita b ON fh.id_berita = b.id_berita
      LEFT JOIN dim_kategori k ON fh.id_kategori = k.id_kategori
      LEFT JOIN dim_sumber s ON fh.id_sumber = s.id_sumber
      LEFT JOIN dim_topik t ON fh.id_topik = t.id_topik
      LEFT JOIN dim_status_hoaks sh ON fh.id_status_hoaks = sh.id_status_hoaks
      LEFT JOIN dim_waktu w ON fh.id_waktu = w.id_waktu
      LEFT JOIN dim_tag tg ON fh.id_tag = tg.id_tag
      WHERE 1=1
    `;
    const params = [];
    if (kategori) { sql += ' AND k.id_kategori = ?'; params.push(kategori); }
    if (topik)    { sql += ' AND t.id_topik = ?';    params.push(topik); }
    if (status)   { sql += ' AND sh.id_status_hoaks = ?'; params.push(status); }
    if (tahun)    { sql += ' AND fh.tahun = ?';       params.push(tahun); }
    if (q)        { sql += ' AND (b.judul LIKE ? OR b.excerpt LIKE ? OR b.isi LIKE ?)';
                    const like = `%${q}%`;
                    params.push(like, like, like); }
    sql += ' ORDER BY w.tanggal DESC LIMIT 100';
    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data insight.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// REPORT — Agregasi untuk laporan eksekutif
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/report/summary', async (req, res) => {
  try {
    const [[{ totalHoaks }]] = await pool.query('SELECT COUNT(*) AS totalHoaks FROM fact_hoaks');
    const [[{ verified }]]   = await pool.query(
      `SELECT COUNT(*) AS verified FROM fact_hoaks fh
       JOIN dim_status_hoaks sh ON fh.id_status_hoaks = sh.id_status_hoaks
       WHERE sh.status_hoaks = 'Verifikasi'`);
    const [[{ hoaks }]]      = await pool.query(
      `SELECT COUNT(*) AS hoaks FROM fact_hoaks fh
       JOIN dim_status_hoaks sh ON fh.id_status_hoaks = sh.id_status_hoaks
       WHERE sh.status_hoaks = 'Hoaks'`);

    const topSumber = await query(`
      SELECT s.sumber, COUNT(*) AS jumlah
      FROM fact_hoaks fh JOIN dim_sumber s ON fh.id_sumber = s.id_sumber
      GROUP BY fh.id_sumber ORDER BY jumlah DESC LIMIT 5
    `);

    const topTopik = await query(`
      SELECT t.topics, COUNT(*) AS jumlah
      FROM fact_hoaks fh JOIN dim_topik t ON fh.id_topik = t.id_topik
      GROUP BY fh.id_topik ORDER BY jumlah DESC LIMIT 5
    `);

    const topKategori = await query(`
      SELECT k.kategori, COUNT(*) AS jumlah
      FROM fact_hoaks fh JOIN dim_kategori k ON fh.id_kategori = k.id_kategori
      GROUP BY fh.id_kategori ORDER BY jumlah DESC LIMIT 5
    `);

    const trenTahun = await query(`
      SELECT tahun, COUNT(*) AS total
      FROM fact_hoaks
      GROUP BY tahun
      ORDER BY tahun DESC
      LIMIT 5
    `);

    const [[{ lastUpdate }]] = await pool.query(
      'SELECT MAX(tanggal) AS lastUpdate FROM dim_waktu'
    );

    res.json({ totalHoaks, verified, hoaks, topSumber, topTopik, topKategori, trenTahun, lastUpdate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil laporan.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// FACT_HOAKS — Baca semua dengan JOIN
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/fact_hoaks', async (req, res) => {
  try {
    const rows = await query(`
      SELECT fh.*,
             b.judul, b.slug, k.kategori, s.sumber,
             t.topics, sh.status_hoaks, w.tanggal, tg.nama_tag
      FROM fact_hoaks fh
      LEFT JOIN dim_berita b ON fh.id_berita = b.id_berita
      LEFT JOIN dim_kategori k ON fh.id_kategori = k.id_kategori
      LEFT JOIN dim_sumber s ON fh.id_sumber = s.id_sumber
      LEFT JOIN dim_topik t ON fh.id_topik = t.id_topik
      LEFT JOIN dim_status_hoaks sh ON fh.id_status_hoaks = sh.id_status_hoaks
      LEFT JOIN dim_waktu w ON fh.id_waktu = w.id_waktu
      LEFT JOIN dim_tag tg ON fh.id_tag = tg.id_tag
      ORDER BY w.tanggal DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil fact_hoaks.' });
  }
});

// FACT_HOAKS — Buat + otomatis insert dim_waktu
app.post('/api/fact_hoaks', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const now = new Date();
    const [wRes] = await conn.query(
      `INSERT INTO dim_waktu (tanggal, hari, nama_hari, bulan, nama_bulan, tahun, quarter)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        now.toISOString().slice(0, 19).replace('T', ' '),
        now.getDate(), now.getDay(),
        now.getMonth() + 1, now.getMonth() + 1,
        now.getFullYear(),
        Math.floor((now.getMonth() + 3) / 3),
      ]
    );
    const id_waktu = wRes.insertId;
    const { id_berita, id_tag, id_sumber, id_topik, id_kategori, id_status_hoaks } = req.body;
    const [fRes] = await conn.query(
      `INSERT INTO fact_hoaks (id_berita, id_tag, id_waktu, id_sumber, id_topik, id_kategori, id_status_hoaks, tahun)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_berita, id_tag, id_waktu, id_sumber, id_topik, id_kategori, id_status_hoaks, now.getFullYear()]
    );
    await conn.commit();
    res.json({ success: true, id: fRes.insertId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat fact_hoaks.' });
  } finally {
    conn.release();
  }
});

app.put('/api/fact_hoaks/:id', async (req, res) => {
  try {
    const { id_berita, id_tag, id_sumber, id_topik, id_kategori, id_status_hoaks } = req.body;
    await query(
      `UPDATE fact_hoaks SET id_berita=?, id_tag=?, id_sumber=?, id_topik=?, id_kategori=?, id_status_hoaks=?
       WHERE id_fact_hoaks=?`,
      [id_berita, id_tag, id_sumber, id_topik, id_kategori, id_status_hoaks, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal update fact_hoaks.' });
  }
});

app.delete('/api/fact_hoaks/:id', async (req, res) => {
  try {
    await query('DELETE FROM fact_hoaks WHERE id_fact_hoaks = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal hapus fact_hoaks.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// GENERIC CRUD untuk semua tabel dimensi + staff
// ════════════════════════════════════════════════════════════════════════════
const TABLES = [
  { name: 'dim_berita',       pk: 'id_berita' },
  { name: 'dim_kategori',     pk: 'id_kategori' },
  { name: 'dim_status_hoaks', pk: 'id_status_hoaks' },
  { name: 'dim_sumber',       pk: 'id_sumber' },
  { name: 'dim_tag',          pk: 'id_tag' },
  { name: 'dim_topik',        pk: 'id_topik' },
  { name: 'dim_waktu',        pk: 'id_waktu' },
  { name: 'staff',            pk: 'id' },
];

TABLES.forEach(({ name, pk }) => {
  // LIST
  app.get(`/api/${name}`, async (req, res) => {
    try {
      const rows = await query(`SELECT * FROM \`${name}\``);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // CREATE
  app.post(`/api/${name}`, async (req, res) => {
    try {
      const keys = Object.keys(req.body);
      const vals = Object.values(req.body);
      const sql = `INSERT INTO \`${name}\` (${keys.map(k => `\`${k}\``).join(',')}) VALUES (${keys.map(() => '?').join(',')})`;
      const [result] = await pool.query(sql, vals);
      res.json({ success: true, id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE
  app.put(`/api/${name}/:id`, async (req, res) => {
    try {
      const keys = Object.keys(req.body);
      const vals = Object.values(req.body);
      const set = keys.map(k => `\`${k}\` = ?`).join(',');
      await pool.query(`UPDATE \`${name}\` SET ${set} WHERE \`${pk}\` = ?`, [...vals, req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE
  app.delete(`/api/${name}/:id`, async (req, res) => {
    try {
      await pool.query(`DELETE FROM \`${name}\` WHERE \`${pk}\` = ?`, [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// START
// ════════════════════════════════════════════════════════════════════════════
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend berjalan di http://localhost:${PORT}`));
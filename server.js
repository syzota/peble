import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 3000;

// ─── MIDDLEWARES ───
app.use(cors());
app.use(express.json());

// ─── DATABASE POOL CONNECTION ───
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bimbim',
  waitForConnections: true,
  connectionLimit: 10,
});

// Helper universal untuk query ringkas
const query = (sql, params = []) => pool.query(sql, params).then(([rows]) => rows);


// ─── CUSTOM ROUTE: FACT HOAKS (WITH FIXED PAGINATION) ───
app.get('/api/fact_hoaks', async (req, res) => {
  try {
    const { tahun, search, page = 1, limit = 10 } = req.query;
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const offset = (p - 1) * l;

    let whereSql = "WHERE 1=1";
    const params = [];

    if (search) {
      whereSql += " AND (b.judul LIKE ? OR fh.tahun LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    } else if (tahun) {
      whereSql += " AND fh.tahun = ?";
      params.push(tahun);
    }

    // 1. HITUNG TOTAL DATA SEBENARNYA (PENTING UNTUK PAGINATION ANGKA)
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM fact_hoaks fh LEFT JOIN dim_berita b ON fh.id_berita = b.id_berita ${whereSql}`,
      params
    );
    const total = countResult[0].total;

    // 2. AMBIL DATA DENGAN LIMIT
    const sql = `
      SELECT fh.*, b.judul, k.kategori, s.sumber, t.topics, sh.status_hoaks, w.tanggal, tg.nama_tag
      FROM fact_hoaks fh
      LEFT JOIN dim_berita b ON fh.id_berita = b.id_berita
      LEFT JOIN dim_kategori k ON fh.id_kategori = k.id_kategori
      LEFT JOIN dim_sumber s ON fh.id_sumber = s.id_sumber
      LEFT JOIN dim_topik t ON fh.id_topik = t.id_topik
      LEFT JOIN dim_status_hoaks sh ON fh.id_status_hoaks = sh.id_status_hoaks
      LEFT JOIN dim_waktu w ON fh.id_waktu = w.id_waktu
      LEFT JOIN dim_tag tg ON fh.id_tag = tg.id_tag
      ${whereSql}
      ORDER BY fh.id_fact_hoaks DESC LIMIT ? OFFSET ?`;

    const rows = await query(sql, [...params, l, offset]);
    res.json({ data: rows, total }); // Kirim data dan total ke frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ─── GENERIC CRUD FOR DIMENSION TABLES ───
const TABLES = [
  { name: 'dim_berita', pk: 'id_berita' },
  { name: 'dim_kategori', pk: 'id_kategori' },
  { name: 'dim_sumber', pk: 'id_sumber' },
  { name: 'dim_topik', pk: 'id_topik' },
  { name: 'dim_tag', pk: 'id_tag' },
  { name: 'dim_status_hoaks', pk: 'id_status_hoaks' },
  { name: 'dim_waktu', pk: 'id_waktu' },
  { name: 'staff', pk: 'id' }
];

TABLES.forEach(({ name, pk }) => {
  // GET ALL WITH PAGINATION
  app.get(`/api/${name}`, async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const p = parseInt(page) || 1;
      const l = parseInt(limit) || 10;
      const offset = (p - 1) * l;

      // Hitung TOTAL data untuk tahu jumlah halaman
      const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM \`${name}\``);

      // Ambil data sesuai halaman
      const rows = await query(
        `SELECT * FROM \`${name}\` ORDER BY \`${pk}\` DESC LIMIT ? OFFSET ?`,
        [l, offset]
      );

      res.json({ data: rows, total: total });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST (CREATE)
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

  // PUT (UPDATE)
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


// ─── DASHBOARD, ANOMALIES, REPORT & INSIGHT ROUTES ───

// 1. GET /api/dashboard/summary
app.get('/api/dashboard/summary', async (req, res) => {
  try {
    // Total kasus
    const [[{ totalHoaks }]] = await pool.query('SELECT COUNT(*) AS totalHoaks FROM fact_hoaks');

    // Aktif bulan ini
    const [[{ aktivBulanIni }]] = await pool.query(
      `SELECT COUNT(*) AS aktivBulanIni
       FROM fact_hoaks fh
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.bulan = MONTH(NOW()) AND dw.tahun = YEAR(NOW())`
    );

    // Aktif bulan lalu
    const [[{ aktivBulanLalu }]] = await pool.query(
      `SELECT COUNT(*) AS aktivBulanLalu
       FROM fact_hoaks fh
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.bulan = MONTH(NOW() - INTERVAL 1 MONTH)
         AND dw.tahun = YEAR(NOW() - INTERVAL 1 MONTH)`
    );

    // Hoaks terverifikasi
    const [[{ hoaksTerverif }]] = await pool.query(
      `SELECT COUNT(*) AS hoaksTerverif
       FROM fact_hoaks fh
       JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
       WHERE ds.status_hoaks = 'Hoaks'`
    );

    // Jumlah sumber unik
    const [[{ jumlahSumber }]] = await pool.query(
      'SELECT COUNT(DISTINCT id_sumber) AS jumlahSumber FROM fact_hoaks'
    );

    // Tahun pertama
    const [[{ firstYear }]] = await pool.query('SELECT MIN(tahun) AS firstYear FROM fact_hoaks');

    // Tren per tahun (bahan bar chart)
    const trenRaw = await query(
      `SELECT fh.tahun, COUNT(*) AS total
       FROM fact_hoaks fh
       GROUP BY fh.tahun
       ORDER BY fh.tahun ASC`
    );
    const trenTahun = trenRaw.map(t => ({ tahun: t.tahun, total: Number(t.total) }));

    // Distribusi status (bahan pie chart)
    const statusDistribusi = await query(
      `SELECT ds.status_hoaks, COUNT(*) AS jumlah
       FROM fact_hoaks fh
       JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
       GROUP BY ds.status_hoaks
       ORDER BY jumlah DESC`
    );

    // Top 5 topik
    const topTopikRaw = await query(
      `SELECT dt.topics, COUNT(*) AS jumlah
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       GROUP BY dt.topics
       ORDER BY jumlah DESC
       LIMIT 5`
    );

    // Count 7 hari terakhir per topik (flag anomali)
    const recent7d = await query(
      `SELECT dt.topics, COUNT(*) AS count7d
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.tanggal >= NOW() - INTERVAL 7 DAY
       GROUP BY dt.topics`
    );

    // Rata-rata bulanan per topik (12 bln / 12)
    const monthly = await query(
      `SELECT dt.topics, COUNT(*) / 12 AS monthlyAvg
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.tanggal >= NOW() - INTERVAL 12 MONTH
       GROUP BY dt.topics`
    );

    const avgMap    = Object.fromEntries(monthly.map(r => [r.topics, parseFloat(r.monthlyAvg) || 0]));
    const recentMap = Object.fromEntries(recent7d.map(r => [r.topics, r.count7d]));

    const topTopik = topTopikRaw.map(t => ({
      topics:    t.topics,
      jumlah:    Number(t.jumlah),
      isAnomaly: (recentMap[t.topics] ?? 0) > (avgMap[t.topics] ?? 0) * 1.5,
    }));

    res.json({
      totalHoaks:      Number(totalHoaks),
      aktivBulanIni:   Number(aktivBulanIni),
      deltaBulan:      Number(aktivBulanIni) - Number(aktivBulanLalu),
      hoaksTerverif:   Number(hoaksTerverif),
      jumlahSumber:    Number(jumlahSumber),
      firstYear:       Number(firstYear),
      trenTahun,
      statusDistribusi,
      topTopik,
    });
  } catch (err) {
    console.error('[/api/dashboard/summary]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /api/dashboard/anomalies
app.get('/api/dashboard/anomalies', async (req, res) => {
  try {
    const recent7d = await query(
      `SELECT dt.topics AS topik, COUNT(*) AS count7d
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.tanggal >= NOW() - INTERVAL 7 DAY
       GROUP BY dt.topics`
    );

    const monthly = await query(
      `SELECT dt.topics AS topik, COUNT(*) / 12 AS monthlyAvg
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.tanggal >= NOW() - INTERVAL 12 MONTH
       GROUP BY dt.topics`
    );

    const avgMap = Object.fromEntries(monthly.map(r => [r.topik, parseFloat(r.monthlyAvg) || 1]));

    const anomalies = recent7d
      .map(r => {
        const avg   = avgMap[r.topik] || 1;
        const ratio = r.count7d / avg;
        const level = ratio > 2 ? 'danger' : ratio > 1.5 ? 'warning' : null;
        return { topik: r.topik, count7d: Number(r.count7d), monthlyAvg: avg, ratio, level };
      })
      .filter(r => r.level !== null)
      .sort((a, b) => b.ratio - a.ratio);

    res.json(anomalies);
  } catch (err) {
    console.error('[/api/dashboard/anomalies]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. GET /api/dashboard/recent
app.get('/api/dashboard/recent', async (req, res) => {
  try {
    const reqLimit = Math.min(parseInt(req.query.limit) || 5, 20);
    const rows = await query(
      `SELECT
         fh.id_fact_hoaks, b.judul, b.author, b.link, b.main_image_url, b.excerpt,
         dw.tanggal, ds.status_hoaks, dk.kategori, dt.topics, ds2.sumber
       FROM fact_hoaks fh
       JOIN dim_berita       b   ON fh.id_berita       = b.id_berita
       JOIN dim_waktu        dw  ON fh.id_waktu        = dw.id_waktu
       JOIN dim_status_hoaks ds  ON fh.id_status_hoaks = ds.id_status_hoaks
       JOIN dim_kategori     dk  ON fh.id_kategori     = dk.id_kategori
       JOIN dim_topik        dt  ON fh.id_topik        = dt.id_topik
       JOIN dim_sumber       ds2 ON fh.id_sumber       = ds2.id_sumber
       ORDER BY dw.tanggal DESC
       LIMIT ?`,
      [reqLimit]
    );
    res.json(rows);
  } catch (err) {
    console.error('[/api/dashboard/recent]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 4. GET /api/report/summary
app.get('/api/report/summary', async (req, res) => {
  try {
    const [[{ totalHoaks }]] = await pool.query('SELECT COUNT(*) AS totalHoaks FROM fact_hoaks');

    const [[{ verified }]] = await pool.query(
      `SELECT COUNT(*) AS verified
       FROM fact_hoaks fh
       JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
       WHERE ds.status_hoaks = 'Fakta'`
    );

    const [[{ lastUpdate }]] = await pool.query(
      `SELECT MAX(dw.tanggal) AS lastUpdate
       FROM fact_hoaks fh
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu`
    );

    const trenRaw = await query(
      `SELECT fh.tahun, COUNT(*) AS total
       FROM fact_hoaks fh
       GROUP BY fh.tahun
       ORDER BY fh.tahun ASC`
    );
    const trenTahun = trenRaw.map(t => ({ tahun: t.tahun, total: Number(t.total) }));

    const topTopikRaw = await query(
      `SELECT dt.topics, COUNT(*) AS jumlah
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       GROUP BY dt.topics
       ORDER BY jumlah DESC
       LIMIT 10`
    );
    const topTopik = topTopikRaw.map(t => ({ topics: t.topics, jumlah: Number(t.jumlah) }));

    const topSumberRaw = await query(
      `SELECT ds.sumber, COUNT(*) AS jumlah
       FROM fact_hoaks fh
       JOIN dim_sumber ds ON fh.id_sumber = ds.id_sumber
       GROUP BY ds.sumber
       ORDER BY jumlah DESC
       LIMIT 5`
    );
    const topSumber = topSumberRaw.map(s => ({ sumber: s.sumber, jumlah: Number(s.jumlah) }));

    const statusDistribusi = await query(
      `SELECT ds.status_hoaks, COUNT(*) AS jumlah
       FROM fact_hoaks fh
       JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
       GROUP BY ds.status_hoaks
       ORDER BY jumlah DESC`
    );

    res.json({
      totalHoaks: Number(totalHoaks),
      verified:   Number(verified),
      lastUpdate,
      trenTahun,
      topTopik,
      topSumber,
      statusDistribusi,
    });
  } catch (err) {
    console.error('[/api/report/summary]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 5. GET /api/insight (Dengan Paginasi Data + Total Count)
app.get('/api/insight', async (req, res) => {
  try {
    const { q: search, kategori, topik, status, page = 1, limit = 30 } = req.query;
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 30;
    const offset = (p - 1) * l;

    const conditions = [];
    const params     = [];

    if (search) {
      conditions.push('(b.judul LIKE ? OR b.excerpt LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (kategori) { conditions.push('fh.id_kategori = ?'); params.push(kategori); }
    if (topik)    { conditions.push('fh.id_topik = ?');    params.push(topik);    }
    if (status)   { conditions.push('fh.id_status_hoaks = ?'); params.push(status); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Hitung total data berdasarkan filter (Bagus untuk counter halaman di frontend)
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total
       FROM fact_hoaks fh
       JOIN dim_berita b ON fh.id_berita = b.id_berita
       ${where}`,
      params
    );

    const rows = await query(
      `SELECT
         fh.id_fact_hoaks, b.judul, b.author, b.link, b.main_image_url, b.excerpt, b.view_count,
         dw.tanggal, ds.status_hoaks, dk.kategori, dt.topics, ds2.sumber
       FROM fact_hoaks fh
       JOIN dim_berita       b   ON fh.id_berita       = b.id_berita
       JOIN dim_waktu        dw  ON fh.id_waktu        = dw.id_waktu
       JOIN dim_status_hoaks ds  ON fh.id_status_hoaks = ds.id_status_hoaks
       JOIN dim_kategori     dk  ON fh.id_kategori     = dk.id_kategori
       JOIN dim_topik        dt  ON fh.id_topik        = dt.id_topik
       JOIN dim_sumber       ds2 ON fh.id_sumber       = ds2.id_sumber
       ${where}
       ORDER BY dw.tanggal DESC
       LIMIT ? OFFSET ?`,
      [...params, l, offset]
    );

    // Dikembalikan dalam format objek konsisten agar frontend mudah mapping
    res.json({ data: rows, total });
  } catch (err) {
    console.error('[/api/insight]', err.message);
    res.status(500).json({ error: err.message });
  }
});


// ─── START SERVER ───
app.listen(PORT, () => console.log(`🚀 Server ON dan berjalan mulus di port ${PORT}`));
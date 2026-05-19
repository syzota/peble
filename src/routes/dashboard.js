/**
 * routes/dashboard.js
 * ─────────────────────────────────────────────────────────────
 * Semua endpoint yang dibutuhkan oleh Dashboard.jsx
 *
 * GET /api/dashboard/summary   → KPI cards + trend + status distribusi + top topik
 * GET /api/dashboard/anomalies → Rule-based anomaly detection per topik
 * GET /api/dashboard/recent    → Activity feed (berita terbaru)
 *
 * Mount di server.js:
 *   const dashboardRoutes = require('./routes/dashboard');
 *   app.use('/api/dashboard', dashboardRoutes);
 * ─────────────────────────────────────────────────────────────
 */

const express = require('express');
const router  = express.Router();
const db      = require('../db'); // pool MySQL2 yang sudah kamu punya

// ── helper: promise wrapper ───────────────────────────────────
const query = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, results) =>
      err ? reject(err) : resolve(results)
    )
  );

// ─────────────────────────────────────────────────────────────
// GET /api/dashboard/summary
// ─────────────────────────────────────────────────────────────
router.get('/summary', async (req, res) => {
  try {
    // 1. Total kasus
    const [[{ totalHoaks }]] = await query(
      `SELECT COUNT(*) AS totalHoaks FROM fact_hoaks`
    );

    // 2. Aktif bulan ini
    const [[{ aktivBulanIni }]] = await query(
      `SELECT COUNT(*) AS aktivBulanIni
       FROM fact_hoaks fh
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.bulan = MONTH(NOW()) AND dw.tahun = YEAR(NOW())`
    );

    // 3. Aktif bulan lalu (untuk delta)
    const [[{ aktivBulanLalu }]] = await query(
      `SELECT COUNT(*) AS aktivBulanLalu
       FROM fact_hoaks fh
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.bulan = MONTH(NOW() - INTERVAL 1 MONTH)
         AND dw.tahun = YEAR(NOW() - INTERVAL 1 MONTH)`
    );

    // 4. Hoaks terverifikasi (status_hoaks = 'Hoaks')
    const [[{ hoaksTerverif }]] = await query(
      `SELECT COUNT(*) AS hoaksTerverif
       FROM fact_hoaks fh
       JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
       WHERE ds.status_hoaks = 'Hoaks'`
    );

    // 5. Jumlah sumber aktif
    const [[{ jumlahSumber }]] = await query(
      `SELECT COUNT(DISTINCT id_sumber) AS jumlahSumber FROM fact_hoaks`
    );

    // 6. Tahun pertama data
    const [[{ firstYear }]] = await query(
      `SELECT MIN(tahun) AS firstYear FROM fact_hoaks`
    );

    // 7. Tren per tahun (untuk bar chart + forecast)
    const trenTahun = await query(
      `SELECT fh.tahun, COUNT(*) AS total
       FROM fact_hoaks fh
       GROUP BY fh.tahun
       ORDER BY fh.tahun ASC`
    );

    // 8. Distribusi status (untuk pie chart)
    const statusDistribusi = await query(
      `SELECT ds.status_hoaks, COUNT(*) AS jumlah
       FROM fact_hoaks fh
       JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
       GROUP BY ds.status_hoaks
       ORDER BY jumlah DESC`
    );

    // 9. Top 5 topik + flag anomali dari 30 hari terakhir
    const topTopikRaw = await query(
      `SELECT dt.topics, COUNT(*) AS jumlah
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       GROUP BY dt.topics
       ORDER BY jumlah DESC
       LIMIT 5`
    );

    // Rata-rata bulanan per topik (untuk flag anomali sederhana)
    const topTopikRecent = await query(
      `SELECT dt.topics, COUNT(*) AS count7d
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.tanggal >= NOW() - INTERVAL 7 DAY
       GROUP BY dt.topics`
    );

    // Monthly avg per topik (12 bulan terakhir / 12)
    const topTopikMonthly = await query(
      `SELECT dt.topics, COUNT(*) / 12 AS monthlyAvg
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.tanggal >= NOW() - INTERVAL 12 MONTH
       GROUP BY dt.topics`
    );

    const monthlyMap = {};
    topTopikMonthly.forEach(r => { monthlyMap[r.topics] = parseFloat(r.monthlyAvg) || 0; });
    const recentMap = {};
    topTopikRecent.forEach(r => { recentMap[r.topics] = r.count7d; });

    const topTopik = topTopikRaw.map(t => ({
      ...t,
      jumlah: parseInt(t.jumlah),
      isAnomaly: (recentMap[t.topics] ?? 0) > (monthlyMap[t.topics] ?? 0) * 1.5,
    }));

    res.json({
      totalHoaks:    parseInt(totalHoaks),
      aktivBulanIni: parseInt(aktivBulanIni),
      deltaBulan:    parseInt(aktivBulanIni) - parseInt(aktivBulanLalu),
      hoaksTerverif: parseInt(hoaksTerverif),
      jumlahSumber:  parseInt(jumlahSumber),
      firstYear:     parseInt(firstYear),
      trenTahun:     trenTahun.map(t => ({ tahun: t.tahun, total: parseInt(t.total) })),
      statusDistribusi,
      topTopik,
    });
  } catch (err) {
    console.error('[/dashboard/summary]', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/dashboard/anomalies
// Rule: jika count(7d) > monthlyAvg * 2  → danger
//       jika count(7d) > monthlyAvg * 1.5 → warning
// ─────────────────────────────────────────────────────────────
router.get('/anomalies', async (req, res) => {
  try {
    // Count per topik dalam 7 hari terakhir
    const recent7d = await query(
      `SELECT dt.topics AS topik, COUNT(*) AS count7d
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.tanggal >= NOW() - INTERVAL 7 DAY
       GROUP BY dt.topics`
    );

    // Rata-rata bulanan per topik (12 bulan terakhir)
    const monthlyAvgs = await query(
      `SELECT dt.topics AS topik, COUNT(*) / 12 AS monthlyAvg
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
       WHERE dw.tanggal >= NOW() - INTERVAL 12 MONTH
       GROUP BY dt.topics`
    );

    const avgMap = {};
    monthlyAvgs.forEach(r => { avgMap[r.topik] = parseFloat(r.monthlyAvg) || 0; });

    const anomalies = recent7d
      .map(r => {
        const avg   = avgMap[r.topik] || 1;
        const ratio = r.count7d / avg;
        let level   = null;
        if (ratio > 2)   level = 'danger';
        else if (ratio > 1.5) level = 'warning';
        return { topik: r.topik, count7d: r.count7d, monthlyAvg: avg, ratio, level };
      })
      .filter(r => r.level !== null)
      .sort((a, b) => b.ratio - a.ratio);

    res.json(anomalies);
  } catch (err) {
    console.error('[/dashboard/anomalies]', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/dashboard/recent?limit=5
// Activity feed — berita terbaru dengan JOIN ke semua dim
// ─────────────────────────────────────────────────────────────
router.get('/recent', async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  try {
    const rows = await query(
      `SELECT
         fh.id_fact_hoaks,
         db2.judul,
         db2.author,
         db2.link,
         db2.main_image_url,
         db2.excerpt,
         dw.tanggal,
         ds.status_hoaks,
         dk.kategori,
         dt.topics,
         dsumb.sumber
       FROM fact_hoaks fh
       JOIN dim_berita      db2    ON fh.id_berita       = db2.id_berita
       JOIN dim_waktu       dw     ON fh.id_waktu        = dw.id_waktu
       JOIN dim_status_hoaks ds    ON fh.id_status_hoaks = ds.id_status_hoaks
       JOIN dim_kategori    dk     ON fh.id_kategori     = dk.id_kategori
       JOIN dim_topik       dt     ON fh.id_topik        = dt.id_topik
       JOIN dim_sumber      dsumb  ON fh.id_sumber       = dsumb.id_sumber
       ORDER BY dw.tanggal DESC
       LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (err) {
    console.error('[/dashboard/recent]', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// Legacy endpoints (agar AdminManagement & Insight tidak break)
// ─────────────────────────────────────────────────────────────

// GET /api/dashboard/stats  (dipakai Dashboard lama)
router.get('/stats', async (req, res) => {
  try {
    const [[{ totalHoaks }]] = await query(`SELECT COUNT(*) AS totalHoaks FROM fact_hoaks`);
    const [[{ verified }]]   = await query(
      `SELECT COUNT(*) AS verified FROM fact_hoaks fh
       JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
       WHERE ds.status_hoaks = 'Fakta'`
    );
    const [[{ waiting }]]    = await query(
      `SELECT COUNT(*) AS waiting FROM fact_hoaks fh
       JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
       WHERE ds.status_hoaks = 'Unknown'`
    );
    const [[{ hoaks }]]      = await query(
      `SELECT COUNT(*) AS hoaks FROM fact_hoaks fh
       JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
       WHERE ds.status_hoaks = 'Hoaks'`
    );
    res.json({ totalHoaks, verified, waiting, hoaks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/tren  (dipakai Dashboard lama)
router.get('/tren', async (req, res) => {
  try {
    const rows = await query(
      `SELECT fh.tahun AS name, COUNT(*) AS val
       FROM fact_hoaks fh
       GROUP BY fh.tahun
       ORDER BY fh.tahun ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/topik  (dipakai Dashboard lama)
router.get('/topik', async (req, res) => {
  try {
    const COLORS = ['#185FA5', '#E24B4A', '#EF9F27', '#1D9E75', '#888780'];
    const rows = await query(
      `SELECT dt.topics AS name, COUNT(*) AS value
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       GROUP BY dt.topics
       ORDER BY value DESC
       LIMIT 5`
    );
    res.json(rows.map((r, i) => ({ ...r, value: parseInt(r.value), color: COLORS[i] })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/berita-terbaru  (dipakai Dashboard lama)
router.get('/berita-terbaru', async (req, res) => {
  try {
    const rows = await query(
      `SELECT
         fh.id_fact_hoaks, db2.judul, db2.author, db2.link,
         dw.tanggal, ds.status_hoaks, dt.topics
       FROM fact_hoaks fh
       JOIN dim_berita       db2 ON fh.id_berita       = db2.id_berita
       JOIN dim_waktu        dw  ON fh.id_waktu        = dw.id_waktu
       JOIN dim_status_hoaks ds  ON fh.id_status_hoaks = ds.id_status_hoaks
       JOIN dim_topik        dt  ON fh.id_topik        = dt.id_topik
       ORDER BY dw.tanggal DESC
       LIMIT 5`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
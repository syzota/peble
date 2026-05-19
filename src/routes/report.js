/**
 * routes/report.js
 * ─────────────────────────────────────────────────────────────
 * Semua endpoint yang dibutuhkan oleh Report.jsx
 *
 * GET /api/report/summary  → Semua data analitik + ML input
 *
 * Mount di server.js:
 *   const reportRoutes = require('./routes/report');
 *   app.use('/api/report', reportRoutes);
 * ─────────────────────────────────────────────────────────────
 */

const express = require('express');
const router  = express.Router();
const db      = require('../db');

const query = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, results) =>
      err ? reject(err) : resolve(results)
    )
  );

// ─────────────────────────────────────────────────────────────
// GET /api/report/summary
// ─────────────────────────────────────────────────────────────
router.get('/summary', async (req, res) => {
  try {
    // 1. Total hoaks
    const [[{ totalHoaks }]] = await query(
      `SELECT COUNT(*) AS totalHoaks FROM fact_hoaks`
    );

    // 2. Verified (status = Fakta)
    const [[{ verified }]] = await query(
      `SELECT COUNT(*) AS verified
       FROM fact_hoaks fh
       JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
       WHERE ds.status_hoaks = 'Fakta'`
    );

    // 3. Last update (tanggal terbaru di dim_waktu)
    const [[{ lastUpdate }]] = await query(
      `SELECT MAX(dw.tanggal) AS lastUpdate
       FROM fact_hoaks fh
       JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu`
    );

    // 4. Tren per tahun (bahan linear regression di frontend)
    const trenTahun = await query(
      `SELECT fh.tahun, COUNT(*) AS total
       FROM fact_hoaks fh
       GROUP BY fh.tahun
       ORDER BY fh.tahun ASC`
    );

    // 5. Top topik (untuk horizontal bar chart)
    const topTopik = await query(
      `SELECT dt.topics, COUNT(*) AS jumlah
       FROM fact_hoaks fh
       JOIN dim_topik dt ON fh.id_topik = dt.id_topik
       GROUP BY dt.topics
       ORDER BY jumlah DESC
       LIMIT 10`
    );

    // 6. Top sumber (untuk progress bar)
    const topSumber = await query(
      `SELECT ds.sumber, COUNT(*) AS jumlah
       FROM fact_hoaks fh
       JOIN dim_sumber ds ON fh.id_sumber = ds.id_sumber
       GROUP BY ds.sumber
       ORDER BY jumlah DESC
       LIMIT 5`
    );

    // 7. Distribusi status
    const statusDistribusi = await query(
      `SELECT ds.status_hoaks, COUNT(*) AS jumlah
       FROM fact_hoaks fh
       JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
       GROUP BY ds.status_hoaks
       ORDER BY jumlah DESC`
    );

    res.json({
      totalHoaks:      parseInt(totalHoaks),
      verified:        parseInt(verified),
      lastUpdate,
      trenTahun:       trenTahun.map(t => ({ tahun: t.tahun, total: parseInt(t.total) })),
      topTopik:        topTopik.map(t => ({ ...t, jumlah: parseInt(t.jumlah) })),
      topSumber:       topSumber.map(s => ({ ...s, jumlah: parseInt(s.jumlah) })),
      statusDistribusi,
    });
  } catch (err) {
    console.error('[/report/summary]', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
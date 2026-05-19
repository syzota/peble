import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

// ─── MySQL Pool ───────────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "bimbim",
  waitForConnections: true,
  connectionLimit: 10,
});

pool.getConnection()
  .then((c) => { console.log("✅ MySQL bem_hoaks terhubung."); c.release(); })
  .catch((e) => console.error("❌ Gagal konek MySQL:", e.message));

const q = (sql: string, params: unknown[] = []) =>
  pool.query(sql, params).then(([rows]: [unknown]) => rows as Record<string, unknown>[]);

// ─── Express App ─────────────────────────────────────────────────────────────
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // AUTH
  // ══════════════════════════════════════════════════════════════════════════
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const rows = await q(
        "SELECT * FROM staff WHERE username = ? AND password = ?",
        [username, password]
      );
      if (!rows.length)
        return res.status(401).json({ success: false, message: "Username atau password salah." });
      const u = rows[0];
      res.json({
        success: true,
        user: {
          id:          u.id,
          username:    u.username,
          name:        u.nama_lengkap,
          kementerian: u.kementerian,
          jabatan:     u.jabatan,
          role:        u.role,
        },
      });
    } catch (e: unknown) {
      const err = e as Error;
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ══════════════════════════════════════════════════════════════════════════
  app.get("/api/dashboard/stats", async (_req, res) => {
    try {
      const [[{ totalHoaks }]] = await pool.query("SELECT COUNT(*) AS totalHoaks FROM fact_hoaks") as [Record<string,number>[], unknown];
      const [[{ verified }]]   = await pool.query(`SELECT COUNT(*) AS verified FROM fact_hoaks fh JOIN dim_status_hoaks sh ON fh.id_status_hoaks=sh.id_status_hoaks WHERE sh.status_hoaks='Verifikasi'`) as [Record<string,number>[], unknown];
      const [[{ waiting }]]    = await pool.query(`SELECT COUNT(*) AS waiting FROM fact_hoaks fh JOIN dim_status_hoaks sh ON fh.id_status_hoaks=sh.id_status_hoaks WHERE sh.status_hoaks='Unknown'`) as [Record<string,number>[], unknown];
      const [[{ hoaks }]]      = await pool.query(`SELECT COUNT(*) AS hoaks FROM fact_hoaks fh JOIN dim_status_hoaks sh ON fh.id_status_hoaks=sh.id_status_hoaks WHERE sh.status_hoaks='Hoaks'`) as [Record<string,number>[], unknown];
      const [[{ sources }]]    = await pool.query("SELECT COUNT(*) AS sources FROM dim_sumber") as [Record<string,number>[], unknown];
      res.json({ totalHoaks, verified, waiting, hoaks, sources });
    } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
  });

  app.get("/api/dashboard/tren", async (_req, res) => {
    try {
      const rows = await q(`
        SELECT w.bulan, w.tahun, COUNT(*) AS total
        FROM fact_hoaks fh JOIN dim_waktu w ON fh.id_waktu=w.id_waktu
        WHERE w.tanggal >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY w.tahun, w.bulan ORDER BY w.tahun, w.bulan
      `);
      const names = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
      res.json(rows.map((r) => ({ name: names[Number(r.bulan)-1] ?? `Bln${r.bulan}`, val: r.total })));
    } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
  });

  app.get("/api/dashboard/topik", async (_req, res) => {
    try {
      const rows = await q(`
        SELECT t.topics AS name, COUNT(*) AS value
        FROM fact_hoaks fh JOIN dim_topik t ON fh.id_topik=t.id_topik
        GROUP BY fh.id_topik, t.topics ORDER BY value DESC LIMIT 6
      `);
      const colors = ["#FFFFFF","#C0C0C0","#A0A0A0","#808080","#606060","#404040"];
      res.json(rows.map((r, i) => ({ ...r, color: colors[i] ?? "#404040" })));
    } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
  });

  app.get("/api/dashboard/berita-terbaru", async (_req, res) => {
    try {
      const rows = await q(`
        SELECT b.id_berita, b.judul, b.excerpt, b.author, sh.status_hoaks, w.tanggal
        FROM fact_hoaks fh
        JOIN dim_berita b ON fh.id_berita=b.id_berita
        JOIN dim_status_hoaks sh ON fh.id_status_hoaks=sh.id_status_hoaks
        JOIN dim_waktu w ON fh.id_waktu=w.id_waktu
        ORDER BY w.tanggal DESC LIMIT 5
      `);
      res.json(rows);
    } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // INSIGHT (dengan filter)
  // ══════════════════════════════════════════════════════════════════════════
  app.get("/api/insight", async (req, res) => {
    try {
      const { kategori, topik, status, q: search } = req.query as Record<string,string>;
      let sql = `
        SELECT fh.id_fact_hoaks, fh.tahun,
              b.id_berita, b.judul, b.excerpt, b.isi, b.author, b.link, b.main_image_url, b.view_count,
              k.kategori, s.sumber, t.topics, sh.status_hoaks, w.tanggal, tg.nama_tag
        FROM fact_hoaks fh
        JOIN dim_berita b ON fh.id_berita=b.id_berita  -- <-- Ubah LEFT JOIN menjadi JOIN di sini
        LEFT JOIN dim_kategori k ON fh.id_kategori=k.id_kategori
        LEFT JOIN dim_sumber s ON fh.id_sumber=s.id_sumber
        LEFT JOIN dim_topik t ON fh.id_topik=t.id_topik
        LEFT JOIN dim_status_hoaks sh ON fh.id_status_hoaks=sh.id_status_hoaks
        LEFT JOIN dim_waktu w ON fh.id_waktu=w.id_waktu
        LEFT JOIN dim_tag tg ON fh.id_tag=tg.id_tag
        WHERE b.judul IS NOT NULL AND TRIM(b.judul) != ''
      `;
      const params: unknown[] = [];
      if (kategori) { sql += " AND k.id_kategori=?";    params.push(kategori); }
      if (topik)    { sql += " AND t.id_topik=?";        params.push(topik); }
      if (status)   { sql += " AND sh.id_status_hoaks=?";params.push(status); }
      if (search)   {
        sql += " AND (b.judul LIKE ? OR b.excerpt LIKE ? OR b.isi LIKE ?)";
        const like = `%${search}%`;
        params.push(like, like, like);
      }
      sql += " ORDER BY w.tanggal DESC LIMIT 100";
      res.json(await q(sql, params));
    } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // REPORT SUMMARY
  // ══════════════════════════════════════════════════════════════════════════
  app.get("/api/report/summary", async (_req, res) => {
    try {
      const [[{ totalHoaks }]] = await pool.query("SELECT COUNT(*) AS totalHoaks FROM fact_hoaks") as [Record<string,number>[], unknown];
      const [[{ verified }]]   = await pool.query(`SELECT COUNT(*) AS verified FROM fact_hoaks fh JOIN dim_status_hoaks sh ON fh.id_status_hoaks=sh.id_status_hoaks WHERE sh.status_hoaks='Verifikasi'`) as [Record<string,number>[], unknown];
      const [[{ hoaks }]]      = await pool.query(`SELECT COUNT(*) AS hoaks FROM fact_hoaks fh JOIN dim_status_hoaks sh ON fh.id_status_hoaks=sh.id_status_hoaks WHERE sh.status_hoaks='Hoaks'`) as [Record<string,number>[], unknown];
      // Ubah query topTopikRaw:
      const topTopikRaw = await q(`
        SELECT dt.topics, COUNT(*) AS jumlah
        FROM fact_hoaks fh
        JOIN dim_topik dt ON fh.id_topik = dt.id_topik
        GROUP BY dt.id_topik, dt.topics
        ORDER BY jumlah DESC LIMIT 5
      `);

      // --- Di dalam route /api/report/summary ---
      // Ubah topSumber:
      const topSumber = await q(`
        SELECT s.sumber, COUNT(*) AS jumlah
        FROM fact_hoaks fh
        JOIN dim_sumber s ON fh.id_sumber = s.id_sumber
        GROUP BY s.id_sumber, s.sumber
        ORDER BY jumlah DESC LIMIT 5
      `);

      // Ubah topTopik:
      const topTopik = await q(`
        SELECT t.topics, COUNT(*) AS jumlah
        FROM fact_hoaks fh
        JOIN dim_topik t ON fh.id_topik = t.id_topik
        GROUP BY t.id_topik, t.topics
        ORDER BY jumlah DESC LIMIT 5
      `);

      // Ubah topKategori:
      const topKategori = await q(`
        SELECT k.kategori, COUNT(*) AS jumlah
        FROM fact_hoaks fh
        JOIN dim_kategori k ON fh.id_kategori = k.id_kategori
        GROUP BY k.id_kategori, k.kategori
        ORDER BY jumlah DESC LIMIT 5
      `);
      const trenTahun  = await q(`SELECT tahun, COUNT(*) AS total FROM fact_hoaks GROUP BY tahun ORDER BY tahun DESC LIMIT 5`);
      const [[{ lastUpdate }]] = await pool.query("SELECT MAX(tanggal) AS lastUpdate FROM dim_waktu") as [Record<string,unknown>[], unknown];
      res.json({ totalHoaks, verified, hoaks, topSumber, topTopik, topKategori, trenTahun, lastUpdate });
    } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FACT_HOAKS CRUD
  // ══════════════════════════════════════════════════════════════════════════
  app.get("/api/fact_hoaks", async (_req, res) => {
    try {
      res.json(await q(`
        SELECT fh.*, b.judul, b.slug, k.kategori, s.sumber, t.topics, sh.status_hoaks, w.tanggal, tg.nama_tag
        FROM fact_hoaks fh
        LEFT JOIN dim_berita b ON fh.id_berita=b.id_berita
        LEFT JOIN dim_kategori k ON fh.id_kategori=k.id_kategori
        LEFT JOIN dim_sumber s ON fh.id_sumber=s.id_sumber
        LEFT JOIN dim_topik t ON fh.id_topik=t.id_topik
        LEFT JOIN dim_status_hoaks sh ON fh.id_status_hoaks=sh.id_status_hoaks
        LEFT JOIN dim_waktu w ON fh.id_waktu=w.id_waktu
        LEFT JOIN dim_tag tg ON fh.id_tag=tg.id_tag
        ORDER BY w.tanggal DESC
      `));
    } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
  });

  app.post("/api/fact_hoaks", async (req, res) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const now = new Date();
      const [wRes] = await conn.query(
        `INSERT INTO dim_waktu (tanggal, hari, nama_hari, bulan, nama_bulan, tahun, quarter) VALUES (?,?,?,?,?,?,?)`,
        [
          now.toISOString().slice(0,19).replace("T"," "),
          now.getDate(), now.getDay(),
          now.getMonth()+1, now.getMonth()+1,
          now.getFullYear(),
          Math.floor((now.getMonth()+3)/3),
        ]
      ) as [{ insertId: number }, unknown];
      const { id_berita, id_tag, id_sumber, id_topik, id_kategori, id_status_hoaks } = req.body;
      const [fRes] = await conn.query(
        `INSERT INTO fact_hoaks (id_berita, id_tag, id_waktu, id_sumber, id_topik, id_kategori, id_status_hoaks, tahun) VALUES (?,?,?,?,?,?,?,?)`,
        [id_berita, id_tag, wRes.insertId, id_sumber, id_topik, id_kategori, id_status_hoaks, now.getFullYear()]
      ) as [{ insertId: number }, unknown];
      await conn.commit();
      res.json({ success: true, id: fRes.insertId });
    } catch (e: unknown) {
      await conn.rollback();
      res.status(500).json({ error: (e as Error).message });
    } finally { conn.release(); }
  });

  app.put("/api/fact_hoaks/:id", async (req, res) => {
    try {
      const { id_berita, id_tag, id_sumber, id_topik, id_kategori, id_status_hoaks } = req.body;
      await pool.query(
        `UPDATE fact_hoaks SET id_berita=?,id_tag=?,id_sumber=?,id_topik=?,id_kategori=?,id_status_hoaks=? WHERE id_fact_hoaks=?`,
        [id_berita, id_tag, id_sumber, id_topik, id_kategori, id_status_hoaks, req.params.id]
      );
      res.json({ success: true });
    } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
  });

  app.delete("/api/fact_hoaks/:id", async (req, res) => {
    try {
      await pool.query("DELETE FROM fact_hoaks WHERE id_fact_hoaks=?", [req.params.id]);
      res.json({ success: true });
    } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // GENERIC CRUD — semua tabel dimensi + staff
  // ══════════════════════════════════════════════════════════════════════════
  const TABLES = [
    { name: "dim_berita",       pk: "id_berita" },
    { name: "dim_kategori",     pk: "id_kategori" },
    { name: "dim_status_hoaks", pk: "id_status_hoaks" },
    { name: "dim_sumber",       pk: "id_sumber" },
    { name: "dim_tag",          pk: "id_tag" },
    { name: "dim_topik",        pk: "id_topik" },
    { name: "dim_waktu",        pk: "id_waktu" },
    { name: "staff",            pk: "id" },
  ];

  TABLES.forEach(({ name, pk }) => {
    app.get(`/api/${name}`, async (_req, res) => {
      try { res.json(await q(`SELECT * FROM \`${name}\``)); }
      catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
    });

    app.post(`/api/${name}`, async (req, res) => {
      try {
        const keys = Object.keys(req.body);
        const vals = Object.values(req.body);
        const [result] = await pool.query(
          `INSERT INTO \`${name}\` (${keys.map(k=>`\`${k}\``).join(",")}) VALUES (${keys.map(()=>"?").join(",")})`,
          vals
        ) as [{ insertId: number }, unknown];
        res.json({ success: true, id: result.insertId });
      } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
    });

    app.put(`/api/${name}/:id`, async (req, res) => {
      try {
        const keys = Object.keys(req.body);
        const vals = Object.values(req.body);
        await pool.query(
          `UPDATE \`${name}\` SET ${keys.map(k=>`\`${k}\`=?`).join(",")} WHERE \`${pk}\`=?`,
          [...vals, req.params.id]
        );
        res.json({ success: true });
      } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
    });

    app.delete(`/api/${name}/:id`, async (req, res) => {
      try {
        await pool.query(`DELETE FROM \`${name}\` WHERE \`${pk}\`=?`, [req.params.id]);
        res.json({ success: true });
      } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // HEALTH CHECK
  // ══════════════════════════════════════════════════════════════════════════
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
// ══════════════════════════════════════════════════════════════════════════

  // ── /api/dashboard/summary ───────────────────────────────────
  app.get("/api/dashboard/summary", async (_req, res) => {
    try {
      const [[{ totalHoaks }]]    = await pool.query("SELECT COUNT(*) AS totalHoaks FROM fact_hoaks") as [Record<string,number>[], unknown];
      const [[{ aktivBulanIni }]] = await pool.query(`
        SELECT COUNT(*) AS aktivBulanIni FROM fact_hoaks fh
        JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
        WHERE dw.bulan = MONTH(NOW()) AND dw.tahun = YEAR(NOW())`) as [Record<string,number>[], unknown];
      const [[{ aktivBulanLalu }]] = await pool.query(`
        SELECT COUNT(*) AS aktivBulanLalu FROM fact_hoaks fh
        JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
        WHERE dw.bulan = MONTH(NOW() - INTERVAL 1 MONTH)
          AND dw.tahun = YEAR(NOW() - INTERVAL 1 MONTH)`) as [Record<string,number>[], unknown];
      const [[{ hoaksTerverif }]] = await pool.query(`
        SELECT COUNT(*) AS hoaksTerverif FROM fact_hoaks fh
        JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
        WHERE ds.status_hoaks = 'Hoaks'`) as [Record<string,number>[], unknown];
      const [[{ jumlahSumber }]] = await pool.query(
        "SELECT COUNT(DISTINCT id_sumber) AS jumlahSumber FROM fact_hoaks") as [Record<string,number>[], unknown];
      const [[{ firstYear }]] = await pool.query(
        "SELECT MIN(tahun) AS firstYear FROM fact_hoaks") as [Record<string,number>[], unknown];

      const trenTahunRaw = await q(`SELECT tahun, COUNT(*) AS total FROM fact_hoaks GROUP BY tahun ORDER BY tahun ASC`);
      const trenTahun = trenTahunRaw.map(t => ({ tahun: t.tahun, total: Number(t.total) }));

      const statusDistribusi = await q(`
        SELECT ds.status_hoaks, COUNT(*) AS jumlah
        FROM fact_hoaks fh JOIN dim_status_hoaks ds ON fh.id_status_hoaks = ds.id_status_hoaks
        GROUP BY ds.status_hoaks ORDER BY jumlah DESC`);

      const topTopikRaw = await q(`
        SELECT dt.topics, COUNT(*) AS jumlah
        FROM fact_hoaks fh JOIN dim_topik dt ON fh.id_topik = dt.id_topik
        GROUP BY dt.id_topik, dt.topics ORDER BY jumlah DESC LIMIT 5`);

      const recent7d = await q(`
        SELECT dt.topics, COUNT(*) AS count7d
        FROM fact_hoaks fh
        JOIN dim_topik dt ON fh.id_topik = dt.id_topik
        JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
        WHERE dw.tanggal IS NOT NULL AND dw.tanggal >= NOW() - INTERVAL 7 DAY
        GROUP BY dt.topics`);

      const monthly = await q(`
        SELECT dt.topics, COUNT(*) / 12 AS monthlyAvg
        FROM fact_hoaks fh
        JOIN dim_topik dt ON fh.id_topik = dt.id_topik
        JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
        WHERE dw.tanggal >= NOW() - INTERVAL 12 MONTH
        GROUP BY dt.topics`);

      const avgMap    = Object.fromEntries(monthly.map(r => [r.topics, parseFloat(String(r.monthlyAvg)) || 0]));
      const recentMap = Object.fromEntries(recent7d.map(r => [r.topics, Number(r.count7d)]));

      const topTopik = topTopikRaw.map(t => ({
        topics:    t.topics,
        jumlah:    Number(t.jumlah),
        isAnomaly: (recentMap[String(t.topics)] ?? 0) > (avgMap[String(t.topics)] ?? 0) * 1.5,
      }));

      res.json({
        totalHoaks: Number(totalHoaks), aktivBulanIni: Number(aktivBulanIni),
        deltaBulan: Number(aktivBulanIni) - Number(aktivBulanLalu),
        hoaksTerverif: Number(hoaksTerverif), jumlahSumber: Number(jumlahSumber),
        firstYear: Number(firstYear), trenTahun, statusDistribusi, topTopik,
      });
    } catch (e: unknown) { console.error('[/api/dashboard/summary]', e); res.status(500).json({ error: (e as Error).message }); }
  });

  // ── /api/dashboard/anomalies ─────────────────────────────────
  app.get("/api/dashboard/anomalies", async (_req, res) => {
    try {
      const recent7d = await q(`
        SELECT dt.topics AS topik, COUNT(*) AS count7d
        FROM fact_hoaks fh
        JOIN dim_topik dt ON fh.id_topik = dt.id_topik
        JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
        WHERE dw.tanggal >= NOW() - INTERVAL 7 DAY
        GROUP BY dt.topics`);

      const monthly = await q(`
        SELECT dt.topics AS topik, COUNT(*) / 12 AS monthlyAvg
        FROM fact_hoaks fh
        JOIN dim_topik dt ON fh.id_topik = dt.id_topik
        JOIN dim_waktu dw ON fh.id_waktu = dw.id_waktu
        WHERE dw.tanggal >= NOW() - INTERVAL 12 MONTH
        GROUP BY dt.topics`);

      const avgMap = Object.fromEntries(monthly.map(r => [r.topik, parseFloat(String(r.monthlyAvg)) || 1]));

      const anomalies = recent7d
        .map(r => {
          const avg   = avgMap[String(r.topik)] || 1;
          const ratio = Number(r.count7d) / avg;
          const level = ratio > 2 ? 'danger' : ratio > 1.5 ? 'warning' : null;
          return { topik: r.topik, count7d: Number(r.count7d), monthlyAvg: avg, ratio, level };
        })
        .filter(r => r.level !== null)
        .sort((a, b) => b.ratio - a.ratio);

      res.json(anomalies);
    } catch (e: unknown) { console.error('[/api/dashboard/anomalies]', e); res.status(500).json({ error: (e as Error).message }); }
  });

  // ── /api/dashboard/recent ────────────────────────────────────
  app.get("/api/dashboard/recent", async (req, res) => {
    try {
      const limit = Math.min(parseInt(String(req.query.limit)) || 5, 20);
      const rows = await q(`
        SELECT fh.id_fact_hoaks, b.judul, b.author, b.link, b.main_image_url, b.excerpt,
              dw.tanggal, ds.status_hoaks, dk.kategori, dt.topics, ds2.sumber
        FROM fact_hoaks fh
        JOIN dim_berita       b   ON fh.id_berita       = b.id_berita
        JOIN dim_waktu        dw  ON fh.id_waktu        = dw.id_waktu
        JOIN dim_status_hoaks ds  ON fh.id_status_hoaks = ds.id_status_hoaks
        JOIN dim_kategori     dk  ON fh.id_kategori     = dk.id_kategori
        JOIN dim_topik        dt  ON fh.id_topik        = dt.id_topik
        JOIN dim_sumber       ds2 ON fh.id_sumber       = ds2.id_sumber
        ORDER BY dw.tanggal DESC LIMIT ?`, [limit]);
      res.json(rows);
    } catch (e: unknown) { console.error('[/api/dashboard/recent]', e); res.status(500).json({ error: (e as Error).message }); }
  });
  // VITE DEV MIDDLEWARE (Ini harus di akhir)
  // ══════════════════════════════════════════════════════════════════════════
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server jalan di port ${PORT}`);
  });
}

startServer();
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  AlertTriangle, Bell, Shield, Database,
  ExternalLink, Calendar, ArrowUpRight, ArrowDownRight,
  ChevronRight, Activity, Layers, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Design tokens ────────────────────────────────────────────
const T = {
  blue:    '#185FA5',
  blueLt:  '#E6F1FB',
  blueMid: '#B5D4F4',
  red:     '#E24B4A',
  redLt:   '#FCEBEB',
  amber:   '#EF9F27',
  amberLt: '#FAEEDA',
  green:   '#1D9E75',
  greenLt: '#E1F5EE',
  text:    '#1a1a1a',
  muted:   '#888780',
  border:  'rgba(183,212,244,0.5)',
  glass:   'rgba(255,255,255,0.72)',
};

const STATUS_COLORS = {
  'Hoaks':      { bg: '#FCEBEB', text: '#791F1F', dot: '#E24B4A' },
  'Fakta':      { bg: '#E1F5EE', text: '#085041', dot: '#1D9E75' },
  'Verifikasi': { bg: '#FAEEDA', text: '#633806', dot: '#EF9F27' },
  'Unknown':    { bg: '#F1EFE8', text: '#444441', dot: '#888780' },
};

const PIE_COLORS = [T.red, T.green, T.amber, '#888780'];

// ─── Pseudo-ML ────────────────────────────────────────────────
const movingAverage = (arr, n = 3) => {
  if (!arr.length) return 0;
  const slice = arr.slice(-Math.min(n, arr.length));
  return Math.round(slice.reduce((a, b) => a + b, 0) / slice.length);
};
const forecast = (arr, periods = 3) => {
  if (!arr.length) return Array(periods).fill(0);
  const base  = movingAverage(arr, 3);
  const last  = arr[arr.length - 1] ?? base;
  const prev4 = arr[arr.length - 4] ?? last;
  const slope = (last - prev4) / 3;
  return Array.from({ length: periods }, (_, i) =>
    Math.max(0, Math.round(base + slope * (i + 1)))
  );
};

// ─── Shared components ────────────────────────────────────────
const Card = ({ children, className = '', style = {} }) => (
  <div className={`rounded-3xl p-6 ${className}`}
    style={{ background: T.glass, border: `0.5px solid ${T.border}`, backdropFilter: 'blur(16px)', ...style }}>
    {children}
  </div>
);

const SLabel = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: T.muted }}>
    {children}
  </p>
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS_COLORS[status] || STATUS_COLORS['Unknown'];
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.text }}>{status}</span>
  );
};

const Skel = ({ h = '20px', rounded = '8px' }) => (
  <div className="animate-pulse w-full"
    style={{ height: h, borderRadius: rounded, background: T.blueMid + '40' }} />
);

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-4 py-3 text-xs shadow-lg"
      style={{ background: '#fff', border: `0.5px solid ${T.blueMid}` }}>
      <p className="font-bold mb-1" style={{ color: T.text }}>{label}</p>
      <p style={{ color: T.blue }}>{payload[0]?.value?.toLocaleString('id-ID')} kasus</p>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary]     = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [recent, setRecent]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshed, setRefreshed] = useState(new Date());

// Dashboard.jsx - Pastikan fetchAll seperti ini:
const fetchAll = async () => {
  setLoading(true);
  try {
    const endpoints =[
      '/api/dashboard/summary',
      '/api/dashboard/anomalies',
      '/api/dashboard/recent?limit=5'
    ];

    console.log("Mencoba memanggil:", endpoints); // <--- LIHAT INI DI KONSOL BROWSER

    const results = await Promise.all(endpoints.map(url =>
      fetch(url).then(r => {
        if (!r.ok) {
          console.error(`Gagal di ${url}: Status ${r.status}`); // <--- LIHAT INI
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
    ));

    setSummary(results[0]);
    setAnomalies(Array.isArray(results[1]) ? results[1] :[]);
    setRecent(Array.isArray(results[2]) ? results[2] :[]);
  } catch (e) {
    console.error("Gagal mengambil data:", e);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchAll(); }, []);

  const counts  = summary?.trenTahun?.map(t => t.total) ?? [];
  const fcVals  = forecast(counts, 3);
  const fcMths  = ['Juni 2026', 'Juli 2026', 'Agustus 2026'];
  const pieDat  = summary?.statusDistribusi ?? [];

  const greeting = () => {
    const h = new Date().getHours();
    return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
  };

  // Build chart data: historis + forecast
  const chartData = [
    ...(summary?.trenTahun ?? []).map(t => ({ label: String(t.tahun), val: t.total, fc: null })),
    ...fcVals.map((v, i) => ({ label: `${2026 + i}*`, val: null, fc: v })),
  ];

  // KPI definitions
  const kpis = summary ? [
    {
      label: 'Total kasus', icon: <Database className="w-4 h-4" />,
      value: summary.totalHoaks?.toLocaleString('id-ID'),
      sub: `Sejak ${summary.firstYear ?? 2015}`,
      color: T.blue, bg: T.blueLt, pct: 100,
    },
    {
      label: 'Aktif bulan ini', icon: <Activity className="w-4 h-4" />,
      value: summary.aktivBulanIni?.toLocaleString('id-ID'),
      sub: `${(summary.deltaBulan ?? 0) >= 0 ? '+' : ''}${summary.deltaBulan ?? 0} vs bulan lalu`,
      color: T.green, bg: T.greenLt,
      pct: Math.min(100, Math.round((summary.aktivBulanIni / Math.max(1, summary.totalHoaks / 12)) * 100)),
      up: (summary.deltaBulan ?? 0) >= 0,
    },
    {
      label: 'Hoaks terverif.', icon: <Shield className="w-4 h-4" />,
      value: `${summary.totalHoaks ? Math.round((summary.hoaksTerverif / summary.totalHoaks) * 100) : 0}%`,
      sub: `${summary.hoaksTerverif?.toLocaleString('id-ID')} kasus`,
      color: T.red, bg: T.redLt,
      pct: summary.totalHoaks ? Math.round((summary.hoaksTerverif / summary.totalHoaks) * 100) : 0,
    },
    {
      label: 'Sumber aktif', icon: <Layers className="w-4 h-4" />,
      value: summary.jumlahSumber,
      sub: 'Instansi terverifikasi',
      color: '#BA7517', bg: T.amberLt,
      pct: Math.min(100, (summary.jumlahSumber ?? 0) * 7),
    },
  ] : [];

  return (
    <div className="space-y-6 pb-24 md:pb-10">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '26px', color: T.text, lineHeight: 1.1 }}>
              {greeting()}, {user?.name?.split(' ')[0] ?? 'Pengguna'}.
            </h1>
            <p className="text-sm mt-1.5 flex items-center gap-2" style={{ color: T.muted }}>
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              {anomalies.length > 0 && (
                <span className="font-semibold" style={{ color: T.red }}>
                  · {anomalies.length} anomali terdeteksi
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{ background: T.blueLt, color: T.blue }}>
              {user?.kementerian ?? 'Peble EIS'}
            </span>
            <button onClick={fetchAll}
              className="p-2 rounded-full transition-all hover:scale-110"
              style={{ background: T.blueLt, color: T.blue }}>
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* ── Anomaly banners ── */}
      <AnimatePresence>
        {!loading && anomalies.map((a, i) => (
          <motion.div key={a.topik} layout
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }} transition={{ delay: i * 0.08 }}>
            <div className="rounded-2xl px-5 py-4 flex items-center gap-4"
              style={{
                background: a.level === 'danger' ? T.redLt : T.amberLt,
                border: `0.5px solid ${a.level === 'danger' ? '#F09595' : '#FAC775'}`,
              }}>
              {a.level === 'danger'
                ? <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: T.red }} />
                : <Bell className="w-5 h-5 shrink-0" style={{ color: T.amber }} />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold"
                  style={{ color: a.level === 'danger' ? '#791F1F' : '#633806' }}>
                  {a.level === 'danger' ? 'Spike anomali' : 'Tren naik'} — topik "{a.topik}"
                </p>
                <p className="text-xs mt-0.5"
                  style={{ color: a.level === 'danger' ? T.red : '#854F0B' }}>
                  {a.count7d} kasus dalam 7 hari · {Number(a.ratio).toFixed(1)}× rata-rata bulanan
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
                style={{
                  background: a.level === 'danger' ? '#F7C1C1' : '#FAC775',
                  color: a.level === 'danger' ? '#791F1F' : '#633806',
                }}>
                {a.level === 'danger' ? 'Anomali' : 'Waspada'}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── KPI cards ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <Card key={i}><Skel h="80px" /></Card>)
          : kpis.map((kpi, i) => (
            <motion.div key={kpi.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}>
              <Card className="flex flex-col gap-3 h-full">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: T.muted }}>
                    {kpi.label}
                  </p>
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                    style={{ background: kpi.bg, color: kpi.color }}>{kpi.icon}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '28px', color: kpi.color, lineHeight: 1 }}>
                    {kpi.value ?? '—'}
                  </div>
                  <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: T.muted }}>
                    {kpi.up !== undefined && (
                      kpi.up
                        ? <ArrowUpRight className="w-3 h-3" style={{ color: T.green }} />
                        : <ArrowDownRight className="w-3 h-3" style={{ color: T.red }} />
                    )}
                    {kpi.sub}
                  </p>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: kpi.bg }}>
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${kpi.pct}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    style={{ background: kpi.color }}
                  />
                </div>
              </Card>
            </motion.div>
          ))
        }
      </motion.div>

      {/* ── Trend chart + Forecast ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <SLabel>Tren historis</SLabel>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '18px', color: T.text }}>
                Kasus per tahun
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: T.muted }}>
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: T.blue }} /> Historis
              <span className="w-3 h-3 rounded-full inline-block ml-2 border border-dashed"
                style={{ background: T.red + '60', borderColor: T.red }} /> Forecast
            </div>
          </div>
          {loading ? <Skel h="200px" rounded="12px" /> : (
            <div style={{ width: '100%', height: 220, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={26} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: T.muted, fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip content={<ChartTip />} cursor={{ fill: T.blueLt }} />
                  <Bar dataKey="val" name="Aktual" radius={[6, 6, 0, 0]} fill={T.blue} />
                  <Bar dataKey="fc" name="Forecast" radius={[6, 6, 0, 0]} fill={T.red + '60'}
                    stroke={T.red} strokeWidth={1.5} strokeDasharray="4 2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="flex flex-col">
          <SLabel>Prediksi 3 bulan</SLabel>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '18px', color: T.text, marginBottom: '20px' }}>
            Moving average
          </h2>
          {loading ? <Skel h="120px" rounded="12px" /> : (
            <div className="flex-1 flex flex-col justify-between">
              {fcMths.map((month, i) => {
                const val  = fcVals[i] ?? 0;
                const prev = i === 0 ? (summary?.aktivBulanIni ?? val) : (fcVals[i - 1] ?? val);
                const up   = val >= prev;
                return (
                  <motion.div key={month}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center justify-between py-3.5 border-b last:border-b-0"
                    style={{ borderColor: T.border }}>
                    <div>
                      <p className="text-xs font-medium" style={{ color: T.text }}>{month}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: T.muted }}>
                        {up ? '↑' : '↓'} {Math.abs(val - prev).toLocaleString('id-ID')} dari sebelumnya
                      </p>
                    </div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '20px', color: up ? T.red : T.green }}>
                      ~{val.toLocaleString('id-ID')}
                    </div>
                  </motion.div>
                );
              })}
              <p className="text-[10px] mt-3 pt-3 border-t" style={{ color: T.muted, borderColor: T.border }}>
                avg(3 bulan terakhir) + slope linear
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── Top Topik + Distribusi Status ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Card>
          <SLabel>Breakdown topik</SLabel>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '18px', color: T.text, marginBottom: '20px' }}>
            Top 5 topik rentan
          </h2>
          {loading
            ? <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skel key={i} h="32px" rounded="8px" />)}</div>
            : (
              <div className="space-y-4">
                {(summary?.topTopik ?? []).map((t, i) => {
                  const maxVal = summary.topTopik[0]?.jumlah ?? 1;
                  const pct    = Math.round((t.jumlah / maxVal) * 100);
                  return (
                    <motion.div key={t.topics}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.07 }}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: T.text }}>
                          {t.topics}
                          {t.isAnomaly && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                              style={{ background: T.redLt, color: '#791F1F' }}>spike</span>
                          )}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: t.isAnomaly ? T.red : T.blue }}>
                          {t.jumlah?.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.blueLt }}>
                        <motion.div className="h-full rounded-full"
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5 + i * 0.08, duration: 0.7, ease: 'easeOut' }}
                          style={{ background: t.isAnomaly ? T.red : T.blue }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
        </Card>

        <Card>
          <SLabel>Distribusi status</SLabel>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '18px', color: T.text, marginBottom: '20px' }}>
            Komposisi keseluruhan
          </h2>
          {loading ? <Skel h="160px" rounded="12px" /> : (
            <div className="flex items-center gap-6">
              <div style={{ width: 140, height: 140, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieDat} dataKey="jumlah" nameKey="status_hoaks"
                      cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={3}>
                      {pieDat.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: `0.5px solid ${T.blueMid}`, borderRadius: '10px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {pieDat.map((d, i) => {
                  const total = pieDat.reduce((s, x) => s + parseInt(x.jumlah), 0);
                  const pct   = total > 0 ? Math.round((parseInt(d.jumlah) / total) * 100) : 0;
                  return (
                    <div key={d.status_hoaks} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-xs flex-1" style={{ color: T.text }}>{d.status_hoaks}</span>
                      <span className="text-xs font-semibold" style={{ color: T.muted }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── Activity feed ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div>
              <SLabel>Live feed</SLabel>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '18px', color: T.text }}>
                Entri terbaru
              </h2>
            </div>
            <a href="/insight" className="flex items-center gap-1 text-xs font-semibold hover:opacity-70 transition-opacity"
              style={{ color: T.blue }}>
              Lihat semua <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
          {loading
            ? <div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skel key={i} h="56px" rounded="10px" />)}</div>
            : (
              <div className="divide-y" style={{ borderColor: T.border }}>
                {recent.map((item, i) => {
                  const cfg = STATUS_COLORS[item.status_hoaks] || STATUS_COLORS['Unknown'];
                  return (
                    <motion.div key={item.id_fact_hoaks}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 + i * 0.06 }}
                      className="flex items-center gap-4 py-4 group">
                      <div className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ background: cfg.dot }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1" style={{ color: T.text }}>{item.judul}</p>
                        <p className="text-[10px] mt-1 uppercase tracking-wider font-medium" style={{ color: T.muted }}>
                          {item.author} · {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} · {item.topics}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={item.status_hoaks} />
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                          style={{ background: T.blueLt, color: T.blue }}>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          <p className="text-[10px] mt-4 pt-4 border-t" style={{ color: T.muted, borderColor: T.border }}>
            Diperbarui: {refreshed.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </Card>
      </motion.div>

    </div>
  );
};

export default Dashboard;
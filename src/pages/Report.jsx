import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, ReferenceLine, PieChart, Pie
} from 'recharts';
import {
  FileText, Download, Share2, TrendingUp, Activity,
  Globe, ArrowUpRight, ShieldCheck, Calendar,
  Brain, AlertTriangle, ChevronRight
} from 'lucide-react';

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
  gray:    '#888780',
  grayLt:  '#F1EFE8',
  text:    '#1a1a1a',
  muted:   '#888780',
  border:  'rgba(183,212,244,0.5)',
  glass:   'rgba(255,255,255,0.72)',
};

const Card = ({ children, className = '', style = {} }) => (
  <div className={`rounded-3xl p-6 ${className}`}
    style={{ background: T.glass, border: `0.5px solid ${T.border}`, backdropFilter: 'blur(16px)', ...style }}>
    {children}
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: T.muted }}>{children}</p>
);

const Skeleton = ({ h = '20px', w = '100%' }) => (
  <div className="animate-pulse rounded-xl" style={{ height: h, width: w, background: T.blueMid + '40' }} />
);

// ── Pseudo-ML engine ──────────────────────────────────────────
const mlEngine = {
  // Simple linear regression
  linearRegression(data) {
    const n = data.length;
    if (n < 2) return { slope: 0, intercept: data[0] ?? 0, r2: 0 };
    const xMean = (n - 1) / 2;
    const yMean = data.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    data.forEach((y, x) => {
      num += (x - xMean) * (y - yMean);
      den += (x - xMean) ** 2;
    });
    const slope     = den === 0 ? 0 : num / den;
    const intercept = yMean - slope * xMean;
    const yPred     = data.map((_, x) => slope * x + intercept);
    const ssTot     = data.reduce((s, y) => s + (y - yMean) ** 2, 0);
    const ssRes     = data.reduce((s, y, i) => s + (y - yPred[i]) ** 2, 0);
    const r2        = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);
    return { slope, intercept, r2 };
  },

  forecast(data, periods = 3) {
    const { slope, intercept } = this.linearRegression(data);
    const n = data.length;
    return Array.from({ length: periods }, (_, i) =>
      Math.max(0, Math.round(intercept + slope * (n + i)))
    );
  },

  movingAvg(data, window = 3) {
    return data.map((_, i) => {
      const slice = data.slice(Math.max(0, i - window + 1), i + 1);
      return Math.round(slice.reduce((a, b) => a + b, 0) / slice.length);
    });
  },

  detectAnomalies(data, labels, threshold = 2) {
    const mean   = data.reduce((a, b) => a + b, 0) / data.length;
    const stddev = Math.sqrt(data.reduce((s, v) => s + (v - mean) ** 2, 0) / data.length);
    return data.map((v, i) => ({
      label: labels[i], value: v, mean: Math.round(mean),
      zScore: stddev === 0 ? 0 : (v - mean) / stddev,
      isAnomaly: Math.abs(v - mean) > threshold * stddev,
    }));
  },
};

// ── Custom tooltip ────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-4 py-3 text-xs"
      style={{ background: '#fff', border: `0.5px solid ${T.blueMid}`, boxShadow: '0 4px 16px rgba(24,95,165,0.1)' }}>
      <p className="font-bold mb-1" style={{ color: T.text }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? T.blue }}>{p.name}: {p.value?.toLocaleString('id-ID')}</p>
      ))}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────
const Report = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/report/summary')
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Derived ML computations ─────────────────────────────────
  const ml = useMemo(() => {
    if (!data?.trenTahun?.length) return null;
    const years  = data.trenTahun.map(t => t.tahun);
    const counts = data.trenTahun.map(t => t.total);
    const { slope, r2 } = mlEngine.linearRegression(counts);
    const forecastVals  = mlEngine.forecast(counts, 3);
    const movAvg        = mlEngine.movingAvg(counts, 3);
    const anomalies     = mlEngine.detectAnomalies(counts, years, 1.5);

    const forecastMonths = ['Jun 2026', 'Jul 2026', 'Ags 2026'];
    const lastActual     = counts[counts.length - 1];

    // Build combined chart data
    const chartData = years.map((y, i) => ({
      label: String(y), actual: counts[i], mavg: movAvg[i],
      isAnomaly: anomalies[i].isAnomaly,
    }));
    forecastMonths.forEach((m, i) => {
      chartData.push({ label: m, forecast: forecastVals[i], mavg: null });
    });

    return {
      slope: Math.round(slope),
      r2: (r2 * 100).toFixed(1),
      forecastVals,
      forecastMonths,
      lastActual,
      chartData,
      anomalies,
      trend: slope > 0 ? 'naik' : 'turun',
    };
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-6 pb-10">
        <Skeleton h="80px" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} h="120px" />)}
        </div>
        <Skeleton h="280px" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-10">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <SectionLabel>Analitik & Prediksi</SectionLabel>
            <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '28px', color: T.text, lineHeight: 1.1 }}>
              Audit & Reports
            </h1>
            <p className="text-sm mt-1.5" style={{ color: T.muted }}>
              Analisis mendalam penyebaran hoaks + model prediktif.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-full transition-all hover:opacity-70"
              style={{ background: T.blueLt, border: `0.5px solid ${T.blueMid}`, color: T.blue }}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* ── KPI metrics ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Total kasus diaudit',
            value: data?.totalHoaks?.toLocaleString('id-ID') ?? '—',
            icon: <FileText className="w-5 h-5" />,
            detail: `Sejak ${data?.firstYear ?? 2015}`,
            color: T.blue, bg: T.blueLt,
          },
          {
            label: 'Akurasi verifikasi',
            value: data ? `${Math.round((data.verified / data.totalHoaks) * 100)}%` : '—',
            icon: <ShieldCheck className="w-5 h-5" />,
            detail: 'Tingkat akurasi data',
            color: T.green, bg: T.greenLt,
          },
          {
            label: 'Pembaruan terakhir',
            value: data?.lastUpdate
              ? new Date(data.lastUpdate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
              : '—',
            icon: <Calendar className="w-5 h-5" />,
            detail: 'Sinkronisasi database',
            color: '#BA7517', bg: T.amberLt,
          },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
            <Card className="h-full">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: m.bg, color: m.color }}>
                {m.icon}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: T.muted }}>
                {m.label}
              </p>
              <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '32px', color: m.color, lineHeight: 1, marginBottom: '12px' }}>
                {m.value}
              </div>
              <div className="pt-4 border-t text-[10px] font-medium uppercase tracking-widest" style={{ color: T.muted, borderColor: T.border }}>
                {m.detail}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── ML Intelligence banner ── */}
      {ml && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4"
            style={{ background: T.blueLt, border: `0.5px solid ${T.blueMid}` }}>
            <Brain className="w-5 h-5 shrink-0" style={{ color: T.blue }} />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: '#0C447C' }}>
                Model prediktif aktif — Linear Regression (R² = {ml.r2}%)
              </p>
              <p className="text-xs mt-0.5" style={{ color: T.blue }}>
                Tren {ml.trend} ~{Math.abs(ml.slope).toLocaleString('id-ID')} kasus/tahun ·
                {ml.anomalies.filter(a => a.isAnomaly).length} anomali tahun terdeteksi dalam data historis
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ background: T.blue, color: '#fff' }}>
              Pseudo-ML
            </span>
          </div>
        </motion.div>
      )}

      {/* ── Main chart: Trend + Forecast + Moving Avg ── */}
      {ml && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <SectionLabel>Model prediktif</SectionLabel>
                <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '20px', color: T.text }}>
                  Tren historis + Forecast 3 bulan
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm inline-block" style={{ background: T.blue }} />
                  Aktual
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 inline-block" style={{ background: T.green }} />
                  Moving avg
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm inline-block" style={{ background: T.red + '70' }} />
                  Forecast
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ml.chartData} barSize={24} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: T.muted, fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: T.muted, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={ml.chartData.filter(d => d.actual).reduce((s, d) => s + d.actual, 0) / ml.chartData.filter(d => d.actual).length}
                  stroke={T.gray} strokeDasharray="4 2"
                  label={{ value: 'rata-rata', fill: T.muted, fontSize: 9, position: 'right' }} />
                <Bar dataKey="actual" name="Aktual" radius={[4, 4, 0, 0]}>
                  {ml.chartData.map((d, i) => (
                    <Cell key={i}
                      fill={d.isAnomaly ? T.amber : T.blue}
                      opacity={d.actual ? 1 : 0}
                    />
                  ))}
                </Bar>
                <Bar dataKey="forecast" name="Forecast" radius={[4, 4, 0, 0]} fill={T.red + '70'}
                  stroke={T.red} strokeWidth={1} strokeDasharray="4 2" />
                <Line dataKey="mavg" name="Moving avg" type="monotone"
                  stroke={T.green} strokeWidth={2} dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {/* ── Forecast detail + Anomaly ── */}
      {ml && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Forecast detail */}
          <Card>
            <SectionLabel>Prediksi</SectionLabel>
            <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18px', color: T.text, marginBottom: '20px' }}>
              Proyeksi 3 bulan ke depan
            </h2>
            <div className="space-y-0 divide-y" style={{ borderColor: T.border }}>
              {ml.forecastMonths.map((month, i) => {
                const val  = ml.forecastVals[i];
                const prev = i === 0 ? ml.lastActual : ml.forecastVals[i - 1];
                const up   = val >= prev;
                const delta = Math.abs(val - prev);
                return (
                  <motion.div key={month} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 + i * 0.08 }}
                    className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: T.text }}>{month}</p>
                      <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: T.muted }}>
                        <ArrowUpRight className="w-3 h-3" style={{ color: up ? T.red : T.green }} />
                        {up ? '+' : '-'}{delta.toLocaleString('id-ID')} dari sebelumnya
                      </p>
                    </div>
                    <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '22px', color: up ? T.red : T.green }}>
                      ~{val.toLocaleString('id-ID')}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-[10px] mt-4 pt-4 border-t" style={{ color: T.muted, borderColor: T.border }}>
              Metode: Linear regression (slope={ml.slope > 0 ? '+' : ''}{ml.slope}/thn) · R²={ml.r2}%
            </p>
          </Card>

          {/* Anomaly list */}
          <Card>
            <SectionLabel>Anomaly detection</SectionLabel>
            <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18px', color: T.text, marginBottom: '20px' }}>
              Tahun di luar pola normal
            </h2>
            <div className="space-y-3">
              {ml.anomalies.filter(a => a.isAnomaly).length === 0
                ? <p className="text-sm" style={{ color: T.muted }}>Tidak ada anomali terdeteksi dalam data historis.</p>
                : ml.anomalies.filter(a => a.isAnomaly).map((a, i) => (
                  <motion.div key={a.label} initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.07 }}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{ background: a.zScore > 0 ? T.redLt : T.amberLt, border: `0.5px solid ${a.zScore > 0 ? '#F09595' : '#FAC775'}` }}>
                    <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: a.zScore > 0 ? T.red : T.amber }} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: a.zScore > 0 ? '#791F1F' : '#633806' }}>
                        Tahun {a.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: a.zScore > 0 ? T.red : T.amber }}>
                        {a.value.toLocaleString('id-ID')} kasus · z-score: {a.zScore.toFixed(2)} · rata-rata: {a.mean.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </motion.div>
                ))
              }
            </div>
            <p className="text-[10px] mt-4 pt-4 border-t" style={{ color: T.muted, borderColor: T.border }}>
              Threshold: |z-score| &gt; 1.5 · Metode: statistik deskriptif (mean ± σ)
            </p>
          </Card>
        </motion.div>
      )}

      {/* ── Top topik + Sumber ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top topik horizontal bar */}
        <Card>
          <SectionLabel>Distribusi topik</SectionLabel>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18px', color: T.text, marginBottom: '20px' }}>
            Topik paling rentan
          </h2>
          {loading ? <Skeleton h="200px" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data?.topTopik ?? []} layout="vertical" barSize={14}>
                <XAxis type="number" hide />
                <YAxis dataKey="topics" type="category" axisLine={false} tickLine={false}
                  width={90} tick={{ fill: T.muted, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="jumlah" name="Kasus" radius={[0, 4, 4, 0]}>
                  {(data?.topTopik ?? []).map((_, i) => (
                    <Cell key={i} fill={i === 0 ? T.blue : T.blueMid} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Sumber progress */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <SectionLabel>Distribusi sumber</SectionLabel>
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18px', color: T.text }}>
                Sumber dominan
              </h2>
            </div>
            <Globe className="w-5 h-5" style={{ color: T.muted }} />
          </div>
          {loading ? <Skeleton h="160px" /> : (
            <div className="flex-1 space-y-4">
              {(data?.topSumber ?? []).map((s, i) => {
                const pct = data?.totalHoaks
                  ? Math.round((s.jumlah / data.totalHoaks) * 100)
                  : 0;
                return (
                  <motion.div key={s.sumber} initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.07 }}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-medium" style={{ color: T.text }}>{s.sumber}</span>
                      <span className="text-xs font-semibold" style={{ color: T.blue }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.blueLt }}>
                      <motion.div className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.5 + i * 0.08, duration: 0.7, ease: 'easeOut' }}
                        style={{ background: i === 0 ? T.blue : T.blueMid }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── Historical year grid ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <SectionLabel>Rekap historis</SectionLabel>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18px', color: T.text, marginBottom: '20px' }}>
            Data per tahun
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(data?.trenTahun ?? []).map((t, i) => {
              const isAnomaly = ml?.anomalies?.[i]?.isAnomaly;
              return (
                <motion.div key={t.tahun} initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.04 }}
                  className="rounded-2xl p-4 transition-all hover:scale-[1.02] group"
                  style={{
                    background: isAnomaly ? T.amberLt : T.blueLt,
                    border: `0.5px solid ${isAnomaly ? '#FAC775' : T.blueMid}`,
                  }}>
                  <div className="flex justify-between items-start mb-3">
                    <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '20px', color: isAnomaly ? '#633806' : T.blue }}>
                      {t.tahun}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all"
                      style={{ color: isAnomaly ? '#633806' : T.blue }} />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: T.muted }}>
                    Total kasus
                  </p>
                  <p className="text-base font-semibold" style={{ color: isAnomaly ? '#633806' : T.text }}>
                    {t.total?.toLocaleString('id-ID')}
                  </p>
                  {isAnomaly && (
                    <span className="text-[9px] font-bold uppercase tracking-wider mt-2 inline-block px-1.5 py-0.5 rounded-full"
                      style={{ background: T.amberLt, color: '#633806', border: '0.5px solid #FAC775' }}>
                      anomali
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

    </div>
  );
};

export default Report;
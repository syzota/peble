import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Users, AlertTriangle, ArrowUpRight,
  TrendingDown, BarChart2, Map as MapIcon, ArrowLeft, CheckCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';

const API = '';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalHoaks: 0, verified: 0, waiting: 0, hoaks: 0, sources: 0 });
  const [tren, setTren] = useState([]);
  const [topik, setTopik] = useState([]);
  const [beritaTerbaru, setBeritaTerbaru] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, t, tp, bt] = await Promise.all([
          fetch(`${API}/api/dashboard/stats`).then(r => r.json()),
          fetch(`${API}/api/dashboard/tren`).then(r => r.json()),
          fetch(`${API}/api/dashboard/topik`).then(r => r.json()),
          fetch(`${API}/api/dashboard/berita-terbaru`).then(r => r.json()),
        ]);
        setStats(s);
        setTren(t);
        setTopik(tp);
        setBeritaTerbaru(bt);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: 'Total Entri', value: stats.totalHoaks, trend: 'Global', up: true,  icon: AlertTriangle },
    { label: 'Terverifikasi', value: stats.verified,  trend: 'Safe',   up: true,  icon: CheckCircle },
    { label: 'Menunggu',     value: stats.waiting,    trend: 'Audit',  up: false, icon: TrendingDown },
    { label: 'Sumber Data',  value: stats.sources,    trend: 'Active', up: true,  icon: Users },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat pagi';
    if (h < 17) return 'Selamat siang';
    return 'Selamat malam';
  };

  const statusColor = (status) => {
    if (!status) return 'bg-white';
    if (status === 'Hoaks') return 'bg-red-500';
    if (status === 'Verifikasi') return 'bg-green-400';
    return 'bg-yellow-400';
  };

  const formatTanggal = (raw) => {
    if (!raw) return '-';
    const d = new Date(raw);
    const diff = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diff < 60) return `${diff} menit yang lalu`;
    if (diff < 1440) return `${Math.floor(diff / 60)} jam yang lalu`;
    return `${Math.floor(diff / 1440)} hari yang lalu`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 md:pb-6">
      {/* Header */}
      <header className="flex items-center gap-4 mb-10 mt-4 md:mt-0">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white/60 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-heading italic">Our Dashboard</h1>
          <p className="text-white/40 font-body text-sm">
            {greeting()}, {user?.name || 'Pengguna'} · {user?.jabatan || ''}
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            onClick={() => navigate('/insight')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="liquid-glass p-4 rounded-3xl border border-white/5 cursor-pointer hover:border-white/20 active:scale-95 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.up ? 'text-white' : 'text-white/40'} group-hover:scale-110 transition-transform`} />
              <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${stat.up ? 'bg-white/10 text-white' : 'bg-red-500/10 text-red-400'}`}>
                {stat.trend}
              </div>
            </div>
            <div className="text-2xl font-heading italic leading-none mb-1">
              {loading ? '—' : stat.value.toLocaleString()}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest leading-none">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tren Area Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="liquid-glass p-6 rounded-[2rem] border border-white/5 min-h-[350px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-heading italic">Tren Sebaran Informasi</h3>
            <div className="text-xs text-white/40 font-body">12 Bulan Terakhir</div>
          </div>
          <div className="flex-1 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-white/20 text-sm">Memuat...</div>
            ) : tren.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/20 text-sm">Belum ada data tren.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tren}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#FFFFFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFFFFF10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#FFFFFF40', fontSize: 10 }} dy={10} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="val" stroke="#FFFFFF" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Topik Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="liquid-glass p-6 rounded-[2rem] border border-white/5 min-h-[350px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-heading italic">Topik Terbanyak</h3>
            <BarChart2 className="w-5 h-5 text-white/40" />
          </div>
          <div className="flex-1 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-white/20 text-sm">Memuat...</div>
            ) : topik.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/20 text-sm">Belum ada data topik.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topik} layout="vertical" margin={{ left: -20 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#FFFFFF', fontSize: 11, fontWeight: 500 }}
                    width={110}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={16}>
                    {topik.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Peta Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="liquid-glass p-6 rounded-[2rem] border border-white/5 mb-8 overflow-hidden relative"
      >
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h3 className="text-lg font-heading italic">Sebaran Wilayah (GIS)</h3>
            <p className="text-xs text-white/40 font-body">Intensitas isu berdasarkan cakupan wilayah</p>
          </div>
          <button className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-colors">
            <MapIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-white/5 rounded-3xl flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full opacity-30 mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Indonesia_location_map.svg')] bg-center bg-no-repeat bg-contain p-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-white rounded-full mx-auto mb-4 animate-ping opacity-20" />
              <p className="text-sm font-body text-white/40">Visualisasi Geografis Interaktif</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4 pl-1 italic font-heading">
            Entri Terbaru
          </h3>
          <div className="space-y-4">
            {loading ? (
              <div className="py-8 text-center text-white/20 text-sm">Memuat...</div>
            ) : beritaTerbaru.length === 0 ? (
              <div className="py-8 text-center text-white/20 text-sm">Belum ada entri.</div>
            ) : beritaTerbaru.map((item, i) => (
              <div
                key={item.id_berita}
                onClick={() => navigate('/insight')}
                className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${statusColor(item.status_hoaks)}`} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-body text-white/90 group-hover:text-white transition-colors truncate">
                    {item.judul}
                  </h4>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">
                    {formatTanggal(item.tanggal)} · {item.status_hoaks || 'Unknown'}
                  </span>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white transition-all shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4 pl-1 italic font-heading">
            Saran Eksekutif
          </h3>
          <div className="liquid-glass-strong p-6 rounded-[2rem] border border-white/10 flex flex-col gap-6">
            <p className="text-sm font-body text-white/80 leading-relaxed italic">
              "Berdasarkan {stats.totalHoaks} entri tercatat, {stats.verified} telah terverifikasi.
              Terdapat {stats.waiting} entri menunggu audit. Segera tindak lanjuti sebelum menyebar lebih luas."
            </p>
            <button
              onClick={() => navigate('/report')}
              className="w-full bg-white text-black py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all"
            >
              Lihat Laporan Lengkap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
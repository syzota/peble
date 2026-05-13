import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Zap, ArrowLeft, X, ExternalLink } from 'lucide-react';

const API = '';

const Insight = () => {
  const navigate = useNavigate();
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searchTerm, setSearch]   = useState('');
  const [filterOpen, setFilter]   = useState(false);
  const [kategoriList, setKategori] = useState([]);
  const [topikList, setTopik]     = useState([]);
  const [statusList, setStatus]   = useState([]);
  const [selectedKat, setSelKat]  = useState('');
  const [selectedTopik, setSelTopik] = useState('');
  const [selectedStatus, setSelStatus] = useState('');

  // Fetch dimension lists for filters
  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/dim_kategori`).then(r => r.json()),
      fetch(`${API}/api/dim_topik`).then(r => r.json()),
      fetch(`${API}/api/dim_status_hoaks`).then(r => r.json()),
    ]).then(([k, t, s]) => {
      setKategori(k);
      setTopik(t);
      setStatus(s);
    }).catch(console.error);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm)     params.set('q', searchTerm);
      if (selectedKat)    params.set('kategori', selectedKat);
      if (selectedTopik)  params.set('topik', selectedTopik);
      if (selectedStatus) params.set('status', selectedStatus);
      const res = await fetch(`${API}/api/insight?${params}`);
      const rows = await res.json();
      setData(rows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedKat, selectedTopik, selectedStatus]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  const clearFilters = () => {
    setSelKat('');
    setSelTopik('');
    setSelStatus('');
    setFilter(false);
  };

  const hasFilter = selectedKat || selectedTopik || selectedStatus;

  const statusBadge = (s) => {
    if (!s) return 'bg-white/10 text-white/40';
    if (s === 'Hoaks')      return 'bg-red-500/20 text-red-400';
    if (s === 'Verifikasi') return 'bg-green-500/20 text-green-400';
    return 'bg-yellow-500/20 text-yellow-400';
  };

  const formatDate = (raw) => {
    if (!raw) return '-';
    return new Date(raw).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32">
      {/* Header */}
      <header className="flex items-center gap-4 mb-10 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white/60 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-heading italic">Deep Insights</h1>
          <p className="text-white/40 font-body text-sm">
            {loading ? 'Memuat...' : `${data.length} entri ditemukan`}
          </p>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
          <input
            type="text"
            placeholder="Cari judul, isi, topik..."
            value={searchTerm}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-white/30 transition-all font-body"
          />
        </div>
        <button
          onClick={() => setFilter(!filterOpen)}
          className={`p-4 rounded-2xl border transition-all ${hasFilter ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-[2rem] border border-white/10 p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Kategori</label>
            <select
              value={selectedKat}
              onChange={e => setSelKat(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="">Semua Kategori</option>
              {kategoriList.map(k => (
                <option key={k.id_kategori} value={k.id_kategori}>{k.kategori}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Topik</label>
            <select
              value={selectedTopik}
              onChange={e => setSelTopik(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="">Semua Topik</option>
              {topikList.map(t => (
                <option key={t.id_topik} value={t.id_topik}>{t.topics}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelStatus(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="">Semua Status</option>
              {statusList.map(s => (
                <option key={s.id_status_hoaks} value={s.id_status_hoaks}>{s.status_hoaks}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" /> Reset Filter
            </button>
          </div>
        </motion.div>
      )}

      {/* Category Pills (topik quick filter) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar mb-8">
        <button
          onClick={() => setSelTopik('')}
          className={`px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${!selectedTopik ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'}`}
        >
          Semua
        </button>
        {topikList.map(t => (
          <button
            key={t.id_topik}
            onClick={() => setSelTopik(String(t.id_topik))}
            className={`px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedTopik === String(t.id_topik) ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'}`}
          >
            {t.topics}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-5">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/20 text-sm">Memuat data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center text-white/20">
            <Zap className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Tidak ada data ditemukan.</p>
          </div>
        ) : data.map((item, i) => (
          <motion.div
            key={item.id_fact_hoaks}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.5) }}
            className="liquid-glass p-6 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-4 gap-4">
              <div className="bg-white/10 p-3 rounded-2xl shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {item.status_hoaks && (
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${statusBadge(item.status_hoaks)}`}>
                    {item.status_hoaks}
                  </span>
                )}
                {item.kategori && (
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 bg-white/5 text-white/40 rounded-lg">
                    {item.kategori}
                  </span>
                )}
                {item.topics && (
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 bg-white/5 text-white/30 rounded-lg">
                    {item.topics}
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-lg font-heading italic text-white mb-2">{item.judul}</h3>
            <p className="text-sm font-body text-white/60 leading-relaxed line-clamp-2">
              {item.excerpt || item.isi}
            </p>

            <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">
                <span>{item.author || 'Tim PRK'}</span>
                {item.sumber && <span>· {item.sumber}</span>}
                {item.tanggal && <span>· {formatDate(item.tanggal)}</span>}
                {item.nama_tag && <span>· {item.nama_tag}</span>}
              </div>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Sumber
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Insight;
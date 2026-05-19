import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Filter, ChevronDown, ExternalLink,
  Grid2X2, List, Calendar, Tag, Hash, AlertTriangle, Info, X, XCircle
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

const STATUS_CFG = {
  'Hoaks':      { bg: '#FCEBEB', text: '#791F1F', dot: '#E24B4A' },
  'Fakta':      { bg: '#E1F5EE', text: '#085041', dot: '#1D9E75' },
  'Verifikasi': { bg: '#FAEEDA', text: '#633806', dot: '#EF9F27' },
  'Unknown':    { bg: '#F1EFE8', text: '#444441', dot: '#888780' },
};

// Komponen Tombol Baru Sesuai Request
const GradientButton = ({ onClick, children, className = "", icon: Icon }) => (
  <button onClick={onClick}
    className={`relative bg-[#185FA5] text-white text-xs font-semibold px-4 py-2.5 rounded-[12px] shadow-sm hover:shadow-md transition-all overflow-hidden ${className}`}>
    <div className="absolute w-[80%] h-4 left-[10%] top-[1px] bg-gradient-to-b from-[#DEF0FC] to-transparent rounded-[12px] opacity-40 pointer-events-none" />
    <span className="relative z-10 flex items-center justify-center gap-2">
      {children}
      {Icon && <Icon className="w-4 h-4" />}
    </span>
  </button>
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG['Unknown'];
  return (
    <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.text }}>
      {status}
    </span>
  );
};

const FilterPill = ({ value, onChange, options, placeholder, icon }) => {
  const isActive = !!value;
  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        style={{ color: isActive ? '#fff' : T.muted }}>
        {icon}
      </div>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none text-xs font-medium pl-9 pr-9 py-2.5 rounded-[12px] outline-none cursor-pointer transition-all relative overflow-hidden shadow-sm"
        style={{
          background: isActive ? T.blue : '#ffffff',
          color: isActive ? '#fff' : T.text,
          border: `1px solid ${isActive ? T.blue : '#E2E8F0'}`,
        }}>
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: '#fff', color: T.text }}>
            {o.label}
          </option>
        ))}
      </select>
      {/* Efek gradient di dalam dropdown jika aktif */}
      {isActive && (
        <div className="absolute w-[80%] h-4 left-[10%] top-[1px] bg-gradient-to-b from-[#DEF0FC] to-transparent rounded-[12px] opacity-30 pointer-events-none" />
      )}
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none z-10"
        style={{ color: isActive ? '#fff' : T.muted }} />
    </div>
  );
};

const SkeletonCard = () => (
  <div className="rounded-3xl p-5 h-[400px] animate-pulse"
    style={{ background: T.glass, border: `1px solid #E2E8F0` }}>
    <div className="rounded-2xl mb-5 h-44 bg-slate-200" />
    <div className="h-3 rounded w-1/3 mb-3 bg-slate-200" />
    <div className="h-5 rounded w-full mb-2 bg-slate-200" />
    <div className="h-5 rounded w-2/3 bg-slate-200" />
  </div>
);

const InsightGridCard = ({ item, onClick }) => {
  const cfg = STATUS_CFG[item.status_hoaks] || STATUS_CFG['Unknown'];
  return (
    <motion.div layout
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onClick(item)}
      className="rounded-3xl overflow-hidden flex flex-col h-full group cursor-pointer shadow-sm hover:shadow-md transition-shadow bg-white"
      style={{ border: `1px solid #E2E8F0` }}
    >
      <div className="relative aspect-video overflow-hidden" style={{ background: T.blueLt }}>
        {item.main_image_url
          ? <img src={item.main_image_url} alt={item.judul}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          : <div className="w-full h-full flex items-center justify-center" style={{ color: T.blueMid }}>
              <Info className="w-10 h-10" />
            </div>
        }
        <div className="absolute top-3 left-3">
          <StatusBadge status={item.status_hoaks} />
        </div>
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: T.blueLt, color: T.blue }}>
            {item.kategori}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: T.muted }}>
            <Calendar className="w-2.5 h-2.5" />
            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        <h3 className="text-base font-semibold line-clamp-2 mb-3 flex-1 leading-snug group-hover:text-[#185FA5] transition-colors"
          style={{ color: T.text }}>
          {item.judul}
        </h3>

        <p className="text-xs line-clamp-2 mb-5" style={{ color: T.muted, lineHeight: 1.6 }}>
          {item.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>
            {item.author}
          </span>
          <span className="text-[10px] font-bold text-[#185FA5] group-hover:underline">
            Lihat Detail
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const InsightListCard = ({ item, onClick }) => {
  return (
    <motion.div layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={() => onClick(item)}
      className="rounded-2xl p-4 flex items-center gap-4 group cursor-pointer transition-all hover:shadow-md bg-white border border-slate-200"
    >
      <div className="w-24 aspect-video rounded-xl overflow-hidden shrink-0" style={{ background: T.blueLt }}>
        {item.main_image_url
          ? <img src={item.main_image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
          : <div className="w-full h-full flex items-center justify-center" style={{ color: T.blueMid }}>
              <Info className="w-5 h-5" />
            </div>
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <StatusBadge status={item.status_hoaks} />
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>
            {item.kategori} · {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#185FA5] transition-colors" style={{ color: T.text }}>
          {item.judul}
        </h3>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>
          {item.author}
        </span>
        <div className="p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all bg-[#E6F1FB] text-[#185FA5]">
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
};

// --- Komponen Pop-Up Modal ---
const DetailModal = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        {/* Modal Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="w-full h-64 bg-slate-100 relative shrink-0">
          {item.main_image_url ? (
            <img src={item.main_image_url} alt={item.judul} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Info className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center gap-2 mb-4">
            <StatusBadge status={item.status_hoaks} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {item.kategori} · {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 leading-tight">
            {item.judul}
          </h2>

          <div className="prose prose-sm text-slate-600 mb-6">
            <p className="whitespace-pre-line leading-relaxed">{item.excerpt || "Tidak ada deskripsi detail tersedia untuk berita ini."}</p>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Sumber / Author</p>
              <p className="text-sm font-semibold text-slate-800">{item.author || "Tidak Diketahui"}</p>
            </div>

            <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
               <GradientButton icon={ExternalLink}>
                 Kunjungi Sumber Asli
               </GradientButton>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Insight = () => {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState('grid');
  const [search, setSearch]     = useState('');
  const [kategori, setKategori] = useState('');
  const [topik, setTopik]       = useState('');
  const [status, setStatus]     = useState('');

  const [kategoriOpts, setKategoriOpts] = useState([]);
  const [topikOpts, setTopikOpts]       = useState([]);
  const [statusOpts, setStatusOpts]     = useState([]);

  // State untuk Pop-up Detail
  const [selectedItem, setSelectedItem] = useState(null);

  const hasFilter = search || kategori || topik || status;

  useEffect(() => {
    Promise.all([
      fetch('/api/dim_kategori').then(r => r.json()).catch(() => []),
      fetch('/api/dim_topik').then(r => r.json()).catch(() => []),
      fetch('/api/dim_status_hoaks').then(r => r.json()).catch(() => []),
    ]).then(([k, t, s]) => {
      if(k.length) setKategoriOpts(k.map(o => ({ value: o.id_kategori, label: o.kategori })));
      if(t.length) setTopikOpts(t.map(o => ({ value: o.id_topik, label: o.topics })));
      if(s.length) setStatusOpts(s.map(o => ({ value: o.id_status_hoaks, label: o.status_hoaks })));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search)   params.append('q', search);
        if (kategori) params.append('kategori', kategori);
        if (topik)    params.append('topik', topik);
        if (status)   params.append('status', status);

        const res = await fetch(`/api/insight?${params.toString()}`);
        const result = await res.json();

        // Memastikan yang diset ke state adalah array untuk mencegah error mapping
        setData(Array.isArray(result) ? result : []);
      } catch (e) {
        console.error(e);
        setData([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, kategori, topik, status]);

  const clearFilters = () => { setSearch(''); setKategori(''); setTopik(''); setStatus(''); };

  return (
    <div className="space-y-6 pb-24 md:pb-10">
      {/* Header Controls (Teks Judul & Database Count Dihilangkan) */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div className="flex flex-wrap items-center gap-3 flex-1">
            <FilterPill value={kategori} onChange={setKategori} options={kategoriOpts} placeholder="Semua Kategori" icon={<Tag className="w-3.5 h-3.5" />} />
            <FilterPill value={topik} onChange={setTopik} options={topikOpts} placeholder="Semua Topik" icon={<Hash className="w-3.5 h-3.5" />} />
            <FilterPill value={status} onChange={setStatus} options={statusOpts} placeholder="Semua Status" icon={<AlertTriangle className="w-3.5 h-3.5" />} />

            {hasFilter && (
               <GradientButton onClick={clearFilters} icon={XCircle} className="!px-3 bg-slate-700 hover:bg-slate-800">
                 Reset Filter
               </GradientButton>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                style={{ color: search ? T.blue : T.muted }} />
              <input type="text" placeholder="Cari berita atau isu..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="text-sm pl-11 pr-10 py-2.5 rounded-[12px] outline-none w-64 transition-all bg-white"
                style={{ border: `1px solid ${search ? T.blue : '#E2E8F0'}`, color: T.text }}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: T.muted }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex rounded-[12px] p-1 bg-white border border-slate-200">
              {[
                { v: 'grid', icon: <Grid2X2 className="w-4 h-4" /> },
                { v: 'list', icon: <List className="w-4 h-4" /> },
              ].map(({ v, icon }) => (
                <button key={v} onClick={() => setView(v)}
                  className="p-2 rounded-[8px] transition-all"
                  style={{
                    background: view === v ? '#185FA5' : 'transparent',
                    color: view === v ? '#fff' : T.muted,
                  }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : data.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 space-y-4 bg-white/50 rounded-3xl border border-dashed border-slate-300">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ color: T.blueMid }}>
            <Search className="w-7 h-7" />
          </div>
          <p className="text-sm font-medium" style={{ color: T.muted }}>
            Tidak ada data yang ditemukan.
          </p>
          {hasFilter && (
            <button onClick={clearFilters} className="text-xs font-semibold text-[#185FA5] hover:underline">
              Hapus pencarian & filter
            </button>
          )}
        </motion.div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {data.map(item => <InsightGridCard key={item.id_fact_hoaks} item={item} onClick={setSelectedItem} />)}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {data.map(item => <InsightListCard key={item.id_fact_hoaks} item={item} onClick={setSelectedItem} />)}
          </AnimatePresence>
        </div>
      )}

      {/* Render Pop-Up Modal */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Insight;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Edit2, Trash2, Search, X, Save,
  Database, FileText, Tag, Layers, Compass,
  CheckCircle2, AlertCircle, Link, Clock, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = '';

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dim_berita',       label: 'Berita',    icon: FileText,    pk: 'id_berita' },
  { id: 'dim_kategori',     label: 'Kategori',  icon: Layers,      pk: 'id_kategori' },
  { id: 'dim_sumber',       label: 'Sumber',    icon: Compass,     pk: 'id_sumber' },
  { id: 'dim_topik',        label: 'Topik',     icon: Database,    pk: 'id_topik' },
  { id: 'dim_tag',          label: 'Tag',       icon: Tag,         pk: 'id_tag' },
  { id: 'dim_status_hoaks', label: 'Status',    icon: CheckCircle2,pk: 'id_status_hoaks' },
  { id: 'fact_hoaks',       label: 'Fact',      icon: AlertCircle, pk: 'id_fact_hoaks', special: true },
  { id: 'staff',            label: 'Staff',     icon: Shield,      pk: 'id' },
];

// Fields to skip in edit forms
const SKIP_FIELDS = new Set(['id_fact_hoaks', 'id_berita_fk', 'judul', 'slug', 'kategori', 'sumber', 'topics', 'status_hoaks', 'tanggal', 'nama_tag']);

// ─── Fact Hoaks Form (custom, requires dim lookups) ──────────────────────────
const FactForm = ({ editing, onClose, onSuccess }) => {
  const [beritaList, setBerita]   = useState([]);
  const [tagList, setTag]         = useState([]);
  const [sumberList, setSumber]   = useState([]);
  const [topikList, setTopik]     = useState([]);
  const [katList, setKat]         = useState([]);
  const [statusList, setStatus]   = useState([]);
  const [form, setForm] = useState({
    id_berita: '', id_tag: '', id_sumber: '',
    id_topik: '', id_kategori: '', id_status_hoaks: '',
    ...(editing || {}),
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/dim_berita`).then(r => r.json()),
      fetch(`${API}/api/dim_tag`).then(r => r.json()),
      fetch(`${API}/api/dim_sumber`).then(r => r.json()),
      fetch(`${API}/api/dim_topik`).then(r => r.json()),
      fetch(`${API}/api/dim_kategori`).then(r => r.json()),
      fetch(`${API}/api/dim_status_hoaks`).then(r => r.json()),
    ]).then(([b, tg, s, t, k, st]) => {
      setBerita(b); setTag(tg); setSumber(s); setTopik(t); setKat(k); setStatus(st);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url    = editing ? `${API}/api/fact_hoaks/${editing.id_fact_hoaks}` : `${API}/api/fact_hoaks`;
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) { onSuccess(); onClose(); }
  };

  const sel = (label, name, options, valKey, labelKey) => (
    <div key={name} className="space-y-2">
      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">{label}</label>
      <select
        name={name}
        value={form[name] || ''}
        onChange={e => setForm({ ...form, [name]: e.target.value })}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-white/30"
        required
      >
        <option value="">— Pilih {label} —</option>
        {options.map(o => (
          <option key={o[valKey]} value={o[valKey]}>{o[labelKey]}</option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[65vh] overflow-y-auto">
      {sel('Berita',   'id_berita',      beritaList, 'id_berita',       'judul')}
      {sel('Tag',      'id_tag',         tagList,    'id_tag',          'nama_tag')}
      {sel('Sumber',   'id_sumber',      sumberList, 'id_sumber',       'sumber')}
      {sel('Topik',    'id_topik',       topikList,  'id_topik',        'topics')}
      {sel('Kategori', 'id_kategori',    katList,    'id_kategori',     'kategori')}
      {sel('Status',   'id_status_hoaks',statusList, 'id_status_hoaks', 'status_hoaks')}
      <div className="flex items-center gap-4 pt-4">
        <button type="button" onClick={onClose}
          className="flex-1 py-4 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
          Batal
        </button>
        <button type="submit"
          className="flex-1 py-4 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-all">
          <Save className="w-4 h-4" /> Simpan
        </button>
      </div>
    </form>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminManagement = () => {
  const navigate  = useNavigate();
  const { user }  = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard');
  }, [user, navigate]);

  const [activeTab, setActiveTab]   = useState('dim_berita');
  const [data, setData]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [formData, setFormData]     = useState({});

  const currentTab = TABS.find(t => t.id === activeTab);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/${activeTab}`);
      const rows = await res.json();
      setData(rows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const openModal = (item = null) => {
    setEditing(item);
    if (item) {
      setFormData({ ...item });
    } else {
      const init = {};
      if (data.length > 0) {
        Object.keys(data[0]).forEach(k => { if (k !== currentTab.pk) init[k] = ''; });
      }
      setFormData(init);
    }
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setFormData({}); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url    = editing ? `${API}/api/${activeTab}/${editing[currentTab.pk]}` : `${API}/api/${activeTab}`;
    const method = editing ? 'PUT' : 'POST';
    // Strip display-only fields (from fact join)
    const payload = { ...formData };
    if (activeTab === 'fact_hoaks') {
      Object.keys(payload).forEach(k => { if (SKIP_FIELDS.has(k)) delete payload[k]; });
    }
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) { fetchData(); closeModal(); }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data ini?')) return;
    try {
      const res = await fetch(`${API}/api/${activeTab}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = data.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  // Display-friendly column labels
  const colLabel = (k) => k.replace(/^id_/, '').replace(/_/g, ' ');

  // Columns to show in table (hide some verbose ones for fact_hoaks)
  const visibleCols = (item) => {
    if (activeTab !== 'fact_hoaks') return Object.entries(item);
    const SHOW = ['id_fact_hoaks', 'judul', 'kategori', 'sumber', 'topics', 'status_hoaks', 'tanggal', 'nama_tag', 'tahun'];
    return Object.entries(item).filter(([k]) => SHOW.includes(k));
  };

  if (user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8 lg:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-heading italic mb-2">Manajemen Data</h1>
          <p className="text-white/40 text-sm font-body">Kelola semua dimensi dan data.</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-8 border-b border-white/5">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl transition-all whitespace-nowrap text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-white/5 text-white border-b-2 border-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder={`Cari di ${currentTab.label}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-white/30"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="w-full md:w-auto px-8 py-3 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah {currentTab.label}
          </button>
        </div>

        {/* Table */}
        <div className="liquid-glass rounded-[2rem] overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {data.length > 0 && visibleCols(data[0]).map(([key]) => (
                    <th key={key} className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">
                      {colLabel(key)}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr>
                      <td colSpan="100%" className="px-6 py-20 text-center text-white/20">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <p className="text-sm">Memuat data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="100%" className="px-6 py-20 text-center text-white/20 text-sm">
                        Tidak ada data ditemukan.
                      </td>
                    </tr>
                  ) : filtered.map((item, idx) => (
                    <motion.tr
                      key={item[currentTab.pk] ?? idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      {visibleCols(item).map(([key, val]) => (
                        <td key={key} className="px-6 py-4 text-sm font-body text-white/80 max-w-[180px] truncate">
                          {String(val ?? '—')}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(item)}
                            className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item[currentTab.pk])}
                            className="p-2 rounded-lg bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Row count */}
          {!loading && (
            <div className="px-6 py-3 border-t border-white/5 text-[10px] text-white/20 font-body">
              {filtered.length} dari {data.length} entri ditampilkan
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-2xl liquid-glass-strong rounded-[2.5rem] border border-white/10 overflow-hidden"
              >
                <div className="flex items-center justify-between p-8 border-b border-white/10">
                  <h2 className="text-2xl font-heading italic">
                    {editing ? 'Edit' : 'Tambah'} {currentTab.label}
                  </h2>
                  <button onClick={closeModal} className="text-white/40 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Fact hoaks uses special form */}
                {currentTab.special ? (
                  <FactForm editing={editing} onClose={closeModal} onSuccess={fetchData} />
                ) : (
                  <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[65vh] overflow-y-auto">
                    {Object.keys(formData).map(key => {
                      if (key === currentTab.pk) return null;
                      return (
                        <div key={key} className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">
                            {colLabel(key)}
                          </label>
                          {(key === 'isi' || key === 'excerpt') ? (
                            <textarea
                              name={key}
                              value={formData[key] || ''}
                              onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                              rows={4}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/30 font-body text-white/80"
                            />
                          ) : key === 'role' ? (
                            <select
                              name={key}
                              value={formData[key] || ''}
                              onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/30 text-white"
                            >
                              <option value="">— Pilih Role —</option>
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              name={key}
                              value={formData[key] || ''}
                              onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/30 font-body text-white/80"
                            />
                          )}
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-4 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 py-4 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
                      >
                        <Save className="w-4 h-4" /> Simpan Perubahan
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminManagement;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Save, X, ShieldAlert, TriangleAlert, Search } from 'lucide-react';
import { cn } from '../lib/utils';

// Tombol gaya Link Up yang konsisten
const ActiveButton = ({ children, onClick, className, type = "button" }) => (
  <button type={type} onClick={onClick} className={cn("relative group bg-[#0871E7] px-6 py-3 rounded-full text-white font-inter font-bold text-[14px] transition-all shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline-1 outline-[#0871E7] -outline-offset-1 overflow-hidden flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]", className)}>
    <div className="absolute w-[80%] h-4 left-[10%] top-[1px] bg-gradient-to-b from-[#DEF0FC] to-transparent rounded-[12px] group-hover:scale-x-105 transition-transform origin-center" />
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </button>
);

const AdminManagement = () => {
  const [activeTab, setActiveTab] = useState('dim_berita');
  const [data, setData] = useState([]);
  const[search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const[formData, setFormData] = useState({});

  const TABS =[
    { id: 'dim_berita', label: 'Archive Berita', icon: <TriangleAlert size={16} /> },
    { id: 'staff', label: 'User Directory', icon: <ShieldAlert size={16} /> },
  ];

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/${activeTab}`);
      const result = await res.json();
      setData(result);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  // Fungsi untuk mendapatkan ID yang benar dari objek item
  const getId = (item) => item.id || item.id_berita;

  const handleSave = async () => {
      // 1. Debug data sebelum dikirim
      console.log("Data yang dikirim:", JSON.stringify(formData));

      const id = formData.id || formData.id_berita;
      const url = id ? `/api/${activeTab}/${id}` : `/api/${activeTab}`;
      const method = id ? 'PUT' : 'POST';

      console.log("URL tujuan:", url);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // 2. Lihat respon error dari server secara mendetail
      if (!res.ok) {
          const errorDetail = await res.text(); // Ambil pesan error mentah dari server
          console.error("Detail Error dari Server:", errorDetail);
          alert("Server Error! Cek console F12 untuk detailnya.");
      } else {
          setIsEditing(false);
          fetchData();
      }
  };

  const handleDelete = async (item) => {
    if (!confirm('Hapus permanen data ini?')) return;
    const id = getId(item);
    const res = await fetch(`/api/${activeTab}/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  return (
    <div className="space-y-8 pb-20 pt-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 p-1.5 bg-white rounded-full border border-slate-200 w-fit shadow-sm">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("px-6 py-3 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2",
              activeTab === tab.id ? "bg-[#0871E7] text-white" : "text-slate-500 hover:bg-slate-100")}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <input className="px-4 py-3 rounded-full border border-slate-200 w-64 text-sm"
                 placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} />
          <ActiveButton onClick={() => { setFormData({}); setIsEditing(true); }}>
            <Plus className="w-4 h-4" /> Tambah
          </ActiveButton>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-bold uppercase text-slate-400">ID</th>
              <th className="p-6 text-[10px] font-bold uppercase text-slate-400">Judul / Nama</th>
              <th className="p-6 text-[10px] font-bold uppercase text-slate-400">Isi / Dept</th>
              <th className="p-6 text-[10px] font-bold uppercase text-slate-400">Link / User</th>
              <th className="p-6 text-right text-[10px] font-bold uppercase text-slate-400">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.filter(i => JSON.stringify(i).toLowerCase().includes(search.toLowerCase())).map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-6 text-sm font-mono text-slate-500">{getId(item)}</td>
                <td className="p-6 text-sm font-semibold text-slate-900">{item.judul || item.nama_lengkap}</td>
                <td className="p-6 text-sm text-slate-600 truncate max-w-[200px]">{item.isi || item.jabatan}</td>
                <td className="p-6 text-sm text-blue-600 truncate max-w-[150px]">{item.link || item.username}</td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setFormData(item); setIsEditing(true); }} className="p-2 text-[#0871E7] hover:bg-[#E6F1FB] rounded-xl"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(item)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative">
              <button onClick={() => setIsEditing(false)} className="absolute top-8 right-8 text-slate-400 hover:text-black"><X/></button>
              <h2 className="text-xl font-instrument italic mb-6">{formData.id || formData.id_berita ? 'Edit' : 'Tambah'}</h2>

              <div className="space-y-4">
                {activeTab === 'dim_berita' ? (
                  <>
                    <input className="w-full p-4 rounded-2xl bg-slate-50 border" placeholder="Judul" value={formData.judul || ''} onChange={e => setFormData({...formData, judul: e.target.value})} />
                    <textarea className="w-full p-4 rounded-2xl bg-slate-50 border" placeholder="Isi" rows={3} value={formData.isi || ''} onChange={e => setFormData({...formData, isi: e.target.value})} />
                    <input className="w-full p-4 rounded-2xl bg-slate-50 border" placeholder="Link" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} />
                  </>
                ) : (
                  <>
                    <input className="w-full p-4 rounded-2xl bg-slate-50 border" placeholder="Nama Lengkap" value={formData.nama_lengkap || ''} onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} />
                    <input className="w-full p-4 rounded-2xl bg-slate-50 border" placeholder="Username" value={formData.username || ''} onChange={e => setFormData({...formData, username: e.target.value})} />
                    <input type="password" className="w-full p-4 rounded-2xl bg-slate-50 border" placeholder="Password" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} />
                    <input className="w-full p-4 rounded-2xl bg-slate-50 border" placeholder="Kementerian" value={formData.kementerian || ''} onChange={e => setFormData({...formData, kementerian: e.target.value})} />
                  </>
                )}
              </div>
              <ActiveButton className="w-full mt-8" onClick={handleSave}>
                <Save className="w-4 h-4" /> Simpan
              </ActiveButton>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminManagement;
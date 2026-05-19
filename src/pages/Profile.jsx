import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Briefcase, Building2, Shield, LogOut, Lock, X, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [showPwdModal, setShowPwdModal] = useState(false);

  // Style tombol biru konsisten dengan sidebar
  const activeBtnStyle = "relative group bg-[#0871E7] px-6 py-4 rounded-full text-white font-inter font-bold text-[14px] transition-all shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline-1 outline-[#0871E7] -outline-offset-1 overflow-hidden flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0">
      {/* Header Profil */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-500/30">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-5xl font-instrument italic text-[#ffffff] drop-shadow-md">
            {user?.name || 'User'}
          </h1>

          {/* Role badge dengan style tombol biru */}
          <div className="mt-3 px-4 py-1.5 bg-[#0871E7] text-white rounded-full w-fit shadow-[inset_0_-2px_2px_rgba(255,255,255,0.3)]">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {user?.role === 'admin' ? 'Administrator' : 'Staff Member'}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Informasi Diri */}
        <div className="bg-white/60 backdrop-blur-xl border border-white p-10 rounded-[3rem] shadow-sm">
          <h3 className="text-2xl font-instrument italic text-[#1a1a1a] mb-8">Informasi Diri</h3>
          <div className="grid grid-cols-1 gap-8">
            <InfoItem icon={<Briefcase />} label="Jabatan" value={user?.jabatan || '-'} />
            <InfoItem icon={<Building2 />} label="Kementerian" value={user?.kementerian || 'BEM KM UNMUL'} />
            <InfoItem icon={<Shield />} label="Priviledge" value={user?.role === 'admin' ? 'Superuser' : 'User'} />
          </div>
        </div>

        {/* Pengaturan */}
        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-xl border border-white p-10 rounded-[3rem] shadow-sm">
             <h3 className="text-2xl font-instrument italic text-[#1a1a1a] mb-8">Keamanan</h3>
             <button
                onClick={() => setShowPwdModal(true)}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white border border-[#0871E7]/20 text-[#0871E7] font-bold hover:bg-[#E6F1FB] transition-all"
             >
                <Lock className="w-5 h-5" /> Ganti Password
             </button>
          </div>

          {/* Tombol Logout Style Link Up */}
          <button onClick={logout} className={activeBtnStyle}>
            <div className="absolute w-[80%] h-4 left-[10%] top-[1px] bg-gradient-to-b from-[#DEF0FC] to-transparent rounded-[12px]" />
            <span className="relative z-10 flex items-center gap-2">
              Keluar Sesi <LogOut className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>

      <PasswordModal isOpen={showPwdModal} onClose={() => setShowPwdModal(false)} />
    </div>
  );
};

// Password Modal tetap sama
const PasswordModal = ({ isOpen, onClose }) => {
  const[pass, setPass] = useState({ old: '', new: '' });
  const handleUpdate = async () => {
    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pass)
      });
      if (res.ok) { alert('Password berhasil diubah!'); onClose(); }
    } catch (e) { alert('Gagal update password'); }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-instrument italic">Ganti Password</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <input type="password" placeholder="Password Lama" className="w-full p-3 mb-4 bg-slate-100 rounded-xl" onChange={e => setPass({...pass, old: e.target.value})} />
        <input type="password" placeholder="Password Baru" className="w-full p-3 mb-6 bg-slate-100 rounded-xl" onChange={e => setPass({...pass, new: e.target.value})} />
        <button onClick={handleUpdate} className="w-full bg-[#0871E7] text-white py-3 rounded-full font-bold">Simpan</button>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-[#E6F1FB] rounded-2xl text-[#0871E7]">{icon}</div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#888780]">{label}</p>
      <p className="text-sm font-semibold text-[#1a1a1a]">{value}</p>
    </div>
  </div>
);

export default Profile;
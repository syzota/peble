import React from 'react';
import { motion } from 'motion/react';
import { LogOut, User, Lock, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32">
       <div className="flex items-center gap-4 mt-4 md:mt-0 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white/60 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-heading italic text-white/40">Profile Settings</span>
       </div>

       <header className="flex flex-col items-center mb-12">
          <div className="relative group mb-6">
             <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-white/20 to-white/5 border-2 border-white/10 p-1">
                <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                   <span className="text-4xl font-heading italic">
                     {(user?.name || 'A').charAt(0)}
                   </span>
                </div>
             </div>
             <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center border-4 border-black">
                <Shield className="w-4 h-4 fill-current" />
             </div>
          </div>
          <h1 className="text-2xl font-heading italic">{user?.name || 'Admin Pusat'}</h1>
          <p className="text-white/40 font-body text-sm mt-1">{user?.username}@prk.bem.unmul.ac.id</p>
       </header>

       <div className="space-y-4">
          <h3 className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-2 pl-2">Pengaturan Akun</h3>
          
          {[
            { icon: User, label: "Nama", detail: user?.name || "Admin Pusat" },
            { icon: Shield, label: "Kementerian", detail: user?.kementerian || "Riset dan Kajian (RK)" },
            { icon: User, label: "Jabatan", detail: user?.jabatan || "Staff" },
            { icon: Lock, label: "Password", detail: "••••••••" },
          ].map((item, i) => (
            <motion.div 
               key={item.label}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="liquid-glass p-5 rounded-[1.5rem] flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
            >
               <div className="flex items-center gap-4">
                  <div className="bg-white/5 p-2 rounded-xl group-hover:bg-white/10 transition-colors">
                     <item.icon className="w-5 h-5 text-white/60 group-hover:text-white" />
                  </div>
                  <span className="font-body text-sm font-medium">{item.label}</span>
               </div>
               <span className="text-[10px] text-white/20 font-bold uppercase tracking-wider">{item.detail}</span>
            </motion.div>
          ))}

          <button 
            onClick={handleLogout}
            className="w-full mt-8 p-5 rounded-[1.5rem] bg-red-500/5 border border-red-500/10 flex items-center justify-center gap-3 text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all active:scale-95"
          >
             <LogOut className="w-4 h-4" />
             Keluar Sistem
          </button>
       </div>

       <div className="mt-16 text-center">
          <p className="text-white/20 text-[10px] font-body uppercase tracking-[0.3em]">
             Pebble v1.0.4-Stable
          </p>
       </div>
    </div>
  );
};

export default Profile;

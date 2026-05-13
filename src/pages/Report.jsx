import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Clock } from 'lucide-react';

const Report = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col">
      <header className="flex items-center gap-4 mb-auto mt-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white/60 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-heading italic">Executive Report</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center pb-32">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-[2rem] liquid-glass flex items-center justify-center"
        >
          <FileText className="w-10 h-10 text-white/40" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-white/30 text-xs uppercase tracking-widest mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Coming Soon</span>
          </div>
          <h2 className="text-3xl font-heading italic">Sedang Disiapkan</h2>
          <p className="text-white/40 font-body text-sm max-w-xs">
            Fitur laporan eksekutif sedang dalam pengembangan dan akan segera hadir.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Report;
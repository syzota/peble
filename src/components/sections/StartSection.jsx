import React from 'react';
import { motion } from 'motion/react';
import { 
  Wand2, 
  BookOpen, 
  ArrowRight, 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { InfiniteGrid } from '../ui/InfiniteGrid';
import HolographicCard from '../common/HolographicCard';

const StartSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <InfiniteGrid>
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto min-h-screen py-20 flex-col justify-center">
         
         <div className="space-y-6 mb-12">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-slate-900 leading-[0.9] drop-shadow-sm">
            Membangun <br/>
            <span className="font-serif italic text-sky-600">kejernihan informasi</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 max-w-2xl mx-auto font-medium">
            Arsip nasional fakta digital di tengah badai misinformasi.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mt-8">
           <HolographicCard className="p-10 rounded-[3rem] text-left group">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-sky-100">
                <Wand2 size={28} className="text-sky-600" />
              </div>
              <h4 className="text-2xl text-slate-900 font-bold mb-4 font-poppins tracking-tight">
                Intelligent <span className="font-serif italic text-sky-600 font-medium">Processing</span>
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium text-lg">
                Ekstraksi data cerdas untuk mengidentifikasi misinformasi.
              </p>
           </HolographicCard>
           <HolographicCard className="p-10 rounded-[3rem] text-left group">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-sky-100">
                <BookOpen size={28} className="text-sky-600" />
              </div>
              <h4 className="text-2xl text-slate-900 font-bold mb-4 font-poppins tracking-tight">
                Historical <span className="font-serif italic text-sky-600 font-medium">Archive</span>
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium text-lg">
                Dokumentasi permanen penyebaran misinformasi.
              </p>
           </HolographicCard>
        </div>

        {/* Footer Text */}
        <footer className="mt-20 flex flex-col items-center opacity-40 pb-10">
           <span className="text-[10px] tracking-[0.3em] uppercase text-sky-900 font-bold">© 2026 PEBLE ARCHIVE COLLECTION</span>
        </footer>

      </div>
    </InfiniteGrid>
  );
};

export default StartSection;

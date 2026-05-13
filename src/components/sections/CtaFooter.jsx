import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import HlsVideo from '@/components/common/HlsVideo';

const CtaFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative w-full overflow-hidden pt-32 md:pt-48 pb-12 px-6 md:px-8 lg:px-16 flex flex-col items-center min-h-[700px] md:min-h-[900px]">
      {/* Background Video */}
      <HlsVideo 
        src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
        className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 md:opacity-30"
      />

      {/* Overlays */}
      <div className="absolute inset-x-0 top-0 h-[150px] md:h-[200px] bg-gradient-to-b from-black to-transparent z-[1] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[150px] md:h-[200px] bg-gradient-to-t from-black to-transparent z-[1] pointer-events-none" />

      {/* CTA Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-8 md:gap-10 max-w-4xl">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-8xl font-heading italic text-white tracking-tighter leading-[0.9] md:leading-[0.85]"
        >
          Bersama Membangun <br className="hidden sm:block" /> Insight Lebih Bermakna.
        </motion.h2>

        <motion.p
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.3 }}
           className="text-white/60 font-body font-light text-sm md:text-lg max-w-2xl px-2"
        >
          Pebble: Executive Information System internal BEM-KM Unmul. 
          Hubungi tim PRK untuk pengajuan integrasi dataset baru.
        </motion.p>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.5 }}
           className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 w-full sm:w-auto"
        >
          <button 
            onClick={() => navigate('/login')}
            className="liquid-glass-strong rounded-full px-8 py-4 text-base md:text-lg font-medium text-white hover:scale-105 transition-transform active:scale-95"
          >
            Masuk Sekarang
          </button>
          <button 
            onClick={() => navigate('/report')}
            className="bg-white text-black rounded-full px-8 py-4 text-base md:text-lg font-medium hover:bg-white/90 transition-all active:scale-95"
          >
            Panduan Sistem
          </button>
        </motion.div>
      </div>

      {/* Footer Bar */}
      <div className="relative z-10 mt-auto w-full pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto text-center md:text-left">
        <div className="flex items-center gap-4">
           {/* Simple placeholders for logos */}
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">BEM</div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">PRK</div>
           </div>
           <div className="text-white/40 text-[10px] md:text-xs font-body tracking-wider uppercase">
             &copy; 2026 PEBBLE EIS. BEM-KM UNMUL. KEMENTERIAN PRK.
           </div>
        </div>
        <div className="flex items-center gap-6 md:gap-8 text-white/40 text-[10px] md:text-xs font-body font-medium tracking-widest uppercase">
          {["Kebijakan", "Syarat", "Kontak"].map(link => (
            <a key={link} href="#" className="hover:text-white transition-colors">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default CtaFooter;

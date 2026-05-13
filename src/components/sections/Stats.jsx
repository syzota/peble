import React from 'react';
import { motion } from 'motion/react';
import HlsVideo from '@/components/common/HlsVideo';

const STATS = [
  { value: "15+", label: "Kementerian & Unit" },
  { value: "99.9%", label: "Akurasi Data" },
  { value: "2.4K+", label: "Data Mahasiswa" },
  { value: "24/7", label: "Monitoring Sistem" }
];

const Stats = () => {
  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32 px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center min-h-[600px] md:min-h-[800px]">
      {/* Background Video - Desaturated */}
      <HlsVideo 
        src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
        className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 md:opacity-40"
      />

      {/* Overlays */}
      <div className="absolute inset-x-0 top-0 h-[150px] md:h-[200px] bg-gradient-to-b from-black to-transparent z-[1] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[150px] md:h-[200px] bg-gradient-to-t from-black to-transparent z-[1] pointer-events-none" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-6xl liquid-glass rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 lg:p-24"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8 items-center text-center">
          {STATS.map((stat, index) => (
            <div key={stat.label} className="flex flex-col gap-2 md:gap-3">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-3xl md:text-5xl lg:text-7xl font-heading italic text-white tracking-tighter"
              >
                {stat.value}
              </motion.span>
              <motion.span 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.4 + index * 0.1 }}
                 className="text-white/50 font-body font-light text-[10px] md:text-sm uppercase tracking-widest"
              >
                {stat.label}
              </motion.span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Stats;

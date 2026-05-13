import React from 'react';
import { motion } from 'motion/react';
import { Image, MonitorPlay, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FadingVideo from '@/components/common/FadingVideo';
import { useAuth } from '../../context/AuthContext';

const CAPABILITIES = [
  {
    icon: <Zap className="w-6 h-6 text-white" />,
    title: "Integrasi Data",
    description: "Menyatukan berbagai sumber data internal BEM-KM menjadi satu gudang data yang terorganisir.",
    tags: ["Data Warehouse", "Internal Sync", "PRK Hub"],
    path: "/management"
  },
  {
    icon: <MonitorPlay className="w-6 h-6 text-white" />,
    title: "Analisis Informasi",
    description: "Mengolah kerikil-kerikil data mentah menjadi informasi yang bernilai bagi kementerian.",
    tags: ["Pattern Recog", "Deep Insight", "Trend Tracking"],
    path: "/report"
  },
  {
    icon: <Image className="w-6 h-6 text-white" />,
    title: "Visualisasi Insight",
    description: "Menyajikan data dalam bentuk visual interaktif untuk mempermudah pemahaman tim eksekutif.",
    tags: ["GIS Heatmap", "Dynamic Charts", "Executive Dashboard"],
    path: "/dashboard"
  }
];

const StartSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCardClick = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      {/* Background Video */}
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 md:opacity-100"
      />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-32 pb-20 flex flex-col min-h-screen">
        {/* Header */}
        <div className="mb-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xs md:text-sm font-body text-white/80 mb-4 md:mb-6 tracking-widest uppercase drop-shadow-md"
          >
            // Tentang Data Center
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading italic text-white text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[1] md:leading-[0.9] tracking-[-2px] md:tracking-[-3px]"
          >
            Data Center<br className="hidden sm:block" /> PRK BEM-KM
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-white/90 font-body font-light text-sm md:text-lg max-w-2xl mt-6 lg:mt-10"
          >
            Kementerian Penelitian, Riset, dan Kajian (PRK) berfokus pada riset mendalam,
            analisis data strategis, dan pengembangan insight untuk pengambilan keputusan.
          </motion.p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {CAPABILITIES.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col group hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
              onClick={() => handleCardClick(cap.path)}
            >
              {/* Card Top */}
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="w-11 h-11 liquid-glass rounded-[0.75rem] flex items-center justify-center">
                  {cap.icon}
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  {cap.tags.map(tag => (
                    <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1" />

              {/* Card Bottom */}
              <div className="mt-6">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">
                  {cap.title}
                </h3>
                <p className="text-sm text-white/70 font-body font-light leading-snug max-w-[32ch]">
                  {cap.description}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(cap.path);
                  }}
                  className="mt-6 flex items-center gap-2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest">Learn More</span>
                  <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StartSection;

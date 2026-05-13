import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Play, Clock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BlurText from '@/components/common/BlurText';
import FadingVideo from '@/components/common/FadingVideo';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center pt-20 md:pt-24">
      {/* Background Video */}
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4"
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
        style={{ width: "130%", height: "130%" }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center w-full max-w-5xl">
        {/* Badge Pill */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="liquid-glass rounded-full px-1 py-1 flex items-center gap-2 md:gap-3 mb-6 md:mb-8"
        >
          <span className="bg-white text-black rounded-full px-2 md:px-3 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-wider whitespace-nowrap">New</span>
          <span className="text-[11px] md:text-sm font-body pr-3 text-white/90">Executive Information System</span>
        </motion.div>

        {/* Headline */}
        <BlurText
          text="Peble"
          className="text-7xl md:text-8xl lg:text-[10rem] font-heading italic text-white leading-[0.8] max-w-3xl tracking-[-4px] mb-4"
          delay={100}
        />
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl font-heading italic text-white mb-6"
        >
          Data System for Organizations
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-sm md:text-base text-white/80 font-body font-light leading-tight max-w-[280px] sm:max-w-md md:max-w-2xl mb-8 md:mb-10 text-center"
        >
          Mengubah kumpulan data menjadi insight strategis untuk pengambilan keputusan organisasi.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-12 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate('/login')}
            className="liquid-glass-strong rounded-full w-full sm:w-auto px-10 py-4 flex items-center justify-center gap-2 text-white font-medium hover:scale-105 transition-transform active:scale-95"
          >
            Masuk ke Sistem
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="grid grid-cols-2 sm:flex items-stretch gap-3 md:gap-4 w-full sm:w-auto"
        >
          <div className="liquid-glass p-4 md:p-5 w-full sm:w-[200px] md:w-[220px] rounded-[1.25rem] text-left flex flex-col gap-4 md:gap-6">
            <Clock className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[1.5]" />
            <div>
              <div className="text-2xl md:text-4xl font-heading italic text-white tracking-[-1px] leading-none mb-1 whitespace-nowrap">34.5 Min</div>
              <div className="text-[10px] md:text-xs text-white/60 font-body font-light uppercase tracking-wider">Avg Data Sync</div>
            </div>
          </div>
          <div className="liquid-glass p-4 md:p-5 w-full sm:w-[200px] md:w-[220px] rounded-[1.25rem] text-left flex flex-col gap-4 md:gap-6">
            <Globe className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[1.5]" />
            <div>
              <div className="text-2xl md:text-4xl font-heading italic text-white tracking-[-1px] leading-none mb-1 whitespace-nowrap">2.8B+</div>
              <div className="text-[10px] md:text-xs text-white/60 font-body font-light uppercase tracking-wider">Data Points</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Spacer */}
      <div className="pb-12" />
    </section>
  );
};

export default Hero;

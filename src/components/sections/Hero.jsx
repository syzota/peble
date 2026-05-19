import React from 'react';
import { motion } from 'motion/react';
import TypingMessages from '@/components/common/TypingMessages';

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center pt-20 md:pt-24">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260427_054418_a6d194f0-ac86-4df9-abe5-ded73e596d7c.mp4"
      />
      
      {/* Video Overlay Tint */}
      <div className="absolute inset-0 bg-white/5 z-10 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-start pt-8 md:pt-12 px-6 text-center w-full max-w-5xl pointer-events-none">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1 className="font-instrument text-[48px] md:text-[64px] lg:text-[88px] leading-[0.85] tracking-tighter text-[#1a1a1a]">
            National Hoax <br />
            <span className="font-serif italic text-sky-600">Data Archive.</span>
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <p className="font-inter text-[16px] md:text-[20px] text-[#1a1a1a]/80 leading-relaxed max-w-2xl mx-auto font-medium">
            Arsip terpadu informasi misinformasi di seluruh Indonesia. <br className="hidden md:block" />
            Memantau kebenaran dalam riuh digital nasional.
          </p>
        </motion.div>

        {/* Overlay Typing Messages */}
        <div className="w-full opacity-90">
          <TypingMessages />
        </div>
      </div>
    </section>
  );
};

export default Hero;

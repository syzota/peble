import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Music2, Facebook, Twitter, Youtube, Instagram, X, ArrowRight, Shield, BookOpen, HelpCircle } from 'lucide-react';

const CtaFooter = () => {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);

  return (
    <footer className="relative w-full overflow-hidden pt-20 pb-10 flex flex-col items-center">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_101827_abebfeec-f243-466b-b494-7f6814c0fbbf.mp4"
      />
      <div className="absolute inset-0 bg-white/20 z-[1] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl px-6 md:px-10">
        {/* Upper CTA Section */}
        <section className="flex flex-col items-center text-center py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-instrument italic text-[#1a1a1a] tracking-tight leading-[0.9] mb-8">
            Bersama Menjaga <br className="hidden sm:block" /> Kejernihan Informasi.
          </h2>
          <p className="text-[#1a1a1a]/80 font-inter font-bold text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Peble membantu Anda menavigasi lautan data dengan arsip terverifikasi dan analisis mendalam.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="relative group bg-[#0871E7] px-10 py-4 rounded-full text-white font-sans font-medium text-lg transition-all shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline-1 outline-[#0871E7] -outline-offset-1 overflow-hidden"
            >
              <div className="absolute w-[80%] h-4 left-[10%] top-[1px] bg-gradient-to-b from-[#DEF0FC] to-transparent rounded-[12px] group-hover:scale-x-105 transition-transform origin-center" />
              <span className="relative z-10">Cari Tau</span>
            </button>
            <button
              onClick={() => setShowGuide(true)}
              className="bg-white/40 backdrop-blur-md border border-black/10 text-[#1a1a1a] px-10 py-4 rounded-full text-lg font-medium hover:bg-white/60 transition-all flex items-center gap-2"
            >
              <HelpCircle className="w-5 h-5" />
              Panduan Sistem
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer Pill */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="w-[95%] md:w-full max-w-5xl mx-auto backdrop-blur-2xl rounded-full px-8 py-3 flex items-center justify-between border border-black/5 bg-white/40 mt-12 mb-8 gap-4 shadow-lg"
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor" className="text-[#1a1a1a]">
            <path d="M 4.688 136 C 68.373 136 120 187.627 120 251.312 C 120 252.883 119.967 254.445 119.905 256 L 0 256 L 0 136.096 C 1.555 136.034 3.117 136 4.688 136 Z M 251.312 136 C 252.883 136 254.445 136.034 256 136.096 L 256 256 L 136.095 256 C 136.032 254.438 136.001 252.875 136 251.312 C 136 187.627 187.627 136 251.312 136 Z M 119.905 0 C 119.967 1.555 120 3.117 120 4.688 C 120 68.373 68.373 120 4.687 120 C 3.117 120 1.555 119.967 0 119.905 L 0 0 Z M 256 119.905 C 254.445 119.967 252.883 120 251.312 120 C 187.627 120 136 68.373 136 4.687 C 136 3.117 136.033 1.555 136.095 0 L 256 0 Z" />
          </svg>
          <span className="text-lg font-instrument italic tracking-tight text-[#1a1a1a] text-shadow-glow">peble.</span>
        </div>

        {/* Center: Links */}
        <div className="hidden sm:flex items-center gap-8 text-[#1a1a1a]/60 font-inter font-bold text-[13px] text-shadow-glow">
          {["Privacy", "Terms", "Contact"].map(link => (
            <a key={link} href="#" className="hover:text-[#1a1a1a] transition-colors">
              {link}
            </a>
          ))}
        </div>

        {/* Right: Copyright & Social */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex gap-3 md:gap-4">
            {[Instagram, Twitter, Youtube].map((Icon, idx) => (
              <a key={idx} href="#" className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
          <p className="hidden md:block text-[11px] text-[#1a1a1a]/40 font-inter font-bold text-shadow-glow">
            &copy; 2026 PEBLE.
          </p>
        </div>
      </motion.footer>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuide(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowGuide(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-all"
              >
                <X className="w-6 h-6 text-[#1a1a1a]" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#0871E7] rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-instrument italic text-[#1a1a1a]">Panduan Sistem Peble</h3>
                  <p className="text-sm text-[#1a1a1a]/60">Pelajari cara menggunakan arsip hoaks nasional</p>
                </div>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar text-[#1a1a1a]">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0871E7]/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-[#0871E7]">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Pencarian Data</h4>
                    <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">
                      Gunakan fitur pencarian di dashboard untuk memfilter data berdasarkan kategori, platform, atau rentang waktu tertentu.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0871E7]/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-[#0871E7]">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Status Verifikasi</h4>
                    <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">
                      Perhatikan label warna: Hijau (Fakta), Merah (Hoaks), Kuning (Perlu Verifikasi), dan Biru (Satir).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0871E7]/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-[#0871E7]">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Kontribusi Data</h4>
                    <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">
                      Sebagai kontributor terdaftar, Anda dapat menambahkan temuan hoaks baru dengan melampirkan bukti screenshot atau link referensi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-black/5">
                <button
                  onClick={() => setShowGuide(false)}
                  className="w-full bg-[#0871E7] text-white py-4 rounded-full font-medium hover:bg-[#0871E7]/90 transition-all flex items-center justify-center gap-2"
                >
                  Saya Mengerti
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </footer>
  );
};

export default CtaFooter;

import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, PieChart, Activity, Database, LayoutDashboard, Share2 } from 'lucide-react';
import HolographicCard from '../common/HolographicCard';

const FEATURE_CARDS = [
  {
    icon: Database,
    title: "Arsip Masif",
    description: "Basis data yang memuat ribuan entri misinformasi terverifikasi di seluruh Indonesia.",
    path: "/dashboard"
  },
  {
    icon: PieChart,
    title: "Demografi Hoaks",
    description: "Analisis persebaran hoaks berdasarkan rentang usia, lokasi, dan platform penyebaran.",
    path: "/dashboard"
  },
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Sistem pendeteksi dini isu-isu yang berpotensi menjadi misinformasi viral.",
    path: "/insight"
  },
  {
    icon: BarChart3,
    title: "Studi Kasus Politik",
    description: "Kajian mendalam mengenai pola hoaks dalam narasi politik nasional.",
    path: "/report"
  },
  {
    icon: Share2,
    title: "Laporan Terbuka",
    description: "Akses data terbuka untuk peneliti dan jurnalis guna menekan angka misinformasi.",
    path: "/insight"
  },
  {
    icon: LayoutDashboard,
    title: "Fact-Check Hub",
    description: "Kolaborasi verifikasi dengan berbagai lembaga cek fakta independen Indonesia.",
    path: "/dashboard"
  }
];

const FeaturesGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_074327_a4d6275d-82d9-4c83-bfbe-f1fb2213c17c.mp4"
      />
      
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-white/20 z-10 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-16 md:mb-24 text-center items-center">
          <span className="text-xs font-semibold text-sky-900/40 uppercase tracking-[0.3em]">
            Data-Driven Mission
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9] text-center max-w-4xl font-instrument">
            <span className="text-slate-900">Melawan Disinformasi Dengan</span><br className="hidden sm:block" /> 
            <span className="bg-gradient-to-r from-sky-600 via-sky-400 to-sky-600 bg-[length:200%_auto] text-transparent bg-clip-text animate-shine font-bold italic drop-shadow-sm">
               Kekuatan Data.
            </span>
          </h2>
        </div>

        {/* 3-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURE_CARDS.map((card, index) => (
            <HolographicCard
              key={card.title}
              className="rounded-[3rem] p-10 flex flex-col gap-8 group cursor-pointer border border-white/40 shadow-2xl hover:bg-white/30 transition-all backdrop-blur-3xl"
            >
              <div 
                onClick={() => navigate(card.path)}
                className="flex flex-col gap-8 h-full"
              >
                <div className="w-14 h-14 bg-sky-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-3 transition-transform">
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </HolographicCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;

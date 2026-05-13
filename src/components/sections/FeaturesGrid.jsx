import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, PieChart, Activity, Database, LayoutDashboard, Share2 } from 'lucide-react';

const FEATURE_CARDS = [
  {
    icon: LayoutDashboard,
    title: "Dashboard Analitik",
    description: "Visualisasi performa real-time organisasi BEM-KM Unmul.",
    path: "/dashboard"
  },
  {
    icon: PieChart,
    title: "Visualisasi Data",
    description: "Peta interaktif dan chart dinamis untuk data kementerian.",
    path: "/dashboard"
  },
  {
    icon: Activity,
    title: "Insight Hoaks",
    description: "Pemantauan tren hoaks nasional secara akurat.",
    path: "/insight"
  },
  {
    icon: BarChart3,
    title: "Executive Report",
    description: "Laporan ringkas dan mendalam untuk pimpinan eksekutif.",
    path: "/report"
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Kelola set data besar dengan mudah dan terstuktur.",
    path: "/dashboard"
  },
  {
    icon: Share2,
    title: "Monitoring Tren",
    description: "Pantau isu-isu terkini yang beredar di mahasiswa.",
    path: "/insight"
  }
];

const FeaturesGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 mb-16 md:mb-24 text-center md:text-left">
        <span className="text-xs font-medium text-white/40 uppercase tracking-[0.3em]">
          Core Capabilities
        </span>
        <h2 className="text-4xl md:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
          Sistem Informasi Eksekutif<br className="hidden sm:block" /> Berbasis Data.
        </h2>
      </div>

      {/* 3-column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {FEATURE_CARDS.map((card, index) => (
  <div
    key={card.title}
    // 1. Fungsi onClick dihapus agar tidak bisa pindah halaman
    // 2. cursor-pointer dihapus agar kursor tidak berubah jadi tangan
    // 3. hover & active effect dihapus agar card benar-benar diam
    className="liquid-glass rounded-3xl p-8 flex flex-col gap-6 group"
  >
    <div className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center">
      <card.icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex flex-col gap-3">
      <h3 className="text-xl font-heading font-medium italic text-white">
        {card.title}
      </h3>
      <p className="text-white/50 font-body font-light text-sm leading-relaxed">
        {card.description}
      </p>
    </div>
  </div>
))}
      </div>
    </section>
  );
};

export default FeaturesGrid;
import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const FeaturesChess = () => {
  const navigate = useNavigate();
  return (
    <section className="py-32 px-8 lg:px-16 flex flex-col gap-32 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-6 mb-8">
        <div className="liquid-glass rounded-full px-4 py-1.5 text-xs font-medium text-white uppercase tracking-widest font-body">
          Capabilities
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
          Pro features. Zero complexity.
        </h2>
      </div>

      {/* Row 1: Content Left / Image Right */}
      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 flex flex-col items-start gap-8"
        >
          <h3 className="text-3xl md:text-4xl font-heading italic text-white leading-tight">
            Designed to convert. <br /> Built to perform.
          </h3>
          <p className="text-white/60 font-body font-light text-base md:text-lg leading-relaxed">
            Every pixel is intentional. Our AI studies what works across thousands 
            of top sites&mdash;then builds yours to outperform them all.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="liquid-glass-strong rounded-full px-6 py-2.5 text-sm font-medium text-white hover:scale-105 transition-transform"
          >
            Learn more
          </button>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex-1 w-full"
        >
          <div className="liquid-glass rounded-3xl overflow-hidden aspect-square lg:aspect-video relative group">
            <img 
              src="https://motionsites.ai/assets/hero-finlytic-preview-CV9g0FHP.gif" 
              alt="Feature 1" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </div>

      {/* Row 2: Content Right / Image Left */}
      <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 flex flex-col items-start gap-8"
        >
          <h3 className="text-3xl md:text-4xl font-heading italic text-white leading-tight">
            It gets smarter. <br /> Automatically.
          </h3>
          <p className="text-white/60 font-body font-light text-base md:text-lg leading-relaxed">
            Your site evolves on its own. AI monitors every click, scroll, and 
            conversion&mdash;then optimizes in real time. No manual updates. Ever.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="liquid-glass-strong rounded-full px-6 py-2.5 text-sm font-medium text-white hover:scale-105 transition-transform"
          >
            See how it works
          </button>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex-1 w-full"
        >
          <div className="liquid-glass rounded-3xl overflow-hidden aspect-square lg:aspect-video relative group">
            <img 
              src="https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif" 
              alt="Feature 2" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesChess;

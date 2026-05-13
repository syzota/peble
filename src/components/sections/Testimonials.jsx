import React from 'react';
import { motion } from 'motion/react';

const TESTIMONIALS = [
  {
    quote: "A complete rebuild in five days. The result outperformed everything we'd spent months building before.",
    author: "Sarah Chen",
    role: "CEO, Luminary"
  },
  {
    quote: "Conversions up 4x. That's not a typo. The design just works differently when it's built on real data.",
    author: "Marcus Webb",
    role: "Head of Growth, Arcline"
  },
  {
    quote: "They didn't just design our site. They defined our brand. World-class doesn't begin to cover it.",
    author: "Elena Voss",
    role: "Brand Director, Helix"
  }
];

const Testimonials = () => {
  return (
    <section className="py-32 px-8 lg:px-16 max-w-7xl mx-auto flex flex-col gap-16">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-6">
        <div className="liquid-glass rounded-full px-4 py-1.5 text-xs font-medium text-white uppercase tracking-widest font-body">
          What They Say
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
          Don't take our word for it.
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, index) => (
          <motion.div
            key={t.author}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="liquid-glass rounded-3xl p-10 flex flex-col justify-between gap-12 group hover:translate-y-[-4px] transition-transform"
          >
            <p className="text-white/80 font-body font-light text-lg italic leading-relaxed">
              "{t.quote}"
            </p>
            <div className="flex flex-col gap-1">
              <span className="text-white font-body font-medium text-sm">
                {t.author}
              </span>
              <span className="text-white/50 font-body font-light text-xs uppercase tracking-wider">
                {t.role}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

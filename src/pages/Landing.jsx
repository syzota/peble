import React from 'react';
import Navbar from '../components/sections/Navbar';
import Hero from '../components/sections/Hero';
import FeaturesGrid from '../components/sections/FeaturesGrid';
import Stats from '../components/sections/Stats';
import CtaFooter from '../components/sections/CtaFooter';
import { InfiniteGrid } from '../components/ui/InfiniteGrid';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <Navbar />
      <InfiniteGrid>
        <main className="relative">
          {/* 1. Hero */}
          <section id="home">
            <Hero />
          </section>

          {/* 2. Fitur - FeaturesGrid */}
          <section id="fitur">
            <FeaturesGrid />
          </section>

          {/* 3. Stats */}
          <section id="static">
            <Stats />
          </section>

          {/* 4. CtaFooter */}
          <section id="start">
            <CtaFooter />
          </section>
        </main>
      </InfiniteGrid>
    </div>
  );
};

export default Landing;

import React from 'react';
import Navbar from '../components/sections/Navbar';
import Hero from '../components/sections/Hero';
import StartSection from '../components/sections/StartSection';
import FeaturesGrid from '../components/sections/FeaturesGrid';
import Stats from '../components/sections/Stats';
import CtaFooter from '../components/sections/CtaFooter';

const Landing = () => {
 return (
  <div className="min-h-screen bg-black">
    <Navbar />
    <main className="relative z-10">
      {/* 1. Home */}
      <section id="home">
        <Hero />
      </section>

      <div className="bg-black relative z-1">
        {/* 2. About */}
        <section id="about">
          <StartSection />
        </section>

        {/* 3. Fitur */}
        <section id="fitur">
          <FeaturesGrid />
        </section>

        {/* 4. Static */}
        <section id="static">
          <Stats />
        </section>

        {/* 5. Start (Section Terakhir) */}
        <section id="start">
          <CtaFooter />
        </section>
      </div>
    </main>
  </div>
);
};

export default Landing;

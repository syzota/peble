import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';

const DashboardLayout = () => {
  return (
    <div
      className="min-h-screen overflow-x-hidden selection:bg-[#185FA5] selection:text-white"
      style={{
        backgroundImage: 'url(/sky.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <DesktopSidebar />

      <main className="relative z-10 max-w-7xl mx-auto md:pl-20 lg:pl-64 transition-all px-4 md:px-8 py-8">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
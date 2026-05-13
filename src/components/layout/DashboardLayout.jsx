import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden selection:bg-white selection:text-black">
      <DesktopSidebar />
      
      <main className="max-w-7xl mx-auto md:pl-20 lg:pl-64 transition-all">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardLayout;

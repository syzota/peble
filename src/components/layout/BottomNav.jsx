import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FileText, User, Home, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { icon: Home,            label: 'Portal',  path: '/' },
    { icon: LayoutDashboard, label: 'Beranda', path: '/dashboard' },
    { icon: BarChart3,       label: 'Insight', path: '/insight' },
    { icon: FileText,        label: 'Laporan', path: '/report' },
    ...(isAdmin ? [{ icon: Database, label: 'Data', path: '/management' }] : []),
    { icon: User,            label: 'Profil',  path: '/profile' },
  ];

  return (
    <nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-sm rounded-full px-5 py-3 flex items-center justify-between z-50 md:hidden"
      style={{
        background: 'rgba(255,255,255,0.85)',
        border: '0.5px solid rgba(183,212,244,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(24,95,165,0.08)',
      }}
    >
      {navItems.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={path}
          to={path}
          className="flex flex-col items-center gap-1 transition-all"
          style={({ isActive }) => ({
            color: isActive ? '#185FA5' : '#B4B2A9',
          })}
        >
          <Icon className="w-5 h-5" />
          <span className="text-[9px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
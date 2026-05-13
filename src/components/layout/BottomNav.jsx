import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FileText, User, Home, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { icon: Home,           label: 'Portal',   path: '/' },
    { icon: LayoutDashboard,label: 'Beranda',  path: '/dashboard' },
    { icon: BarChart3,      label: 'Insight',  path: '/insight' },
    { icon: FileText,       label: 'Laporan',  path: '/report' },
    ...(isAdmin ? [{ icon: Database, label: 'Data', path: '/management' }] : []),
    { icon: User,           label: 'Profil',   path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm liquid-glass rounded-full px-6 py-3 flex items-center justify-between z-50 md:hidden shadow-2xl border border-white/10">
      {navItems.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `
            flex flex-col items-center gap-1 transition-all
            ${isActive ? 'text-white' : 'text-white/40 hover:text-white/60'}
          `}
        >
          <Icon className="w-6 h-6" />
          <span className="text-[10px] font-medium font-body">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
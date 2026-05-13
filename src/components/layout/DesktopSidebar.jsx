import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FileText, User, Shield, Home, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DesktopSidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { icon: Home, label: 'Portal Utama', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart3, label: 'Deep Insights', path: '/insight' },
    { icon: FileText, label: 'Reports', path: '/report' },
    ...(isAdmin ? [{ icon: Database, label: 'Management', path: '/management' }] : []),
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-20 lg:w-64 h-screen fixed left-0 top-0 bg-black border-r border-white/5 z-40 py-8 px-4 lg:px-6">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center shrink-0">
          <span className="text-xl font-heading italic text-white lowercase">p</span>
        </div>
        <span className="hidden lg:block font-heading italic text-lg text-white">Pebble EIS</span>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group
              ${isActive
                ? 'bg-white text-black'
                : 'text-white/40 hover:bg-white/5 hover:text-white'}
            `}
          >
            <Icon className="w-6 h-6 shrink-0" />
            <span className="hidden lg:block text-sm font-medium font-body">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info Card */}
      <div className="mt-auto px-2">
        <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-heading italic text-white">
              {(user?.name || 'U').charAt(0)}
            </span>
          </div>
          <div className="hidden lg:block overflow-hidden">
            <div className="text-xs font-bold text-white truncate">{user?.name || 'User'}</div>
            <div className="text-[10px] text-white/30 truncate">
              {user?.jabatan || 'Staff'} · {user?.role === 'admin' ? 'Admin' : 'User'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FileText, User, Home, Database, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DesktopSidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems =[
    { icon: Home,            label: 'Portal Utama',  path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard',     path: '/dashboard' },
    { icon: BarChart3,       label: 'Details', path: '/insight' },
    { icon: FileText,        label: 'Reports',       path: '/report' },
    ...(isAdmin ? [{ icon: Database, label: 'Management', path: '/management' }] :[]),
    { icon: User,            label: 'Profile',       path: '/profile' },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-20 lg:w-64 h-screen fixed left-0 top-0 z-40 py-8 px-3 lg:px-5 transition-all"
      style={{
        background: 'rgba(255,255,255,0.72)',
        borderRight: '0.5px solid rgba(183,212,244,0.6)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: '#f0f9ff', border: '0.5px solid #B5D4F4' }}>
          <img src="/favicon.svg" alt="Logo" className="w-5 h-5" />
        </div>
        <span className="hidden lg:block text-lg tracking-tight text-[#1a1a1a]"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          peble.
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive
                ? "relative group bg-[#0871E7] px-4 py-2.5 rounded-full text-white font-inter font-bold text-[14px] transition-all shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline-1 outline-[#0871E7] -outline-offset-1 overflow-hidden flex items-center gap-3"
                : "flex items-center gap-3 px-4 py-3 rounded-2xl text-[#4B4B4B] hover:bg-[#E6F1FB] transition-all"
            }
          >
            {({ isActive }) => (
              <>
                {/* Efek gradient hanya muncul saat aktif */}
                {isActive && (
                  <div className="absolute w-[80%] h-4 left-[10%] top-[1px] bg-gradient-to-b from-[#DEF0FC] to-transparent rounded-[12px] group-hover:scale-x-105 transition-transform origin-center" />
                )}

                <Icon className="w-5 h-5 shrink-0 relative z-10" />
                <span className={`hidden lg:block text-sm ${isActive ? 'font-bold' : 'font-medium'} relative z-10`}>
                  {label}
                </span>

                {isActive && <ArrowUpRight className="hidden lg:block w-4 h-4 ml-auto relative z-10" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="mt-auto px-1">
        <div className="rounded-2xl p-3 flex items-center gap-3"
          style={{ background: '#E6F1FB', border: '0.5px solid #B5D4F4' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            style={{ background: '#185FA5', color: '#fff' }}>
            {user?.nama_lengkap ? user.nama_lengkap.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden lg:block overflow-hidden">
            <div className="text-xs semibold text-[#1a1a1a] truncate">
              {user?.name || 'User'}
            </div>
            <div className="text-[10px] text-[#555] truncate font-medium">
              {user?.jabatan || 'Staff'} · {user?.role === 'admin' ? 'Admin' : 'User'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
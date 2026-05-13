import React, { useState } from 'react';
import { ArrowUpRight, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userLinks = [
    { label: "Home", href: "home" },
    { label: "About", href: "about" },
    { label: "Fitur", href: "fitur" },
    { label: "Static", href: "static" },
    { label: "Start", href: "start" }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname !== '/') {
      navigate('/#' + href);
      // Wait for navigation and potential page load
      setTimeout(() => {
        const element = document.getElementById(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      const element = document.getElementById(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 md:top-4 left-0 right-0 z-50 px-4 md:px-8 lg:px-16 py-4 md:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="w-10 h-10 md:w-12 md:h-12 rounded-full liquid-glass flex items-center justify-center">
          <span className="text-xl md:text-2xl font-heading italic text-white lowercase">p</span>
        </Link>

        {/* Center: Navigation Pill (Desktop) */}
        <div className="hidden md:flex items-center liquid-glass rounded-full px-1.5 py-1.5 gap-1 shadow-2xl">
          {userLinks.map((link) => (
            <a
              key={link.label}
              href={`#${link.href}`}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="ml-2 bg-white/10 text-white rounded-full px-5 py-2 text-sm font-medium flex items-center gap-1.5 whitespace-nowrap hover:bg-white/20 transition-all border border-white/10"
            >
              Keluar
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <Link to="/login" className="ml-2 bg-white text-black rounded-full px-5 py-2 text-sm font-medium flex items-center gap-1.5 whitespace-nowrap hover:bg-white/90 transition-all">
              Masuk Sistem
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Right: Mobile Menu Toggle / Balance Spacer */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className="hidden md:block w-12 h-12 invisible" aria-hidden="true" />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
            />
            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-xs liquid-glass-strong z-[70] md:hidden border-l border-white/10 p-8 flex flex-col gap-8 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between">
                <Link to="/" onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center">
                  <span className="text-xl font-heading italic text-white lowercase">p</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6 mt-8">
                {userLinks.map((link) => (
                  <a
                    key={link.label}
                    href={`#${link.href}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-2xl font-heading italic text-white/90 hover:text-white tracking-tight"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="mt-auto">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full bg-white/10 text-white border border-white/10 rounded-full py-4 font-medium flex items-center justify-center gap-2"
                  >
                    Keluar
                    <LogOut className="w-5 h-5" />
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full bg-white text-black rounded-full py-4 font-medium flex items-center justify-center gap-2">
                    Masuk ke Sistem
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

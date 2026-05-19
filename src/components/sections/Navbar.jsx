import React, { useState } from 'react';
import { ArrowUpRight, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userLinks = [
    { label: "Home", href: "home" },
    { label: "Fitur", href: "fitur" },
    { label: "Static", href: "static" },
    { label: "Start", href: "start" }
  ];

  const handleNavClick = (e, href) => {
  e.preventDefault();
  setIsOpen(false);

  const performScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      
      const offset = (id === 'fitur') ? -70 : 0; 

      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  if (location.pathname !== '/') {
    navigate('/#' + href);
    setTimeout(() => performScroll(href), 300);
  } else {
    performScroll(href);
  }
};

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 pointer-events-none">
        <nav className="pointer-events-auto backdrop-blur-md rounded-full px-8 py-3 flex items-center justify-between border border-black/10 transition-all">
          {/* Left: Logo */}
          <Link to="/" className="font-instrument text-[28px] tracking-tight text-[#1a1a1a]">
            peble.
          </Link>

          {/* Center: Navigation (Desktop) */}
          <div className="hidden md:flex items-center gap-10">
                {userLinks.map((link) => (
              <a
                key={link.label}
                href={`#${link.href}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-inter font-bold text-[14px] text-[#1a1a1a] hover:opacity-60 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: Action Button */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-[14px] font-sans text-[#1a1a1a] hover:opacity-60 transition-opacity flex items-center gap-2"
              >
                Log Out
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link 
                to="/login" 
                className="relative group bg-[#0871E7] px-6 py-2.5 rounded-full text-white font-inter font-bold text-[14px] transition-all shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline-1 outline-[#0871E7] -outline-offset-1 overflow-hidden"
              >
                <div className="absolute w-[80%] h-4 left-[10%] top-[1px] bg-gradient-to-b from-[#DEF0FC] to-transparent rounded-[12px] group-hover:scale-x-105 transition-transform origin-center" />
                <span className="relative z-10 flex items-center gap-2">
                  Link up
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            )}
            
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden ml-4 text-[#1a1a1a] hover:opacity-60 transition-opacity"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
            />
            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-white z-[70] md:hidden border-l border-black/10 p-8 flex flex-col gap-8 shadow-[-20px_0_50px_rgba(0,0,0,0.1)]"
            >
              <div className="flex items-center justify-between">
                <Link to="/" onClick={() => setIsOpen(false)} className="font-instrument text-[28px] tracking-tight text-[#1a1a1a]">
                  peble.
                </Link>
                <button onClick={() => setIsOpen(false)} className="text-black/60 hover:text-black">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6 mt-8">
                {userLinks.map((link) => (
                  <a
                    key={link.label}
                    href={`#${link.href}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-2xl font-instrument text-[#1a1a1a] hover:opacity-60 transition-opacity tracking-tight"
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
                    className="w-full bg-[#0871E7] text-white rounded-full py-4 font-sans text-sm font-medium flex items-center justify-center gap-2"
                  >
                    Log Out
                    <LogOut className="w-5 h-5" />
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full bg-[#0871E7] text-white rounded-full py-4 font-sans text-sm font-medium flex items-center justify-center gap-2 shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)]">
                    Link up
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

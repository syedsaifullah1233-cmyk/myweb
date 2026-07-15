import { useState, useEffect } from 'react';
import { Menu, X, MoreVertical, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenLogin: () => void;
  isAdmin: boolean;
  onLogout: () => void;
  onOpenDashboard: () => void;
}

export default function Navbar({ onOpenLogin, isAdmin, onLogout, onOpenDashboard }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Live Projects', href: '#live-projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/5 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo - Infinite Scalable vector SVG */}
        <a href="#home" className="flex items-center gap-3 group">
          <img
            src="/logo_icon.svg"
            alt="Aura Pixel Icon"
            className="w-9 h-9 transition-transform duration-500 group-hover:rotate-12"
            referrerPolicy="no-referrer"
          />
          <span className="font-display font-bold text-2xl tracking-tight text-white flex items-center">
            Aura<span className="text-blue-500 font-normal">Pixel</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors duration-200 relative group py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Menu Controls: Admin & Mobile Actions */}
        <div className="flex items-center gap-4">
          {/* Admin Status Highlight & Three Dot Menu */}
          <div className="relative">
            <button
              id="admin-dropdown-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-full transition-all duration-200 focus:outline-none flex items-center"
              aria-label="Admin settings"
            >
              <MoreVertical className="w-5 h-5" />
              {isAdmin && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-950" />
              )}
            </button>

            {/* Premium dropdown block */}
            <AnimatePresence>
              {showDropdown && (
                <>
                  {/* Backdrop to close dropdown on tap */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50 py-2 origin-top-right overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-xs font-mono text-slate-500">AURA PIXEL SUITE</p>
                      <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                        {isAdmin ? 'Mode: Administrator' : 'Guest Visitor'}
                      </p>
                    </div>

                    {!isAdmin ? (
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onOpenLogin();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-blue-400 transition-colors text-left"
                      >
                        <LogIn className="w-4 h-4" />
                        Admin Login
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            onOpenDashboard();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-blue-400 transition-colors text-left font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-950/20 transition-colors text-left border-t border-white/5"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu trigger */}
          <button
            id="mobile-nav-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 md:hidden text-slate-400 hover:text-blue-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0A] border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-slate-300 hover:text-blue-400 py-1"
                >
                  {link.name}
                </a>
              ))}
              {isAdmin && (
                <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenDashboard();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-semibold"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Open Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

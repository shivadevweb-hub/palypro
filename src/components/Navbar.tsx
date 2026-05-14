
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, ToyBrick, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlay } from '../PlayContext';
import { AuthModal } from './AuthModal';

export const Navbar = () => {
  const { user, logout, selectedToys } = usePlay();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Toys', path: '/toys' },
    { name: 'Plans', path: '/plans' },
    { name: 'How it Works', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  if (user?.isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <>
      <nav 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 px-4 py-4 md:px-8 ${
          isScrolled ? 'top-2' : 'top-0'
        }`}
      >
        <div 
          className={`max-w-7xl mx-auto transition-all duration-500 rounded-[2rem] px-6 md:px-8 ${
            isScrolled 
              ? 'glass shadow-2xl py-3' 
              : 'bg-transparent py-5'
          }`}
        >
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div 
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20"
                >
                  <ToyBrick className="h-6 w-6 text-white" />
                </motion.div>
                <span className="text-2xl font-black text-dark tracking-tighter font-display uppercase italic">
                  Play<span className="text-primary font-extrabold not-italic">Pro</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center bg-dark/5 backdrop-blur-md rounded-full px-2 py-1 ml-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2 text-sm font-semibold transition-all rounded-full ${
                    location.pathname === link.path 
                      ? 'text-white' 
                      : 'text-dark/60 hover:text-dark'
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-dark rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/cart" 
                className="relative p-3 text-dark/70 hover:text-primary transition-all rounded-2xl hover:bg-primary/5"
              >
                <ShoppingCart size={22} strokeWidth={2.5} />
                <AnimatePresence>
                  {selectedToys.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white"
                    >
                      {selectedToys.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              
              <div className="h-6 w-px bg-dark/10 mx-2" />

              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden xl:block text-right">
                    <p className="text-[10px] font-bold text-dark/40 uppercase tracking-widest">Welcome back</p>
                    <p className="text-sm font-black text-dark">{user.name}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="p-3 text-dark/60 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl"
                  >
                    <LogOut size={22} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-dark text-white text-sm font-black rounded-2xl shadow-xl shadow-dark/10 hover:bg-dark/90 transition-all"
                >
                  <Sparkles size={16} className="text-primary" />
                  <span>Join the Club</span>
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 text-dark">
                <ShoppingCart size={24} />
                {selectedToys.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                    {selectedToys.length}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 bg-dark rounded-xl text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden bg-dark/60 backdrop-blur-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-canvas shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-8 py-8 h-24">
                <span className="text-2xl font-black text-dark tracking-tighter">
                  Play<span className="text-primary">Pro</span>
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 bg-dark/5 rounded-2xl text-dark"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow py-8 px-8 space-y-4 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-4xl font-black font-display tracking-tighter py-2 ${
                        location.pathname === link.path ? 'text-primary' : 'text-dark'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 space-y-4">
                {user ? (
                  <div className="p-6 bg-dark rounded-[2.5rem] text-white">
                    <p className="text-sm font-bold text-white/50 mb-1">Signed in as</p>
                    <p className="text-2xl font-black mb-6">{user.name}</p>
                    <button 
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all flex items-center justify-center space-x-2"
                    >
                      <LogOut size={18} />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-6 bg-primary text-white font-black rounded-[2.5rem] shadow-2xl shadow-primary/20 text-xl tracking-tight"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

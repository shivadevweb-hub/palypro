
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, ToyBrick } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlay } from '../PlayContext';
import { AuthModal } from './AuthModal';

export const Navbar = () => {
  const { user, logout, selectedToys } = usePlay();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Toys', path: '/toys' },
    { name: 'Plans', path: '/plans' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy', path: '/privacy' },
  ];

  if (user?.isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="relative">
                <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-indigo-100">
                  <ToyBrick className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-500 rounded-lg group-hover:-rotate-12 transition-transform duration-500" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight font-display italic leading-none">
                PLAY<span className="text-indigo-600">PRO</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-indigo-600">
              <ShoppingCart size={20} />
              {selectedToys.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {selectedToys.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Hi, {user.name}</span>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-indigo-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden bg-indigo-900/20 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2">
                  <div className="bg-indigo-600 p-1.5 rounded-xl">
                    <ToyBrick className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-black text-gray-900 tracking-tight font-display italic leading-none">
                    PLAY<span className="text-indigo-600">PRO</span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="flex-grow py-8 px-8 space-y-2 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-3xl font-black font-display tracking-tight py-4 border-b border-gray-50 transition-colors ${
                        location.pathname === link.path ? 'text-indigo-600' : 'text-gray-900 hover:text-indigo-600'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 border-t border-gray-100 space-y-4">
                <Link 
                  to="/cart" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl w-full font-bold text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingCart size={24} className="text-indigo-600" />
                    <span className="text-lg">My Box</span>
                  </div>
                  <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">
                    {selectedToys.length}
                  </span>
                </Link>
                
                {user ? (
                  <div className="p-5 bg-indigo-50 rounded-2xl w-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <User size={24} className="text-indigo-600" />
                        <span className="font-black text-indigo-900">Hi, {user.name}</span>
                      </div>
                      <LogOut 
                        size={20} 
                        className="text-indigo-400 cursor-pointer" 
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                      />
                    </div>
                    {currentPlan && (
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                        {currentPlan.name} Plan Active
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 text-xl tracking-tight"
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
    </nav>
  );
};

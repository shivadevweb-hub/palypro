
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[60]"
        >
          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-indigo-50 p-6 md:p-8">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 shrink-0">
                <Cookie size={24} className="animate-bounce" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">We value your privacy</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. <Link to="/cookies" className="text-indigo-600 font-bold hover:underline">Read Policy</Link>
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleAccept}
                    className="flex-grow bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2"
                  >
                    <Check size={18} />
                    <span>Accept All</span>
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="bg-gray-50 text-gray-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

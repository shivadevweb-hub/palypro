
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      // Check localStorage, sessionStorage, AND actual cookies
      const consent = localStorage.getItem('cookie-consent') || 
                      sessionStorage.getItem('cookie-consent') ||
                      document.cookie.includes('cookie-consent=true');
      
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie-consent', 'true');
      sessionStorage.setItem('cookie-consent', 'true');
      // Set a real cookie as well
      document.cookie = "cookie-consent=true; path=/; max-age=" + (60 * 60 * 24 * 365);
    } catch (e) {
      console.warn("Could not save cookie consent choice");
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] bg-white rounded-3xl shadow-2xl border border-indigo-50 z-50 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                <Cookie className="text-indigo-600" size={24} />
              </div>
              <div className="flex-grow">
                <h3 className="font-black text-gray-900 mb-1">Cookie Policy</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  We use cookies to enhance your experience and keep your toy box safe. By playing with us, you agree to our <Link to="/privacy" className="text-indigo-600 font-bold hover:underline">Privacy Policy</Link>.
                </p>
                <div className="flex space-x-3">
                  <button 
                    id="accept-cookies"
                    onClick={handleAccept}
                    className="flex-grow py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Accept All
                  </button>
                  <button 
                    id="close-cookie-banner"
                    onClick={() => setIsVisible(false)}
                    className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-indigo-100 flex">
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 10, ease: "linear" }}
              className="h-full bg-indigo-600 origin-left w-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

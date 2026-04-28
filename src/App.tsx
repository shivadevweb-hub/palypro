import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PlayProvider, usePlay } from './PlayContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ToysPage } from './pages/ToysPage';
import { PlansPage } from './pages/PlansPage';
import { SelectionPage } from './pages/SelectionPage';
import { CartPage } from './pages/CartPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { AIParentConcierge } from './components/AIParentConcierge';
import { CookieConsent } from './components/CookieConsent';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, isLoading } = usePlay();

  if (isLoading) return null;
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const AppContent = () => {
  const { isLoading } = usePlay();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
              <Route path="/toys" element={<PageWrapper><ToysPage /></PageWrapper>} />
              <Route path="/plans" element={<PageWrapper><PlansPage /></PageWrapper>} />
              <Route path="/select-toys" element={<PageWrapper><SelectionPage /></PageWrapper>} />
              <Route path="/cart" element={<PageWrapper><CartPage /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
              <Route path="/privacy" element={<PageWrapper><PrivacyPolicyPage /></PageWrapper>} />
              <Route path="/cookies" element={<PageWrapper><CookiePolicyPage /></PageWrapper>} />
              <Route path="/admin/login" element={<PageWrapper><AdminLoginPage /></PageWrapper>} />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <PageWrapper><AdminPage /></PageWrapper>
                </ProtectedRoute>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <AIParentConcierge />
      <CookieConsent />
    </div>
  );
};

export default function App() {
  return (
    <PlayProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </PlayProvider>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, ToyBrick, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { usePlay } from '../PlayContext';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('adminplaypro@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signInWithEmail } = usePlay();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError('Invalid admin credentials. Please try again.');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6 sm:p-10 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-secondary/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] border border-dark/5 p-10 md:p-16 text-center">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-dark rounded-[2.5rem] shadow-2xl shadow-dark/20 mb-10 group relative">
              <ToyBrick className="h-10 w-10 text-white" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-bounce">
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tighter mb-4 italic">The Vault.</h1>
            <p className="text-dark/30 font-black text-[10px] uppercase tracking-[0.3em]">Restricted Command Center Access</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-10 p-5 bg-primary/5 border border-primary/10 rounded-3xl flex items-center space-x-4 text-primary font-bold text-sm"
            >
              <ShieldAlert size={20} className="shrink-0" />
              <span className="text-left">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="text-left space-y-3">
              <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest ml-1">Identity UID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-dark/20">
                  <User size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-16 pr-6 py-6 bg-canvas border-none rounded-3xl focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:text-dark/10"
                  placeholder="admin@playpro.com"
                  required
                />
              </div>
            </div>

            <div className="text-left space-y-3">
              <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest ml-1">Secret Keyphrase</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-dark/20">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-16 pr-6 py-6 bg-canvas border-none rounded-3xl focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:text-dark/10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-dark text-white font-black rounded-[2rem] shadow-2xl shadow-dark/20 flex items-center justify-center space-x-4 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-sm uppercase tracking-widest italic">Authorize Session</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-12 text-dark/20 text-[10px] font-black uppercase tracking-[0.4em]">
          Logs are being recorded. Unauthorized entry attempt is a violation.
        </p>
      </motion.div>
    </div>
  );
};


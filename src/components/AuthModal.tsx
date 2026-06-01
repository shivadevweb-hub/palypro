import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { usePlay } from '../PlayContext';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithEmail, signUpWithEmail, login } = usePlay();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login();
      onClose();
    } catch (err: any) {
      console.error("AuthModal: Login error", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUpWithEmail(email, password, name);
        if (error) throw error;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark/60 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
        >
          <div className="p-10 md:p-14">
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-dark/20 hover:text-dark hover:rotate-90 transition-all duration-300"
            >
              <X size={24} />
            </button>

            <div className="mb-12">
              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Sparkles size={24} />
              </div>
              <h3 className="text-4xl font-black text-dark tracking-tight leading-none mb-4">
                {isLogin ? 'Hello Again.' : 'Start Playing.'}
              </h3>
              <p className="text-dark/40 font-medium">
                {isLogin ? 'Sign in to manage your monthly box.' : 'Create an account to join the community.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleLogin}
                className="w-full py-4 bg-canvas border border-dark/5 text-dark font-black rounded-2xl shadow-sm hover:bg-dark/[0.02] transition-all flex items-center justify-center space-x-3 disabled:opacity-70 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin text-dark/20" size={20} />
                ) : (
                  <>
                    <img 
                      src="https://www.google.com/favicon.ico" 
                      alt="Google" 
                      className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" 
                    />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] items-center">
                  <span className="bg-white px-4 text-dark/20 font-black uppercase tracking-widest">Or use email</span>
                </div>
              </div>

              {!isLogin && (
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-dark/30 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-canvas border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-dark"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-dark/30 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-canvas border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-dark"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-dark/30 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-canvas border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-dark"
                />
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-primary text-xs font-black uppercase tracking-widest text-center pt-2"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-dark text-white font-black rounded-[2rem] shadow-2xl shadow-dark/20 hover:bg-dark/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-dark/40 font-black text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
              >
                {isLogin ? "No account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

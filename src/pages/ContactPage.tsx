
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="bg-canvas min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center space-x-2 bg-dark/5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-dark/40 mb-8">
              <Sparkles size={14} className="text-secondary" />
              <span>We're here to help</span>
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-dark tracking-tighter leading-[0.9] mb-8">
              Get in <span className="text-secondary italic">Touch.</span>
            </h1>
            <p className="text-xl md:text-2xl text-dark/40 font-medium leading-relaxed">
              Have questions about our rental plans or sanitization process? Our team is here for you 24/7.
            </p>
          </motion.div>
          
          {/* Decorative Blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -z-10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Cards */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-dark text-white p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 blur-[60px] rounded-full" />
              
              <h2 className="text-3xl font-black mb-10 tracking-tight relative z-10">Direct Contact</h2>
              
              <div className="space-y-10 relative z-10">
                <div className="group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Email Support</p>
                  <p className="text-xl font-bold group-hover:text-secondary transition-colors">support@playpro.com</p>
                </div>
                
                <div className="group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Call Center</p>
                  <p className="text-xl font-bold group-hover:text-secondary transition-colors">+91 98765 43210</p>
                </div>
                
                <div className="group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Visit Hub</p>
                  <p className="text-xl font-bold leading-relaxed group-hover:text-secondary transition-colors">
                    123, Toy Lane, Kid City,<br />Mumbai - 400001
                  </p>
                </div>
              </div>

              <div className="mt-16 pt-10 border-t border-white/10 relative z-10">
                <div className="flex items-center space-x-3 text-secondary font-black text-[10px] uppercase tracking-widest mb-6">
                  <Clock size={16} />
                  <span>Working Hours</span>
                </div>
                <div className="space-y-2 text-sm font-medium text-white/50">
                  <p className="flex justify-between"><span>Mon - Sat</span> <span>09:00 - 20:00</span></p>
                  <p className="flex justify-between"><span>Sunday</span> <span>10:00 - 16:00</span></p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 flex items-center space-x-6 border border-dark/5 shadow-xl shadow-dark/5 group hover:scale-[1.02] transition-all cursor-pointer"
            >
              <div className="bg-accent/10 p-5 rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                <MessageCircle size={32} />
              </div>
              <div>
                <p className="font-black text-dark text-lg leading-none mb-1">WhatsApp Hub</p>
                <p className="text-dark/40 font-bold text-xs uppercase tracking-widest">Instant Chat Support</p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 h-full"
          >
            <div className="bg-white p-10 md:p-20 rounded-[4rem] shadow-2xl border border-dark/5 h-full relative overflow-hidden group">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-20"
                  >
                    <div className="w-24 h-24 bg-accent/10 text-accent rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-accent/5">
                      <Send size={40} />
                    </div>
                    <h3 className="text-4xl font-black text-dark tracking-tighter mb-4 italic">Message Sent.</h3>
                    <p className="text-dark/40 font-medium text-lg">We will get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] ml-1">Your Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="What should we call you?"
                          className="w-full px-8 py-6 bg-canvas border-none rounded-3xl focus:ring-4 focus:ring-secondary/10 transition-all outline-none font-bold placeholder:text-dark/20 text-dark"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="Your primary email"
                          className="w-full px-8 py-6 bg-canvas border-none rounded-3xl focus:ring-4 focus:ring-secondary/10 transition-all outline-none font-bold placeholder:text-dark/20 text-dark"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] ml-1">Inquiry Subject</label>
                      <input 
                        required
                        type="text" 
                        placeholder="What's this about?"
                        className="w-full px-8 py-6 bg-canvas border-none rounded-3xl focus:ring-4 focus:ring-secondary/10 transition-all outline-none font-bold placeholder:text-dark/20 text-dark"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] ml-1">Your Message</label>
                      <textarea 
                        required
                        rows={6}
                        placeholder="Tell us everything..."
                        className="w-full px-8 py-6 bg-canvas border-none rounded-[2.5rem] focus:ring-4 focus:ring-secondary/10 transition-all outline-none font-bold resize-none placeholder:text-dark/20 text-dark"
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full py-6 bg-dark text-white font-black rounded-3xl shadow-2xl shadow-dark/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center space-x-4 group/submit"
                    >
                      <span className="text-sm uppercase tracking-widest">Transmit Message</span>
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

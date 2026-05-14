
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Zap, Sparkles, Box, Heart, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const FloatingToy = ({ delay, children, className }: { delay: number, children: React.ReactNode, className?: string }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ 
      y: [0, -20, 0],
      opacity: 1 
    }}
    transition={{ 
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
      opacity: { duration: 1, delay: delay * 0.5 }
    }}
    className={`absolute z-20 ${className}`}
  >
    {children}
  </motion.div>
);

export const HomePage = () => {
  return (
    <div className="flex flex-col bg-canvas pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-12 lg:py-20">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-xl shadow-dark/5 mb-8"
              >
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <span className="text-dark/60 font-bold text-xs uppercase tracking-widest">Trusted by 5,000+ Parents</span>
              </motion.div>
              
              <h1 className="text-6xl sm:text-7xl xl:text-8xl font-black text-dark leading-[0.95] tracking-tight mb-8">
                The Smart Way <br />
                To <span className="text-primary italic">Play & Grow.</span>
              </h1>
              
              <p className="text-xl text-dark/60 max-w-lg leading-relaxed mb-10 font-medium">
                Access a library of ₹5L+ world-class developmental toys for a fraction of the cost. Monthly swaps, zero mess, infinite fun.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/toys"
                  className="group relative inline-flex items-center justify-center px-10 py-5 bg-dark text-white text-lg font-black rounded-2xl overflow-hidden shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span className="relative z-10 flex items-center">
                    Explore Toys
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  to="/plans"
                  className="inline-flex items-center justify-center px-10 py-5 bg-white border-2 border-dark/5 text-dark text-lg font-black rounded-2xl hover:bg-dark/5 transition-all"
                >
                  View Plans
                </Link>
              </div>
            </motion.div>

            {/* Visual Side */}
            <div className="relative h-[600px] hidden lg:block">
              {/* Floating Cards */}
              <FloatingToy delay={0} className="top-10 left-0 w-64">
                <div className="glass p-4 rounded-[2rem] rotate-[-6deg]">
                  <img 
                    src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400" 
                    alt="Toy" 
                    className="rounded-2xl mb-3 h-40 w-full object-cover"
                  />
                  <p className="font-bold text-dark">Wooden Montessori Set</p>
                  <p className="text-xs text-dark/50">Age: 1-3 years</p>
                </div>
              </FloatingToy>

              <FloatingToy delay={2} className="bottom-20 right-0 w-72">
                <div className="glass p-6 rounded-[2.5rem] rotate-[4deg]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-primary/20 p-2 rounded-xl">
                      <Sparkles className="text-primary" size={20} />
                    </div>
                    <p className="font-black text-dark">Premium Quality</p>
                  </div>
                  <p className="text-sm text-dark/70 leading-relaxed font-medium">Curated by developmental experts for specific age milestones.</p>
                </div>
              </FloatingToy>

              <FloatingToy delay={1} className="top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80">
                <div className="bg-dark p-8 rounded-[3rem] shadow-2xl rotate-2">
                  <div className="flex justify-between items-start mb-12">
                    <div className="bg-white/10 p-4 rounded-2xl">
                      <Box className="text-white" size={32} />
                    </div>
                    <div className="bg-accent px-4 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                      Your Box
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-white/10 rounded-full" />
                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                    <div className="h-2 w-1/2 bg-white/20 rounded-full" />
                  </div>
                  <div className="mt-8 flex justify-between items-center">
                    <p className="text-white font-black text-2xl">₹1,799<span className="text-white/40 text-sm font-medium">/mo</span></p>
                    <div className="bg-white text-dark p-2 rounded-xl">
                      <CheckCircle2 size={24} />
                    </div>
                  </div>
                </div>
              </FloatingToy>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-dark mb-6">Built for <span className="text-secondary italic">Modern</span> Families</h2>
            <p className="text-dark/50 font-medium text-lg">We've reimagined the toy box for the 21st century.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:h-[600px]">
            {/* Sanitization - Large Bento */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-white border border-dark/5 rounded-[3rem] p-10 overflow-hidden relative group"
            >
              <div className="relative z-10 max-w-md">
                <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center text-accent mb-8">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-4xl font-black text-dark mb-4">Medical Grade Sanitization</h3>
                <p className="text-lg text-dark/60 font-medium">Every toy undergoes a 5-step cleaning process including UV-C sterilization and organic deep cleaning. Safer than buying new.</p>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-20 group-hover:opacity-40 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800" 
                  alt="Sanitization" 
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            {/* Delivery - Small Bento */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-secondary p-10 rounded-[3rem] text-white flex flex-col justify-end overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 p-8">
                <Truck size={48} className="text-white/20 group-hover:scale-125 transition-transform duration-500" />
              </div>
              <h3 className="text-3xl font-black mb-4">48h Delivery</h3>
              <p className="text-white/70 font-medium leading-relaxed">Doorstep delivery and pickup included. Hassle-free monthly swaps.</p>
            </motion.div>

            {/* AI Agent - Small Bento */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-dark p-10 rounded-[3rem] text-white flex flex-col justify-between"
            >
              <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center">
                <Sparkles size={28} />
              </div>
              <div>
                <h3 className="text-3xl font-black mb-4">AI Concierge</h3>
                <p className="text-white/50 font-medium">Talk to our expert AI agent to get personalized toy recommendations for your child's age.</p>
              </div>
            </motion.div>

            {/* Values - Wide Bento */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 glass rounded-[3rem] p-10 flex flex-col lg:flex-row items-center gap-10"
            >
              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                {[
                  { label: "Cost Saved", val: "₹15L+" },
                  { label: "Toys Reused", val: "10k+" },
                  { label: "Happy Parents", val: "2k+" },
                  { label: "States", val: "28" }
                ].map((stat, i) => (
                  <div key={i} className="bg-canvas p-6 rounded-3xl">
                    <p className="text-dark/40 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-dark tracking-tight">{stat.val}</p>
                  </div>
                ))}
              </div>
              <div className="lg:w-1/2">
                <h3 className="text-3xl font-black text-dark mb-4">Big Joy, Small Footprint</h3>
                <p className="text-dark/50 font-medium leading-relaxed">Save money and the planet. By sharing toys, we reduce plastic waste while giving children better variety.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="bg-canvas aspect-square rounded-[4rem] overflow-hidden rotate-[-2deg]">
                <img 
                  src="https://images.unsplash.com/photo-1484820540004-14229fe36ca4?auto=format&fit=crop&q=80&w=800" 
                  alt="Happy Child" 
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-8 -right-8 glass p-8 rounded-[2.5rem] shadow-2xl max-w-xs"
              >
                <div className="flex items-center space-x-2 mb-3">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />)}
                </div>
                <p className="text-dark font-bold italic mb-4">"PlayPro has completely changed our playrooms. No more toy clutter!"</p>
                <p className="text-sm font-black text-dark">Ananya M., Parent</p>
              </motion.div>
            </div>

            <div className="space-y-12">
              <h2 className="text-4xl md:text-6xl font-black text-dark leading-tight">Trusted by Parents <br /> across India.</h2>
              
              <div className="grid gap-6">
                {[
                  { title: "Curated developmental focus", desc: "Every toy is hand-picked to help your child reach specific developmental milestones." },
                  { title: "Economical & Sustainable", desc: "Get ₹10k worth of toys for ₹999. Better for your wallet and the planet." },
                  { title: "Peace of Mind", desc: "No broken toys, no missing pieces. We handle everything." }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-6">
                    <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Heart size={24} fill="currentColor" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-dark mb-2">{item.title}</h4>
                      <p className="text-dark/60 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/toys"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-dark text-white rounded-2xl font-black transition-all hover:scale-105"
              >
                <span>Start Your First Box</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

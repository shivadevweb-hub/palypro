
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-[#FBFBFF] py-20 lg:py-0">
        <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(circle_at_50%_50%,#E0E7FF_0%,transparent_70%)]" />
        
        {/* Decorative Shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-yellow-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

        {/* Floating background text */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.03] flex items-center justify-center">
          <div className="text-[20rem] font-black font-display rotate-12 whitespace-nowrap animate-pulse">
            PLAY PLAY PLAY PLAY
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs sm:text-sm mb-8 uppercase tracking-[0.2em] shadow-sm"
            >
              <Zap size={14} className="animate-pulse" />
              <span>Smart Play for Smart Parents</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black text-gray-900 leading-[0.95] tracking-[-0.04em] font-display mb-12 overflow-hidden">
              <div className="flex flex-wrap justify-center gap-x-[0.2em]">
                {"Rent the ".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-indigo-600 italic"
                >
                  Play,
                </motion.span>
              </div>
              <div className="flex flex-wrap justify-center gap-x-[0.2em]">
                {"Swap the ".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ y: "100%", rotate: 5 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-pink-500"
                >
                  Mess.
                </motion.span>
              </div>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-16 font-medium"
            >
              High-quality, curated toys delivered to your door every month. Save money, save space, and give your kids endless world-class toys.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/toys"
                className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-6 border border-transparent text-xl font-black rounded-3xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:scale-105 active:scale-95"
              >
                Browse Library
              </Link>
              <Link
                to="/plans"
                className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-6 border-2 border-indigo-100 text-xl font-black rounded-3xl text-indigo-600 bg-white hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95"
              >
                See Plans
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-20 flex flex-col items-center"
            >
              <div className="flex text-yellow-500 mb-2 space-x-1">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <p className="font-bold text-gray-900 text-lg font-display">4.9/5 from 2k+ families</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {[
              { icon: Truck, title: "Free Delivery", desc: "Doorstep delivery and pickup included in every plan. Zero hidden costs." },
              { icon: ShieldCheck, title: "Safe & Sanitized", desc: "Hospital-grade cleaning for every single toy. Safety is our #1 priority." },
              { icon: Zap, title: "AI Recommender", desc: "Use our Gemini-powered AI Concierge to find toys that match your child's milestones." }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center md:items-start p-10 rounded-[3rem] border border-gray-100 bg-white hover:border-indigo-200 transition-all hover:shadow-[0_32px_64px_-12px_rgba(79,70,229,0.1)] group"
              >
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-10 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon size={40} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-6 font-display group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed text-base font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-indigo-600 font-black tracking-widest uppercase text-sm mb-6 block">Simple Process</span>
                <h2 className="text-5xl md:text-7xl font-black text-gray-900 font-display mb-10 leading-tight">How it <span className="italic text-indigo-600">Works</span></h2>
                
                <div className="space-y-12">
                  {[
                    { step: "01", title: "Pick a Plan", desc: "Choose a subscription that fits your child's age and your budget." },
                    { step: "02", title: "Select Your Toys", desc: "Browse our 10,000+ toy library and fill your magic play box." },
                    { step: "03", title: "Deliver & Play", desc: "We deliver sanitised toys within 48 hours. Let the fun begin!" },
                    { step: "04", title: "Swap Monthly", desc: "Done playing? We pick them up and bring your next set of toys." }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.2, duration: 0.8, ease: "easeOut" }}
                      className="flex space-x-8 relative group"
                    >
                      <div className="text-indigo-600/10 font-black text-6xl sm:text-8xl font-display group-hover:text-indigo-600/40 transition-all duration-700 shrink-0 select-none scale-90 group-hover:scale-100">
                        {item.step}
                      </div>
                      <div className="pt-4">
                        <h4 className="text-2xl sm:text-3xl font-black text-gray-900 font-display mb-3 group-hover:translate-x-2 transition-transform duration-500">{item.title}</h4>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <div className="lg:w-5/12 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative"
              >
                <div className="bg-white p-6 rounded-[3.5rem] shadow-2xl rotate-3 relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1545558014-8692070000f2?auto=format&fit=crop&q=80&w=1000" 
                    alt="Sanitized Toys" 
                    className="rounded-[3rem] w-full"
                  />
                </div>
                <div className="absolute -bottom-10 -left-10 bg-pink-500 p-8 rounded-3xl text-white shadow-2xl -rotate-6 z-20 max-w-[240px]">
                  <p className="text-xl font-black font-display mb-2 italic">Clean & Safe</p>
                  <p className="text-sm font-medium opacity-90">Every toy is sanitized with hospital-grade solution before every delivery.</p>
                </div>
                <div className="absolute inset-0 bg-indigo-200 blur-3xl opacity-30 rounded-full -z-10 scale-110" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

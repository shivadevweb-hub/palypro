
import React from 'react';
import { Target, Users, Shield, Zap, Heart, Sparkles, Globe, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutPage = () => {
  const values = [
    {
      icon: <Target className="text-primary" />,
      title: "Our Mission",
      description: "To make high-quality toy play accessible and sustainable for every child through our innovative rental platform.",
      bgColor: "bg-primary/5"
    },
    {
      icon: <Shield className="text-accent" />,
      title: "Safety First",
      description: "Every toy undergoes a multi-stage sanitization process using medical-grade UV sterilization.",
      bgColor: "bg-accent/5"
    },
    {
      icon: <Users className="text-secondary" />,
      title: "Community",
      description: "Building a community of conscious parents who believe in sharing resources and reducing impact.",
      bgColor: "bg-secondary/5"
    },
    {
      icon: <Zap className="text-primary" />,
      title: "Fast Delivery",
      description: "Our logistics team ensures your chosen toys are delivered within 48 hours.",
      bgColor: "bg-primary/5"
    }
  ];

  return (
    <div className="bg-canvas pt-20">
      {/* Hero Section */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center space-x-2 bg-dark/5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-dark/40 mb-8">
              <Sparkles size={14} className="text-primary" />
              <span>Founded in 2024</span>
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-dark tracking-tighter leading-[0.9] mb-10">
              Revolutionizing How Kids <span className="text-primary italic">Play.</span>
            </h1>
            <p className="text-xl md:text-2xl text-dark/40 font-medium leading-relaxed max-w-2xl mx-auto">
              PlayPro was born out of a simple observation: children grow fast, and their toy preferences change even faster.
            </p>
          </motion.div>
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] animate-pulse" />
      </section>

      {/* Our Story - Modern Bento-ish Layout */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white rounded-[3rem] p-12 md:p-16 shadow-xl border border-dark/5 flex flex-col justify-center"
          >
            <h2 className="text-4xl font-black text-dark tracking-tighter mb-8 italic">The PlayPro Story.</h2>
            <div className="space-y-6 text-dark/50 text-lg font-medium leading-relaxed">
              <p>
                Founded in 2024, PlayPro started in a small garage with just 50 toys and a dream to make premium education and play accessible to all children, regardless of their background.
              </p>
              <p>
                As parents ourselves, we understood the frustration of buying expensive toys that would be forgotten within a week. We realized that 'access' is more valuable than 'ownership' when it comes to early development.
              </p>
              <p>
                Today, PlayPro serves thousands of families across the country, offering a curated library of over 10,000 international and Indian toy brands aimed at cognitive, social, and physical development.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative group"
          >
            <div className="aspect-[4/5] bg-dark rounded-[3rem] overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1000" 
                alt="Children playing" 
                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 p-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] text-white">
                <p className="text-6xl font-black tracking-tighter leading-none mb-1">10k+</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Happy Families</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Cards - Premium Grid */}
      <section className="py-24 bg-dark py-32 rounded-[4rem] mx-4 my-24 overflow-hidden relative group">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl font-black text-white tracking-tighter mb-4 italic">What we stand for.</h2>
            <p className="text-white/30 font-medium">Our values drive every decision we make at PlayPro.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                key={idx} 
                className="bg-white/5 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] hover:bg-white transition-all duration-500 group/card"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-10 group-hover/card:bg-dark group-hover/card:scale-110 transition-all duration-500">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover/card:text-dark transition-colors">{value.title}</h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed group-hover/card:text-dark/50 transition-colors">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainable Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 pb-40">
        <div className="bg-canvas border border-dark/5 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-dark tracking-tighter mb-8 leading-tight italic max-w-3xl mx-auto">Better for your kids, better for the planet.</h2>
            <p className="text-dark/40 text-lg font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              By renting toys, you help reduce plastic waste and promote a circular economy. Together, we can build a greener future for our children to inherit.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-dark/30">
                <Leaf size={16} className="text-accent" />
                <span>Eco-Friendly Pack</span>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-dark/30">
                <Globe size={16} className="text-secondary" />
                <span>Sustainable Play</span>
              </div>
            </div>
          </div>
          
          {/* Animated Blob Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
        </div>
      </section>
    </div>
  );
};

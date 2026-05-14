
import React from 'react';
import { Cookie, ShieldCheck, BarChart3, Settings, Info } from 'lucide-react';
import { motion } from 'motion/react';

export const CookiePolicyPage = () => {
  return (
    <div className="bg-canvas pt-32 pb-40 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 bg-dark/5 rounded-full text-dark/40 mb-8 font-black text-[10px] uppercase tracking-[0.2em]">
            <Cookie className="mr-3" size={14} />
            Data Preferences
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter mb-6 italic">Cookie Policy<span className="text-secondary">.</span></h1>
          <p className="text-dark/30 font-bold uppercase tracking-widest text-xs">Last updated: May 2024</p>
        </motion.div>

        <div className="space-y-20 text-dark/50 font-medium leading-relaxed">
          <section className="bg-white p-12 rounded-[3.5rem] border border-dark/5 flex flex-col md:flex-row items-center gap-10 shadow-sm relative overflow-hidden group">
            <div className="w-20 h-20 bg-canvas rounded-[1.5rem] flex items-center justify-center text-secondary relative z-10 shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Info size={32} />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-dark mb-4 tracking-tight italic">Digital Fingerprints?</h2>
              <p className="text-dark/50 leading-relaxed">
                Cookies are tiny metadata units placed on your device to ensure our vault remains synchronized and your preferences are remembered across sessions.
              </p>
            </div>
            {/* Background Blob */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-secondary/5 blur-[60px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
          </section>

          <section>
            <div className="flex items-center space-x-5 mb-10">
              <ShieldCheck className="text-secondary" size={32} />
              <h2 className="text-3xl font-black text-dark tracking-tight italic">Taxonomy of Cookies.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { 
                  icon: Settings, 
                  color: "bg-emerald-500", 
                  bg: "bg-emerald-5", 
                  title: "Infrastructural", 
                  desc: "Necessary for the core engine: auth sessions, selection drawers, and checkout secure-tunnels.",
                  active: true 
                },
                { 
                  icon: BarChart3, 
                  color: "bg-blue-500", 
                  bg: "bg-blue-5", 
                  title: "Intelligence", 
                  desc: "Anonymized heatmaps and traffic patterns that help us calibrate our logistics and inventory." 
                }
              ].map((card, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-dark/5 relative overflow-hidden group">
                  <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <card.icon size={24} className={`text-dark`} />
                  </div>
                  <h3 className="text-xl font-black text-dark mb-4 tracking-tight">{card.title}</h3>
                  <p className="text-sm leading-relaxed mb-8">{card.desc}</p>
                  {card.active && (
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Protocol Active</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-dark p-12 md:p-20 rounded-[4rem] text-white">
            <h2 className="text-3xl font-black tracking-tight mb-8 italic">Managing Preference.</h2>
            <p className="text-white/40 text-lg mb-10 max-w-2xl italic leading-relaxed">
              You maintain total sovereignty over your digital trail. Most standard-issue browsers provide the toggle to prune or purge these files.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Chrome', 'Safari', 'Firefox', 'Edge'].map((browser, i) => (
                <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest">
                  {browser} Configuration
                </div>
              ))}
            </div>
          </section>

          <section className="pt-20 border-t border-dark/5 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h2 className="text-2xl font-black text-dark mb-2 tracking-tight">Support & Queries</h2>
              <p className="text-sm font-medium">Need more technical context on our cookies?</p>
            </div>
            <a href="mailto:privacy@playpro.com" className="px-10 py-5 bg-canvas border border-dark/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-dark hover:text-white transition-all">
              privacy@playpro.com
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

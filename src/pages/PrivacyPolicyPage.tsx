
import React from 'react';
import { ShieldAlert, BookOpen, Clock, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="bg-canvas pt-32 pb-40 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 bg-dark/5 rounded-full text-dark/40 mb-8 font-black text-[10px] uppercase tracking-[0.2em]">
            <Lock className="mr-3" size={14} />
            Privacy Protection Protocol
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter mb-6 italic">Privacy Policy<span className="text-primary">.</span></h1>
          <p className="text-dark/30 font-bold uppercase tracking-widest text-xs">Last updated: May 2024</p>
        </motion.div>

        <div className="space-y-20 text-dark/50 font-medium leading-relaxed">
          <section>
            <div className="flex items-center space-x-5 mb-8">
              <div className="text-4xl font-black text-primary/20 italic">01.</div>
              <h2 className="text-3xl font-black text-dark tracking-tight italic">Information We Collect.</h2>
            </div>
            <p className="mb-8 text-lg">
              PlayPro collects personal information to provide and improve our services. Our data collection is minimal and designed for security:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Identity Data", items: ["Legal Name", "Physical Address", "Email Point", "Contact Number"] },
                { title: "Service Data", items: ["Rental History", "Toy Preferences", "Cleanliness Logs", "Subscription Tier"] }
              ].map((group, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-dark/5">
                  <h3 className="font-black text-dark uppercase tracking-widest text-[10px] mb-6">{group.title}</h3>
                  <ul className="space-y-3">
                    {group.items.map((item, j) => (
                      <li key={j} className="flex items-center space-x-3 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-5 mb-8">
              <div className="text-4xl font-black text-secondary/20 italic">02.</div>
              <h2 className="text-3xl font-black text-dark tracking-tight italic">Usage & Processing.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-dark/5 relative overflow-hidden group">
                <Clock className="text-secondary/30 mb-6 group-hover:scale-110 transition-transform duration-500" size={32} />
                <h3 className="text-xl font-black text-dark mb-4 tracking-tight">Service Delivery</h3>
                <p className="text-sm leading-relaxed">To coordinate complex logistics, sanitize inventory, and manages active child-play cycles.</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-dark/5 relative overflow-hidden group">
                <ShieldAlert className="text-accent/30 mb-6 group-hover:scale-110 transition-transform duration-500" size={32} />
                <h3 className="text-xl font-black text-dark mb-4 tracking-tight">Vault Security</h3>
                <p className="text-sm leading-relaxed">To verify guardian identity and maintain the integrity of our premium toy circle.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-dark p-12 md:p-20 rounded-[4rem] text-white overflow-hidden relative group">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <h2 className="text-3xl font-black tracking-tighter mb-6 italic italic">Encrypted by Design.</h2>
                  <p className="text-white/40 text-lg font-medium leading-relaxed italic">
                    We implement military-grade encryption and zero-knowledge storage where possible to ensure your family's data remains private.
                  </p>
                </div>
                <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                  <Lock size={40} className="text-white" />
                </div>
              </div>
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
            </div>
          </section>

          <section className="pt-20 border-t border-dark/5 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h2 className="text-2xl font-black text-dark mb-2 tracking-tight">Data Governance</h2>
              <p className="text-sm font-medium">Questions or deletions? Our DPO is standing by.</p>
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

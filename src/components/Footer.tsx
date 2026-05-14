
import React from 'react';
import { Link } from 'react-router-dom';
import { ToyBrick, Instagram, Twitter, Facebook, Mail, Phone, MapPin, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const Footer = () => {
  return (
    <footer className="bg-dark pt-32 pb-12 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Newsletter Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32 border-b border-white/5 pb-32">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-6">
              Join the <span className="text-primary italic">Play</span> Circle.
            </h2>
            <p className="text-white/50 text-lg font-medium max-w-md">
              Receive early access to new toys, parenting tips, and local event invitations.
            </p>
          </div>
          <div className="relative">
            <div className="flex p-2 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 group focus-within:border-primary/50 transition-all">
              <input 
                type="email" 
                placeholder="parent@example.com"
                className="flex-1 bg-transparent px-6 py-4 text-white outline-none font-medium placeholder:text-white/20"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20">
                <span>Join Now</span>
                <ArrowRight size={20} />
              </button>
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] font-black text-white/30 text-center lg:text-left">
              No spam. Just play. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-32">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-10 group">
              <div className="relative">
                <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                  <ToyBrick className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-black text-white tracking-tighter italic">
                PLAY<span className="text-primary">PRO</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs mb-10">
              India's premier circular economy platform for early childhood development. Better for your child, better for the planet.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-8 text-primary/80">Platform</h4>
            <ul className="space-y-4">
              {['About Us', 'Our Toys', 'Rental Plans', 'Sanitization'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-white/40 hover:text-white font-bold text-sm transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-8 text-secondary/80">Support</h4>
            <ul className="space-y-4">
              {['Help Center', 'Safety Guide', 'Delivery Info', 'Contact Us'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-white/40 hover:text-white font-bold text-sm transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-8 text-accent/80">Contact</h4>
            <ul className="space-y-6">
              <li className="flex flex-col">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Email</span>
                <a href="mailto:hello@playpro.com" className="text-white/70 hover:text-white font-bold text-sm transition-colors">hello@playpro.com</a>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Headquarters</span>
                <span className="text-white/70 font-medium text-sm leading-relaxed">123 Play Lane, Mumbai, IN</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
            <span>© {new Date().getFullYear()} PlayPro</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Built with</span>
            <Heart size={10} className="text-primary" fill="currentColor" />
            <span>for Parents</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {['Privacy Policy', 'Terms', 'Admin Login'].map((item) => (
              <Link 
                key={item} 
                to={item === 'Admin Login' ? '/admin/login' : '#'} 
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  item === 'Admin Login' ? 'text-white/10 hover:text-primary/50' : 'text-white/30 hover:text-white'
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

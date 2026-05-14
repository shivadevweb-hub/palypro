
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, X, Star, Calendar, ChevronDown, Sparkles, Box, Info, ArrowRight } from 'lucide-react';
import { usePlay } from '../PlayContext';
import { Toy } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

export const ToysPage = () => {
  const { toys } = usePlay();
  const [search, setSearch] = useState('');
  const [selectedToy, setSelectedToy] = useState<Toy | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Educational', 'STEM', 'Building', 'Creative', 'Outdoor'];

  const filteredToys = toys.filter(toy => {
    const matchesSearch = toy.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || toy.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-canvas pb-24 pt-32">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full text-secondary font-bold text-xs mb-6 uppercase tracking-widest"
        >
          <Box size={14} />
          <span>Curated Collection</span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tight mb-8">
          The Toy <span className="text-secondary italic">Library.</span>
        </h1>
        <p className="text-xl text-dark/50 max-w-2xl mx-auto font-medium">
          Ditch the clutter. Access world-class educational toys sanitized and delivered to your doorstep.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* Modern Filter Bar */}
        <div className="glass rounded-[2rem] p-4 mb-16 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dark/30" size={20} />
            <input
              type="text"
              placeholder="Search by name, brand, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-dark/5 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium text-dark placeholder:text-dark/20"
            />
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-4 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-dark text-white shadow-xl shadow-dark/20'
                    : 'bg-dark/5 text-dark/40 hover:bg-dark/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Toys Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredToys.map((toy) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={toy.id}
                onClick={() => setSelectedToy(toy)}
                className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-dark/5 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(30,41,59,0.15)] hover:scale-[1.02] cursor-pointer flex flex-col h-full"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={toy.image}
                    alt={toy.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-dark uppercase tracking-widest shadow-sm">
                      {toy.category}
                    </span>
                    <span className="bg-primary px-3 py-1 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-primary/20">
                      Age {toy.ageRange}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-dark tracking-tight leading-tight mb-2">
                      {toy.name}
                    </h3>
                    <p className="text-xs font-bold text-dark/30 uppercase tracking-widest">{toy.brand}</p>
                  </div>
                  
                  <p className="text-dark/50 text-sm font-medium line-clamp-2 mb-8 flex-grow">
                    {toy.shortDescription}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-dark/5">
                    <p className="text-xs font-black text-dark/40 uppercase tracking-widest">Available to Rent</p>
                    <div className="w-10 h-10 bg-dark text-white rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredToys.length === 0 && (
          <div className="text-center py-32">
            <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-dark/5 inline-block max-w-sm">
              <div className="bg-dark/5 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-dark/20" />
              </div>
              <h3 className="text-2xl font-black text-dark mb-2">No toys found</h3>
              <p className="text-dark/40 font-medium">Try broadening your search or choosing a different category.</p>
            </div>
          </div>
        )}
      </div>

      {/* Toy Details Modal */}
      <AnimatePresence>
        {selectedToy && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedToy(null)}
              className="absolute inset-0 bg-dark/60 backdrop-blur-xl"
            />
            
            <motion.div
              layoutId={selectedToy.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedToy(null)}
                className="absolute top-8 right-8 z-20 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-dark shadow-xl hover:bg-dark hover:text-white transition-all transform hover:rotate-90"
              >
                <X size={24} />
              </button>

              <div className="md:w-1/2 h-80 md:h-auto relative">
                <img
                  src={selectedToy.image}
                  alt={selectedToy.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent" />
              </div>

              <div className="md:w-1/2 p-10 md:p-16 overflow-y-auto flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
                    {selectedToy.category}
                  </span>
                  <span className="text-[10px] font-black text-dark/30 uppercase tracking-widest">{selectedToy.brand}</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-dark tracking-tight leading-none mb-6">{selectedToy.name}</h2>
                
                <div className="flex items-center space-x-6 mb-10">
                  <div className="bg-canvas p-4 rounded-2xl border border-dark/5">
                    <p className="text-[10px] font-black text-dark/30 uppercase tracking-widest mb-1">Target Age</p>
                    <p className="font-black text-dark">{selectedToy.ageRange} Years</p>
                  </div>
                  <div className="bg-canvas p-4 rounded-2xl border border-dark/5">
                    <p className="text-[10px] font-black text-dark/30 uppercase tracking-widest mb-1">Condition</p>
                    <p className="font-black text-accent flex items-center">
                      <Sparkles size={16} className="mr-1" />
                      Sanitized
                    </p>
                  </div>
                </div>

                <div className="mb-12 flex-grow">
                  <h4 className="text-dark font-black uppercase text-xs tracking-widest mb-4">Description</h4>
                  <p className="text-dark/60 font-medium leading-relaxed italic border-l-4 border-secondary/10 pl-6 mb-8">
                    {selectedToy.shortDescription}
                  </p>
                  <p className="text-dark/70 font-medium leading-relaxed">
                    {selectedToy.fullDescription}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-dark/5">
                  <button
                    onClick={() => {
                      setSelectedToy(null);
                      navigate('/plans');
                    }}
                    className="flex-grow py-5 bg-dark text-white font-black rounded-[2rem] shadow-2xl shadow-dark/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-95 hover:bg-primary"
                  >
                    <span>Rent This Toy</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

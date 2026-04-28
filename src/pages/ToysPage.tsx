
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, X, Star, Calendar, ChevronDown } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight font-display">Our Toy Library</h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            High-quality, sanitized toys delivered to your door. Filter by age, category, or interest.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search toys..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredToys.map((toy) => (
            <motion.div
              layoutId={toy.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              key={toy.id}
              onClick={() => setSelectedToy(toy)}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={toy.image}
                  alt={toy.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                  {toy.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors font-display">
                    {toy.name}
                  </h3>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar size={14} className="mr-1" />
                  <span>Age: {toy.ageRange}</span>
                </div>
                
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow">
                  {toy.shortDescription}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/plans');
                  }}
                  className="w-full py-3 bg-gray-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                >
                  Subscribe to Rent
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredToys.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white p-8 rounded-3xl shadow-sm inline-block">
              <Star size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No toys found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          </div>
        )}
      </div>

      {/* Toy Details Overlay (Same Page) */}
      <AnimatePresence>
        {selectedToy && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedToy(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div
              layoutId={selectedToy.id}
              className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedToy(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 shadow-md hover:bg-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <img
                  src={selectedToy.image}
                  alt={selectedToy.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    {selectedToy.category}
                  </span>
                  <span className="text-sm font-medium text-gray-500">Brand: {selectedToy.brand}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedToy.name}</h2>
                
                <div className="flex items-center text-gray-700 font-medium mb-8 bg-gray-50 px-4 py-3 rounded-2xl w-fit">
                  <Star className="text-yellow-400 mr-2" size={18} fill="currentColor" />
                  <span>Age Range: {selectedToy.ageRange}</span>
                </div>

                <div className="prose prose-indigo max-w-none mb-10">
                  <h4 className="text-gray-900 font-bold mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedToy.fullDescription}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate('/plans')}
                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-[0.98]"
                  >
                    Subscribe to Rent
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

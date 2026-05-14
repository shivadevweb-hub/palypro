
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle2, ChevronRight, AlertCircle, Plus, Minus, X, Loader2, Truck, Clock, Package, Sparkles, Box } from 'lucide-react';
import { usePlay } from '../PlayContext';
import { motion, AnimatePresence } from 'motion/react';

export const SelectionPage = () => {
  const { toys, currentPlan, selectedToys, toggleToySelection, orders } = usePlay();
  const [filter, setFilter] = useState('All');
  const [togglingToyId, setTogglingToyId] = useState<string | null>(null);
  const navigate = useNavigate();

  const activeOrder = orders.find(o => o.status !== 'swapped');

  if (!currentPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md text-center border border-dark/5">
          <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-dark mb-4">No Plan Selected</h2>
          <p className="text-dark/40 font-medium mb-10 leading-relaxed">Please choose a subscription plan before selecting your toys.</p>
          <Link to="/plans" className="inline-block w-full py-5 bg-dark text-white font-black rounded-2xl hover:bg-dark/90 transition-all shadow-xl shadow-dark/20 hover:scale-[1.02] active:scale-95">
            View Plans
          </Link>
        </div>
      </div>
    );
  }

  const calculateDaysLeft = (expiryDate: any) => {
    if (!expiryDate) return null;
    const expiry = expiryDate.toDate ? expiryDate.toDate() : new Date(expiryDate);
    const diffTime = expiry.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleToggleToy = async (toy: any) => {
    setTogglingToyId(toy.id);
    try {
      await toggleToySelection(toy);
    } finally {
      setTogglingToyId(null);
    }
  };

  const filteredToys = filter === 'All' ? toys : toys.filter(t => t.category === filter);
  const categories = ['All', ...new Set(toys.map(t => t.category))];
  const remainingSlots = currentPlan.toyCount - selectedToys.length;

  return (
    <div className="min-h-screen bg-canvas pb-48 pt-20">
      {/* Active Subscription Banner */}
      <AnimatePresence mode="wait">
        {activeOrder && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-dark text-white"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden">
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 p-2 rounded-xl">
                  {activeOrder.status === 'pending' ? (
                    <Truck size={20} className="animate-pulse text-secondary" />
                  ) : (
                    <Package size={20} className="text-accent" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">Current Status</p>
                  <p className="text-sm font-bold tracking-tight">
                    {activeOrder.status === 'pending' ? 'Box being prepared for delivery' : 'Toys delivered & playing'}
                  </p>
                </div>
              </div>
              
              {activeOrder.status === 'delivered' && (
                <div className="flex items-center space-x-4">
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center space-x-2">
                    <Clock size={16} className="text-secondary" />
                    <span className="text-xs font-black uppercase tracking-widest">{calculateDaysLeft(activeOrder.expiryDate)} Days Until Swap</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Status Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-dark/5 sticky top-16 z-50 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-dark text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-dark/20">
                <Box size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-dark tracking-tighter leading-none mb-1">Pick Your Bundle.</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dark/30">
                  <span className="text-primary">{currentPlan.name} Plan</span> — {currentPlan.toyCount} Toys Total
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-12">
              <div className="hidden lg:flex flex-col items-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-dark/30 mb-2">Box Progress</p>
                <div className="flex items-center space-x-4">
                  <div className="w-48 h-3 bg-dark/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      layout
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedToys.length / currentPlan.toyCount) * 100}%` }}
                      className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_20px_rgba(255,122,89,0.4)]"
                    />
                  </div>
                  <span className="text-xl font-black text-dark tracking-tighter">
                    {selectedToys.length}<span className="text-dark/20 text-sm">/{currentPlan.toyCount}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/cart')}
                disabled={selectedToys.length === 0}
                className={`h-16 px-12 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center space-x-2 transition-all shadow-2xl overflow-hidden relative group/btn ${
                  selectedToys.length === currentPlan.toyCount
                    ? 'bg-dark text-white shadow-dark/20 hover:scale-105 active:scale-95'
                    : 'bg-dark/5 text-dark/20 border border-dark/5 cursor-not-allowed'
                }`}
              >
                <span className="relative z-10">Finalize Box</span>
                <ChevronRight className="relative z-10 group-hover/btn:translate-x-1 transition-transform" size={20} />
                <div className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16">
        {/* Categories Scroller */}
        <div className="flex items-center space-x-3 mb-16 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-dark text-white shadow-xl shadow-dark/20 scale-105'
                  : 'bg-white text-dark/30 border border-dark/5 hover:border-dark/10 hover:text-dark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Toys Selection Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
        >
          {filteredToys.map((toy) => {
            const isSelected = selectedToys.find(t => t.id === toy.id);
            return (
              <motion.div 
                layout
                key={toy.id}
                className={`relative bg-white rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 flex flex-col h-full group ${
                  isSelected 
                    ? 'border-primary ring-8 ring-primary/5 shadow-2xl scale-[1.02]' 
                    : 'border-dark/5 shadow-xl shadow-dark/5'
                }`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={toy.image} alt={toy.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1 bg-white/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-xl text-dark shadow-sm">
                      {toy.ageRange} Yrs
                    </span>
                  </div>

                  {isSelected && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[2px]"
                    >
                      <div className="bg-white w-16 h-16 rounded-full text-primary shadow-2xl flex items-center justify-center animate-bounce">
                        <CheckCircle2 size={32} />
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-dark tracking-tight leading-tight mb-2">{toy.name}</h3>
                    <p className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em]">{toy.category}</p>
                  </div>
                  
                  <button
                    onClick={() => handleToggleToy(toy)}
                    disabled={(!isSelected && remainingSlots === 0) || togglingToyId !== null}
                    className={`mt-auto w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center transition-all disabled:opacity-50 ${
                      isSelected
                        ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                        : remainingSlots === 0
                          ? 'bg-dark/5 text-dark/10 cursor-not-allowed border border-dashed border-dark/10'
                          : 'bg-dark text-white hover:bg-dark/80 hover:scale-[1.02]'
                    }`}
                  >
                    {togglingToyId === toy.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : isSelected ? (
                      <>
                        <Minus className="mr-2" size={16} strokeWidth={3} /> Remove
                      </>
                    ) : remainingSlots === 0 ? (
                      'Full'
                    ) : (
                      <>
                        <Plus className="mr-2" size={16} strokeWidth={3} /> Add to Box
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Floating Selection Bar */}
      <AnimatePresence>
        {selectedToys.length > 0 && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-10 inset-x-4 md:inset-x-0 mx-auto max-w-5xl z-50"
          >
            <div className="bg-dark/80 backdrop-blur-3xl text-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] p-6 md:p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 w-full overflow-hidden">
                <div className="flex items-center justify-between mb-4 md:hidden">
                  <p className="text-xl font-black">{selectedToys.length}/{currentPlan.toyCount} Selected</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">View All</p>
                </div>

                <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide py-2">
                  <div className="hidden lg:block shrink-0 pr-8 border-r border-white/10 mr-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">My Monthly Box</p>
                    <p className="text-3xl font-black text-white">{selectedToys.length}<span className="text-sm opacity-20">/{currentPlan.toyCount}</span></p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {selectedToys.map(toy => (
                      <motion.div 
                        layout
                        initial={{ scale: 0, x: -20 }}
                        animate={{ scale: 1, x: 0 }}
                        key={toy.id} 
                        className="relative w-20 h-20 group shrink-0"
                      >
                        <img src={toy.image} className="w-full h-full object-cover rounded-[1.5rem] border-2 border-white/10 shadow-2xl" />
                        <button 
                          onClick={() => handleToggleToy(toy)}
                          className="absolute -top-2 -right-2 bg-primary text-white rounded-xl p-2 shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:rotate-90"
                        >
                          <X size={14} strokeWidth={4} />
                        </button>
                      </motion.div>
                    ))}
                    {Array.from({ length: remainingSlots }).map((_, i) => (
                      <div key={`empty-${i}`} className="w-20 h-20 rounded-[1.5rem] border-4 border-dashed border-white/5 flex items-center justify-center text-white/10">
                        <Plus size={24} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/cart')}
                disabled={selectedToys.length === 0}
                className={`h-20 px-12 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_rgba(255,122,89,0.3)] transition-all flex items-center space-x-3 whitespace-nowrap overflow-hidden relative group/btn-final ${
                  selectedToys.length === currentPlan.toyCount
                    ? 'bg-primary text-white hover:scale-105 active:scale-95'
                    : 'bg-white/10 text-white/40 cursor-not-allowed grayscale'
                }`}
              >
                <span className="relative z-10">Checkout Box</span>
                <ChevronRight className="relative z-10 group-hover/btn-final:translate-x-1 transition-transform" size={20} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

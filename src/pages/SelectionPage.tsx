
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle2, ChevronRight, AlertCircle, Plus, Minus, X, Loader2, Truck, Clock, Package } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Plan Selected</h2>
          <p className="text-gray-500 mb-8">Please choose a subscription plan before selecting your toys.</p>
          <Link to="/plans" className="inline-block w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
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
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Active Subscription Banner */}
      <AnimatePresence>
        {activeOrder && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-indigo-600 text-white"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2 overflow-hidden">
              <div className="flex items-center space-x-3">
                {activeOrder.status === 'pending' ? (
                  <>
                    <Truck size={18} className="animate-bounce" />
                    <span className="text-sm font-bold uppercase tracking-wide">📦 Box is being prepared for delivery</span>
                  </>
                ) : (
                  <>
                    <Package size={18} />
                    <span className="text-sm font-bold uppercase tracking-wide">🏠 Toys Delivered & Playing</span>
                  </>
                )}
              </div>
              
              {activeOrder.status === 'delivered' && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-white/30 shadow-lg">
                    <Clock size={14} />
                    <span>{calculateDaysLeft(activeOrder.expiryDate)} Days Left</span>
                  </div>
                  <span className="text-[10px] font-black uppercase opacity-60 tracking-tighter">Swap opens when time runs out</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Status Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 font-display">Choose your {currentPlan.toyCount} Toys</h2>
            <p className="text-xs text-indigo-400 font-black uppercase tracking-widest mt-1">Tier: {currentPlan.name}</p>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(selectedToys.length / currentPlan.toyCount) * 100}%` }}
                  className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full shadow-lg shadow-indigo-100"
                />
              </div>
              <span className="text-sm font-black text-gray-900">{selectedToys.length}/{currentPlan.toyCount}</span>
            </div>

            <button
              onClick={() => navigate('/cart')}
              disabled={selectedToys.length === 0}
              className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center transition-all shadow-xl ${
                selectedToys.length === currentPlan.toyCount
                  ? 'bg-indigo-600 text-white shadow-indigo-100 scale-105'
                  : 'bg-white border border-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              Finalize Box
              <ChevronRight className="ml-2" size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center space-x-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap border-2 transition-all ${
                filter === cat
                  ? 'bg-gray-900 text-white border-gray-900 shadow-2xl scale-110'
                  : 'bg-white text-gray-400 border-gray-50 hover:border-indigo-100 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredToys.map((toy) => {
            const isSelected = selectedToys.find(t => t.id === toy.id);
            return (
              <div 
                key={toy.id}
                className={`relative bg-white rounded-[2.5rem] overflow-hidden border-2 transition-all flex flex-col h-full group ${
                  isSelected ? 'border-indigo-600 ring-8 ring-indigo-50 shadow-2xl' : 'border-gray-50 shadow-lg shadow-gray-100/50'
                }`}
              >
                <div className="relative aspect-[1/1] overflow-hidden">
                  <img src={toy.image} alt={toy.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest rounded-full text-indigo-600 shadow-sm">
                      {toy.ageRange}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white p-3 rounded-full text-indigo-600 shadow-2xl scale-110">
                        <CheckCircle2 size={32} />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{toy.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{toy.category}</p>
                  
                  <button
                    onClick={() => handleToggleToy(toy)}
                    disabled={(!isSelected && remainingSlots === 0) || togglingToyId !== null}
                    className={`mt-auto w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center transition-all disabled:opacity-50 ${
                      isSelected
                        ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                        : remainingSlots === 0
                          ? 'bg-gray-50 text-gray-200 cursor-not-allowed'
                          : 'bg-gray-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-100'
                    }`}
                  >
                    {togglingToyId === toy.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : isSelected ? (
                      <>
                        <Minus className="mr-2" size={16} /> Drop Toy
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2" size={16} /> Take This
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selection Drawer (Mobile/Sticky) */}
      <AnimatePresence>
        {selectedToys.length > 0 && (
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            className="fixed bottom-10 inset-x-4 md:inset-x-0 mx-auto max-w-4xl bg-gray-900 text-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] p-6 z-40 border border-white/10 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-1">
                <div className="hidden md:block pr-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Box Contents</p>
                  <p className="text-xl font-black text-white">{selectedToys.length}/{currentPlan.toyCount}</p>
                </div>
                {selectedToys.map(toy => (
                  <div key={toy.id} className="relative w-16 h-16 flex-shrink-0 group">
                    <img src={toy.image} className="w-full h-full object-cover rounded-2xl border-2 border-white/20" />
                    <button 
                      onClick={() => handleToggleToy(toy)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => navigate('/cart')}
                disabled={selectedToys.length === 0}
                className="bg-indigo-600 text-white h-16 px-10 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-500/40 hover:bg-indigo-500 hover:scale-105 transition-all whitespace-nowrap"
              >
                Go to Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

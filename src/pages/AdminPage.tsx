
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Box, Truck, CheckCircle2, Clock, MapPin, LayoutDashboard, Sparkles, Database, ArrowRight } from 'lucide-react';
import { usePlay } from '../PlayContext';
import { Toy } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

export const AdminPage = () => {
  const { toys, orders, addToy, updateToy, deleteToy, markOrderAsDelivered, seedDatabase, dbStatus } = usePlay();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'deliveries' | 'inventory'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingToy, setEditingToy] = useState<Toy | null>(null);

  const [formData, setFormData] = useState<Partial<Toy>>({
    name: '',
    category: 'Educational',
    ageRange: '3-5 Years',
    shortDescription: '',
    fullDescription: '',
    brand: '',
    image: '',
    available: true
  });

  const handleOpenModal = (toy?: Toy) => {
    if (toy) {
      setEditingToy(toy);
      setFormData(toy);
    } else {
      setEditingToy(null);
      setFormData({
        name: '',
        category: 'Educational',
        ageRange: '3-5 Years',
        shortDescription: '',
        fullDescription: '',
        brand: '',
        image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&q=80&w=800',
        available: true
      });
    }
    setIsModalOpen(true);
  };

  const calculateDaysLeft = (expiryDate: any) => {
    if (!expiryDate) return null;
    const expiry = expiryDate.toDate ? expiryDate.toDate() : new Date(expiryDate);
    const diffTime = expiry.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderDashboard = () => {
    const stats = [
      { label: 'Active Orders', value: orders.filter(o => o.status === 'delivered').length, icon: Box, color: 'text-primary', bg: 'bg-primary/5' },
      { label: 'Pending Delivery', value: orders.filter(o => o.status === 'pending').length, icon: Truck, color: 'text-secondary', bg: 'bg-secondary/5' },
      { label: 'Library Size', value: toys.length, icon: Database, color: 'text-accent', bg: 'bg-accent/5' },
      { label: 'Total Operations', value: orders.length, icon: CheckCircle2, color: 'text-dark', bg: 'bg-dark/5' },
    ];

    return (
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[3rem] border border-dark/5 shadow-xl shadow-dark/5 group hover:scale-[1.02] transition-all"
            >
              <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={32} />
              </div>
              <div className="text-5xl font-black text-dark tracking-tighter mb-2 italic">{stat.value}</div>
              <div className="text-dark/40 font-black text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-12 rounded-[4rem] border border-dark/5 shadow-2xl shadow-dark/5"
          >
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-dark tracking-tighter italic">Recent Transmissions.</h3>
              <button className="text-secondary font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center">
                Review All <ArrowRight size={14} className="ml-2" />
              </button>
            </div>
            <div className="space-y-6">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-6 bg-canvas rounded-[2rem] border border-dark/5 group hover:bg-dark hover:text-white transition-all duration-500">
                  <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center italic font-black text-primary border border-dark/5 group-hover:bg-primary group-hover:text-white transition-colors">
                      {order.userName[0]}
                    </div>
                    <div>
                      <div className="font-black tracking-tight text-lg leading-none mb-1">{order.userName}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-60">{order.status}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black tracking-widest opacity-30 group-hover:opacity-50">
                    {new Date(order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark p-12 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(30,41,59,0.3)] relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white tracking-tighter mb-10 italic">System Status.</h3>
              <div className="flex flex-col items-center justify-center h-64 text-white/20 font-black text-[10px] uppercase tracking-[0.3em]">
                <Sparkles size={40} className="mb-6 opacity-40 animate-pulse" />
                <span>Monitoring Live Feeds...</span>
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full" />
          </motion.div>
        </div>
      </div>
    );
  };

  const renderDeliveries = () => (
    <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-dark/5 border border-dark/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-canvas/50 text-dark/30 text-[10px] font-black uppercase tracking-[0.2em] border-b border-dark/5">
              <th className="px-10 py-8 italic">Customer & Target</th>
              <th className="px-10 py-8 text-center uppercase tracking-[0.2em]">Package Manifest</th>
              <th className="px-10 py-8 text-center uppercase tracking-[0.2em]">Deployment</th>
              <th className="px-10 py-8 text-center uppercase tracking-[0.2em]">Time Window</th>
              <th className="px-10 py-8 text-right uppercase tracking-[0.2em]">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/5">
            {orders.map((order) => {
              const daysLeft = calculateDaysLeft(order.expiryDate);
              return (
                <tr key={order.id} className="hover:bg-canvas transition-colors">
                  <td className="px-10 py-10">
                    <div>
                      <div className="font-black text-dark text-xl tracking-tighter mb-1 leading-none">{order.userName}</div>
                      <div className="flex items-center text-dark/30 text-[10px] font-black uppercase tracking-widest">
                        <MapPin size={12} className="mr-2 text-secondary" />
                        {order.shippingAddress}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex items-center justify-center -space-x-3">
                      {order.toyNames.map((name, i) => (
                        <div key={i} title={name} className="w-10 h-10 rounded-xl bg-white border-2 border-canvas flex items-center justify-center text-[10px] font-black text-primary shadow-sm hover:z-10 hover:scale-110 transition-transform">
                          {name[0]}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-10 text-center">
                    <span className={`px-4 py-2 text-[10px] font-black rounded-full uppercase tracking-widest ${
                      order.status === 'delivered' ? 'bg-accent/10 text-accent' : 
                      order.status === 'pending' ? 'bg-secondary/10 text-secondary' : 
                      'bg-dark/5 text-dark/40'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex items-center justify-center">
                      {order.status === 'delivered' ? (
                        <div className={`flex items-center font-black text-lg tracking-tighter italic ${daysLeft && daysLeft < 5 ? 'text-primary' : 'text-dark'}`}>
                          <Clock size={16} className="mr-2 opacity-30" />
                          {daysLeft} Days
                        </div>
                      ) : (
                        <span className="text-dark/10 font-bold uppercase tracking-widest text-[10px]">Awaiting Fix</span>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-10 text-right">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => markOrderAsDelivered(order.id)}
                        className="px-8 py-4 bg-dark text-white text-[10px] font-black rounded-[1.2rem] shadow-xl shadow-dark/20 hover:bg-secondary hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                      >
                        Authorize
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <div className="text-accent">
                        <CheckCircle2 size={32} className="ml-auto opacity-40" />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-10">
      {toys.length === 0 && (
        <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-dark/5 shadow-2xl shadow-dark/5">
          <div className="w-24 h-24 bg-canvas rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-dark/20">
            <Box size={48} />
          </div>
          <h4 className="text-4xl font-black text-dark tracking-tighter mb-4 italic">Library is empty.</h4>
          <p className="text-dark/40 font-medium text-lg mb-12 max-w-md mx-auto">Sync the default premium collection to begin operations.</p>
          <button 
            onClick={() => seedDatabase()}
            className="px-12 py-5 bg-dark text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-dark/20 hover:scale-105 transition-all"
          >
            Seed Collection
          </button>
        </div>
      )}
      <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-dark/5 border border-dark/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-canvas/50 text-dark/30 text-[10px] font-black uppercase tracking-[0.2em] border-b border-dark/5">
                <th className="px-10 py-8 italic">Asset Identity</th>
                <th className="px-10 py-8 uppercase tracking-[0.2em]">Genre</th>
                <th className="px-10 py-8 text-center uppercase tracking-[0.2em]">Maturity</th>
                <th className="px-10 py-8 text-right uppercase tracking-[0.2em]">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {toys.map((toy) => (
                <tr key={toy.id} className="hover:bg-canvas transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-dark/5">
                        <img src={toy.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-black text-dark text-xl tracking-tighter leading-none mb-1">{toy.name}</div>
                        <div className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em]">{toy.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-2 bg-dark text-white text-[9px] font-black rounded-full uppercase tracking-widest italic group-hover:bg-primary transition-colors">
                      {toy.category}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="text-lg font-black text-dark tracking-tighter italic">{toy.ageRange}</div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end space-x-4">
                      <button 
                        onClick={() => handleOpenModal(toy)}
                        className="w-10 h-10 flex items-center justify-center bg-canvas text-dark/40 hover:bg-dark hover:text-white rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteToy(toy.id)}
                        className="w-10 h-10 flex items-center justify-center bg-canvas text-dark/40 hover:bg-primary hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas pb-40">
      {/* Header / Nav */}
      <section className="bg-white border-b border-dark/5 pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-inner ${
                  dbStatus === 'connected' ? 'bg-accent/10 text-accent' : 
                  dbStatus === 'connecting' ? 'bg-yellow-500/10 text-yellow-600 animate-pulse' :
                  'bg-secondary/10 text-secondary'
                }`}>
                  {dbStatus === 'connected' ? '● Core Online' : 
                   dbStatus === 'connecting' ? '○ Syncing...' : 
                   '○ Offline Mode'}
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-dark tracking-tighter leading-none mb-4 italic">
                Commander<span className="text-primary">.</span>
              </h1>
              <p className="text-dark/40 font-medium text-xl max-w-xl">Central hub for logistics, deployment, and inventory assets.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex bg-canvas p-2 rounded-[2rem] border border-dark/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]"
            >
              {[
                { id: 'dashboard', icon: LayoutDashboard },
                { id: 'deliveries', icon: Truck },
                { id: 'inventory', icon: Box }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                    activeTab === tab.id ? 'bg-white shadow-xl shadow-dark/5 text-dark' : 'text-dark/30 hover:text-dark/60'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.id}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-16 px-4">
          <h2 className="text-5xl font-black text-dark tracking-tighter italic capitalize">
            {activeTab}<span className="text-secondary">.</span>
          </h2>
          {activeTab === 'inventory' && (
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-10 py-5 bg-dark text-white font-black rounded-3xl shadow-2xl shadow-dark/20 hover:scale-[1.02] active:scale-95 transition-all text-[10px] uppercase tracking-widest"
            >
              <Plus className="mr-3" size={20} />
              Register Asset
            </button>
          )}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-4"
        >
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'deliveries' && renderDeliveries()}
          {activeTab === 'inventory' && renderInventory()}
        </motion.div>
      </div>

      {/* Modern Asset Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-dark/20 backdrop-blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white rounded-[4rem] shadow-[0_50px_150px_-30px_rgba(30,41,59,0.5)] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-dark/5"
            >
              <div className="px-12 py-10 border-b border-dark/5 flex items-center justify-between bg-canvas/30 backdrop-blur-xl">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/30 mb-2">Inventory Management</p>
                  <h3 className="text-4xl font-black text-dark tracking-tighter italic leading-none">
                    {editingToy ? 'Modify Record.' : 'New Asset Registration.'}
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-16 h-16 flex items-center justify-center bg-dark text-white rounded-3xl hover:scale-110 transition-transform shadow-xl shadow-dark/20 group">
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const toyData = {
                  ...formData,
                  id: editingToy ? editingToy.id : Math.random().toString(36).substr(2, 9),
                } as Toy;
                if (editingToy) updateToy(toyData);
                else addToy(toyData);
                setIsModalOpen(false);
              }} className="p-12 overflow-y-auto space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest ml-1">Asset Identity</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-8 py-6 bg-canvas border-none rounded-3xl focus:ring-4 focus:ring-primary/10 transition-all font-bold placeholder:text-dark/10"
                      placeholder="e.g. Super Rocket X"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest ml-1">Manufacturer</label>
                    <input
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full px-8 py-6 bg-canvas border-none rounded-3xl focus:ring-4 focus:ring-secondary/10 transition-all font-bold placeholder:text-dark/10"
                      placeholder="e.g. Tesla Toys"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest ml-1">Core Genre</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-8 py-6 bg-canvas border-none rounded-3xl focus:ring-4 focus:ring-accent/10 transition-all font-bold appearance-none cursor-pointer"
                    >
                      {['Educational', 'STEM', 'Building', 'Creative', 'Outdoor'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest ml-1">Target Maturity</label>
                    <select
                      value={formData.ageRange}
                      onChange={(e) => setFormData({...formData, ageRange: e.target.value})}
                      className="w-full px-8 py-6 bg-canvas border-none rounded-3xl focus:ring-4 focus:ring-primary/10 transition-all font-bold appearance-none cursor-pointer"
                    >
                      {['0-3 Years', '3-5 Years', '5-8 Years', '8-12 Years', 'Everyone'].map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest ml-1">Visual Asset URL</label>
                  <div className="flex items-center space-x-6">
                    <input
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="flex-1 px-8 py-6 bg-canvas border-none rounded-3xl focus:ring-4 focus:ring-secondary/10 transition-all font-bold placeholder:text-dark/10"
                      placeholder="https://..."
                    />
                    <div className="w-20 h-20 bg-canvas rounded-[1.5rem] overflow-hidden shadow-inner border border-dark/5 p-1">
                      <img src={formData.image} className="w-full h-full object-cover rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest ml-1">Manifest One-Liner</label>
                  <textarea
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                    className="w-full px-8 py-6 bg-canvas border-none rounded-[2rem] focus:ring-4 focus:ring-accent/10 transition-all font-bold h-32 resize-none placeholder:text-dark/10"
                    placeholder="Brief objective summary..."
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full py-8 bg-dark text-white font-black rounded-[2.5rem] shadow-2xl shadow-dark/30 hover:scale-[1.02] active:scale-98 transition-all uppercase tracking-[0.2em] text-xs"
                  >
                    {editingToy ? 'Commit Record Override' : 'Finalize Asset Deployment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

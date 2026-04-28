
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, LayoutDashboard, Box, Truck, CheckCircle2, Clock, MapPin, Users } from 'lucide-react';
import { usePlay } from '../PlayContext';
import { Toy } from '../data/mockData';
import { Order } from '../PlayContext';
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
      { label: 'Active Orders', value: orders.filter(o => o.status === 'delivered').length, icon: Box, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Pending Delivery', value: orders.filter(o => o.status === 'pending').length, icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Total Library', value: toys.length, icon: Box, color: 'text-pink-600', bg: 'bg-pink-50' },
      { label: 'Total Swaps', value: orders.filter(o => o.status === 'swapped').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
            >
              <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon size={28} />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-500 font-bold text-sm uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-black text-gray-900 mb-8 font-display">Recent Orders</h3>
            <div className="space-y-6">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 italic font-black text-indigo-600">
                      {order.userName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{order.userName}</div>
                      <div className="text-xs text-gray-400 capitalize">{order.status}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-400">
                    {new Date(order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-black text-gray-900 mb-8 font-display">Activity Monitor</h3>
            <div className="flex items-center justify-center h-64 text-gray-400 font-bold italic">
              Real-time activity graph coming soon...
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDeliveries = () => (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-50">
            <th className="px-8 py-5">Customer & Address</th>
            <th className="px-8 py-5">Toys in Box</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5">Time Left</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((order) => {
            const daysLeft = calculateDaysLeft(order.expiryDate);
            return (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div>
                    <div className="font-black text-gray-900 text-lg mb-1">{order.userName}</div>
                    <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-tight">
                      <MapPin size={14} className="mr-1 text-indigo-600" />
                      {order.shippingAddress}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex -space-x-2">
                    {order.toyNames.map((name, i) => (
                      <div key={i} title={name} className="w-8 h-8 rounded-lg bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-600">
                        {name[0]}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {order.status === 'delivered' ? (
                    <div className={`flex items-center font-black ${daysLeft && daysLeft < 5 ? 'text-red-500' : 'text-gray-900'}`}>
                      <Clock size={16} className="mr-2" />
                      {daysLeft} Days
                    </div>
                  ) : (
                    <span className="text-gray-300 font-bold">--</span>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => markOrderAsDelivered(order.id)}
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest"
                    >
                      Deliver
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <div className="text-green-500">
                      <CheckCircle2 size={24} className="ml-auto" />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      {toys.length === 0 && (
        <div className="bg-indigo-50 p-10 rounded-[3rem] text-center border-2 border-dashed border-indigo-200">
          <Box className="mx-auto text-indigo-300 mb-4" size={48} />
          <h4 className="text-xl font-bold text-indigo-900 mb-2">Library is Empty</h4>
          <p className="text-indigo-600/60 mb-6 font-medium">Would you like to sync the default toy collection to your database?</p>
          <button 
            onClick={() => {
              if(confirm('This will upload the default 50+ toys to your live database. Proceed?')) {
                seedDatabase();
              }
            }}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100"
          >
            Sync Default Collection
          </button>
        </div>
      )}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-50">
            <th className="px-8 py-5">Toy Details</th>
            <th className="px-8 py-5">Category</th>
            <th className="px-8 py-5">Age Range</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {toys.map((toy) => (
            <tr key={toy.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-8 py-5">
                <div className="flex items-center space-x-4">
                  <img src={toy.image} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                  <div>
                    <div className="font-bold text-gray-900">{toy.name}</div>
                    <div className="text-xs text-gray-400">{toy.brand}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase">
                  {toy.category}
                </span>
              </td>
              <td className="px-8 py-5 text-sm text-gray-500">{toy.ageRange}</td>
              <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button 
                    onClick={() => handleOpenModal(toy)}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => { if(confirm('Delete toy?')) deleteToy(toy.id); }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100 pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-gray-900 font-display">PlayPro Commander</h1>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  dbStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {dbStatus === 'connected' ? '● System Online' : '○ Synchronizing...'}
                </span>
              </div>
              <p className="text-gray-500 font-medium italic">Command center for logistics and toy inventory.</p>
            </div>

            <div className="flex bg-gray-50 p-1.5 rounded-3xl border border-gray-100">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'dashboard' ? 'bg-white shadow-xl shadow-indigo-100/50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => setActiveTab('deliveries')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'deliveries' ? 'bg-white shadow-xl shadow-indigo-100/50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Truck size={18} />
                <span>Deliveries</span>
              </button>
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'inventory' ? 'bg-white shadow-xl shadow-indigo-100/50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Box size={18} />
                <span>Inventory</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 font-display capitalize">
            {activeTab}
          </h2>
          {activeTab === 'inventory' && (
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs"
            >
              <Plus className="mr-2" size={18} />
              Add Toy
            </button>
          )}
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'deliveries' && renderDeliveries()}
        {activeTab === 'inventory' && renderInventory()}
      </div>

      {/* Admin Modal (Same as before but stylized) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-indigo-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[3.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-3xl font-black text-gray-900 font-display">
                  {editingToy ? 'Edit Masterpiece' : 'New Toy Entry'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-2xl transition-colors">
                  <X size={24} />
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
              }} className="p-10 overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Brand</label>
                    <input
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Genre</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                    >
                      {['Educational', 'STEM', 'Building', 'Creative', 'Outdoor'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Maturity</label>
                    <select
                      value={formData.ageRange}
                      onChange={(e) => setFormData({...formData, ageRange: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                    >
                      {['0-3 Years', '3-5 Years', '5-8 Years', '8-12 Years', 'Everyone'].map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Visual URL</label>
                  <div className="flex space-x-4">
                    <input
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="flex-1 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                    />
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden shadow-inner">
                      <img src={formData.image} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">One-Liner</label>
                  <input
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-6 bg-gray-900 text-white font-black rounded-3xl shadow-2xl hover:bg-indigo-600 transition-all uppercase tracking-widest text-sm"
                  >
                    {editingToy ? 'Update Records' : 'Release to Library'}
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

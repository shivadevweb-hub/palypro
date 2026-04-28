
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, User, BrainCircuit, Loader2, Plus, Check, ShoppingBag } from 'lucide-react';
import { getToyRecommendations, RecommendationResponse } from '../services/geminiService';
import { TOYS, Toy } from '../data/mockData';
import { Link, useNavigate } from 'react-router-dom';
import { usePlay } from '../PlayContext';

export const AIParentConcierge = () => {
  const { user, currentPlan, selectedToys, toggleToySelection, login, toys: liveToys } = usePlay();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; recommendations?: Toy[] }[]>([
    { role: 'ai', content: "Hello! I'm your PlayPro AI Concierge. Tell me about your child's age or what they love doing, and I'll find the perfect developmental toys for them!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getToyRecommendations(userMessage);
      
      // Use live toys from context instead of static mock data
      const recommendedToys = liveToys.filter(t => 
        response.recommendedToyIds.includes(t.id) || 
        response.recommendedToyIds.includes(t.name.toLowerCase().replace(/\s+/g, '-')) // Fallback for ID matching
      );
      
      // If no ID matches found, try searching by name
      if (recommendedToys.length === 0) {
        const fuzzyMatches = liveToys.filter(t => 
          response.recommendedToyIds.some(recId => 
            t.name.toLowerCase().includes(recId.replace(/-/g, ' '))
          )
        );
        if (fuzzyMatches.length > 0) recommendedToys.push(...fuzzyMatches);
      }

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: response.advice,
        recommendations: recommendedToys.slice(0, 3) // Max 3 recommendations for clean UI
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error. Please try again or check your internet connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelection = async (toy: Toy) => {
    if (!user) {
      if (confirm("Please sign in to select toys. Would you like to sign in now?")) {
        await login();
      }
      return;
    }
    
    if (!currentPlan) {
      alert("Please choose a subscription plan first.");
      navigate('/plans');
      setIsOpen(false);
      return;
    }

    try {
      await toggleToySelection(toy);
    } catch (error) {
      console.error("Selection failed", error);
    }
  };

  const isToySelected = (toyId: string) => {
    return selectedToys.some(t => t.id === toyId);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all group"
            id="ai-toggle-btn"
          >
            <Sparkles className="group-hover:animate-pulse" size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white w-[350px] sm:w-[400px] h-[600px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            id="ai-chat-window"
          >
            {/* Header */}
            <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Parent Concierge</h3>
                  <div className="flex items-center space-x-1 outline-none">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-indigo-100 uppercase font-bold tracking-wider">Expert Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                id="close-chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Top Matches:</p>
                          {selectedToys.length > 0 && (
                            <Link 
                              to="/cart" 
                              onClick={() => setIsOpen(false)}
                              className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center hover:underline"
                            >
                              <ShoppingBag size={12} className="mr-1" />
                              View Box ({selectedToys.length})
                            </Link>
                          )}
                        </div>
                        <div className="space-y-3">
                          {msg.recommendations.map(toy => {
                            const selected = isToySelected(toy.id);
                            const canSelectMore = currentPlan && selectedToys.length < currentPlan.toyCount;

                            return (
                              <div 
                                key={toy.id}
                                className="flex items-center space-x-3 p-2 bg-indigo-50 rounded-xl group relative overflow-hidden"
                              >
                                <div className="flex-shrink-0">
                                  <img src={toy.image} alt={toy.name} className="w-12 h-12 rounded-lg object-cover" />
                                </div>
                                <div className="flex-grow min-w-0 pr-10">
                                  <p className="text-xs font-bold text-gray-900 line-clamp-1">{toy.name}</p>
                                  <p className="text-[10px] text-gray-500">{toy.ageRange}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleToggleSelection(toy);
                                  }}
                                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all z-10 ${
                                    selected 
                                      ? 'bg-emerald-500 text-white shadow-lg' 
                                      : 'bg-white text-indigo-600 shadow-sm hover:shadow-md hover:scale-110 active:scale-95'
                                  }`}
                                  disabled={!selected && !canSelectMore && !!currentPlan}
                                  title={selected ? "Remove from selection" : "Add to selection"}
                                >
                                  {selected ? <Check size={16} /> : <Plus size={16} />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <Loader2 className="animate-spin text-indigo-600" size={20} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for advice or recommendations..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-sm"
                  id="ai-chat-input"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1.5 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 transition-all shadow-lg shadow-indigo-100"
                  id="send-message"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-3">
                Powered by Gemini AI • Personalized for your child
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, User, BrainCircuit, Loader2, Plus, Check, Info } from 'lucide-react';
import { getGemini } from '../services/geminiService';
import { Toy } from '../data/mockData';
import { usePlay } from '../PlayContext';
import { SchemaType } from '@google/generative-ai';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  recommendations?: Toy[];
  parts?: any[];
}

const SYSTEM_INSTRUCTION = `
  You are the "PlayPro AI Concierge" - an expert Child Developmental Specialist at PlayPro.
  
  KNOWLEDGE BASE:
  - SANITIZATION: Medical-grade UV sterilization + deep cleaning for EVERY toy before shipping.
  - DELIVERY: 48-hour delivery once a box is finalized. We ship Pan-India.
  - PRICING: Basic (₹999/mo for 2 toys), Pro (₹1799/mo for 4 toys), Premium (₹2499/mo for 6 toys).
  - RETURNS: No-hassle monthly swaps. We pick up old toys when delivering new ones.
  - AGE RANGE: We provide toys from 0 to 8 years old.
  
  YOUR CAPABILITIES:
  1. Recommendation: Help parents find the perfect developmental toys. ALWAYS use "search_toys" to check inventory first.
  2. Actions: If a user expresses interest in a specific toy, use "add_toy_to_box" to add it to their selection.
  3. Support: Answer questions about shipping, safety, or pricing using "get_service_policies".
  
  TONE: Helpful, professional, and empathetic. Speak like a friendly pediatrician or early childhood expert.
`;

const TOOLS: any[] = [{
  functionDeclarations: [
    {
      name: "search_toys",
      description: "Search for toys in the PlayPro library based on age, category, or keywords.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          query: { type: SchemaType.STRING, description: "Keywords to search for" },
          ageRange: { type: SchemaType.STRING, description: "Target age (e.g., '0-3 years')" },
          category: { type: SchemaType.STRING, description: "Toy category (e.g., 'STEM', 'Puzzles')" }
        }
      }
    },
    {
      name: "add_toy_to_box",
      description: "Add a specific toy to the user's box selection.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          toyId: { type: SchemaType.STRING, description: "The ID of the toy" },
          toyName: { type: SchemaType.STRING, description: "The name of the toy" }
        },
        required: ["toyId", "toyName"]
      }
    },
    {
      name: "get_service_policies",
      description: "Get detailed policy info on shipping, sanitization, returns, or pricing.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          topic: { type: SchemaType.STRING, enum: ["shipping", "sanitization", "returns", "pricing"] }
        },
        required: ["topic"]
      }
    }
  ]
}];

export const AIParentConcierge = () => {
  const { toys: liveToys, selectedToys, toggleToySelection } = usePlay();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      content: "Hello! I'm your PlayPro AI Concierge. I can help you find developmental toys, check our policies, or add items directly to your box. What can I do for you?",
      parts: [{ text: "Hello! I'm your PlayPro AI Concierge. I can help you find developmental toys, check our policies, or add items directly to your box. What can I do for you?" }]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const userParts = [{ text: userMessage }];
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage, parts: userParts }]);
    setIsLoading(true);

    const genAI = getGemini();
    if (!genAI) {
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having trouble connecting right now. Please check if your API key is configured." }]);
      setIsLoading(false);
      return;
    }

    try {
      // Build history from existing messages
      // Gemini requires history to start with 'user' role or be empty
      const history = messages
        .filter((_, i) => i > 0 || messages[0].role === 'user') // Skip first message if it's from model
        .map(m => ({
          role: m.role,
          parts: m.parts || [{ text: m.content }]
        }));

      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: TOOLS
      });

      // Create a chat session with memory
      const chat = model.startChat({
        history
      });

      let recommendations: Toy[] = [];
      let currentResponse = await chat.sendMessage(userMessage);
      let responseText = currentResponse.response.text();
      let toolLoopCount = 0;
      const MAX_TOOL_LOOPS = 5;

      while (toolLoopCount < MAX_TOOL_LOOPS) {
        const calls = currentResponse.response.candidates?.[0]?.content?.parts?.filter(p => p.functionCall);
        if (!calls || calls.length === 0) break;

        toolLoopCount++;
        const toolResponses = [];

        for (const part of calls) {
          const call = part.functionCall!;
          try {
            if (call.name === 'search_toys') {
              const { query, ageRange, category } = call.args as any;
              const matches = liveToys.filter(t => {
                const q = query?.toLowerCase();
                const nameMatch = !q || t.name.toLowerCase().includes(q) || t.shortDescription.toLowerCase().includes(q);
                const ageMatch = !ageRange || t.ageRange === ageRange;
                const catMatch = !category || t.category === category;
                return nameMatch && ageMatch && catMatch;
              });
              if (matches.length > 0) recommendations = [...recommendations, ...matches.slice(0, 3)];
              toolResponses.push({ functionResponse: { name: call.name, response: { result: matches.slice(0, 5), count: matches.length } } });
            } 
            else if (call.name === 'add_toy_to_box') {
              const { toyId, toyName } = call.args as any;
              const toy = liveToys.find(t => t.id === toyId || (toyName && t.name.toLowerCase().includes(toyName.toLowerCase())));
              if (toy) {
                toggleToySelection(toy); // Update box
                toolResponses.push({ functionResponse: { name: call.name, response: { status: "success", message: `${toy.name} was added to your box selection.` } } });
              } else {
                toolResponses.push({ functionResponse: { name: call.name, response: { status: "error", message: "Toy not found." } } });
              }
            }
            else if (call.name === 'get_service_policies') {
              const { topic } = call.args as any;
              const policies: any = {
                shipping: "Free 48-hour delivery once your box is finalized. We ship Pan-India.",
                sanitization: "Medical-grade UV sterilization + deep cleaning for every toy.",
                returns: "Monthly swaps with free pickup and delivery.",
                pricing: "Basic (₹999), Pro (₹1799), Premium (₹2499) per month."
              };
              toolResponses.push({ functionResponse: { name: call.name, response: { content: policies[topic] || "Policy details are on our help page." } } });
            }
          } catch (err) {
            toolResponses.push({ functionResponse: { name: call.name, response: { error: "Failed to execute action." } } });
          }
        }

        // Send results back to model to get final text
        currentResponse = await chat.sendMessage(toolResponses);
        responseText = currentResponse.response.text();
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        content: responseText || "I've handled that for you. Is there anything else you'd like to explore?",
        recommendations: recommendations.length > 0 ? Array.from(new Map(recommendations.map(t => [t.id, t])).values()) : undefined,
        parts: currentResponse.response.candidates?.[0]?.content?.parts
      }]);

    } catch (error) {
      console.error("Concierge Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having trouble responding right now. Please try again or refresh the page." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        id="ai-concierge-toggle"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-40 group"
      >
        <Bot size={28} />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
          AI Concierge
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[90vw] md:w-[450px] h-[600px] bg-white rounded-3xl shadow-2xl border border-indigo-50 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h3 className="font-bold">PlayPro Agent</h3>
                  <div className="flex items-center space-x-1 text-[10px] text-indigo-100 uppercase tracking-widest font-black">
                    <Sparkles size={10} className="text-yellow-400" />
                    <span>AI Assistant</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:rotate-90 transition-transform p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-xl h-fit ${m.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white shadow-sm text-gray-400'}`}>
                      {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className="space-y-3">
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 rounded-tr-none' 
                          : 'bg-white shadow-sm border border-gray-100 text-gray-800 rounded-tl-none'
                      }`}>
                        {m.content}
                      </div>
                      
                      {m.recommendations && m.recommendations.length > 0 && (
                        <div className="grid grid-cols-1 gap-2">
                          {m.recommendations.map(toy => {
                            const isSelected = selectedToys.some(st => st.id === toy.id);
                            return (
                              <div 
                                key={toy.id} 
                                className="bg-white p-3 rounded-2xl border border-indigo-50 shadow-sm flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-xl">
                                    {toy.image.split('|')[0] || '🧸'}
                                  </div>
                                  <div>
                                    <div className="font-bold text-xs text-gray-900">{toy.name}</div>
                                    <div className="text-[10px] text-gray-500">{toy.ageRange}</div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleToySelection(toy)}
                                  className={`p-2 rounded-lg transition-all ${
                                    isSelected 
                                      ? 'bg-green-50 text-green-600' 
                                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                                  }`}
                                >
                                  {isSelected ? <Check size={16} /> : <Plus size={16} />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] flex space-x-3">
                    <div className="p-2 rounded-xl h-fit bg-white shadow-sm text-gray-400">
                      <Bot size={18} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                      <Loader2 size={18} className="animate-spin text-indigo-600" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Info Tip */}
            <div className="px-4 py-2 bg-indigo-50 flex items-center space-x-2">
              <Info size={12} className="text-indigo-600" />
              <p className="text-[10px] text-indigo-600 font-medium">I can add toys directly to your box if you ask!</p>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for toys, policies, or help..."
                  className="flex-grow p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-200"
                />
                <button
                  id="ai-send-btn"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center cursor-pointer"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

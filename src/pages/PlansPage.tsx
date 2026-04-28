
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Zap, Info, Loader2 } from 'lucide-react';
import { usePlay } from '../PlayContext';
import { PLANS } from '../data/mockData';
import { AuthModal } from '../components/AuthModal';
import { motion } from 'motion/react';

export const PlansPage = () => {
  const { user, currentPlan, setPlan } = usePlay();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingPlan, setIsSettingPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelectPlan = async (plan: any) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsSettingPlan(plan.id);
    try {
      await setPlan(plan);
      navigate('/select-toys');
    } finally {
      setIsSettingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-gray-50 py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs mb-6 uppercase tracking-wider">
            <Zap size={14} />
            <span>Investment in Growth</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-display">Simple, Flexible Pricing</h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
            Choose a plan that fits your family's play style. Swap anytime, no strings attached.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12">
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
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {PLANS.map((plan) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 30 },
                show: { opacity: 1, scale: 1, y: 0 }
              }}
              whileHover={{ y: -5 }}
              key={plan.id}
              className={`relative bg-white rounded-[2.5rem] p-8 md:p-10 border shadow-sm transition-all ${
                plan.id === 'standard' 
                  ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl' 
                  : 'border-gray-100 hover:border-indigo-200'
              }`}
            >
              {plan.id === 'standard' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8 font-display">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-black text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-500 ml-1 font-medium font-sans">/month</span>
                </div>
                <div className="flex items-center text-indigo-600 font-bold text-xs bg-indigo-50 px-3 py-1 rounded-lg w-fit">
                  {plan.toyCount} Toys per month
                </div>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mt-1 mr-3 flex-shrink-0 w-5 h-5 bg-green-50 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-green-600" />
                    </div>
                    <p className="text-gray-600 text-[15px]">{feature}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={isSettingPlan !== null}
                className={`w-full py-4 px-6 rounded-2xl font-black transition-all flex items-center justify-center disabled:opacity-70 ${
                  currentPlan?.id === plan.id
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : plan.id === 'standard'
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {isSettingPlan === plan.id ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    {currentPlan?.id === plan.id ? 'Selected' : 'Get Started'}
                    <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-20 max-w-3xl mx-auto bg-gray-50 rounded-[2.5rem] p-8 md:p-12 text-center border border-gray-100">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm text-indigo-600 mb-6">
            <Info size={24} />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mb-4">How it works?</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left mt-10">
            <div>
              <div className="font-black text-indigo-600 text-xl mb-2">01</div>
              <p className="text-sm text-gray-600 font-medium">Choose your plan and verify your account.</p>
            </div>
            <div>
              <div className="font-black text-indigo-600 text-xl mb-2">02</div>
              <p className="text-sm text-gray-600 font-medium">Pick your favorite toys from our library.</p>
            </div>
            <div>
              <div className="font-black text-indigo-600 text-xl mb-2">03</div>
              <p className="text-sm text-gray-600 font-medium">Receive, play, and swap them next month!</p>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

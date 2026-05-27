
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Zap, Info, Loader2, Sparkles, Star } from 'lucide-react';
import { usePlay } from '../PlayContext';
import { PLANS } from '../data/mockData';
import { AuthModal } from '../components/AuthModal';
import { motion, AnimatePresence } from 'motion/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const PlansPage = () => {
  const { user, currentPlan } = usePlay();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingPlan, setIsSettingPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSelectPlan = async (plan: any) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // If user already has this plan, just navigate to toy selection
    if (currentPlan?.id === plan.id) {
      navigate('/select-toys');
      return;
    }

    setIsSettingPlan(plan.id);
    try {
      // Just select the plan directly in Firestore (payment occurs in Cart page)
      const profileRef = doc(db, 'users', user.id);
      await updateDoc(profileRef, { 
        currentPlanId: plan.id, 
        selectedToyIds: [],
        updatedAt: new Date().toISOString()
      });
      console.log(`Plan ${plan.name} selected. Payment will be handled during checkout.`);
      navigate('/select-toys');
    } catch (err: any) {
      console.error("Failed to select plan:", err);
      setModalErrorMessage(err.message || "An unexpected error occurred during plan selection.");
      setErrorModalOpen(true);
    } finally {
      setIsSettingPlan(null);
    }
  };

  const getPrice = (basePrice: number) => {
    if (billingCycle === 'yearly') {
      return Math.floor(basePrice * 0.8);
    }
    return basePrice;
  };

  return (
    <div className="min-h-screen bg-canvas pb-24 pt-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-bold text-xs mb-6 uppercase tracking-widest"
          >
            <Sparkles size={14} />
            <span>Investment in Growth</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tight mb-8">
            Simple <span className="text-secondary italic">Pricing.</span>
          </h1>
          <p className="text-xl text-dark/50 max-w-2xl mx-auto font-medium">
            Choose a plan that fits your family's play style. Swap anytime, no strings attached.
          </p>

          {/* Toggle */}
          <div className="mt-12 flex justify-center items-center space-x-4">
            <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-dark' : 'text-dark/40'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-dark rounded-full p-1 transition-all"
            >
              <motion.div 
                animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-dark' : 'text-dark/40'}`}>Yearly</span>
              <span className="bg-accent px-2 py-0.5 rounded-lg text-[10px] font-black text-white uppercase animate-pulse">Save 20%</span>
            </div>
          </div>
        </div>

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {PLANS.map((plan) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
              key={plan.id}
              className={`relative group h-full`}
            >
              <div className={`h-full bg-white rounded-[3rem] p-10 border transition-all duration-500 flex flex-col ${
                plan.id === 'standard' 
                  ? 'border-primary ring-8 ring-primary/5 shadow-2xl scale-[1.02] z-10' 
                  : 'border-dark/5 hover:border-dark/10 shadow-xl shadow-dark/5'
              }`}>
                {plan.id === 'standard' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    Most Popular
                  </div>
                )}

                <div className="mb-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-3xl font-black text-dark tracking-tight">{plan.name}</h3>
                      <p className="text-sm font-bold text-dark/40 uppercase tracking-widest mt-1">{plan.toyCount} Toys / Delivery</p>
                    </div>
                    {plan.id === 'pro' && (
                      <div className="bg-secondary/10 p-2 rounded-xl text-secondary">
                        <Star size={24} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-black text-dark tracking-tighter">₹{getPrice(plan.price)}</span>
                    <span className="text-dark/40 text-lg font-bold ml-1">/mo</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-xs font-black text-accent uppercase tracking-widest">Billed annually</p>
                  )}
                </div>

                <div className="space-y-5 mb-12 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <div className="mt-1 mr-4 shrink-0 w-6 h-6 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Check size={14} className="text-accent" strokeWidth={3} />
                      </div>
                      <p className="text-dark/60 font-medium text-sm leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isSettingPlan !== null}
                  className={`w-full py-5 px-6 rounded-[2rem] font-black transition-all flex items-center justify-center space-x-2 disabled:opacity-70 group/btn shadow-xl ${
                    currentPlan?.id === plan.id
                      ? 'bg-accent text-white'
                      : plan.id === 'standard'
                        ? 'bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95'
                        : 'bg-dark text-white hover:bg-dark/90 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {isSettingPlan === plan.id ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span>{currentPlan?.id === plan.id ? 'Active Plan' : 'Choose Plan'}</span>
                      <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={20} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Bento */}
        <div className="mt-24 grid md:grid-cols-2 gap-8">
          <div className="bg-dark text-white rounded-[3rem] p-12 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <Info size={32} />
              </div>
              <h2 className="text-4xl font-black mb-6">Need a custom plan?</h2>
              <p className="text-lg text-white/60 font-medium leading-relaxed mb-10 max-w-sm">
                Running a school or daycare? We offer bulk subscription models tailored for institutions.
              </p>
              <button className="flex items-center space-x-2 px-8 py-4 bg-white text-dark rounded-2xl font-black transition-all hover:scale-105">
                <span>Contact Sales</span>
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[100px] rounded-full group-hover:scale-125 transition-transform" />
          </div>

          <div className="glass rounded-[3rem] p-12">
            <h3 className="text-2xl font-black text-dark mb-8">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {[
                { q: "Can I swap toys weekly?", a: "Plans come with monthly swaps. However, you can add more swaps for a small fee." },
                { q: "What if a toy breaks?", a: "We understand! Normal wear & tear is expected. Major damage might incur a fee." },
                { q: "Is delivery truly free?", a: "Yes, both delivery and pickup are included in your subscription cost." }
              ].map((item, i) => (
                <div key={i}>
                  <p className="font-black text-dark mb-2 tracking-tight">{item.q}</p>
                  <p className="text-sm font-medium text-dark/50 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

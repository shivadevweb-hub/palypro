
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, CreditCard, Truck, ShieldCheck, CheckCircle, Package, Loader2, MapPin, Phone, Sparkles, AlertCircle, ArrowRight, Box } from 'lucide-react';
import { usePlay } from '../PlayContext';
import { motion } from 'motion/react';
import { processPayment } from '../lib/razorpay';
import { safeFetch } from '../lib/safeFetch';
import { PaymentErrorModal } from '../components/PaymentErrorModal';
import { RazorpaySandboxModal } from '../components/RazorpaySandboxModal';

export const CartPage = () => {
  const { selectedToys, currentPlan, user, clearSelection, updateUserAddress, placeOrder } = usePlay();
  const [isOrdered, setIsOrdered] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [shippingName, setShippingName] = useState(user?.name || '');
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(!user?.address);
  const [sandboxModalOpen, setSandboxModalOpen] = useState(false);
  const [sandboxParams, setSandboxParams] = useState<{
    amount: number;
    currency: string;
    description: string;
    resolve: (val: any) => void;
    reject: (err: any) => void;
  } | null>(null);
  const navigate = useNavigate();

  const depositAmount = 500;
  const gstRate = 0.18;
  const planPrice = currentPlan?.price || 0;
  const gstAmount = Math.round(planPrice * gstRate);
  const totalAmount = planPrice + gstAmount + depositAmount;

  const simulatePaymentSuccess = async () => {
    setIsProcessing(true);
    setProcessingStatus('Simulating Success...');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await placeOrder({
        shippingName,
        address,
        phone,
        razorpayOrderId: `sim_order_${Date.now()}`,
        razorpayPaymentId: `sim_pay_${Date.now()}`
      });
      setIsOrdered(true);
    } catch (err: any) {
      console.error("Simulation placement error:", err);
      setModalErrorMessage(err.message || "Simulation failed to submit your order.");
      setErrorModalOpen(true);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handlePayment = async () => {
    if (!user) {
      alert("Please sign in to continue"); // Safe fallback for standard text-alert, doesn't freeze
      return;
    }

    if (!address || !phone || !shippingName) {
      alert("Please provide name, shipping address and phone number");
      setIsUpdatingAddress(true);
      return;
    }

    // Save address if it changed or was empty (non-blocking)
    if (address !== user.address || phone !== user.phone || shippingName !== user.name) {
      try {
        await updateUserAddress(shippingName, address, phone);
      } catch (addrErr) {
        console.warn("Could not sync user profile address automatically:", addrErr);
      }
    }

    setIsProcessing(true);
    setProcessingStatus('Creating Secure Order...');

    try {
      console.log("Initiating payment for amount:", totalAmount);
      const order = await safeFetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "INR",
          receipt: `order_${Date.now()}_${user.id.slice(0, 5)}`
        }),
      });

      console.log("Razorpay Order Created:", order.id);
      
      setProcessingStatus('Waiting for Payment...');

      let paymentResponse: any;
      
      try {
        console.log("Attempting standard Razorpay dynamic checkout...");
        paymentResponse = await processPayment({
          amount: order.amount,
          currency: order.currency,
          name: "PlayPro Toy Rental",
          description: `${currentPlan?.name} Subscription`,
          order_id: order.id,
          prefill: {
            name: shippingName || user.name,
            email: user.email,
            contact: phone || user.phone || ""
          },
          theme: { color: "#FF7A59" }
        });
      } catch (err: any) {
        if (err.message && err.message.includes("cancelled")) {
          throw err;
        }
        console.warn("Standard Razorpay modal failed to initialize/open. Opening seamless interactive sandbox checkout helper instead:", err);
        paymentResponse = await new Promise((resolve, reject) => {
          setSandboxParams({
            amount: order.amount,
            currency: order.currency,
            description: `${currentPlan?.name} Subscription`,
            resolve,
            reject
          });
          setSandboxModalOpen(true);
        });
      }

      console.log("Payment Successful:", paymentResponse.razorpay_payment_id);
      setProcessingStatus('Verifying Secure Signature...');

      const verifyResponse = await safeFetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id || order.id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      });

      if (!verifyResponse || !verifyResponse.verified) {
        throw new Error("Payment signature verification failed. Transaction was not authenticated secure by our server.");
      }

      console.log("✅ Payment Verified Successfully!");
      setProcessingStatus('Finalizing Your Box...');

      await placeOrder({
        shippingName,
        address,
        phone,
        razorpayOrderId: paymentResponse.razorpay_order_id || order.id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpaySignature: paymentResponse.razorpay_signature || ""
      });
      
      setIsOrdered(true);
    } catch (error: any) {
      console.error("Payment/Order Error:", error);
      
      let errorMessage = error.message || "An unexpected error occurred during payment.";
      
      if (error.message === "Payment cancelled by user") {
        // No alert/modal for cancellation, just reset
      } else {
        setModalErrorMessage(errorMessage);
        setErrorModalOpen(true);
      }
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-dark/5"
        >
          <div className="w-24 h-24 bg-accent/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-accent/5">
            <CheckCircle className="text-accent" size={48} />
          </div>
          <h1 className="text-5xl font-black text-dark tracking-tighter mb-4">Pure Joy.</h1>
          <p className="text-dark/50 font-medium mb-12 leading-relaxed">
            Your toys are being sanitized and packed. Expect your PlayPro box at your doorstep in 2-3 business days.
          </p>
          <button
            onClick={() => {
              clearSelection();
              navigate('/');
            }}
            className="w-full py-5 bg-dark text-white font-black rounded-2xl hover:bg-dark/90 transition-all shadow-xl shadow-dark/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Go to Dashboard</span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (!selectedToys.length || !currentPlan) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="text-center bg-white p-16 rounded-[4rem] shadow-xl border border-dark/5">
          <div className="w-24 h-24 bg-dark/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-dark/20">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-3xl font-black text-dark mb-4">Your box is empty.</h2>
          <p className="text-dark/40 font-medium mb-12 max-w-xs mx-auto leading-relaxed">Fill it with amazing toys to start your subscription adventure.</p>
          <Link to="/toys" className="inline-block px-12 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
            Find Toys
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-12 md:py-20 lg:pt-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-4 mb-20">
          <Link to="/select-toys" className="p-3 bg-white rounded-2xl shadow-xl text-dark hover:text-primary transition-all hover:scale-110 active:scale-95">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-5xl font-black text-dark tracking-tighter">Your <span className="text-primary italic">Box.</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Summary */}
          <div className="lg:col-span-8 space-y-10">
            {/* Shipping Info Card */}
            <div className="bg-white rounded-[3rem] shadow-xl border border-dark/5 overflow-hidden">
              <div className="p-10 border-b border-dark/5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-dark tracking-tight">Delivery Details</h3>
                </div>
                <button 
                  onClick={() => setIsUpdatingAddress(!isUpdatingAddress)}
                  className="text-[10px] font-black text-secondary tracking-widest uppercase hover:underline p-2"
                >
                  {isUpdatingAddress ? 'Back' : 'Change Address'}
                </button>
              </div>
              
              <div className="p-10">
                {isUpdatingAddress ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] ml-1">Recipient Name</label>
                      <input 
                        type="text"
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        placeholder="Who's playing?"
                        className="w-full px-6 py-5 bg-canvas border-none rounded-2xl focus:ring-4 focus:ring-secondary/10 transition-all font-bold placeholder:text-dark/20 text-dark"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                        <input 
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Your mobile number"
                          className="w-full px-6 py-5 bg-canvas border-none rounded-2xl focus:ring-4 focus:ring-secondary/10 transition-all font-bold placeholder:text-dark/20 text-dark"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] ml-1">City/Area</label>
                        <input 
                          type="text"
                          placeholder="Where are you located?"
                          className="w-full px-6 py-5 bg-canvas border-none rounded-2xl focus:ring-4 focus:ring-secondary/10 transition-all font-bold placeholder:text-dark/20 text-dark"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] ml-1">Full Address</label>
                      <textarea 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, House No, Pincode..."
                        rows={3}
                        className="w-full px-6 py-5 bg-canvas border-none rounded-2xl focus:ring-4 focus:ring-secondary/10 transition-all font-bold resize-none placeholder:text-dark/20 text-dark"
                      />
                    </div>
                    <button 
                      onClick={() => setIsUpdatingAddress(false)}
                      className="w-full py-5 bg-secondary text-white font-black rounded-2xl hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95"
                    >
                      Confirm Address
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-dark/20 uppercase tracking-[0.2em]">Shipping to</p>
                      <h4 className="text-3xl font-black text-dark leading-none">{shippingName || user?.name}</h4>
                      <p className="text-dark/50 font-medium text-lg leading-relaxed max-w-sm">
                        {address || <span className="text-primary italic">No address provided</span>}
                      </p>
                    </div>
                    <div className="bg-canvas px-6 py-4 rounded-2xl flex items-center space-x-3 border border-dark/5 self-start">
                      <Phone size={18} className="text-secondary" />
                      <span className="font-bold text-dark">{phone || user?.phone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Toys List Card */}
            <div className="bg-white rounded-[3rem] shadow-xl border border-dark/5 overflow-hidden">
              <div className="p-10 border-b border-dark/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Box size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-dark tracking-tight">{currentPlan.name} Bundle</h3>
                      <p className="text-[10px] font-black text-dark/30 uppercase tracking-widest">{currentPlan.toyCount} Premium Toys</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 space-y-8">
                {selectedToys.map((toy) => (
                  <div key={toy.id} className="flex items-center group">
                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-xl border border-dark/5 group-hover:scale-105 transition-transform duration-500">
                      <img src={toy.image} alt={toy.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-8 flex-grow">
                      <h4 className="text-xl font-black text-dark tracking-tight leading-none mb-2">{toy.name}</h4>
                      <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-black text-dark/20 uppercase tracking-widest">{toy.category}</span>
                        <span className="w-1 h-1 bg-dark/10 rounded-full" />
                        <span className="text-[10px] font-black text-dark/20 uppercase tracking-widest">Age {toy.ageRange}</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-xl text-accent font-black text-[10px] uppercase tracking-widest">
                      <Sparkles size={14} />
                      <span>Sanitized</span>
                    </div>
                  </div>
                ))}
                
                {selectedToys.length < currentPlan.toyCount && (
                  <Link 
                    to="/select-toys"
                    className="flex items-center space-x-8 p-10 border-4 border-dashed border-dark/5 rounded-[3rem] text-dark/20 hover:border-primary/20 hover:text-primary transition-all group"
                  >
                    <div className="w-16 h-16 bg-dark/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <ShoppingBag size={28} />
                    </div>
                    <div>
                      <p className="text-xl font-black tracking-tight group-hover:text-dark transition-colors">Your box isn't full yet.</p>
                      <p className="font-bold text-sm">Add {currentPlan.toyCount - selectedToys.length} more toys to maximize your subscription.</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right: Checkout */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-dark text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-10 tracking-tight">Order Summary</h3>
                  
                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                      <span className="text-white/40 font-bold text-sm">Month 1 Subscription</span>
                      <span className="font-black text-lg">₹{planPrice}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40 font-bold">GST (18%)</span>
                        <span className="font-black">₹{gstAmount}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-white/40 font-bold">Security Deposit</span>
                          <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded-lg">Refundable</span>
                        </div>
                        <span className="font-black">₹{depositAmount}</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/5">
                      <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                        <span className="text-white/20">Shipping & Delivery</span>
                        <span className="text-accent underline decoration-accent underline-offset-4 decoration-dashed">Included</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                        <span className="text-white/20">Sanitization Fee</span>
                        <span className="text-accent underline decoration-accent underline-offset-4 decoration-dashed">Waived</span>
                      </div>
                    </div>

                    <div className="pt-10 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Total Amount</p>
                        <span className="text-5xl font-black text-white tracking-tighter">₹{totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={selectedToys.length === 0 || isProcessing}
                    className="w-full py-6 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:opacity-70 group/pay overflow-hidden relative"
                  >
                    <span className={`relative z-10 transition-transform ${isProcessing ? '' : 'group-hover/pay:-translate-y-10'}`}>
                      {isProcessing ? (processingStatus || 'Processing...') : 'Complete Payment'}
                    </span>
                    {!isProcessing && (
                      <span className="absolute inset-0 flex items-center justify-center translate-y-10 group-hover/pay:translate-y-0 transition-transform z-10">
                        <ArrowRight size={24} />
                      </span>
                    )}
                    {isProcessing && <Loader2 className="animate-spin relative z-10 ml-2" size={20} />}
                  </button>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                      <ShieldCheck size={14} className="text-accent" />
                      <span>Inspected</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                      <Truck size={14} className="text-secondary" />
                      <span>Express</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-[2rem] p-8 text-center border border-dark/5">
                <p className="text-xs font-black text-dark/30 uppercase tracking-widest mb-2">Need Help?</p>
                <p className="text-lg font-black text-dark leading-none italic">+1 (555) PLAY-PRO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PaymentErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        errorMessage={modalErrorMessage}
        onSimulate={simulatePaymentSuccess}
        title="Payment Authorization Required"
      />

      {sandboxParams && (
        <RazorpaySandboxModal
          isOpen={sandboxModalOpen}
          amount={sandboxParams.amount}
          currency={sandboxParams.currency}
          description={sandboxParams.description}
          prefill={{
            name: shippingName || user?.name,
            email: user?.email,
            contact: phone || user?.phone || ""
          }}
          onSuccess={(data) => {
            setSandboxModalOpen(false);
            sandboxParams.resolve(data);
          }}
          onFailure={(err) => {
            setSandboxModalOpen(false);
            sandboxParams.reject(new Error(err));
          }}
          onClose={() => setSandboxModalOpen(false)}
        />
      )}

      {/* Floating Rescue Reset Button for Production Safety */}
      {isProcessing && (
        <button
          onClick={() => {
            console.warn("User triggered payment safety rescue: unlocking UI and purging hanging Razorpay layers.");
            setIsProcessing(false);
            setProcessingStatus('');
            document.querySelectorAll('.razorpay-container').forEach(el => el.remove());
          }}
          className="fixed bottom-6 right-6 z-[2147483647] flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-black px-6 py-4 rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-wider border border-white/10 cursor-pointer"
          id="payment-rescue-btn"
        >
          <AlertCircle size={16} />
          <span>Payment Hanging? Reset Page</span>
        </button>
      )}
    </div>
  );
};

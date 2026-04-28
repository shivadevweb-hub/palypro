
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, CreditCard, Truck, ShieldCheck, CheckCircle, Package, Loader2, MapPin, Phone } from 'lucide-react';
import { usePlay } from '../PlayContext';
import { motion } from 'motion/react';

export const CartPage = () => {
  const { selectedToys, currentPlan, user, clearSelection, updateUserAddress, placeOrder } = usePlay();
  const [isOrdered, setIsOrdered] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [shippingName, setShippingName] = useState(user?.name || '');
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(!user?.address);
  const navigate = useNavigate();

  const depositAmount = 500;
  const gstRate = 0.18;
  const planPrice = currentPlan?.price || 0;
  const gstAmount = Math.round(planPrice * gstRate);
  const totalAmount = planPrice + gstAmount + depositAmount;

  const handlePayment = async () => {
    if (!user) {
      alert("Please sign in to continue");
      return;
    }

    if (!address || !phone || !shippingName) {
      alert("Please provide name, shipping address and phone number");
      setIsUpdatingAddress(true);
      return;
    }

    // Save address if it changed or was empty
    if (address !== user.address || phone !== user.phone || shippingName !== user.name) {
      await updateUserAddress(shippingName, address, phone);
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    // Check if Razorpay SDK is loaded
    if (typeof (window as any).Razorpay === 'undefined') {
      // alert("Razorpay checkout script failed to load. Please check your connection.");
      // Fallback for demo
      if (confirm(`Razorpay script not loaded. Would you like to simulate a successful payment?`)) {
        await placeOrder();
        setIsOrdered(true);
      }
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order on server
      const response = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "INR",
          receipt: `order_rcptid_${Math.floor(Math.random() * 1000)}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment order");
      }

      const order = await response.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "PlayPro Toy Rental",
        description: `${currentPlan?.name} Subscription`,
        image: "https://www.google.com/favicon.ico",
        order_id: order.id,
        handler: async function (response: any) {
          console.log("Payment Successful:", response.razorpay_payment_id);
          await placeOrder();
          setIsOrdered(true);
          setIsProcessing(false);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: phone
        },
        theme: { color: "#4f46e5" },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error("Payment Initialization Error:", error);
      if (confirm(`Payment gateway couldn't be initialized: ${error.message}. \n\nWould you like to simulate a successful payment for this demo?`)) {
        await placeOrder();
        setIsOrdered(true);
      }
      setIsProcessing(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-100 shadow-inner">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">You're All Set!</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Your toys are being sanitized and packed. Expect your PlayPro box at your doorstep in 2-3 business days.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                clearSelection();
                navigate('/');
              }}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!selectedToys.length || !currentPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-400">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your box is empty</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Fill it with amazing toys to start your subscription adventure.</p>
          <Link to="/toys" className="inline-block px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100">
            Find Toys
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Summary */}
        <div className="lg:col-span-8">
          <div className="flex items-center space-x-2 mb-8">
            <Link to="/select-toys" className="p-2 bg-white rounded-xl shadow-sm text-gray-400 hover:text-indigo-600 border border-gray-100">
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-3xl font-black text-gray-900">Your PlayPro Box</h1>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <MapPin size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Shipping Info</h3>
              </div>
              <button 
                onClick={() => setIsUpdatingAddress(!isUpdatingAddress)}
                className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:underline"
              >
                {isUpdatingAddress ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            <div className="p-8">
              {isUpdatingAddress ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Recipient Name</label>
                    <input 
                      type="text"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      placeholder="Who's playing?"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Shipping Address</label>
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, House No, City, Pincode..."
                      rows={3}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full pl-14 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsUpdatingAddress(false)}
                    className="w-full py-4 bg-indigo-50 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-100 transition-all"
                  >
                    Confirm Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1 mb-4">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Ship to</span>
                    <h4 className="text-xl font-black text-gray-900">{shippingName || user?.name}</h4>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="font-bold text-gray-900 flex-grow">
                      {address || <span className="text-red-400 italic">No address provided</span>}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 font-medium">
                    <Phone size={14} className="mr-2" />
                    {phone || <span className="text-red-400 italic">No phone provided</span>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{currentPlan.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">Monthly collection of {currentPlan.toyCount} toys</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-gray-900">₹{currentPlan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">/mo</span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {selectedToys.map((toy) => (
                <div key={toy.id} className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-gray-50">
                    <img src={toy.image} alt={toy.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-900">{toy.name}</h4>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">{toy.category} • {toy.ageRange}</p>
                  </div>
                  <Package size={20} className="text-indigo-200" />
                </div>
              ))}
              
              {selectedToys.length < currentPlan.toyCount && (
                <Link 
                  to="/select-toys"
                  className="flex items-center space-x-6 p-4 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <ShoppingBag size={24} />
                  </div>
                  <span className="font-bold">Add {currentPlan.toyCount - selectedToys.length} more toys to fill your box</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right: Checkout */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Plan Subtotal</span>
                  <span className="font-bold text-gray-900">₹{planPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-bold text-gray-900">₹{gstAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <div className="flex items-center">
                    <span>Security Deposit</span>
                    <span className="ml-1 text-[10px] text-indigo-400 font-bold uppercase">(Refundable)</span>
                  </div>
                  <span className="font-bold text-gray-900">₹{depositAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping amount</span>
                  <span className="text-green-500 font-bold uppercase text-xs tracking-widest underline decoration-dotted">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Cleaning Fee</span>
                  <span className="text-green-500 font-bold uppercase text-xs tracking-widest">Waived</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-black text-indigo-600">₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={selectedToys.length === 0 || isProcessing}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center mb-6 disabled:opacity-70"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <CreditCard size={18} className="mr-2" />
                    Start My Subscription
                  </>
                )}
              </button>

              <div className="space-y-4">
                <div className="flex items-center text-xs text-gray-500">
                  <Truck className="mr-2" size={14} />
                  <span>Ships within 48 hours</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <ShieldCheck className="mr-2" size={14} />
                  <span>Sanitized & inspected guarantee</span>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-3xl p-6 text-center">
              <p className="text-sm font-bold text-indigo-600">Need help? Text us 24/7</p>
              <p className="text-xs text-indigo-400 mt-1">Support: +1 (555) PLAY-PRO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

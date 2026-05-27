import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, ShieldCheck, Check, Info, Library, Wallet, ArrowRight, Loader2, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RazorpaySandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentData: any) => void;
  onFailure: (error: string) => void;
  amount: number; // in paise or rupees
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export const RazorpaySandboxModal: React.FC<RazorpaySandboxModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onFailure,
  amount,
  currency = "INR",
  name = "PlayPro Toy Rental",
  description = "Toy Rental Subscription",
  prefill
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'upi' | 'netbank' | 'wallet'>('card');
  const [step, setStep] = useState<'payment-selection' | 'processing' | 'otp' | 'success'>('payment-selection');
  
  // Destructure optional prefill parameters safely
  const { name: prefillName = '', contact: prefillContact = '' } = prefill || {};

  // Form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardHolder, setCardHolder] = useState(prefillName);
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState(prefillContact ? `${prefillContact}@okaxis` : 'play@okaxis');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(25);
  const [otpTimer, setOtpTimer] = useState(60);

  // Convert amount to rupees for display
  const displayAmount = (amount / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2
  });

  // OTP Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  // Card brand auto-detection
  const getCardBrand = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    if (cleanNum.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(cleanNum)) return 'mastercard';
    if (/^65|^50[1-9]/.test(cleanNum)) return 'rupay';
    return 'unknown';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setCardExpiry(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCardCvv(value);
  };

  const startPaymentProcessing = () => {
    setStep('processing');
    setTimeout(() => {
      if (activeTab === 'card') {
        setStep('otp');
      } else {
        // Direct success for UPI/Netbank/Wallet
        completePayment();
      }
    }, 2000);
  };

  const completePayment = () => {
    setStep('success');
    setTimeout(() => {
      const paymentId = `pay_sandbox_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      onSuccess({
        razorpay_payment_id: paymentId,
        razorpay_order_id: `order_sandbox_${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        razorpay_signature: `sig_sandbox_${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
        isSimulated: true,
      });
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            onFailure("Payment cancelled by user");
            onClose();
          }}
          className="fixed inset-0 bg-dark/50 backdrop-blur-md"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative bg-[#FAFAFA] rounded-[2.5rem] shadow-2xl w-full max-w-[440px] overflow-hidden border border-dark/5 z-[130] font-sans text-dark flex flex-col"
        >
          {/* Header Bar */}
          <div className="bg-[#1A253C] p-6 text-white flex flex-col relative">
            <button
              onClick={() => {
                onFailure("Payment cancelled by user");
                onClose();
              }}
              className="absolute top-6 right-6 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <X size={16} />
            </button>

            {/* Merchant Details */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#FF7A59] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#FF7A59]/20">
                P
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight">{name}</h4>
                <p className="text-[10px] text-white/50 font-bold">{description}</p>
              </div>
            </div>

            {/* Amount display */}
            <div className="flex justify-between items-end mt-2 select-none">
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Amount to Pay</p>
                <div className="text-3xl font-black tracking-tight">{displayAmount}</div>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center space-x-1 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>Sandbox Mode</span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-grow p-6 flex flex-col min-h-[340px] justify-between">
            {step === 'payment-selection' && (
              <>
                {/* Method Navigation Hub */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI', icon: Smartphone },
                    { id: 'netbank', label: 'Netbank', icon: Library },
                    { id: 'wallet', label: 'Wallet', icon: Wallet },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex flex-col items-center justify-center py-3.5 px-1 rounded-2xl border transition-all ${
                        activeTab === tab.id
                          ? 'border-[#FF7A59] bg-[#FF7A59]/5 text-[#FF7A59] font-black scale-105'
                          : 'border-dark/5 bg-white hover:bg-dark/5 text-dark/40 font-bold'
                      }`}
                    >
                      <tab.icon size={20} className="mb-1.5" />
                      <span className="text-[10px] tracking-tight">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Subform Content */}
                <div className="bg-white rounded-2xl border border-dark/5 p-4 flex-grow flex flex-col justify-center min-h-[160px]">
                  {activeTab === 'card' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-dark/30 uppercase tracking-wider ml-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4111 1111 1111 1111"
                            className="w-full px-4 py-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#FF7A59]/20 transition-all font-mono font-bold placeholder:text-dark/20 text-sm"
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-dark/30 select-none">
                            {getCardBrand(cardNumber) !== 'unknown' ? getCardBrand(cardNumber) : 'Test Card'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-dark/30 uppercase tracking-wider ml-1">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#FF7A59]/20 transition-all font-mono font-bold placeholder:text-dark/20 text-sm text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-dark/30 uppercase tracking-wider ml-1">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={handleCvvChange}
                            placeholder="•••"
                            className="w-full px-4 py-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#FF7A59]/20 transition-all font-mono font-bold placeholder:text-dark/20 text-sm text-center"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-dark/30 uppercase tracking-wider ml-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Cardholder Name"
                          className="w-full px-4 py-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#FF7A59]/20 transition-all font-bold placeholder:text-dark/20 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'upi' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-dark/30 uppercase tracking-wider ml-1">Enter UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@upi"
                          className="w-full px-4 py-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#FF7A59]/20 transition-all font-bold placeholder:text-dark/20 text-sm font-mono text-center"
                        />
                      </div>
                      <div className="flex items-center space-x-2 text-dark/40 bg-dark/5 p-3 rounded-xl border border-dark/5">
                        <Info size={14} className="shrink-0 text-[#FF7A59]" />
                        <p className="text-[10px] font-medium leading-relaxed">UPI payments will display an instant simulation timer for automatic confirmation in real-time.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'netbank' && (
                    <div className="space-y-3">
                      <label className="text-[9px] font-extrabold text-dark/30 uppercase tracking-wider ml-1">Select Bank</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['SBI', 'HDFCB', 'ICICI', 'AXIS'].map((bank) => (
                          <button
                            key={bank}
                            onClick={() => setSelectedBank(bank)}
                            className={`py-3 px-2 text-xs font-black rounded-xl border text-center transition-all ${
                              selectedBank === bank
                                ? 'border-[#FF7A59] bg-[#FF7A59]/10 text-[#FF7A59]'
                                : 'border-dark/5 hover:bg-dark/5'
                            }`}
                          >
                            {bank} Bank
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'wallet' && (
                    <div className="space-y-3">
                      <label className="text-[9px] font-extrabold text-dark/30 uppercase tracking-wider ml-1">Select Wallet</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Paytm', 'PhonePe', 'Amazon Pay', 'MobiKwik'].map((wallet) => (
                          <button
                            key={wallet}
                            onClick={() => setSelectedWallet(wallet)}
                            className={`py-3 px-2 text-xs font-black rounded-xl border text-center transition-all ${
                              selectedWallet === wallet
                                ? 'border-[#FF7A59] bg-[#FF7A59]/10 text-[#FF7A59]'
                                : 'border-dark/5 hover:bg-dark/5'
                            }`}
                          >
                            {wallet}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Security Badge & CTA */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-center space-x-1.5 text-[10px] font-black uppercase text-dark/30 tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>SECURE DIRECT SANDBOX CAPTURE</span>
                  </div>

                  <button
                    onClick={startPaymentProcessing}
                    disabled={(activeTab === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) || (activeTab === 'netbank' && !selectedBank) || (activeTab === 'wallet' && !selectedWallet)}
                    className="w-full py-4.5 bg-[#FF7A59] text-white font-black rounded-2xl shadow-xl shadow-[#FF7A59]/25 hover:scale-[1.02] active:scale-95 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-65"
                  >
                    <span>Pay {displayAmount}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}

            {step === 'processing' && (
              <div className="flex flex-col items-center justify-center flex-grow py-8 text-center select-none">
                <Loader2 className="animate-spin text-[#FF7A59] mb-4" size={48} />
                <h4 className="text-lg font-black tracking-tight mb-2">Contacting Razorpay Gateway...</h4>
                <p className="text-xs text-dark/40 font-bold max-w-[240px] leading-relaxed">
                  Completing secure simulation handshake in test sandbox env.
                </p>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-6 flex-grow flex flex-col justify-between">
                <div className="bg-white rounded-2xl border border-dark/5 p-5 space-y-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-[#FF7A59]/10 p-2 rounded-xl text-[#FF7A59]">
                      <KeyRound size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-dark tracking-tight leading-none mb-1">Enter Sandbox OTP</h4>
                      <p className="text-[10px] text-dark/40 font-bold">Standard security verification code required</p>
                    </div>
                  </div>

                  <p className="text-xs text-dark/50 leading-relaxed font-semibold">
                    We've simulated a secure bank secure request and dispatched a 6-digit OTP code. Enter <span className="text-[#FF7A59] font-black">123456</span> to authorize the card successfully.
                  </p>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full text-center px-4 py-4 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-[#FF7A59]/20 transition-all font-mono font-black text-xl tracking-[0.4em] placeholder:text-dark/15"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-dark/30 tracking-wider">
                    <span>Resend OTP available</span>
                    <span className="text-[#FF7A59]">{otpTimer > 0 ? `00:${otpTimer.toString().padStart(2, '0')}` : 'Now'}</span>
                  </div>
                </div>

                <button
                  onClick={completePayment}
                  disabled={otpCode.length !== 6}
                  className="w-full py-4.5 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  <ShieldCheck size={18} />
                  <span>Verify OTP &amp; Authorize</span>
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center justify-center flex-grow py-8 text-center select-none">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/10">
                  <Check size={32} strokeWidth={3} />
                </div>
                <h4 className="text-2xl font-black text-dark tracking-tight mb-2">Simulated Payment Success!</h4>
                <p className="text-xs text-dark/40 font-bold max-w-[220px] leading-relaxed mb-6">
                  Handshake approved. Transitioning your order confirmation now...
                </p>
                <div className="bg-emerald-500/5 border border-emerald-500/15 py-1.5 px-3 rounded-lg inline-flex items-center space-x-1">
                  <Sparkles size={12} className="text-emerald-500 animate-bounce" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Order finalizing</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

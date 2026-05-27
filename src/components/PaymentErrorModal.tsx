import React, { useState } from 'react';
import { X, AlertCircle, Sparkles, Terminal, Copy, Check, ShieldCheck, ArrowRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  onSimulate: () => void | Promise<void>;
  title?: string;
}

export const PaymentErrorModal: React.FC<PaymentErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  onSimulate,
  title = "Payment Authorization Required"
}) => {
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(errorMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateClick = async () => {
    setIsSimulating(true);
    try {
      await onSimulate();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-dark/70 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg my-8 overflow-hidden border border-dark/5 z-[120]"
        >
          {/* Top Banner Accent */}
          <div className="h-2 bg-gradient-to-r from-secondary to-primary w-full" />

          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-dark/30 hover:text-dark hover:rotate-90 transition-all duration-300 z-10 p-2 bg-dark/5 rounded-full"
          >
            <X size={18} />
          </button>

          <div className="p-8 md:p-10">
            {/* Header section with diagnostics icon */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-secondary/15 p-3 rounded-2xl text-secondary shrink-0">
                <AlertCircle size={28} />
              </div>
              <div>
                <span className="text-[10px] bg-secondary/10 text-secondary border border-secondary/20 px-2.5 py-1 rounded-full uppercase font-black tracking-wider leading-none">
                  Credential Warning
                </span>
                <h3 className="text-2xl font-black text-dark tracking-tight mt-2 leading-tight">
                  {title}
                </h3>
              </div>
            </div>

            {/* Explanatory Context */}
            <p className="text-sm font-medium text-dark/70 leading-relaxed mb-6">
              Razorpay returned a security signature error (<span className="text-secondary font-black">Authentication Failed</span>). This occurs when the API keys are inactive, invalid, or unverified on Razorpay's end.
            </p>

            {/* Error Log Console */}
            <div className="bg-dark/5 rounded-2xl p-5 border border-dark/5 mb-6 relative">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-dark/40 tracking-wider mb-2">
                <span className="flex items-center space-x-1 font-mono">
                  <Terminal size={12} className="mr-1" />
                  API Error Logs
                </span>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1 hover:text-dark-900 transition-colors py-0.5 px-1.5 rounded bg-dark/5 select-none"
                >
                  {copied ? (
                    <>
                      <Check size={10} className="text-green-600" />
                      <span className="text-green-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={10} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-[11px] text-dark/70 bg-white/70 rounded-xl p-3 max-h-24 overflow-y-auto break-all border border-dark/5 leading-normal">
                {errorMessage}
              </div>
            </div>

            {/* Config Guidance Checklist */}
            <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5 mb-8">
              <div className="flex items-center space-x-2 text-primary font-black text-xs uppercase tracking-wider mb-3">
                <ShieldCheck size={16} />
                <span>How to run Live/Real payments:</span>
              </div>
              <ul className="space-y-2.5 text-xs text-dark/70 font-medium">
                <li className="flex items-start">
                  <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mr-2 text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Obtain client and secret keys from your <b>Razorpay Dashboard</b> (Settings &gt; API Keys).</span>
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mr-2 text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Open your local <b>.env</b> file and paste them under <code>VITE_RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code>.</span>
                </li>
                <li className="flex items-start bg-primary/10 p-2.5 rounded-xl text-primary font-semibold">
                  <Settings size={14} className="mr-1.5 shrink-0 mt-0.5" />
                  <span><b>ProTip:</b> Use <code>rzp_test_...</code> keys to simulate actual credit cards safely without spending real money.</span>
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSimulateClick}
                disabled={isSimulating}
                className="flex-1 bg-gradient-to-r from-secondary to-primary hover:from-secondary/95 hover:to-primary/95 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 text-sm"
              >
                {isSimulating ? (
                  <span className="flex items-center space-x-2 animate-pulse">Running Simulation...</span>
                ) : (
                  <>
                    <span>Simulate Payment &amp; Proceed</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                className="bg-dark/5 hover:bg-dark/10 text-dark font-black py-4 px-6 rounded-2xl transition-all text-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

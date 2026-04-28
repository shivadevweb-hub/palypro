
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';

export const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Get in <span className="text-indigo-600">Touch</span></h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions about our rental plans or sanitization process? Our team is here to help you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-indigo-50 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Email Us</p>
                    <p className="text-gray-900 font-medium">support@playpro.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Call Us</p>
                    <p className="text-gray-900 font-medium">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Visit Us</p>
                    <p className="text-gray-900 font-medium leading-relaxed">
                      123, Toy Lane, Kid City,<br />Mumbai - 400001
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-indigo-100">
                <div className="flex items-center space-x-3 text-indigo-600 font-bold mb-4">
                  <Clock size={20} />
                  <span>Working Hours</span>
                </div>
                <p className="text-indigo-900 text-sm">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                <p className="text-indigo-900 text-sm">Sunday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-3xl flex items-center space-x-4 border border-emerald-100">
              <div className="bg-emerald-500 p-3 rounded-2xl text-white">
                <MessageCircle size={28} />
              </div>
              <div>
                <p className="font-bold text-gray-900">WhatsApp Support</p>
                <p className="text-emerald-700 text-sm">Instant help via chat</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100 relative">
              {isSubmitted ? (
                <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Your Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Question about plans"
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                    <textarea 
                      required
                      rows={6}
                      placeholder="How can we help you?"
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center space-x-3"
                  >
                    <span>Send Message</span>
                    <Send size={20} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

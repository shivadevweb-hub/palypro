
import React from 'react';
import { ShieldAlert, BookOpen, Clock, Lock } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl text-indigo-600 mb-6 font-bold">
            <Lock className="mr-2" size={20} />
            Privacy Protection
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-gray-500 font-medium">Last updated: May 2024</p>
        </div>

        <div className="space-y-12 text-gray-600 leading-relaxed">
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">1</div>
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <p className="mb-4">
              PlayPro collects personal information to provide and improve our services. This includes:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Contact Information:</strong> Name, address, email address, and phone number when you register or place a rental order.</li>
              <li><strong>Payment Information:</strong> We use Razorpay to process payments. We do not store your full card numbers or bank credentials on our servers.</li>
              <li><strong>Usage Data:</strong> Information about the toys you rent and how you interact with our website to improve your experience.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">2</div>
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Data</h2>
            </div>
            <p className="mb-4">We use the collected information for the following purposes:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <Clock className="text-indigo-600 mb-3" size={24} />
                <h3 className="font-bold text-gray-900 mb-2">Service Delivery</h3>
                <p className="text-sm text-gray-500">To process orders, deliver toys, and manage your subscription plans.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <ShieldAlert className="text-indigo-600 mb-3" size={24} />
                <h3 className="font-bold text-gray-900 mb-2">Safety & Verification</h3>
                <p className="text-sm text-gray-500">To verify your identity and ensure the security of our toy rental community.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">3</div>
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            </div>
            <div className="bg-indigo-600 text-white p-8 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-lg font-medium leading-relaxed">
                  We implement industry-standard security measures, including SSL encryption and secure firewalls, to protect your personal information from unauthorized access, loss, or theft.
                </p>
              </div>
              <Lock className="absolute -right-8 -bottom-8 opacity-10" size={160} />
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">4</div>
              <h2 className="text-2xl font-bold text-gray-900">Your Choices</h2>
            </div>
            <p className="mb-6">You have rights over your data, including:</p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1.5"><BookOpen size={18} className="text-indigo-600" /></div>
                <div>
                  <p className="font-bold text-gray-900">Access and Correction</p>
                  <p className="text-sm">You can view and update your profile information anytime through your account dashboard.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1.5"><ShieldAlert size={18} className="text-indigo-600" /></div>
                <div>
                  <p className="font-bold text-gray-900">Opt-out</p>
                  <p className="text-sm">You can unsubscribe from marketing emails at any time using the link at the bottom of our emails.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-12 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Privacy Team</h2>
            <p className="text-sm">
              If you have any questions or concerns about this Privacy Policy, please contact our Data Protection Officer at: 
              <a href="mailto:privacy@playpro.com" className="text-indigo-600 font-bold ml-2 hover:underline">privacy@playpro.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

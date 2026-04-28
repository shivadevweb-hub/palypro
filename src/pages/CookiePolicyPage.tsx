
import React from 'react';
import { Cookie, ShieldCheck, BarChart3, Settings, Info } from 'lucide-react';

export const CookiePolicyPage = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl text-indigo-600 mb-6 font-bold">
            <Cookie className="mr-2" size={20} />
            Cookie Settings
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Cookie Policy</h1>
          <p className="text-gray-500 font-medium">Last updated: May 2024</p>
        </div>

        <div className="space-y-12 text-gray-600 leading-relaxed">
          <section className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 flex items-start space-x-6">
            <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600 shrink-0">
              <Info size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">What are cookies?</h2>
              <p className="text-gray-600">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <ShieldCheck className="text-indigo-600 mr-3" />
              Types of Cookies We Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-gray-100 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    <Settings size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">Essential Cookies</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  These are necessary for the website to function. They include, for example, cookies that enable you to log into secure areas, use a shopping cart, or make use of e-billing services.
                </p>
                <p className="mt-4 text-xs font-bold text-emerald-600 uppercase tracking-widest">Always Active</p>
              </div>

              <div className="border border-gray-100 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">Analytics Cookies</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us improve the way our website works.
                </p>
              </div>
            </div>
          </section>

          <section className="prose prose-indigo max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Managing Your Cookies</h2>
            <p className="mb-4">
              Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" className="text-indigo-600 font-bold hover:underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" className="text-indigo-600 font-bold hover:underline">www.allaboutcookies.org</a>.
            </p>
            <p>
              Find out how to manage cookies on popular browsers:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-sm">
              <li>Google Chrome</li>
              <li>Microsoft Edge</li>
              <li>Mozilla Firefox</li>
              <li>Apple Safari</li>
            </ul>
          </section>

          <section className="pt-12 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Questions?</h2>
            <p className="text-sm">
              If you have any questions about our use of cookies, please email us at 
              <a href="mailto:privacy@playpro.com" className="text-indigo-600 font-bold ml-2 hover:underline">privacy@playpro.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

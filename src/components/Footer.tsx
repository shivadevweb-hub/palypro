
import React from 'react';
import { Link } from 'react-router-dom';
import { ToyBrick, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2.5 mb-6 group">
              <div className="relative">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <ToyBrick className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-pink-500 rounded-md" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight font-display italic leading-none">
                PLAY<span className="text-indigo-600">PRO</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              PlayPro is India's leading toy rental platform. We bring joy to your doorstep with high-quality, sanitized toys delivered right to your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/toys" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Our Toys</Link>
              </li>
              <li>
                <Link to="/plans" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Rental Plans</Link>
              </li>
              <li>
                <Link to="/" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Safety & Sanitization</Link>
              </li>
              <li>
                <Link to="/" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Delivery Info</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Contact Us</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center space-x-3 text-gray-500 text-sm">
                <Mail size={18} className="text-indigo-600" />
                <span>support@playpro.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-500 text-sm">
                <Phone size={18} className="text-indigo-600" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-500 text-sm">
                <MapPin size={18} className="text-indigo-600 mt-0.5" />
                <span>123, Toy Lane, Kid City, Mumbai - 400001</span>
              </li>
            </ul>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-indigo-600 hover:shadow-md transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-indigo-600 hover:shadow-md transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-indigo-600 hover:shadow-md transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PlayPro Toy Rental. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-gray-600 text-xs uppercase tracking-widest transition-colors font-medium">Privacy Policy</Link>
            <Link to="/" className="text-gray-400 hover:text-gray-600 text-xs uppercase tracking-widest transition-colors font-medium">Refund Policy</Link>
            <Link to="/cookies" className="text-gray-400 hover:text-gray-600 text-xs uppercase tracking-widest transition-colors font-medium">Cookie Policy</Link>
            <Link to="/admin/login" className="text-gray-400/30 hover:text-indigo-600/50 text-[10px] uppercase tracking-widest transition-colors font-medium">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

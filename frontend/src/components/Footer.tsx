import React from 'react';
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-4 text-gray-500 max-w-xs">
              TechcodeSolution is a premier platform for learning, practicing, and competing in programming.
              Join our community and master the latest technologies.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Help Center</a></li>
              <li><a href="https://t.me/TC_solution" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Community</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Social</h3>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors"><FaLinkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><FaFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-sky-500 transition-colors"><FaTwitter size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-8 flex justify-between items-center">
          <p className="text-base text-gray-400">
            &copy; 2026 TechcodeSolution. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

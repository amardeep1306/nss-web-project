import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-6">
             <div className="bg-blue-600 p-1.5 rounded-lg"><Heart size={20} fill="white" /></div>
             <h2 className="text-2xl font-bold">NSS<span className="text-blue-400">Connect</span></h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empowering students of IIT Roorkee to make a tangible difference in society through transparent philanthropy.
          </p>
        </div>
        
        <div><h3 className="font-bold mb-6">Initiatives</h3><p className="text-gray-400 text-sm">Education<br/>Health<br/>Relief</p></div>
        <div><h3 className="font-bold mb-6">Platform</h3><p className="text-gray-400 text-sm">Dashboard<br/>Login<br/>Support</p></div>
        <div><h3 className="font-bold mb-6">Contact</h3><p className="text-gray-400 text-sm">NSS IIT Roorkee<br/>Uttarakhand, India</p></div>
      </div>
      <div className="text-center text-gray-600 text-sm pt-8 border-t border-gray-800">© 2026 NSS IIT Roorkee.</div>
    </footer>
  );
};

export default Footer;
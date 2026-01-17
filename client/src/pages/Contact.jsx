import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-800">Get in Touch</h1>
            <p className="text-gray-500 mt-2">Have a question or want to volunteer? We are here to help.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden">
            
            {/* Contact Info (Left) */}
            <div className="bg-blue-900 p-10 text-white flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <MapPin className="text-blue-400" />
                        <p>NSS Office, Multi Activity Centre (MAC),<br/>IIT Roorkee, Uttarakhand - 247667</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="text-blue-400" />
                        <p>+91 1332 285 000</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="text-blue-400" />
                        <p>nss@iitr.ac.in</p>
                    </div>
                </div>
            </div>

            {/* Form (Right) */}
            <div className="p-10">
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Your Name</label>
                        <input type="text" className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50" placeholder="Amardeep Kumar" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                        <input type="email" className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50" placeholder="email@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Message</label>
                        <textarea rows="4" className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50" placeholder="How can we help you?"></textarea>
                    </div>
                    <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        Send Message <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
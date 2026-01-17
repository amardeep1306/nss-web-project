import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HelpCircle } from 'lucide-react';

const Help = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <HelpCircle className="text-blue-600" size={32} /> Help & FAQs
        </h1>

        <div className="space-y-6">
            <FaqItem 
                question="Is my donation safe?" 
                answer="Yes, absolutely. We use Razorpay's secure payment gateway (Sandbox/Live). Your money goes directly to the NSS IIT Roorkee bank account." 
            />
            <FaqItem 
                question="How do I get the Tax Benefit certificate?" 
                answer="Once your donation is successful, you can download the 80G receipt directly from your Dashboard under the 'History' tab." 
            />
            <FaqItem 
                question="Can I donate anonymously?" 
                answer="Yes, you can choose to remain anonymous on the public leaderboard. However, we need your details for legal tax receipt generation." 
            />
            <FaqItem 
                question="How are the 'Stars' calculated?" 
                answer="It's based on your contribution. ₹1 = 0.2 XP. As you donate more, your level increases from Bronze to Legendary!" 
            />
             <FaqItem 
                question="I faced a payment failure. What to do?" 
                answer="Don't worry. If money was deducted, it will be refunded automatically within 5-7 days. You can also contact us at nss@iitr.ac.in." 
            />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const FaqItem = ({ question, answer }) => (
  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition bg-gray-50">
    <h3 className="font-bold text-lg text-gray-800 mb-2">{question}</h3>
    <p className="text-gray-600">{answer}</p>
  </div>
);

export default Help;
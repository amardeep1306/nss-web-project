import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Building, Handshake, CheckCircle, Calendar, Mail } from 'lucide-react';
import { BASE_URL } from '../helper';

const Partner = () => {
  const [submitted, setSubmitted] = useState(false);

  // 1. STATE FOR FORM DATA
  const [formData, setFormData] = useState({
    orgType: 'Corporate (CSR)',
    organizationName: '',
    city: '',
    contactPerson: '',
    mobile: '',
    email: '', 
    collaborationGoal: 'CSR Project Funding', 
    message: ''
  });

  // 2. HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. HANDLE SUBMIT
  // 3. HANDLE SUBMIT (Updated for Backend Match)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      // Data ko Backend ke names ke hisab se convert kar rahe hain
      const payload = {
        organization: formData.organizationName, // Backend 'organization' mangta hai
        city: formData.city,
        name: formData.contactPerson,            // Backend 'name' mangta hai
        mobile: formData.mobile,
        email: formData.email,
        goal: formData.collaborationGoal,        // Backend 'goal' mangta hai
        message: formData.message,
        orgType: formData.orgType                // Ye extra bhej rahe hain (optional)
      };

      
      const res = await fetch(`${BASE_URL}/api/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
      });

      const data = await res.json();
      
      if (res.ok) { // Check for 200 OK status
        setSubmitted(true);
      } else {
        alert("Error: " + (data.error || "Submission Failed"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit proposal. Check console for details.");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 max-w-5xl mx-auto px-6">

        {!submitted ? (
            <div className="grid md:grid-cols-2 gap-12">
                {/* Left Side Info */}
                <div>
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Collaborate</span>
                    <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Partner With Us</h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Join 50+ organizations making a real difference. Whether you are a Corporate, NGO, or School, let's create impact together.
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Building size={24} /></div>
                            <div>
                                <h3 className="font-bold text-lg">CSR & Tax Benefits</h3>
                                <p className="text-gray-500 text-sm">Get 80G certificates and detailed impact reports.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="bg-orange-100 p-3 rounded-lg text-orange-600"><Handshake size={24} /></div>
                            <div>
                                <h3 className="font-bold text-lg">Brand Visibility</h3>
                                <p className="text-gray-500 text-sm">Feature your logo in IIT Roorkee's mega events.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Org Type */}
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">Organization Type</label>
                            <select 
                                name="orgType" 
                                value={formData.orgType} //  Controlled Component
                                onChange={handleChange} 
                                className="w-full p-3 rounded-lg border focus:border-blue-500 outline-none"
                            >
                                <option>Corporate (CSR)</option>
                                <option>NGO / Non-Profit</option>
                                <option>School / College</option>
                                <option>Influencer / Media</option>
                            </select>
                        </div>

                        {/* Org Name & City */}
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                              required 
                              name="organizationName" 
                              value={formData.organizationName}
                              onChange={handleChange} 
                              type="text" 
                              placeholder="Org Name" 
                              className="w-full p-3 rounded-lg border outline-none" 
                            />
                            <input 
                              required 
                              name="city" 
                              value={formData.city}
                              onChange={handleChange} 
                              type="text" 
                              placeholder="City" 
                              className="w-full p-3 rounded-lg border outline-none" 
                            />
                        </div>

                        {/* Person Name & Mobile */}
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                              required 
                              name="contactPerson" 
                              value={formData.contactPerson}
                              onChange={handleChange} 
                              type="text" 
                              placeholder="Contact Person" 
                              className="w-full p-3 rounded-lg border outline-none" 
                            />
                            <input 
                              required 
                              name="mobile" 
                              value={formData.mobile}
                              onChange={handleChange} 
                              type="text" 
                              placeholder="Phone Number" 
                              className="w-full p-3 rounded-lg border outline-none" 
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                           <input 
                             required 
                             name="email" 
                             value={formData.email}
                             onChange={handleChange} 
                             type="email" 
                             placeholder="Official Email Address" 
                             className="w-full p-3 rounded-lg border outline-none" 
                           />
                        </div>

                        {/* Goal Dropdown */}
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">Collaboration Goal</label>
                            <select 
                                name="collaborationGoal" 
                                value={formData.collaborationGoal} //  Controlled Component
                                onChange={handleChange} 
                                className="w-full p-3 rounded-lg border focus:border-blue-500 outline-none"
                            >
                                <option>CSR Project Funding</option>
                                <option>Employee Volunteering</option>
                                <option>Event Sponsorship</option>
                                <option>Donation Drive</option>
                            </select>
                        </div>

                        {/* Message Box */}
                        <textarea 
                            name="message" 
                            value={formData.message}
                            onChange={handleChange} 
                            rows="3" 
                            placeholder="Tell us how you want to collaborate..." 
                            className="w-full p-3 rounded-lg border outline-none"
                        ></textarea>

                        <button type="submit" className="w-full py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-md">
                            Submit Proposal
                        </button>
                    </form>
                </div>
            </div>
        ) : (
            // Success Screen
            <div className="max-w-xl mx-auto text-center py-12 bg-green-50 rounded-3xl border border-green-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Proposal Received!</h2>
                <p className="text-gray-600 mb-8">Thank you for your interest. Our partnership team will review your details and contact you within 48 hours.</p>
                <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-bold text-gray-700 flex items-center gap-2 mx-auto hover:bg-gray-50">
                    <Calendar size={18} /> Schedule a Meeting (Optional)
                </button>
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Partner;
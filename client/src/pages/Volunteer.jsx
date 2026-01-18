import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion'; 
import { CheckCircle, Users, Download, Shield } from 'lucide-react';
import { BASE_URL } from '../helper';
const Volunteer = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State 
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    mobile: '',
    email: '',
    city: '',
    skills: [],
    experience: 'No', // Default 'No'
    idProof: ''
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // Skill Toggle Logic
  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  //  MAIN CHANGE: Form Submit Logic (Connect to Backend)
  const handleSubmit = async () => {
    setLoading(true);

    // 1. Validation (Zaroori fields check karo)
    if(!formData.name || !formData.mobile || !formData.email || !formData.city) {
        alert("Please fill all required fields (Name, Mobile, Email, City)");
        setLoading(false);
        return;
    }

    try {
      // 2. API Call
      const response = await fetch(`${BASE_URL}/api/forms/volunteer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.status === "success") {
        setLoading(false);
        setStep(5); // Success Screen
      } else {
        alert("Error: " + (result.error || "Submission Failed"));
        setLoading(false);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Server Error! Make sure backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />
      
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px]">
          
          {/* Header Progress */}
          <div className="bg-blue-900 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Join the Hero Community</h1>
            <p className="text-blue-200 text-sm">Step {step} of 5</p>
            <div className="w-full bg-blue-800 h-2 mt-4 rounded-full">
              <motion.div 
                className="bg-green-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${step * 20}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    
                    {/* STEP 1: Volunteer Type */}
                    {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">How would you like to contribute?</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                        {['Field Volunteer (Ground Work)', 'Online Volunteer (Tech/Design)', 'Event Volunteer', 'Fundraising Volunteer', 'Internship / Student'].map((type) => (
                            <button key={type}
                            onClick={() => { setFormData({...formData, type}); handleNext(); }}
                            className={`p-4 border rounded-xl text-left hover:border-blue-600 hover:bg-blue-50 transition font-medium focus:outline-none hover:shadow-md ${formData.type === type ? 'bg-blue-50 border-blue-600 text-blue-900' : 'text-gray-700 border-gray-200'}`}>
                            {type}
                            </button>
                        ))}
                        </div>
                    </div>
                    )}

                    {/* STEP 2: Basic Details (Inputs Connected) */}
                    {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">Basic Details</h2>
                        
                        <input type="text" placeholder="Full Name" 
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:border-blue-500 outline-none" 
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        
                        <div className="flex gap-2">
                            <input type="tel" placeholder="Mobile Number" 
                                className="w-full p-3 border rounded-lg bg-gray-50 outline-none" 
                                value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                            />
                        </div>
                        
                        <input type="email" placeholder="Email Address" 
                            className="w-full p-3 border rounded-lg bg-gray-50 outline-none" 
                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="City / State" 
                                className="w-full p-3 border rounded-lg bg-gray-50 outline-none" 
                                value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                            <select className="w-full p-3 border rounded-lg bg-gray-50 outline-none text-gray-500">
                                <option>Available Time</option>
                                <option>Weekends Only</option>
                                <option>Daily</option>
                                <option>Occasionally</option>
                            </select>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button onClick={handleBack} className="text-gray-500 font-bold hover:text-gray-800">Back</button>
                            <button onClick={handleNext} className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800">Next</button>
                        </div>
                    </div>
                    )}

                    {/* STEP 3: Interest & Skills */}
                    {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">Your Skills & Interests</h2>
                        <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">🤖 We will assign work based on your interest.</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {['Teaching Kids', 'Social Media / PR', 'Graphic Design', 'Fund Collection', 'Medical Help', 'Legal Help', 'Logistics / Driving'].map((skill) => (
                                <label key={skill} className={`p-3 border rounded-lg flex items-center gap-3 cursor-pointer transition-all ${formData.skills.includes(skill) ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`}>
                                    <input type="checkbox" className="w-5 h-5 accent-blue-600" 
                                        checked={formData.skills.includes(skill)}
                                        onChange={() => toggleSkill(skill)}
                                    />
                                    <span className="text-sm font-medium">{skill}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6">
                            <button onClick={handleBack} className="text-gray-500 font-bold hover:text-gray-800">Back</button>
                            <button onClick={handleNext} className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800">Next</button>
                        </div>
                    </div>
                    )}

                    {/* STEP 4: Verification (Connected) */}
                    {step === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">Verification & Trust</h2>
                        
                        <div className="space-y-4">
                            <div className="p-4 border rounded-xl">
                                <p className="font-semibold mb-2">Have you volunteered before?</p>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="exp" className="accent-blue-600" 
                                            checked={formData.experience === 'Yes'} onChange={() => setFormData({...formData, experience: 'Yes'})}
                                        /> Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="exp" className="accent-blue-600" 
                                            checked={formData.experience === 'No'} onChange={() => setFormData({...formData, experience: 'No'})}
                                        /> No
                                    </label>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block font-semibold mb-2">Aadhaar / ID Number (Optional)</label>
                                <input type="text" placeholder="XXXX-XXXX-XXXX" 
                                    className="w-full p-3 border rounded-lg bg-gray-50 outline-none" 
                                    value={formData.idProof} onChange={(e) => setFormData({...formData, idProof: e.target.value})}
                                />
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
                                <Shield size={18} className="text-green-600" />
                                We respect your privacy. Data will not be shared.
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button onClick={handleBack} disabled={loading} className="text-gray-500 font-bold hover:text-gray-800">Back</button>
                            
                            <button onClick={handleSubmit} disabled={loading} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transform hover:scale-105 transition flex items-center gap-2">
                                {loading ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    </div>
                    )}

                    {/* STEP 5: Success */}
                    {step === 5 && (
                    <div className="text-center py-8">
                        <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                        <CheckCircle size={40} className="text-green-600" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">You are now a Hero! 🎉</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">Welcome to the NSS IIT Roorkee family.</p>
                        
                        <div className="space-y-4 max-w-sm mx-auto">
                            <button className="w-full px-6 py-4 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition shadow-lg">
                                Join WhatsApp Group <Users size={20} />
                            </button>
                            <button className="w-full px-6 py-4 border-2 border-blue-900 text-blue-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition">
                                Download Volunteer ID <Download size={20} />
                            </button>
                        </div>
                    </div>
                    )}

                </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Volunteer;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../helper'
import Navbar from '../components/Navbar';
import { User, Mail, Phone, MapPin, Globe, ArrowRight, Loader, Lock } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
    country: 'India'
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        alert("🎉 Account Created Successfully! Please Login.");
        navigate('/login'); 
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed. Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="flex min-h-screen items-center justify-center p-4 pt-24 pb-12">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT SIDE: Image & Branding */}
          <div className="w-full md:w-5/12 bg-blue-900 relative p-10 flex flex-col justify-between text-white min-h-[300px] md:min-h-auto">
            <div className="absolute inset-0 z-0 opacity-50">
               {/* Image: Group of people/community for Signup vibe */}
               <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80" alt="Community" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Join Our Mission</h2>
                <p className="text-blue-100">Be part of the change. Create your account to start volunteering.</p>
            </div>
            <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 mt-10">
                <p className="text-sm font-medium">"Alone we can do so little; together we can do so much."</p>
                <p className="text-xs text-blue-200 mt-2">- Helen Keller</p>
            </div>
          </div>

          {/* RIGHT SIDE: Form */}
          <div className="w-full md:w-7/12 p-8 md:p-12">
            
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                <p className="text-gray-500 mt-1">Fill in your details to register</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
                
                {/* Name */}
                <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input required name="name" onChange={handleChange} type="text" placeholder="Full Name" 
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition" 
                    />
                </div>

                {/* Email & Mobile (Grid for Desktop) */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input required name="email" onChange={handleChange} type="email" placeholder="Email Address" 
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition" 
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input required name="mobile" onChange={handleChange} type="tel" placeholder="Mobile Number" 
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition" 
                        />
                    </div>
                </div>

                {/* City & State (Grid) */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input required name="city" onChange={handleChange} type="text" placeholder="City" 
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition" 
                        />
                    </div>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input required name="state" onChange={handleChange} type="text" placeholder="State" 
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition" 
                        />
                    </div>
                </div>

                {/* Country */}
                <div className="relative">
                    <Globe className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input required name="country" onChange={handleChange} type="text" placeholder="Country" defaultValue="India"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition" 
                    />
                </div>

                {/* Submit Button */}
                <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 mt-4">
                    {loading ? <Loader className="animate-spin" /> : <>Register Now <ArrowRight size={20} /></>}
                </button>

                {/* Footer Link */}
                <div className="text-center mt-6">
                    <p className="text-gray-500 text-sm">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
                    </p>
                </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { User, Mail, Lock, ArrowRight, Loader, CheckCircle } from 'lucide-react';
import { BASE_URL } from '../helper'
const Login = () => {
  const navigate = useNavigate();
  
  // States
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // --- 1. OTP MANGWANE KA FUNCTION ---
  const handleGetOTP = async (e) => {
    e.preventDefault();
    if (!email) { alert("Please enter email"); return; }
    
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const data = await res.json();

      if (data.status === "success") {
  alert("✅ OTP sent to your Email ID! Please check your Inbox."); // ✅ Sahi message
  setStep(2);
} else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Server Error! Make sure Backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. OTP VERIFY KARNE KA FUNCTION ---
  // --- 2. OTP VERIFY KARNE KA FUNCTION ---
 // --- 2. OTP VERIFY KARNE KA FUNCTION (Fixed for Admin Redirect) ---
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) { alert("Please enter OTP"); return; }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();

      if (data.status === "success") {
        // Login Success
        localStorage.setItem('userEmail', email); 
        console.log("Login Success Data:", data);
        console.log("User Role is:", data.user.role);
        localStorage.setItem('userRole', data.user.role);
        
        if (data.user.role === 'admin') {
            navigate("/admin");       // Admin ko Admin Dashboard par bhejo
        } else {
            navigate("/dashboard");   // Student ko User Dashboard par bhejo
        }
        
      } else {
        alert("❌ Invalid OTP! Try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="flex min-h-screen items-center justify-center p-4 pt-20">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
          
          {/* LEFT SIDE: Image & Text (NSS Branding) */}
          <div className="w-full md:w-1/2 bg-blue-900 relative p-10 flex flex-col justify-between text-white">
            <div className="absolute inset-0 z-0 opacity-40">
                <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80" alt="Volunteers" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                <p className="text-blue-200">Join the community of changemakers at IIT Roorkee.</p>
            </div>
            <div className="relative z-10 bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 mt-10">
                <p className="text-sm font-medium">"The best way to find yourself is to lose yourself in the service of others."</p>
                <p className="text-xs text-blue-300 mt-2">- Mahatma Gandhi</p>
            </div>
          </div>

          {/* RIGHT SIDE: Form (Dynamic) */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  {step === 1 ? 'User Login' : 'Verify OTP'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {step === 1 ? 'Enter your details below' : `OTP sent to ${email}`}
                </p>
            </div>

            {/* --- STEP 1 FORM (Name & Email) --- */}
            {step === 1 && (
              <form onSubmit={handleGetOTP} className="space-y-4">
                
                {/* Name Field */}
                <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input type="text" placeholder="Full Name" 
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition" 
                      value={name} onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Email Field */}
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input type="email" placeholder="User Email ID" required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition" 
                      value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Button */}
                <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                    {loading ? <Loader className="animate-spin" /> : <>Get OTP <ArrowRight size={20} /></>}
                </button>
                <div className="text-center mt-4">
      <p className="text-gray-500 text-sm">
        New User? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create an Account</Link>
      </p>
    </div>
              </form>
            )}

            {/* --- STEP 2 FORM (OTP Only) --- */}
            {step === 2 && (
              <form onSubmit={handleVerify} className="space-y-4">
                
                <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center mb-4">
    <p className="text-xs text-green-800 font-bold">
       📨 OTP sent to <span className="underline">{email}</span>. <br/>
       Check your Inbox or Spam folder.
    </p>
</div>

                {/* OTP Field */}
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input type="text" placeholder="Enter 4-Digit OTP" required maxLength="4"
                      className="w-full pl-10 pr-4 py-3 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-600 text-center text-xl font-bold tracking-widest bg-white" 
                      value={otp} onChange={(e) => setOtp(e.target.value)}
                    />
                </div>

                {/* Button */}
                <button disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                    {loading ? <Loader className="animate-spin" /> : <>Verify & Login <CheckCircle size={20} /></>}
                </button>

                <div className="text-center mt-4">
                  <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-blue-600 font-medium">
                    Incorrect Email? Go Back
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
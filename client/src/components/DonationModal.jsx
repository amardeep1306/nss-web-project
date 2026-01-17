import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Shield, CheckCircle, Heart, Download, MessageCircle, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { BASE_URL } from '../helper';
const DonationModal = ({ isOpen, onClose, selectedCause }) => {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  
  // Form States
  const [subCause, setSubCause] = useState('');
  const [amount, setAmount] = useState(501);
  const [customAmount, setCustomAmount] = useState('');
  
  // 👇 UPDATED: Form data capture karne ke liye state init
  const [details, setDetails] = useState({ 
    name: '', 
    mobile: '', 
    email: '', 
    isAnonymous: false 
  });
   useEffect(() => {
    if (isOpen) {
        setStep(1);
        setProcessing(false);
        setSubCause('');
        // Note: Hum details reset nahi kar rahe taki user ko naam dubara na likhna pade (Good UX)
    }
  }, [isOpen]);
  if (!isOpen) return null;

  // Sub-causes List
  const getSubCauses = () => {
    switch (selectedCause?.title) {
      case "Educate a Child": // Note: Title match hona chahiye Home page se
      case "Education Support":
        return ["Sponsor a Child's Fee", "Buy Books & Uniforms", "Digital Classroom", "Stationery Kit"];
      case "Emergency Medical Aid":
      case "Medical Help":
        return ["Life Saving Surgery", "Medicines for Poor", "Wheelchair Donation", "Health Camp Support"];
      case "Feed the Hungry":
        return ["Sponsor a Meal (Annadan)", "Monthly Ration Kit", "Milk for Kids", "Festival Feast"];
      case "Winter Relief Drive":
      case "Disaster Relief":
        return ["Emergency Food Pack", "Shelter Kits", "Medical Aid", "Warm Blankets"];
      default:
        return ["Direct Aid", "Urgent Needs", "General Support", "Admin & Logistics"];
    }
  };
   // 👇 1. Razorpay Script Load karne ke liye
  const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
  };

  // 👇 2. MAIN PAYMENT FUNCTION (Razorpay Integration)
  const handlePayment = async () => {
    // A. Validation
    if (!details.email && !details.isAnonymous) {
      alert("Please enter email to track your donation, or select Anonymous.");
      return;
    }

    setProcessing(true);
    const finalAmount = customAmount ? Number(customAmount) : amount;
    const USE_DUMMY_MODE = true;
    try {
        if (USE_DUMMY_MODE) {
            // ==========================================
            // 🟢 OPTION 1: DUMMY PAYMENT (ABHI KE LIYE)
            // ==========================================
            console.log("Running in Dummy Mode...");
            
            // 1. Fake Delay (Taaki real feel aaye)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 2. Direct Call to Backend
            const res = await fetch(`${BASE_URL}/api/payment-success`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: details.isAnonymous ? "Anonymous" : (details.name || "Guest"),
                    email: details.email,
                    mobile: details.mobile,
                    amount: finalAmount,
                    cause: selectedCause?.title || "General Donation",
                    subCause: subCause || "General",
                    transactionId: "DUMMY_" + Date.now() // Fake ID
                })
            });

            const data = await res.json();
            if (data.status === "success") {
                setProcessing(false);
                setStep(5); // Show Success Screen 🎉
            } else {
                alert("Donation Failed: " + data.error);
                setProcessing(false);
            }

        } else {
            // ==========================================
            // 🔴 OPTION 2: RAZORPAY (FUTURE KE LIYE)
            // ==========================================
            
            // 1. Load SDK
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
            if (!res) {
                alert('Razorpay SDK failed to load. Check internet.');
                setProcessing(false);
                return;
            }

            // 2. Create Order
            const orderRes = await fetch(`${BASE_URL}/api/payment/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: finalAmount })
            });
            const orderData = await orderRes.json();

            if (orderData.error) {
                alert("Order Creation Failed: " + orderData.error);
                setProcessing(false);
                return;
            }

            // 3. Open Razorpay Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: "INR",
                name: "NSS IIT Roorkee",
                description: `Donation for ${selectedCause?.title || "Cause"}`,
                order_id: orderData.id,
                
                // 4. Success Handler
                handler: async function (response) {
                    const verifyRes = await fetch(`${BASE_URL}/api/payment-success`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: details.isAnonymous ? "Anonymous" : (details.name || "Guest"),
                            email: details.email,
                            mobile: details.mobile,
                            amount: finalAmount,
                            cause: selectedCause?.title || "General Donation",
                            subCause: subCause || "General",
                            // Razorpay Specific Data
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });
                    
                    const verifyData = await verifyRes.json();
                    if(verifyData.status === "success"){
                        setProcessing(false);
                        setStep(5);
                    } else {
                        alert("Payment Verification Failed!");
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: details.name,
                    email: details.email,
                    contact: details.mobile
                },
                theme: { color: "#166534" },
                modal: {
                    ondismiss: function() {
                        setProcessing(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        }

    } catch (error) {
        console.error("Payment Error:", error);
        alert("Something went wrong!");
        setProcessing(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10 p-2 bg-gray-100 rounded-full">
            <X size={20} />
        </button>

        {/* Modal Header */}
        <div className={`p-6 text-white ${step === 5 ? 'bg-green-600' : 'bg-blue-900'}`}>
            <h2 className="text-xl font-bold flex items-center gap-2">
                {step === 5 ? <><CheckCircle /> Donation Successful</> : `Donate to ${selectedCause?.title}`}
            </h2>
            {step < 5 && <p className="text-blue-200 text-xs mt-1">Step {step} of 4</p>}
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            
            {/* STEP 1: SUB CAUSE SELECTION */}
            {step === 1 && (
                <div className="space-y-4">
                    <p className="font-bold text-gray-700">Where should we use your donation?</p>
                    <div className="space-y-3">
                        {getSubCauses().map((item, idx) => (
                            <label key={idx} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${subCause === item ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'hover:bg-gray-50'}`}>
                                <input type="radio" name="subcause" className="accent-blue-600 w-5 h-5" 
                                    checked={subCause === item} onChange={() => setSubCause(item)} 
                                />
                                <span className="font-medium text-gray-700">{item}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: AMOUNT SELECTION */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                        <p className="text-orange-800 font-bold text-sm">💡 Impact: Your contribution directly helps a soul in need.</p>
                    </div>
                    
                    <p className="font-bold text-gray-700">Choose Amount</p>
                    <div className="grid grid-cols-3 gap-3">
                        {[101, 251, 501, 1100, 2100, 5100].map((amt) => (
                            <button key={amt} onClick={() => {setAmount(amt); setCustomAmount('')}}
                                className={`py-3 rounded-lg font-bold border ${amount === amt && !customAmount ? 'bg-blue-900 text-white border-blue-900' : 'border-gray-200 text-gray-600 hover:border-blue-500'}`}>
                                ₹{amt}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500 font-bold">₹</span>
                        <input type="number" placeholder="Enter Custom Amount" 
                            className="w-full p-3 pl-8 border rounded-lg outline-none focus:border-blue-600 font-bold text-gray-800"
                            value={customAmount}
                            onChange={(e) => {setCustomAmount(e.target.value); setAmount(0)}}
                        />
                    </div>
                </div>
            )}

            {/* STEP 3: DONOR DETAILS (Inputs fix kiye hain) */}
            {step === 3 && (
                <div className="space-y-4">
                    <div className="space-y-3">
                        <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg outline-none focus:border-blue-600" 
                            value={details.name}
                            onChange={(e) => setDetails({...details, name: e.target.value})}
                        />
                        <input type="tel" placeholder="Mobile Number" className="w-full p-3 border rounded-lg outline-none focus:border-blue-600" 
                            value={details.mobile}
                            onChange={(e) => setDetails({...details, mobile: e.target.value})}
                        />
                        <input type="email" placeholder="Email (Must for Dashboard Tracking)" className="w-full p-3 border rounded-lg outline-none focus:border-blue-600" 
                            value={details.email}
                            onChange={(e) => setDetails({...details, email: e.target.value})}
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-blue-600 w-4 h-4" 
                            checked={details.isAnonymous}
                            onChange={(e) => setDetails({...details, isAnonymous: e.target.checked})}
                        />
                        <span className="text-sm text-gray-600">Make my donation anonymous</span>
                    </label>

                    <div className="flex items-center gap-4 bg-green-50 p-3 rounded-lg border border-green-100 mt-2">
                        <Shield className="text-green-600" size={20} />
                        <div>
                            <p className="text-xs font-bold text-green-800">100% Secure & Tax Free</p>
                            <p className="text-[10px] text-green-700">You will get 80G Tax Benefit Receipt</p>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: PAYMENT PREVIEW */}
            {step === 4 && (
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">You are donating</p>
                        <h1 className="text-4xl font-extrabold text-blue-900 my-2">₹{customAmount || amount}</h1>
                        <p className="text-gray-600 font-medium bg-gray-100 inline-block px-3 py-1 rounded-full text-sm">{subCause || selectedCause?.title}</p>
                    </div>

                    <div className="border-t border-b py-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Donor Name</span>
                            <span className="font-bold text-gray-800">{details.isAnonymous ? "Anonymous" : details.name || "Guest"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax Benefit</span>
                            <span className="font-bold text-green-600">Applicable (80G)</span>
                        </div>
                    </div>

                    <button onClick={handlePayment} disabled={processing} 
                        className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                        {processing ? "Connecting to Bank..." : <><Lock size={18} /> Pay Securely</>}
                    </button>
                    
                    <div className="flex justify-center gap-4 opacity-50 grayscale">
                        {/* Icons placeholders */}
                        <span className="text-xs font-bold text-gray-400">UPI • Cards • NetBanking</span>
                    </div>
                </div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 5 && (
                <div className="text-center py-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Heart size={40} className="text-green-600" fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Thank You! You're a Blessing 🙏</h2>
                    <p className="text-gray-500 text-sm mt-2 mb-6">Your donation of <span className="font-bold text-gray-900">₹{customAmount || amount}</span> will help in "{subCause}".</p>

                    <div className="space-y-3">
                        <button className="w-full py-3 border border-gray-300 rounded-xl font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50">
                            <Download size={18} /> Download 80G Receipt
                        </button>
                        <button className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 shadow-md">
                            <MessageCircle size={18} /> Get Updates on WhatsApp
                        </button>
                    </div>
                    
                    <button onClick={onClose} className="mt-6 text-sm text-blue-600 font-bold hover:underline">Close Window</button>
                </div>
            )}
        </div>

        {/* Footer Navigation */}
        {step < 4 && (
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                {step > 1 ? (
                    <button onClick={() => setStep(step - 1)} className="text-gray-500 font-bold flex items-center gap-1 hover:text-gray-800"><ArrowLeft size={16}/> Back</button>
                ) : (
                    <div></div>
                )}
                
                <button onClick={() => {
                    if (step === 1 && !subCause) { alert("Please select a cause option"); return; }
                    setStep(step + 1)
                }} 
                className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800">
                    Next <ArrowRight size={16}/>
                </button>
            </div>
        )}
      </motion.div>
    </div>
  );
};

export default DonationModal;
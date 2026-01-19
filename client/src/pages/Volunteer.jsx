import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion'; 
import { CheckCircle, Users, Download, Shield } from 'lucide-react';
import { BASE_URL } from '../helper';
import jsPDF from 'jspdf';
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
  // MAIN CHANGE: Form Submit Logic (Updated to match Backend)
  const handleSubmit = async () => {
    setLoading(true);

    // 1. Validation
    if(!formData.name || !formData.mobile || !formData.email || !formData.city) {
        alert("Please fill all required fields (Name, Mobile, Email, City)");
        setLoading(false);
        return;
    }

    try {
      // Data ko Backend ke hisab se convert kar rahe hain
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        
        // Backend 'course' mangta hai, hum wahan 'City' bhej rahe hain taaki data save ho jaye
        course: formData.city, 
        
        // Backend 'year' mangta hai, hum wahan 'Volunteer Type' bhej rahe hain
        year: formData.type,   
        
        // Backend 'whyJoin' mangta hai, hum wahan 'Skills' bhej rahe hain
        whyJoin: formData.skills.join(', '), 
        
        // Backend 'aadhaar' mangta hai, hum 'idProof' bhej rahe hain
        aadhaar: formData.idProof,
        
        // Backend 'hasVolunteered' mangta hai, hum 'experience' bhej rahe hain
        hasVolunteered: formData.experience
      };

      // 2. API Call (URL Fixed: /api/volunteers)
      const response = await fetch(`${BASE_URL}/api/volunteers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) { // Check if status is 200 OK
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
  
const handleDownloadID = () => {
    // 1. Safety Check
    if (!formData) {
        alert("No data available to generate ID Card");
        return;
    }

    // 2. Setup PDF (Standard ID Card Size: 85.6mm x 54mm)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54] 
    });

    // --- COLORS ---
    const deepBlue = [0, 51, 102];    // Official Blue
    const orange = [255, 165, 0];     // NSS Orange
    const white = [255, 255, 255];
    const grayText = [80, 80, 80];
    const lightGrayBox = [245, 245, 245];

    // --- ASSETS (Signature) ---
    const signatureBase64 = "data:image/png;base64,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";

    // --- GENERATE DATA ---
    const nameStr = formData.name || "Volunteer";
    const namePart = nameStr.substring(0, 3).toUpperCase();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const uniqueID = `NSS-IITR-${randomPart}`;

    // ==========================================
    //  LEFT SIDE DESIGN (Blue Strip)
    // ==========================================
    doc.setFillColor(...deepBlue);
    doc.rect(0, 0, 24, 54, 'F'); // 24mm width strip

    // Profile Circle (White background for photo placeholder)
    doc.setFillColor(...white);
    doc.circle(12, 15, 8, 'F'); 

    // Initials inside Circle
    doc.setFontSize(10);
    doc.setTextColor(...deepBlue);
    doc.setFont("helvetica", "bold");
    const initials = nameStr.charAt(0).toUpperCase();
    doc.text(initials, 12, 17, { align: 'center' });

    // Vertical Text "VOLUNTEER"
    doc.setFontSize(8);
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    // Rotation: angle 90 means vertical text bottom-to-top
    doc.text("VOLUNTEER", 10, 48, { angle: 90 });

    // Small Logo Text at bottom left
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    doc.text("IIT ROORKEE", 12, 51, { align: 'center' });


    // ==========================================
    //  RIGHT SIDE DESIGN (Details)
    // ==========================================
    const startX = 29; // Margin after blue strip

    // HEADER
    doc.setFontSize(11);
    doc.setTextColor(...deepBlue);
    doc.setFont("helvetica", "bold");
    doc.text("NATIONAL SERVICE SCHEME", startX, 8);

    // Subheader
    doc.setFontSize(6);
    doc.setTextColor(...orange);
    doc.text("NOT FOR ME BUT FOR YOU", startX, 11);

    // Separator Line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.4);
    doc.line(startX, 13, 80, 13);

    // --- VOLUNTEER DETAILS ---
    let yPos = 20;

    // Name (Large & Bold)
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(nameStr.toUpperCase(), startX, yPos);

    // ID Number (Inside a subtle box)
    yPos += 5;
    doc.setFillColor(...lightGrayBox);
    doc.rect(startX, yPos - 3, 30, 5, 'F'); // Background box
    doc.setFontSize(8);
    doc.setTextColor(...deepBlue);
    doc.setFont("helvetica", "bold");
    doc.text(uniqueID, startX + 1, yPos + 0.5);

    // Other Details (Labels Gray, Values Black)
    yPos += 7;
    doc.setFontSize(7);
    const lineHeight = 4;

    // Phone
    doc.setTextColor(...grayText); doc.text("Phone:", startX, yPos);
    doc.setTextColor(0,0,0);       doc.text(formData.mobile || "N/A", startX + 10, yPos);
    
    // Email
    yPos += lineHeight;
    doc.setTextColor(...grayText); doc.text("Email:", startX, yPos);
    doc.setTextColor(0,0,0);       doc.text(formData.email || "N/A", startX + 10, yPos);

    // Course (Truncate if too long)
    yPos += lineHeight;
    let course = formData.course || "N/A";
    if(course.length > 25) course = course.substring(0, 24) + "...";
    
    doc.setTextColor(...grayText); doc.text("Course:", startX, yPos);
    doc.setTextColor(0,0,0);       doc.text(course, startX + 10, yPos);


    // ==========================================
    //  FOOTER & SIGNATURE
    // ==========================================
    
    // 1. Signature Image (Scaled down to fit ID card)
    // x=55, y=40, width=25, height=8 (Adjusted for landscape ID)
    doc.addImage(signatureBase64, 'PNG', 55, 38, 25, 8);

    // 2. Authorization Text
    doc.setFontSize(5);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Authorized Signature", 68, 48, { align: 'center' });
    doc.text("NSS IIT ROORKEE", 68, 50, { align: 'center' });

    // 3. Border around the whole card
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.rect(0, 0, 85.6, 54);

    // SAVE FILE
    doc.save(`ID_Card_${namePart}.pdf`);
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
                            <button 
            onClick={handleDownloadID} 
            className="w-full px-6 py-4 border-2 border-blue-900 text-blue-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition"
        >
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
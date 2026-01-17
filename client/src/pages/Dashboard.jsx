import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { TrendingUp, Heart, Loader, Mail, Zap } from 'lucide-react';
import jsPDF from 'jspdf'; 
import { BASE_URL } from '../helper';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) { navigate('/login'); return; }

    fetch(`${BASE_URL}/api/user/dashboard?email=${email}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          localStorage.removeItem('userEmail');
          navigate('/login');
        } else {
          setUserData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard Error:", err); 
        setLoading(false);
      });
  }, [navigate]);

  // --- PDF RECEIPT FUNCTION ---
  const handleDownloadReceipt = (txn) => {
    const doc = new jsPDF();
    doc.setFillColor(230, 240, 255);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFontSize(22); doc.setTextColor(0, 51, 102);
    doc.text("NSS IIT Roorkee", 105, 20, null, null, "center");
    doc.setFontSize(14); doc.setTextColor(100);
    doc.text("Official Donation Receipt", 105, 30, null, null, "center");
    doc.setLineWidth(0.5); doc.line(20, 45, 190, 45);

    const startY = 60; const lineHeight = 12;
    doc.setFontSize(12); doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Receipt No:", 20, startY);
    doc.text("Date:", 20, startY + lineHeight);
    doc.text("Donor Name:", 20, startY + lineHeight * 2);
    doc.setFont("helvetica", "normal");
    doc.text(txn.transactionId, 70, startY);
    doc.text(new Date(txn.date).toLocaleDateString(), 70, startY + lineHeight);
    doc.text(userData.name, 70, startY + lineHeight * 2);
    doc.setFillColor(245, 255, 250); doc.rect(20, 115, 170, 25, 'FD');
    doc.setFontSize(16); doc.setTextColor(0, 100, 0);
    doc.text(`Amount Donated: Rs. ${txn.amount}/-`, 105, 130, null, null, "center");
    doc.setFontSize(10); doc.setTextColor(100);
    doc.text("Thank you for your generous contribution.", 105, 160, null, null, "center");
    doc.save(`NSS_Receipt_${txn.transactionId}.pdf`);
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader className="animate-spin"/></div>;
  if (!userData) return <div>Data not found</div>;

  const donations = userData.donations || [];
  const totalDonated = donations.reduce((sum, item) => sum + item.amount, 0);
  const currentLevel = Math.floor((userData.rating || 0) / 1000) + 1;
  const progressPercent = Math.min(((userData.rating % 1000) / 1000) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-12 max-w-6xl mx-auto px-6">
        
        {/* Profile & Donate Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 border-4 border-white shadow-sm">
                    {userData.name?.charAt(0)}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Hello, {userData.name}! 👋</h1>
                    <div className="flex gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Mail size={14}/> {userData.email || localStorage.getItem('userEmail')}</span>
                    </div>
                </div>
            </div>
            
            {/* 👇 BUTTON CHANGED: Now simply navigates to Donate Page */}
            <button 
                onClick={() => navigate('/donate')} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-1"
            >
                <Zap size={20} fill="currentColor" /> Donate Now
            </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-2 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-md border border-gray-100">
             <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-gray-500 text-xs font-bold uppercase">Impact Score</h2>
                    <div className="text-4xl font-extrabold text-gray-800 mt-2">{userData.rating || 0} XP</div>
                </div>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-white border">Level {currentLevel} Hero</span>
             </div>
             <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${progressPercent}%` }}></div>
             </div>
          </div>
          <div className="grid grid-rows-2 gap-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-full"><Heart /></div>
                <div><p className="text-gray-500 text-sm">Total Donated</p><p className="text-2xl font-bold">₹{totalDonated}</p></div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full"><TrendingUp /></div>
                <div><p className="text-gray-500 text-sm">Donations</p><p className="text-2xl font-bold">{donations.length}</p></div>
             </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="p-6 border-b font-bold text-gray-800">Donation History</h3>
            {donations.length === 0 ? (
                <div className="p-10 text-center text-gray-500">No donations yet. Click "Donate Now" to start!</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="p-5 pl-8">Date</th>
                                <th className="p-5">Cause</th>
                                <th className="p-5">Amount</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right pr-8">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y">
                            {donations.map((txn, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-5 pl-8">{new Date(txn.date).toLocaleDateString()}</td> 
                                    <td className="p-5">{txn.cause}</td>
                                    <td className="p-5 font-bold">₹{txn.amount}</td>
                                    <td className="p-5"><span className="text-green-600 font-bold">{txn.status}</span></td>
                                    <td className="p-5 text-right pr-8">
                                        <button 
                                            type="button" 
                                            onClick={() => handleDownloadReceipt(txn)} 
                                            className="text-blue-600 hover:text-blue-800 font-medium border px-3 py-1 rounded hover:bg-blue-50 transition"
                                        >
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { TrendingUp, Heart, Loader, Mail, Zap } from 'lucide-react';
import { jsPDF } from 'jspdf';
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

const handleDownloadReceipt = (txn, e) => {
    if (e) e.preventDefault();

    try {
        // 1. Safety Check
        if (!userData || !txn) {
            alert("Receipt generation failed: Missing Data");
            return;
        }

        const doc = new jsPDF();
        
        // --- VARIABLES ---
        const primaryColor = [0, 51, 102];   // Deep Blue (NSS Theme)
        const lightGray = [240, 240, 240];
        
        // Date Formatting
        let dateStr;
        try { 
            dateStr = new Date(txn.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); 
        } catch { 
            dateStr = "N/A"; 
        }

        // Safe Transaction ID
        const txnId = txn.transactionId || txn.txnId || txn.id || "N/A";

        // 1. HEADER SECTION (Blue Background)
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 45, 'F'); // Full width header

        // Organization Name & Logo Area
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text("NSS IIT ROORKEE", 20, 20); 
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("National Service Scheme, IIT Roorkee Campus", 20, 28);
        doc.text("Uttarakhand, India - 247667", 20, 33);
        doc.text("Email: nss@iitr.ac.in | Web: nss.iitr.ac.in", 20, 38);

        // "RECEIPT" text on right
        doc.setFontSize(30);
        doc.setTextColor(255, 255, 255); // Solid White (Transparent hataya taaki clear dikhe)
        doc.text("RECEIPT", 140, 32);

        // 2. RECEIPT INFO STRIP
        doc.setFillColor(...lightGray);
        doc.rect(0, 45, 210, 15, 'F');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        // Safe substring check
        const shortTxnId = txnId.length > 12 ? txnId.substring(0, 12).toUpperCase() : txnId.toUpperCase();
        doc.text(`Receipt No: #${shortTxnId}`, 20, 55);
        doc.text(`Date: ${dateStr}`, 150, 55);

        // 3. DONOR DETAILS (Left Side)
        const startY = 80;
        doc.setFontSize(12);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text("DONOR DETAILS", 20, startY);
        doc.setLineWidth(0.5);
        doc.line(20, startY + 2, 80, startY + 2); // Underline

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${userData.name || userData.fullName || "Donor"}`, 20, startY + 10);
        doc.text(`Email: ${userData.email || "N/A"}`, 20, startY + 16);
        doc.text(`Mobile: ${userData.mobile || userData.phone || "N/A"}`, 20, startY + 22);
        doc.text(`PAN: XXXXX0000X`, 20, startY + 28); 

        // 4. TRANSACTION SUMMARY (Right Side Box)
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(120, 75, 70, 40, 2, 2, 'FD');

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Total Donation Amount", 130, 85);
        
        doc.setFontSize(22);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text(`Rs. ${txn.amount}/-`, 130, 98);

        doc.setFontSize(9);
        doc.setTextColor(0, 150, 0); // Green
        doc.text("Successfully Received", 130, 108);

        // 5. DONATION TABLE
        const tableTop = 130;
        // Table Header
        doc.setFillColor(...primaryColor);
        doc.rect(20, tableTop, 170, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Sr.", 25, tableTop + 7);
        doc.text("Description / Cause", 45, tableTop + 7);
        doc.text("Mode", 130, tableTop + 7);
        doc.text("Amount (INR)", 165, tableTop + 7);

        // Table Row
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.rect(20, tableTop + 10, 170, 15); // Border
        
        doc.text("01", 25, tableTop + 20);
        doc.text(`Donation for ${txn.cause || "Social Welfare"}`, 45, tableTop + 20);
        doc.text(txn.method || "Online / UPI", 130, tableTop + 20);
        doc.text(`${txn.amount}.00`, 165, tableTop + 20, {align: "right"}); // Right align amount

        // Total Row
        doc.setFont("helvetica", "bold");
        doc.text("Grand Total:", 130, tableTop + 35);
        doc.text(`${txn.amount}.00`, 165, tableTop + 35, {align: "right"});

        // 6. FOOTER & SIGNATURE (Updated Fix)
        const footerY = 200;
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(20, footerY, 190, footerY);

        // 80G Statement
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "italic");
        doc.text("* Donations to NSS IIT Roorkee are eligible for tax exemption under Section 80G.", 20, footerY + 8);
        doc.text("* This is a computer-generated receipt and does not require a physical signature.", 20, footerY + 13);

        // --- SIGNATURE FIX ---
        // Yahan maine aapka diya hua Base64 code daal diya hai. External URL hata diya.
        const signatureBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUoAAACZCAMAAAB+KoMCAAAAqFBMVEX///8AAAD7/P3d5e/0+Pycoqn5+fnr6+vo6Ojw8PD19fUzMzPt7e3j4+PExMS/v7+1tbWvr6/Z2dnT09OkpKRVVVWLi4uUlJTLy8vf398UFBRKSkpgYGBaWlpBQUFwcHB9fX1CQkIwMDAfHx+goKBvb2+RkZGHh4d5eXklJSUpKSmqsLcxMTEYGBg6Ojrt8/q+xs6Sl519goe9xc1NUFTP1+Dg6PFscHU3fFQTAAALY0lEQVR4nO2d6WKiOhiG+ahFFlkF2RUFRJkROz0znfu/sxPAfYG2JNo6eX9MbRslfcy3JjgM7PX79fnlierdevnx+vsAH7N94P3987bu9Viqd6vXWz+9vK5OUYYv6x7LUH1UvfVLcIzy17p370l9V/XWvw5R/ljTFflpsesfe5SUZDfVLJnKuinJbqpsHKEMKcmuYte/S5TefzTidFbvPw+hfF3fex6PoPVfhPKFLkoM6v0Bxn+inhKD2KffDLVvPFq/Mj+ofWNR75mh8RuPei8MdZV4xD5RlJhEUWITRYlNFCU2UZTYRFFiE0WJTRQlNlGU2ERRYhNFiU0UJTZRlNhEUWITRYlNFCU2UZTYRFFiE0WJTRQlNlGU2HQvlJw46Pf5Uv2ByN1hAvh1B5Ts0BxNrNn+xoLcmsw1+baTIKAboxyaIWIXByNbVwx+IAhCXzZU004lgKlp3G4iBHRDlANlMYOfwXw4EM+vKApK5nu+LtxmLiR0M5RGlsPMHjaiMjKI9W8bBG+EUvVhafPvGKiBpxKfDRndAiWrLCF03hmmORMW3zOi3wClEUDgfGC8WwQDYpMhKOIoORvGyvYbwVBUTXVaEh82nX1HlqRRGgXo1QPesf19KtmS+GTjbxh8CKNUwS+XoKgFS5AmuuHKpVw1jcFSrj+NDTNycyIlsih1sNG/8hxgoh5bNadYEIhXnyjA94vjRFHaJRB+AZZ+6bdOEV+3cmX17ZJ1kihNUMpEcexcuQDnS/2r87JMQrMiJoIo1ZJkCub1lxfn17N2BUjMiaTIoTSQdfMw/WzHh8sveoUjpQ2R6/YihlIcR4w7a4gsbcombSO4WTvtG4oYylEuCpLf4aXVvC3w8F+rXCeFkochY0ldimkRvcKpOEfTbTvR60Dmpl8qypNCmYUogHdr5aKi6AjmIJMAJD8Iyg785Ot13QmhFEER41Gnl0hgkR0ta0eKFHdQTnZg2N7XMu5ShFCqgFB06pUNAeYsXE2WxBS+VPhmiKGcpKzUaVFy04k/GhyiFE4S1Hm3twq/CKG0dAOae5Rscx9NhX6eqHAQV+z4GB2Xf7F6iAxKoXC0ZXN4daCRZTxnQM2C/Q/EcXIyJAmYLyUyKOXcnYTNQxS4Wn8joTeCB8fT9j8ZnvlNI/5aDWIyKI0lX7R0HJ3rIQUpzBhd0uFgZhP/dIzQ+GbcXoRQxn2vxZM1ouTRLycL/+DdGKzOkh/+n0DpLmWvpT4+N9gDjUK05oL4YMQF16uMLxX4gn5eJN1GZFDys+HMZATZdQ1Vt0dZhJTNE00xXJcXqus1orRMlJbmh9lUGJ0NShYXnqlIkHab+6dFBiXrq4E/KeotsaVUjAsp97ZbZFK4sNXBsME8ZZAHs1V+EFW4C0XopeawBrZ1r20hQnllipClpmoIR6/NDWRH1ZPIikukE/0MD1dbsRYzGcBB+GbMTY+J3+MV4Ny+FdAaVztREUJpe2beEBQ4Tk4g/AnLyK2+V4Iq/XZWdZgOMlQ2WodPCDZJZb5fcvZ5Wul6ETfuVvl3ECGUBrhxc41sAC8MR0vI0EIUZlWbV1xtVmKuj4+7Qv3NUhvul6pQnL9+ELPp9G7lJCGU3MxMm4sRo6ajwZRlgjqBjMBclBbOxyuAI0do5vXXaLaL43p89pIqqDbcr/lGql+ZFAq4TQO2Pg25t0l9gMOAxKli0bB0pEeD/TqzMmCXYYkHrlTeeEcvnW/Wstp4aUIihbIPWti4LLcoVShgXBllBoI+Kx8sUJQ/qgnduCI0mO7bG3NkyHpJk0OmPq9+pEGwQb3zA27g366tSWxvJyqcoxh8qg3KoQfLehyHVuKoQF8RyZPUR5OqLwvYFY8yeo4KKMK400EEVUwSfajOgpRudINcRo5idTOLJ4ay7yXJhd2ZnSqUQgIQOHEV6zXkEKwp4xaz8KCrKzuJpNcVpLl3oJwfMjqgAsj1AP24Qqlsf42YbmLPLNLAu5mtk9sH12F4VPqdCLlFUZfKP9+sy5OgEFiYKhCOqpSSE3jDTMeeN14Y1VtiwGSHOAFZA7QoeYihWKRV2WNtrFscj0dF9SehNEKD09YcORE8nZHmxvj6QckhRKgaCtxtzihAISI8YM9Bz2AyqdJ4K1GMTedDnKXKNvtWQFdgBI4DhQolVY6Rt37SWUry5vBWAuN9IiCb88wkmiiRPDM0ncn+tR0YpayHFqVL5Lyq3T6Cnw5iW4zLJalnc9tUtm+D6XMMa0nIwuvvVbBV0BF7CDkuQgTLg5veUnN5Q7WgXKL6pkb164LI0NDVVkEUd9wDbRZJlAN/6SxgflbfoVIHWTZk9RrjqqijgQ8rT9Ws6LxIyqJyJ8fYokwgkuMEhadgG9ZE0+RhCp6HeNXuua/aiYqcZqA5ejqDOEhkNA0xJ9l4J3ooUAjB1OC0LBEsgGVme9vEJpzpegCQw7UVbCVl9lm5V4QjAMTjLJbonjy1nOFxuBZ1tF5XVuJsXfZi2fEvahLhU78mSPMUxurhJTizPLaqelv75a3SFhcKe8WTcTNtABF6MFiGWnRSB23H+KMyyrRNZ5R/bPofEumz6PwoB5TdLRfOSQDS4mpViq6aeavAbNhT42IzqLtAw8APRxcDmVx6waC1UxlYbSM6iPzNJn01LXIUTfLAdgYcx1VXYxk9l3nVTqeeZ7XcKsrl1j6hvDLG9piysdSWjhfRR2b+Qd3sxry+li1LQ44L37L8aX3jbZFp74ipIbRGi3HFuu1IJtu24dRJt73zVnB0e1TtTthBYbw3y1NbT2kO67oqarHfYVP51Vl3+5SCxH9/vtw6Up9Vf4PitQxrD0wddDeUtoWx9LDqHTP32Fly4snnH0QX9yhx6X4oQ4yX3ZxPEqYOMzAUDXmPg/9dsZiYilxdLG49k91Fd0M5x1h4GNviPCjGsbeS/CBLNKe8dc1wtGRhodqqWAxF5mJKik13QxlhXCH61nDT0FQd+cxzcIY6X0ERES3B74cywLhdvdt8XDQsO2M+g+gRww5X2PhebLF9W6LGF83iAmxyfbZ7oRQbdys+JtbfEozmTePSSNTBJ7Yw74VSwJjicbujXoumVSkUCcMMAmJn2O+F0sF4C6O4o5M2bT/wdW/dxmgPR7oTSgFnj2Z/s1TQlO3IG0NIWk7Jf1Z3QmniNDNxm+RwflM/w93eUpGROcJxLwPHec3dquznTba79ynhDOPVd3qED13c+Uq3ca1rO5QGEXf5CCi5LZlhYzmj7yNdlBNILx8BJTvd5EDN9wIeoBRILMtHQMlEm1PpgdQ0SjvIvwoCB9YfAmWy6X1Kjd2mw1R29IHG83v1ECg3J2DkZrN1D24F1AgccHsIlGxdx2jN+SJ/kJqrBA64PQRKJqgsu2UfXJzuayE1pqvysqqjHpc+bONIBzfyagX+XZ7HQClIKB1atNzrW585qjUicA7rMVAyKuij9soadj24n42Nzc/pQVCi/FtqPy6QbLfTeBINjUdB+S6x+aa1NyFxzvKfQom85eYOABIdy38LJfKpk6E7h0u3P3fWP4aS4QMAIBBzmH8PJSovh4Tucv73UBITRYlNFCU2UZTYRFFiE0WJTRQlNlGU2ERRYhNFiU0UJTZRlNhEUWITRYlNFCU2UZTYRFFiE0WJTRQlNlGU2ERRYhNC+YeixCL2D/Nf796TeAz1/mOeKUos6v1i/q7vPYnH0HrB/KRxB4fYJ4kB6ixxqPcDGPj9du9pPILeQoQSflBv2VloUZYof75RE++o3tOsQgl/32jk6ST27S/UKOGVsuwi9u0VtigRS2rjn1avJrlBCcHTmi7MT4ldPwVwiBJWzwgmpflBsb310/MKjlECTH/9eVr3qD6g9dOf5/0HPO5RIv1+/fVM9W79evUP6f0PFeq5zjGHW+8AAAAASUVORK5CYII=";
        
        // Add Signature Image
        doc.addImage(signatureBase64, "PNG", 150, footerY + 15, 40, 15);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("Authorized Signatory", 150, footerY + 35);
        doc.text("General Secretary, NSS", 150, footerY + 40);

        // 7. BORDER AROUND PAGE
        doc.setLineWidth(1);
        doc.setDrawColor(...primaryColor);
        doc.rect(5, 5, 200, 287); // A4 Border

        // Save
        doc.save(`NSS_Receipt_${txnId}.pdf`);

    } catch (error) {
        console.error("PDF Error:", error);
        alert("Could not generate receipt. Please try again.");
    }
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
                    <h1 className="text-2xl font-bold text-gray-800">Hello, {userData.name}! </h1>
                    <div className="flex gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Mail size={14}/> {userData.email || localStorage.getItem('userEmail')}</span>
                    </div>
                </div>
            </div>
            
            {/*  BUTTON CHANGED */}
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
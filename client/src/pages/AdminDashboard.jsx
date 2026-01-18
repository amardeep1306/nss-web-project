import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { 
  Download, Users, DollarSign, Search, Calendar, 
  TrendingUp, Activity, CheckCircle, AlertCircle, Filter,
  HandHelping, Briefcase, Phone, Mail, Clock
} from 'lucide-react';
import { BASE_URL } from '../helper';
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users'); 
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching all 4 data points in parallel
        const [resUsers, resDonations, resVol, resPart] = await Promise.all([
          fetch(`${BASE_URL}/api/admin/users`),
          fetch(`${BASE_URL}/api/admin/donations`),
          fetch(`${BASE_URL}/api/admin/volunteers`),
          fetch(`${BASE_URL}/api/admin/partners`)
        ]);

        setUsers(await resUsers.json());
        setDonations(await resDonations.json());
        setVolunteers(await resVol.json());
        setPartners(await resPart.json());
      } catch (err) {
        console.error("Error fetching admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. STATISTICS CALCULATION ---
  const totalRaised = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const successDonations = donations.filter(d => d.status === 'Success').length;
  const successRate = donations.length > 0 ? ((successDonations / donations.length) * 100).toFixed(0) : 0;
  
  // Volunteer stats (Example: assuming we track active volunteers)
  const totalVolunteers = volunteers.length;
  
  // --- 3. FILTER LOGIC ---
  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    
    if (activeTab === 'users') {
      return users.filter(u => u.name.toLowerCase().includes(term) || u.email.includes(term));
    }
    if (activeTab === 'donations') {
      return donations.filter(d => {
        const matchesSearch = d.userName.toLowerCase().includes(term) || d.cause.toLowerCase().includes(term);
        const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    }
    if (activeTab === 'volunteers') {
      return volunteers.filter(v => v.name.toLowerCase().includes(term) || v.department.toLowerCase().includes(term));
    }
    if (activeTab === 'partners') {
      return partners.filter(p => {
        const orgName = p.organizationName || p.orgName || ""; 
        return orgName.toLowerCase().includes(term) || (p.email && p.email.toLowerCase().includes(term));
      });
    }
    return [];
  };

  const currentData = filteredData();

  // --- 4. EXPORT CSV ---
  const downloadCSV = () => {
    if (!currentData.length) return alert("No data to export!");
    const headers = Object.keys(currentData[0]).join(","); 
    const rows = currentData.map(obj => Object.values(obj).map(v => `"${v}"`).join(",")); 
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `NSS_${activeTab}_Report.csv`;
    link.click();
  };

  // Helper for formatting dates cleanly
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Activity size={16} className="text-green-500" /> 
              Real-time overview of NSS operations
            </p>
          </div>
          <button 
            onClick={downloadCSV}
            className="group bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
            <Download size={18} className="group-hover:translate-y-0.5 transition" /> Export {activeTab}
          </button>
        </div>

        {/* --- STATS CARDS (High Fidelity) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Funds */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Funds</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{totalRaised.toLocaleString()}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-xl text-green-600"><DollarSign size={24} /></div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600 font-medium bg-green-50 w-fit px-2 py-1 rounded-lg">
              <TrendingUp size={14} className="mr-1" /> Verified & Safe
            </div>
          </div>

          {/* Card 2: Volunteers */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Volunteers</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalVolunteers}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><HandHelping size={24} /></div>
            </div>
            <p className="mt-4 text-xs text-gray-400">Total registered applications</p>
          </div>

           {/* Card 3: Partners */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Partners</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{partners.length}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><Briefcase size={24} /></div>
            </div>
            <p className="mt-4 text-xs text-gray-400">Collaborating Organizations</p>
          </div>

          {/* Card 4: Success Rate */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Txn Success Rate</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{successRate}%</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><CheckCircle size={24} /></div>
            </div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${successRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
          
          {/* TABS & FILTERS */}
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
            
            {/* Tab Buttons */}
            <div className="flex bg-gray-200/60 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
              {['users', 'donations', 'volunteers', 'partners'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search records..."
                  className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {activeTab === 'donations' && (
                <div className="relative">
                    <Filter className="absolute left-3 top-2.5 text-gray-500" size={16} />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-blue-500 appearance-none font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                    >
                        <option value="All">All Status</option>
                        <option value="Success">Success</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
              )}
            </div>
          </div>

          {/* TABLE CONTENT */}
          <div className="overflow-x-auto">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 animate-pulse">
                    <Activity size={40} className="mb-4 text-blue-200" />
                    <p>Loading Dashboard Data...</p>
                </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold tracking-wider border-b border-gray-100">
                    {activeTab === 'users' && <><th className="p-5 pl-8">User Profile</th><th className="p-5">Email</th><th className="p-5">Role</th><th className="p-5">Joined Date</th><th className="p-5 text-right pr-8">Status</th></>}
                    {activeTab === 'donations' && <><th className="p-5 pl-8">Date</th><th className="p-5">Donor</th><th className="p-5">Amount</th><th className="p-5">Cause</th><th className="p-5 text-right pr-8">Status</th></>}
                    {activeTab === 'volunteers' && <><th className="p-5 pl-8">Applicant</th><th className="p-5">Contact Info</th><th className="p-5">Department</th><th className="p-5">Reason</th></>}
                    {activeTab === 'partners' && (
  <>
    <th className="p-5 pl-8">Organization Details</th>
    <th className="p-5">Contact Info</th>
    <th className="p-5">Proposal / Message</th> 
    <th className="p-5">Applied Date</th>       
  </>
)}
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
                  
                  {/* --- USERS --- */}
                  {activeTab === 'users' && currentData.map(u => (
                    <tr key={u._id} className="hover:bg-blue-50/30 transition duration-150">
                      <td className="p-5 pl-8 font-semibold text-gray-900 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          {u.name}
                      </td>
                      <td className="p-5 text-gray-500">{u.email}</td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                            {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-5 text-gray-500 flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400"/> {formatDate(u.joinedAt)}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* --- DONATIONS --- */}
                  {activeTab === 'donations' && currentData.map(d => (
                    <tr key={d._id} className="hover:bg-blue-50/30 transition duration-150">
                      <td className="p-5 pl-8 text-gray-500 text-xs font-mono">
                         <div className="flex flex-col">
                            <span className="font-bold text-gray-700 text-sm">{formatDate(d.date)}</span>
                            <span>{new Date(d.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         </div>
                      </td>
                      <td className="p-5 font-medium text-gray-900">{d.userName}</td>
                      <td className="p-5 font-bold text-gray-800">₹{d.amount.toLocaleString()}</td>
                      <td className="p-5"><span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100">{d.cause}</span></td>
                      <td className="p-5 pr-8 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${d.status === 'Success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                           {d.status === 'Success' ? <CheckCircle size={12}/> : <Clock size={12}/>} {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* --- 3. VOLUNTEERS TAB (Matched with your Volunteer.jsx) --- */}
{activeTab === 'volunteers' && currentData.map(v => (
  <tr key={v._id} className="hover:bg-blue-50/30 transition duration-150">
    
    {/* Column 1: Profile & Type */}
    <td className="p-5 pl-8">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
          {v.name ? v.name.charAt(0).toUpperCase() : 'V'}
        </div>
        
        {/* Name, City & Type */}
        <div>
          <p className="font-bold text-gray-900">{v.name || "Unknown"}</p>
          <div className="flex items-center gap-2">
             <p className="text-xs text-gray-500">📍 {v.city || "N/A"}</p>
             {/* Volunteer Type Badge */}
             <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 font-semibold">
               {v.type || "Volunteer"}
             </span>
          </div>
        </div>
      </div>
    </td>

    {/* Column 2: Contact Info */}
    <td className="p-5">
      <div className="flex flex-col text-xs text-gray-500 gap-1.5">
        <span className="flex items-center gap-1.5 font-medium text-gray-700">
            <Mail size={12} className="text-gray-400"/> {v.email || "N/A"}
        </span>
        <span className="flex items-center gap-1.5">
            <Phone size={12} className="text-gray-400"/> {v.mobile || "N/A"}
        </span>
      </div>
    </td>

    {/* Column 3: Skills (Array Handling) */}
    <td className="p-5">
      <div className="flex flex-wrap gap-1 max-w-xs">
        {/* Check */}
        {Array.isArray(v.skills) && v.skills.length > 0 ? (
          v.skills.map((skill, index) => (
            <span key={index} className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-medium border border-orange-100">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-xs italic">No specific skills selected</span>
        )}
      </div>
    </td>

    {/* Column 4: Experience & ID */}
    <td className="p-5">
      <div className="flex flex-col gap-1">
        {/* Experience Badge */}
        <span className={`text-[10px] px-2 py-0.5 rounded-full w-fit font-bold ${v.experience === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          Exp: {v.experience || 'No'}
        </span>
        
        {/* ID Proof (Optional) */}
        {v.idProof && (
           <span className="text-[10px] text-gray-400 font-mono">
             ID: {v.idProof}
           </span>
        )}
      </div>
    </td>
  </tr>
))}

                  {/* --- 4. PARTNERS TAB (Updated for your Form) --- */}
{activeTab === 'partners' && currentData.map(p => (
  <tr key={p._id} className="hover:bg-blue-50/30 transition duration-150">
    
    {/* Column 1: Organization Details */}
    <td className="p-5 pl-8">
      <div className="flex flex-col">
        {/* Org Name */}
        <span className="font-bold text-purple-700 text-base">
          {p.organizationName || p.orgName || "Unnamed Org"}
        </span>
        
        {/* Org Type & City Badge */}
        <span className="text-xs text-gray-500 flex gap-2 mt-1">
          <span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded border border-purple-100 font-medium">
             {p.orgType || "Partner"}  {/* Dropdown Value */}
          </span>
          <span className="flex items-center gap-0.5">
              {p.city || "N/A"}
          </span>
        </span>
      </div>
    </td>

    {/* Column 2: Contact Person */}
    <td className="p-5">
      <div className="flex flex-col text-sm">
        <span className="font-semibold text-gray-800">{p.contactPerson || "N/A"}</span>
        <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <Phone size={12} /> {p.mobile || p.phone || "N/A"}
        </span>
        {/* Agar Email added later */}
        {p.email && (
           <span className="text-xs text-blue-500 flex items-center gap-1 mt-0.5">
             <Mail size={12} /> {p.email}
           </span>
        )}
      </div>
    </td>

    {/* 3. Goal & Message (Truncated) */}
    <td className="p-5 max-w-xs"> 
      <div className="flex flex-col gap-1">
         {p.collaborationGoal && (
           <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 w-fit">
              {p.collaborationGoal}
           </span>
         )}
         
         {/* truncate the message */}
         <p className="text-gray-600 text-xs italic truncate w-48" title={p.message}>
           "{p.message || "No details provided"}"
         </p>
      </div>
    </td>
    
    {/* 4. Date */}
    <td className="p-5 text-gray-400 text-xs font-mono">
       {p.createdAt 
         ? new Date(p.createdAt).toLocaleDateString('en-IN') 
         : <span className="text-red-300">Date Missing</span>
       }
    </td>
  </tr>
))}
                  {currentData.length === 0 && (
                      <tr><td colSpan="5" className="text-center py-10 text-gray-400">No records found matching your criteria.</td></tr>
                  )}

                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
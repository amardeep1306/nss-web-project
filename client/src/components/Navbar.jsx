import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Heart, User, LogOut, LayoutDashboard, ShieldCheck, UserPlus, ChevronDown, HandHelping, Briefcase } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardPath, setDashboardPath] = useState('/dashboard'); 
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(!!email);
    setDashboardPath(role === 'admin' ? '/admin' : '/dashboard');
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setIsOpen(false); 
    navigate('/login');
  };

  // Styles
  const getLinkClass = ({ isActive }) => 
    isActive 
      ? "text-blue-700 font-bold border-b-2 border-blue-700 pb-1 scale-105 transition" 
      : "text-gray-600 hover:text-blue-700 font-medium transition hover:scale-105";

  const getMobileLinkClass = ({ isActive }) => 
    isActive 
      ? "block text-blue-700 font-bold bg-blue-50 p-3 rounded-lg flex items-center gap-2" 
      : "block text-gray-700 font-medium p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2";

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO (Home Link is here) */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-900 text-white p-2 rounded-lg group-hover:bg-blue-800 transition"><Heart size={24} fill="white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900 tracking-tighter group-hover:text-blue-800">NSS<span className="text-blue-500">Connect</span></h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold group-hover:text-blue-400">IIT Roorkee</p>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* 1. Direct Links (Home Hataya, Logo hi Home hai) */}
            <NavLink to="/about" className={getLinkClass}>About</NavLink>
            <NavLink to="/donate" className={getLinkClass}>Causes</NavLink>

            {/* 2. DROPDOWN MENU (Volunteer + Partner) - SAVES SPACE */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-600 font-medium hover:text-blue-700 transition">
                Get Involved <ChevronDown size={16} />
              </button>
              
              {/* Dropdown Content */}
              <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden hidden group-hover:block transform origin-top transition-all pt-2">
                 <div className="flex flex-col p-2 gap-1">
                    <NavLink to="/volunteer" className="flex items-center gap-2 p-3 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-700 text-sm font-bold">
                       <HandHelping size={18} /> As Volunteer
                    </NavLink>
                    <NavLink to="/partner" className="flex items-center gap-2 p-3 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-700 text-sm font-bold">
                       <Briefcase size={18} /> As Partner
                    </NavLink>
                 </div>
              </div>
            </div>

            {/* 3. Auth Buttons */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              {isLoggedIn ? (
                <>
                  <Link to={dashboardPath} className="flex items-center gap-2 text-gray-700 font-bold hover:text-blue-700 transition">
                    {dashboardPath === '/admin' ? <ShieldCheck size={18}/> : <LayoutDashboard size={18} />} 
                    {dashboardPath === '/admin' ? 'Admin' : 'Dash'}
                  </Link>
                  <button onClick={handleLogout} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition" title="Logout">
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={({isActive}) => isActive ? "text-blue-900 font-bold" : "text-gray-700 font-bold hover:text-blue-900 transition"}>
                    Login
                  </NavLink>
                  <Link to="/signup" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-full shadow-md hover:bg-blue-700 transition flex items-center gap-2">
                    <UserPlus size={18} /> Join
                  </Link>
                </>
              )}

              <Link to="/donate" className="px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold rounded-full shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 transition flex items-center gap-2">
                Donate <Heart size={16} fill="white" />
              </Link>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-blue-900 transition p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (No Dropdown needed here, list everything) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-2 shadow-xl absolute w-full left-0 animate-fade-in-down h-screen overflow-y-auto pb-32">
          <NavLink to="/" className={getMobileLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={getMobileLinkClass} onClick={() => setIsOpen(false)}>About Us</NavLink>
          <NavLink to="/donate" className={getMobileLinkClass} onClick={() => setIsOpen(false)}>Causes</NavLink>
          
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Get Involved</p>
            <NavLink to="/volunteer" className="flex items-center gap-2 text-gray-700 font-medium p-2 hover:bg-white rounded-lg" onClick={() => setIsOpen(false)}>
               <HandHelping size={18}/> As Volunteer
            </NavLink>
            <NavLink to="/partner" className="flex items-center gap-2 text-gray-700 font-medium p-2 hover:bg-white rounded-lg" onClick={() => setIsOpen(false)}>
               <Briefcase size={18}/> As Partner
            </NavLink>
          </div>

          <div className="border-t border-gray-100 my-2 pt-4 space-y-3">
            {isLoggedIn ? (
              <>
                <NavLink to={dashboardPath} className={getMobileLinkClass} onClick={() => setIsOpen(false)}>
                  {dashboardPath === '/admin' ? <ShieldCheck size={18}/> : <LayoutDashboard size={18} />}
                  {dashboardPath === '/admin' ? 'Admin Panel' : 'My Dashboard'}
                </NavLink>
                <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 text-red-600 font-bold p-3 hover:bg-red-50 rounded-lg">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <NavLink to="/login" className="flex-1 flex items-center justify-center gap-2 py-3 border border-blue-900 text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition" onClick={() => setIsOpen(false)}>
                  <User size={20} /> Login
                </NavLink>
                <Link to="/signup" className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition" onClick={() => setIsOpen(false)}>
                  <UserPlus size={20} /> Join
                </Link>
              </div>
            )}
            <Link to="/donate" className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-bold hover:shadow-lg transition shadow-md" onClick={() => setIsOpen(false)}>
              Donate Now <Heart size={18} fill="white" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
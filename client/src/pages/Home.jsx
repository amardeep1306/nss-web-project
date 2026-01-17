import { BASE_URL } from '../helper';
import React, { useState, useEffect } from 'react'; // 👈 useState, useEffect import kiya
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Activity, Users, Globe, Heart, 
  CheckCircle, Play, ChevronRight, Star 
} from 'lucide-react';

const Home = () => {
  // ---------------------------------------------------------
  // 1. STATE MANAGEMENT (Data store karne ke liye)
  // ---------------------------------------------------------
  const [stats, setStats] = useState({ raised: 0, volunteers: 0, partners: 0 });
  const [causeProgress, setCauseProgress] = useState({});

  // ---------------------------------------------------------
  // 2. FETCH DATA FROM BACKEND
  // ---------------------------------------------------------
  useEffect(() => {
    // A. General Stats (Funds, Volunteers, Partners)
    fetch(`${BASE_URL}/api/home-stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Stats Error:", err));

    // B. Cause-wise Progress (Kis cause me kitna paisa aaya)
    fetch(`${BASE_URL}/api/causes-progress`) // Ye API humne pehle banayi thi
      .then(res => res.json())
      .then(data => setCauseProgress(data))
      .catch(err => console.error("Progress Error:", err));
  }, []);

  // ---------------------------------------------------------
  // 3. CAUSE DATA CONFIGURATION (Database mapping ke sath)
  // ---------------------------------------------------------
  const causesList = [
    {
      title: "Educate a Child",
      dbName: "Education Support", // 👈 YE NAAM DATABASE SE MATCH HONA CHAHIYE
      desc: "Provide books, uniforms, and tuition fees for bright students from slums.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      goal: 100000, // ₹1 Lakh
      tag: "Education",
      color: "blue"
    },
    {
      title: "Emergency Medical Aid",
      dbName: "Medical Help",
      desc: "Help pay for critical surgeries and medicines for families who can't afford them.",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
      goal: 50000, // ₹50k
      tag: "Medical",
      color: "red"
    },
    {
      title: "Winter Relief Drive",
      dbName: "Disaster Relief", // Ya jo bhi aapne DB me rakha ho (eg. "Religious Causes" or "Relief")
      desc: "Distributing blankets and warm clothes to the homeless in Roorkee winters.",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
      goal: 20000, // ₹20k
      tag: "Relief",
      color: "orange"
    }
  ];

  return (
    <div className="font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      {/* --- SECTION 1: HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center pt-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 rounded-full text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              NSS IIT ROORKEE INITIATIVE
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Transforming Lives,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                One Step at a Time.
              </span>
            </h1>
            
            <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
              Join the largest student-run organization at IIT Roorkee. 
              We don't just donate; we build futures through education, health, and sustainability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/donate" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Start Donating <Heart size={20} fill="currentColor" />
              </Link>
              <Link to="/about" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full transition flex items-center justify-center gap-2">
                Watch Our Story <Play size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 text-white/50 text-sm flex flex-col items-center">
            <p>Scroll Down</p>
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent mt-2"></div>
        </motion.div>
      </section>

      {/* --- SECTION 2: STATS BANNER (REAL DATA) --- */}
      <section className="bg-blue-950 py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-800/50">
                <StatItem number="12,500+" label="Students Taught" />
                {/* 👇 UPDATED: Yahan ab Database wala amount dikhega */}
                <StatItem number={`₹${stats.raised.toLocaleString()}`} label="Funds Raised" />
                <StatItem number="500+" label="Blood Units Donated" />
                <StatItem number="5" label="Villages Adopted" />
            </div>
        </div>
      </section>

      {/* --- SECTION 3: MISSION & VISION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="md:w-1/2 relative">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full -z-10"></div>
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full -z-10"></div>
                    <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80" alt="Teaching Kids" className="rounded-3xl shadow-2xl w-full object-cover hover:scale-[1.02] transition duration-500"/>
                    <div className="absolute bottom-8 left-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden md:block">
                        <p className="font-bold text-gray-800 text-lg">"Education is the most powerful weapon."</p>
                        <p className="text-gray-500 text-sm mt-2">- Nelson Mandela</p>
                    </div>
                </div>
                <div className="md:w-1/2 space-y-6">
                    <h4 className="text-blue-600 font-bold uppercase tracking-widest">Who We Are</h4>
                    <h2 className="text-4xl font-bold text-gray-900 leading-tight">We Are The <span className="text-blue-600">Hope</span> For The Hopeless.</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        NSS IIT Roorkee isn't just a club; it's a movement. We focus on sustainable development in rural areas surrounding our campus.
                    </p>
                    <ul className="space-y-4 pt-4">
                        <ListItem text="100% Transparent Donation System" />
                        <ListItem text="Tax Benefits under Section 80G" />
                        <ListItem text="Direct Impact Tracking via Dashboard" />
                    </ul>
                    <Link to="/about" className="mt-8 inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition">Read More About Us</Link>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECTION 4: CAUSES (REAL DATA CALCULATION) --- */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
                <h4 className="text-blue-600 font-bold uppercase tracking-widest mb-2">Our Campaigns</h4>
                <h2 className="text-4xl font-bold text-gray-900">Urgent Causes Needing Help</h2>
            </div>
            <Link to="/donate" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition">
                View All Causes <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 👇 UPDATED: Ab hum Loop chala rahe hain taaki calculation real ho */}
            {causesList.map((cause, index) => {
                // Calculation Logic
                const raisedAmount = causeProgress[cause.dbName] || 0; // DB se paisa lo
                const percentage = Math.min((raisedAmount / cause.goal) * 100, 100).toFixed(0);

                return (
                    <CauseCard 
                        key={index}
                        title={cause.title}
                        desc={cause.desc}
                        image={cause.image}
                        // Real percentage pass kar rahe hain
                        raised={percentage} 
                        // Goal ko formatted string me dikha rahe hain
                        goal={`${(cause.goal / 1000)}K`} 
                        tag={cause.tag}
                        color={cause.color}
                        realRaisedAmount={raisedAmount} // Optional: Agar card me exact amount dikhana ho
                    />
                );
            })}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: GALLERY GLIMPSES --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Glimpses of Impact</h2>
            <p className="text-gray-500 mb-12 max-w-2xl mx-auto">Our volunteers working on ground zero. Real people, real stories, real change.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
                <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Gallery"/>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xl">Donation Drive</div>
                </div>
                <div className="rounded-2xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Gallery"/>
                </div>
                <div className="rounded-2xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Gallery"/>
                </div>
                <div className="col-span-2 rounded-2xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Gallery"/>
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xl">Teaching Session</div>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECTION 6: VOLUNTEER CTA (REAL STATS) --- */}
      <section className="relative py-32 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-blue-900/90"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
            
            <div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
                <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                        <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" />
                    </div>
                    {/* 👇 UPDATED: Real Volunteer Count */}
                    <span className="font-bold text-sm">4.8/5 Volunteer Rating • {stats.volunteers}+ Active Volunteers</span>
                </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Ready to Create Real Impact?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join our family across 15 states. You don't need money to help, just a willingness to serve.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-8">
                <div className="group">
                    <Link to="/volunteer" className="w-full md:w-auto px-10 py-5 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 text-lg">
                        Join as Volunteer <ArrowRight size={20} />
                    </Link>
                    <p className="text-blue-200 text-xs mt-3 font-medium opacity-80 group-hover:opacity-100 transition">⚡ Takes only 2 minutes</p>
                </div>

                <div className="group">
                    <Link to="/partner" className="w-full md:w-auto px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition flex items-center justify-center gap-3 text-lg">
                        Partner With Us <Users size={20} />
                    </Link>
                    {/* 👇 UPDATED: Real Partner Count */}
                    <p className="text-blue-200 text-xs mt-3 font-medium opacity-80 group-hover:opacity-100 transition">🏢 Trusted by {stats.partners}+ Organizations</p>
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* --- Helper Components --- */

const StatItem = ({ number, label }) => (
  <div className="flex flex-col items-center">
    <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{number}</h3>
    <p className="text-blue-200 uppercase tracking-widest text-sm font-medium">{label}</p>
  </div>
);

const ListItem = ({ text }) => (
  <div className="flex items-center gap-3">
    <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
    <span className="text-gray-700 font-medium">{text}</span>
  </div>
);

const CauseCard = ({ title, desc, image, raised, goal, tag, color }) => {
    const colors = {
        blue: "bg-blue-600 text-blue-600",
        red: "bg-red-500 text-red-500",
        orange: "bg-orange-500 text-orange-500"
    };
    
    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-gray-100 flex flex-col h-full">
            <div className="relative h-64 overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                <span className={`absolute top-4 right-4 bg-white/95 backdrop-blur text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide ${colors[color].split(" ")[1]}`}>
                    {tag}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">{desc}</p>
                
                <div className="mt-auto">
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                        {/* Dynamic Width based on Real Data */}
                        <div className={`h-3 rounded-full ${colors[color].split(" ")[0]}`} style={{ width: `${raised}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-semibold">Raised</p>
                            <p className={`text-lg font-bold ${colors[color].split(" ")[1]}`}>{raised}%</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase font-semibold">Goal</p>
                            <p className="text-lg font-bold text-gray-800">₹{goal}</p>
                        </div>
                    </div>
                    
                    <Link to="/donate" className="w-full py-4 rounded-xl border-2 border-gray-100 text-gray-700 font-bold hover:border-blue-600 hover:text-blue-600 flex items-center justify-center gap-2 transition group-hover:bg-blue-50">
                        Donate Now <Heart size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
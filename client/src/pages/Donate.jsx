import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DonationModal from '../components/DonationModal'; // 👈 1. Import kiya
import { 
  BookOpen, HeartPulse, Utensils, LifeBuoy, 
  Baby, UserPlus, Sprout, Home, HeartHandshake, ArrowRight 
} from 'lucide-react';

const Donate = () => {
  // 👈 2. State banaya (Modal kholne aur Cause select karne ke liye)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCause, setSelectedCause] = useState(null);

  // Helper function to open modal
  const openDonation = (cause) => {
    setSelectedCause(cause);
    setIsModalOpen(true);
  };

  const causes = [
    {
      id: 1,
      title: "Education Support",
      desc: "Sponsor tuition fees, books, and uniforms for underprivileged children.",
      icon: <BookOpen className="text-blue-600" size={28} />,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      color: "blue"
    },
    {
      id: 2,
      title: "Medical Help",
      desc: "Provide life-saving surgeries and medicines to poor patients.",
      icon: <HeartPulse className="text-red-500" size={28} />,
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
      color: "red"
    },
    {
      id: 3,
      title: "Feed the Hungry",
      desc: "Ensure no one sleeps hungry. Distribute ration kits and cooked meals.",
      icon: <Utensils className="text-orange-500" size={28} />,
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      color: "orange"
    },
    {
      id: 4,
      title: "Disaster Relief",
      desc: "Emergency aid for victims of floods, earthquakes, and natural calamities.",
      icon: <LifeBuoy className="text-yellow-600" size={28} />,
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
      color: "yellow"
    },
    {
      id: 5,
      title: "Child Welfare",
      desc: "Care for orphans and street children with shelter and love.",
      icon: <Baby className="text-pink-500" size={28} />,
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      color: "pink"
    },
    {
      id: 6,
      title: "Elder Care",
      desc: "Support abandoned seniors with medical care and a dignified life.",
      icon: <UserPlus className="text-purple-600" size={28} />,
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
      color: "purple"
    },
    {
      id: 7,
      title: "Environment",
      desc: "Plant trees, clean rivers, and promote sustainable living.",
      icon: <Sprout className="text-green-600" size={28} />,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      color: "green"
    },
    {
      id: 8,
      title: "Religious Causes",
      desc: "Contribute to temple renovation and spiritual community services.",
      icon: <Home className="text-amber-600" size={28} />,
      image: "https://live.staticflickr.com/544/32775287672_bdb09ecf77_b.jpg",
      color: "amber"
    },
    {
      id: 9,
      title: "Where Needed Most",
      desc: "Let us decide where your help is needed urgently right now.",
      icon: <HeartHandshake className="text-indigo-600" size={28} />,
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
      color: "indigo"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />

      {/* 👈 3. Modal Component ko yahan lagaya */}
      <DonationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedCause={selectedCause}
      />

      <div className="bg-blue-900 pt-32 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose a Cause</h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          Your small contribution can change someone's entire life. Select a cause close to your heart.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause) => (
            <div key={cause.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col hover:-translate-y-1">
              
              <div className="relative h-48 overflow-hidden">
                <img src={cause.image} alt={cause.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md backdrop-blur-sm">
                  {cause.icon}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                  {cause.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">
                  {cause.desc}
                </p>
                
                {/* 👈 4. Button par onClick lagaya */}
                <button 
                  onClick={() => openDonation(cause)} 
                  className={`w-full py-3 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition 
                  border-gray-100 text-gray-600 hover:border-${cause.color}-500 hover:bg-${cause.color}-50 hover:text-${cause.color}-600`}
                >
                  Donate Now <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Donate;
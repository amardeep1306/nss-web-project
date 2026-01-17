import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Target, Users, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="font-sans text-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20 text-center pt-32">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          We are the National Service Scheme (NSS) unit of IIT Roorkee. 
          Our mission is to serve society through education, health awareness, and sustainable development.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
        <Card icon={<Target size={40} />} title="Our Mission" desc="To bridge the gap between the privileged and underprivileged by providing resources and education." />
        <Card icon={<Users size={40} />} title="Our Community" desc="A family of 1000+ student volunteers from IIT Roorkee working tirelessly on weekends." />
        <Card icon={<Globe size={40} />} title="Our Impact" desc="Adopted 5 local villages, teaching 500+ kids, and conducting regular medical camps." />
      </div>

      {/* Story Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <img src="https://readindia.in/wp-content/uploads/2018/12/volunteer_hero_image_03.jpg" alt="Team" className="w-full md:w-1/2 rounded-2xl shadow-xl" />
            <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-4 text-blue-900">Why We Started?</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                    In 2006, a group of students realized that while we study in a premier institute, people just outside our campus gates struggle for basic needs. 
                </p>
                <p className="text-gray-600 leading-relaxed">
                    NSS IIT Roorkee was born out of the desire to give back. Today, we run schools, donation drives, and awareness campaigns. We believe that <strong>"Not Me, But You"</strong> is the way to live.
                </p>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Helper Card Component
const Card = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:-translate-y-2 transition duration-300">
    <div className="text-blue-600 flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-500">{desc}</p>
  </div>
);

export default About;
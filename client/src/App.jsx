import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Donate from './pages/Donate';
import Volunteer from './pages/Volunteer';
import Partner from './pages/Partner';
import AdminDashboard from './pages/AdminDashboard';
// Components
import Signup from './pages/Signup';
import PageWrapper from './components/PageWrapper';
import ScrollToTop from './components/ScrollToTop'; // <-- Ye Import karein (STEP 1)

// Routes Logic
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
      <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
      <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
      <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
      <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
      <Route path="/help" element={<PageWrapper><Help /></PageWrapper>} />
      <Route path="/donate" element={<PageWrapper><Donate /></PageWrapper>} />
      <Route path="/volunteer" element={<PageWrapper><Volunteer /></PageWrapper>} />
      <Route path="/partner" element={<PageWrapper><Partner /></PageWrapper>} />
      <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
      <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
      
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* <-- Ise yahan laga dein (AnimatedRoutes se pehle) (STEP 2) */}
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
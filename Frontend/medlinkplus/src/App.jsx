import React from 'react'
import Home from './Home/home';
import { Routes, Route } from 'react-router-dom';
import About from './AboutUs/About';
import Signup from './components/Signup';
import Contactus from './contactus/Contactus';
import FAQ from './faq/FAQ';
import Hospital from './HospitalList/Hospital';
import ConsultDoc from './Consultdr/ConsultDoc';
import Appointmentid from './appointment/Appointmentid';
import Profile from './Profile/Profile';
import UserAppoint from './Myappoint/UserAppoint';
import HealthAnalytics from './components/HealthAnalytics';

import TermsOfUse from './pages/Legal/TermsOfUse';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import CookiePolicy from './pages/Legal/CookiePolicy';

import { ToastContainer, toast } from "react-toastify";
import Login from './components/Login';
import Messages from './components/Messages';
import GeminiChatbot from './components/GeminiChatbot';
import { ChatbotProvider } from './components/ChatbotContext';
import UserDashboard from './components/UserDashboard';
import Support from './components/Support';
import { Link } from 'react-router-dom';

function App() {
  return (
    <ChatbotProvider>
      {/* Simple navigation bar for Support */}
      <nav className="w-full bg-gray-100 py-2 px-4 flex gap-4">
        <Link to="/" className="text-[#1c7856] font-bold">Home</Link>
        <Link to="/support" className="text-[#1c7856] font-bold">Support</Link>
      </nav>

      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path="/hospital" element={<Hospital />} />
        <Route path='/consultdoctor' element={<ConsultDoc />} />
        <Route path='/consultdoctor/:speciality' element={<ConsultDoc />} />
        <Route path='/appointments/:docId' element={<Appointmentid />} />
        <Route path='/myprofile' element={<Profile />} />
        <Route path='/userappoint' element={<UserAppoint/>}/>
        <Route path='/health-analytics' element={<HealthAnalytics />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/legal/terms-of-use' element={<TermsOfUse />} />
        <Route path='/legal/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/legal/cookie-policy' element={<CookiePolicy />} />
        <Route path='/dashboard' element={<UserDashboard />} />
        <Route path='/support' element={<Support />} />
      </Routes> 
      <GeminiChatbot />
    </ChatbotProvider>
  );
}

export default App
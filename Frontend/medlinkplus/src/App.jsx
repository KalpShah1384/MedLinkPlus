import React from 'react'
import Home from './Home/Home';
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
import ImageSymptomChecker from './components/ImageSymptomChecker';
import { ChatbotProvider } from './components/ChatbotContext';
import { CartProvider } from './context/CartContext';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Support from './components/Support';
import Medicines from './components/Medicines';
import MedicineDetails from './components/MedicineDetails';
import Cart from './components/Cart';
import { Link } from 'react-router-dom';

function App() {
  return (
    <ChatbotProvider>
      <CartProvider>
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
        <Route path='/medicines' element={<Medicines />} />
        <Route path="/medicines/:id" element={<MedicineDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/medicine-orders" element={<AdminDashboard />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />     
      </Routes>
      <ImageSymptomChecker />
      <GeminiChatbot />
      </CartProvider>
    </ChatbotProvider>
  );
}

export default App
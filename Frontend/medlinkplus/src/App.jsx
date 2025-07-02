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
import ThemeToggle from './components/ThemeToggle';
import TermsOfUse from './pages/Legal/TermsOfUse';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import CookiePolicy from './pages/Legal/CookiePolicy';

import { ToastContainer, toast } from "react-toastify";
import Login from './components/Login';



function App() {
  return (
    <>
      {/* <Home />
      <AboutUs/> */}
      <ThemeToggle />
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
        <Route path='/legal/terms-of-use' element={<TermsOfUse />} />
        <Route path='/legal/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/legal/cookie-policy' element={<CookiePolicy />} />
      </Routes> 
    </>
  );
}

export default App
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

import { ToastContainer, toast } from "react-toastify";



function App() {
  return (
    <>
      {/* <Home />
      <AboutUs/> */}
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
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
      </Routes> 
    </>
  );
}

export default App
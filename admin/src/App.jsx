import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from './context/AdminContext'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import DashBoard from './pages/Admin/DashBoard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';
import MedicineDelivery from './pages/Admin/MedicineDelivery';
import Footer from './components/Footer';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
//import PatientList from './pages/Admin/PatientList';
const App = () => {
  const { AdminToken } = useContext(AdminContext)
  const {dToken } = useContext(DoctorContext)
  return AdminToken || dToken ? (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="flex item-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<DashBoard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorList />} />
          <Route path="/medicine-delivery" element={<MedicineDelivery />} />
          {/* //<Route path="/patient-list" element={<PatientList />} /> */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/doctor-appointment" element={<DoctorAppointment />} />
        </Routes>
      </div>
      <Footer/>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App

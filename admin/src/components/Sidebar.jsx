import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets} from '../assets/assets_admin/assets'
import { DoctorContext } from '../context/DoctorContext'
import medicineImg from '../assets/medicine.png';

const Sidebar = () => {
    const { AdminToken } = useContext(AdminContext)
    const {dToken } = useContext(DoctorContext)
  return (
    <div className="min-h-screen bg-white border-r">
      {AdminToken && (
        <ul className="text-black mt-6">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#EAEFEF] border-r-5 border-[#1c7856]" : ""
              }`
            }
            to={"/admin-dashboard"}
          >
            <img src={assets.home_icon} alt="" />
            <p>Dashboard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#EAEFEF] border-r-5 border-[#1c7856]" : ""
              }`
            }
            to={"all-appointments"}
          >
            <img src={assets.appointment_icon} alt="" />
            <p>Appointments</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#EAEFEF] border-r-5 border-[#1c7856]" : ""
              }`
            }
            to={"add-doctor"}
          >
            <img src={assets.add_icon} alt="" />
            <p>Add Doctor</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#EAEFEF] border-r-5 border-[#1c7856]" : ""
              }`
            }
            to={"doctor-list"}
          >
            <img src={assets.people_icon} alt="" />
            <p>Doctor List</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#EAEFEF] border-r-5 border-[#1c7856]" : ""
              }`
            }
            to={"medicine-delivery"}
          >
            <img src={medicineImg} alt="Medicine Delivery" className="w-6 h-6" />
            <p>Medicine Delivery</p>
          </NavLink>
        </ul>
      )}
        {dToken && (
        <ul className="text-black mt-6">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#EAEFEF] border-r-5 border-[#1c7856]" : ""
              }`
            }
            to={"/doctor-dashboard"}
          >
            <img src={assets.home_icon} alt="" />
            <p>Dashboard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#EAEFEF] border-r-5 border-[#1c7856]" : ""
              }`
            }
            to={"/doctor-appointment"}
          >
            <img src={assets.appointment_icon} alt="" />
            <p>Appointments</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#EAEFEF] border-r-5 border-[#1c7856]" : ""
              }`
            }
            to={"/doctor-profile"}
          >
            <img src={assets.people_icon} alt="" />
            <p>Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
}

export default Sidebar

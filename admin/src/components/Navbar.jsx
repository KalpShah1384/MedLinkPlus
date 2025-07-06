import React, { useContext } from "react";
//import { assets } from "../assets/assets_admin/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import Logo from "../../public/Logo.jpg"
import {useNavigate} from 'react-router-dom';

const Navbar = () => {
  const { AdminToken , setAdminToken } = useContext(AdminContext);
  const { setdToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    setAdminToken("");
    setdToken && setdToken("");
    localStorage.removeItem("AdminToken");
    localStorage.removeItem("dToken");
    navigate('/login');
  }
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img className="w-36 sm:w-40 cursor-pointer" src={Logo} alt="" />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-black-500 text-xs">
          {AdminToken ? "Welcome, Admin!" : "Welcome, Doctor!"}
        </p>
      </div>
      <button onClick={logout} className="bg-[#1c7856] text-white text-sm px-10 py-2 rounded-full cursor-pointer">
        Logout
      </button>
    </div>
  );
};

export default Navbar;

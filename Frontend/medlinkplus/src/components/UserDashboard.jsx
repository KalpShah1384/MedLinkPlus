import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import DashboardAppointments from "./DashboardAppointments";
import MedicalRecords from "./MedicalRecords";

const UserDashboard = () => {
  const { userData, token } = useContext(AppContext);
  const navigate = useNavigate();

  if (!token || !userData) {
    // Not logged in, redirect to login
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded shadow-md max-w-xl">
      <h2 className="text-3xl font-bold mb-4 text-[#54bd95]">User Dashboard</h2>
      <p className="mb-2">Welcome, <span className="font-semibold">{userData.name}</span>!</p>
      <p className="mb-2">Email: {userData.email}</p>
      {/* Add more user-specific controls/info here */}
      <div className="mt-6 mb-2">
        <button
          className="bg-[#1c7856] text-white px-4 py-2 rounded hover:bg-[#14543d] mr-2"
          onClick={() => navigate("/myprofile")}
        >
          View/Edit Profile
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/support")}
        >
          Support
        </button>
      </div>
      <DashboardAppointments />
      <MedicalRecords />
    </div>
  );
};

export default UserDashboard;

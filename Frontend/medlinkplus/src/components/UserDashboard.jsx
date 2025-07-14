import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import DashboardAppointments from "./DashboardAppointments";
import MedicalRecords from "./MedicalRecords";
import Messages from "./Messages";
import { FaUser, FaCalendar, FaFileMedical, FaHeartbeat, FaEnvelope, FaCog } from "react-icons/fa";

const UserDashboard = () => {
  const { userData, token } = useContext(AppContext);
  const navigate = useNavigate();

  if (!token || !userData) {
    // Not logged in, redirect to login
    navigate("/login");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <img src="/Logo.jpg" alt="MedLinkPlus Logo" className="h-10" />
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <Link to="/myprofile" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FaUser className="mr-3" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/userappoint" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FaCalendar className="mr-3" />
                <span>Appointments</span>
              </Link>
            </li>
            <li>
              <Link to="/messages" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FaEnvelope className="mr-3" />
                <span>Messages</span>
              </Link>
            </li>
            <li>
              <Link to="/medical-records" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FaFileMedical className="mr-3" />
                <span>Medical Records</span>
              </Link>
            </li>
            <li>
              <Link to="/health-analytics" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FaHeartbeat className="mr-3" />
                <span>Health Analytics</span>
              </Link>
            </li>
            <li>
              <Link to="/messages" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FaEnvelope className="mr-3" />
                <span>Messages</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FaCog className="mr-3" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#54bd95]">Welcome Back</h1>
              <p className="text-gray-600">{userData.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="bg-[#1c7856] text-white px-6 py-2 rounded-lg hover:bg-[#14543d] flex items-center"
                onClick={() => navigate("/myprofile")}
              >
                <FaUser className="mr-2" />
                View Profile
              </button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                onClick={() => navigate("/support")}
              >
                <FaEnvelope className="mr-2" />
                Support
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#f0f9f5] p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-[#1c7856]">Upcoming Appointments</h3>
              <p className="text-2xl font-bold">{userData?.appointments?.length || 0}</p>
            </div>
            <div className="bg-[#f0f9f5] p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-[#1c7856]">Medical Records</h3>
              <p className="text-2xl font-bold">{userData?.records?.length || 0}</p>
            </div>
            <div className="bg-[#f0f9f5] p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-[#1c7856]">Prescriptions</h3>
              <p className="text-2xl font-bold">{userData?.prescriptions?.length || 0}</p>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-6">
            <DashboardAppointments />
            <MedicalRecords />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

import React, { useState } from "react";
import DoctorStats from "../../components/DoctorStats";
import DoctorProfileEdit from "../../components/DoctorProfileEdit";

import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorProfile = ({ doctor, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(doctor);
  const { updateDoctorProfile } = useContext(AdminContext);

  // Dummy stats for now; replace with real stats if available
  const stats = doctor.stats || {
    totalAppointments: doctor.totalAppointments || 0,
    completed: doctor.completed || 0,
    cancelled: doctor.cancelled || 0,
  };

  const handleSave = async (form) => {
    const updated = await updateDoctorProfile(doctor._id, form);
    if (updated) {
      setProfile(updated);
      setEditMode(false);
    }
    // If update fails, toast is shown by context
  };

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl font-bold text-gray-400 hover:text-[#1c7856]">&times;</button>
        {editMode ? (
          <DoctorProfileEdit doctor={profile} onSave={handleSave} onCancel={() => setEditMode(false)} />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <img src={profile.image} alt={profile.name} className="w-32 h-32 rounded-full object-cover border-4 border-[#1c7856]/30 shadow" />
            <h2 className="text-2xl font-bold text-[#1c7856]">{profile.name}</h2>
            <p className="text-md text-gray-600">{profile.speciality || profile.specialization}</p>
            <div className="flex gap-4 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profile.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{profile.available ? 'Available' : 'Not Available'}</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">{profile.email}</span>
            </div>
            <DoctorStats stats={stats} />
            <div className="w-full mt-6">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">About</h3>
              <p className="text-gray-600 text-sm mb-2">{profile.about || 'No additional information provided.'}</p>
              <h3 className="font-semibold text-lg mb-2 text-gray-800 mt-4">Contact</h3>
              <p className="text-gray-600 text-sm">Phone: {profile.phone || 'N/A'}</p>
              <p className="text-gray-600 text-sm">Experience: {profile.experience || 'N/A'} years</p>
              <p className="text-gray-600 text-sm">Location: {profile.location || 'N/A'}</p>
            </div>
            <button onClick={() => setEditMode(true)} className="btn bg-[#1c7856] text-white mt-4 hover:bg-[#155c43]">Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;

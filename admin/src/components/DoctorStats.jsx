import React from "react";

const DoctorStats = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="flex flex-wrap gap-4 mt-4 justify-center">
      <div className="bg-[#e6f4ea] rounded-xl p-4 min-w-[120px] text-center shadow">
        <p className="text-2xl font-bold text-[#1c7856]">{stats.totalAppointments ?? 0}</p>
        <p className="text-sm text-gray-700 mt-1">Appointments</p>
      </div>
      <div className="bg-[#e6f4ea] rounded-xl p-4 min-w-[120px] text-center shadow">
        <p className="text-2xl font-bold text-[#1c7856]">{stats.completed ?? 0}</p>
        <p className="text-sm text-gray-700 mt-1">Completed</p>
      </div>
      <div className="bg-[#e6f4ea] rounded-xl p-4 min-w-[120px] text-center shadow">
        <p className="text-2xl font-bold text-[#1c7856]">{stats.cancelled ?? 0}</p>
        <p className="text-sm text-gray-700 mt-1">Cancelled</p>
      </div>
    </div>
  );
};

export default DoctorStats;

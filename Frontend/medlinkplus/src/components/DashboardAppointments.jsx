import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const DashboardAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          backendUrl + "/api/user/appointments",
          { headers: { token } }
        );
        if (data.success) {
          setAppointments(data.appointments);
        }
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAppointments();
  }, [token, backendUrl]);

  if (loading) return <div>Loading appointments...</div>;
  if (!appointments.length)
    return <div className="text-gray-500">No appointments found.</div>;

  // Separate upcoming and past
  const now = new Date();
  const upcoming = appointments.filter(
    (appt) => {
      const [day, month, year] = appt.slotDate.split("_");
      const apptDate = new Date(`${year}-${month}-${day}T${appt.slotTime}`);
      return apptDate >= now && !appt.cancel;
    }
  );
  const history = appointments.filter(
    (appt) => {
      const [day, month, year] = appt.slotDate.split("_");
      const apptDate = new Date(`${year}-${month}-${day}T${appt.slotTime}`);
      return apptDate < now || appt.cancel;
    }
  );

  return (
    <div className="my-8">
      <h3 className="text-2xl font-semibold mb-4 text-[#1c7856]">Upcoming Appointments</h3>
      {upcoming.length ? (
        <div className="space-y-4">
          {upcoming.map((item, idx) => (
            <div key={item._id} className="p-4 border rounded-lg shadow bg-white flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <img src={item.docData.image} alt={item.docData.name} className="w-20 h-20 rounded-lg object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">{item.docData.name}</div>
                <div className="text-sm">{item.docData.speciality}</div>
                <div className="text-xs text-gray-600">{item.docData.address.line1}, {item.docData.address.line2}</div>
                <div className="mt-1">Date: <span className="font-medium">{item.slotDate.replace(/_/g, "-")}</span> | Time: <span className="font-medium">{item.slotTime}</span></div>
                <div className="mt-1 text-xs">Status: <span className="font-semibold text-green-600">Confirmed</span></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No upcoming appointments.</div>
      )}

      <h3 className="text-2xl font-semibold mb-4 mt-8 text-[#1c7856]">Appointment History</h3>
      {history.length ? (
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div key={item._id} className="p-4 border rounded-lg shadow bg-gray-50 flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <img src={item.docData.image} alt={item.docData.name} className="w-20 h-20 rounded-lg object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">{item.docData.name}</div>
                <div className="text-sm">{item.docData.speciality}</div>
                <div className="text-xs text-gray-600">{item.docData.address.line1}, {item.docData.address.line2}</div>
                <div className="mt-1">Date: <span className="font-medium">{item.slotDate.replace(/_/g, "-")}</span> | Time: <span className="font-medium">{item.slotTime}</span></div>
                <div className="mt-1 text-xs">Status: <span className={item.cancel ? "font-semibold text-red-600" : "font-semibold text-gray-600"}>{item.cancel ? "Cancelled" : "Completed"}</span></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No appointment history.</div>
      )}
    </div>
  );
};

export default DashboardAppointments;

import React, { useState, useEffect } from "react";
import { createContext } from "react";
import axios from "axios";

export const DoctorContext = createContext();
const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setdToken] = useState(localStorage.getItem("dToken") ? localStorage.getItem("dToken") : "");
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch doctor profile and appointments on mount or when dToken changes
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!dToken) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch doctor profile
        const profileRes = await axios.get(`${backendUrl}/api/doctor/profile`, {
          headers: { dtoken: dToken },
        });
        setDoctor(profileRes.data.doctor);
        // Fetch appointments
        const apptRes = await axios.get(`${backendUrl}/api/doctor/appointments`, {
          headers: { dtoken: dToken },
        });
        setAppointments(apptRes.data.appointments || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch doctor data');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, [dToken, backendUrl]);

  const value = {
    dToken,
    setdToken,
    backendUrl,
    doctor,
    appointments,
    loading,
    error,
    setDoctor,
    setAppointments,
  };
  return(
    <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>
  );
};
export default DoctorContextProvider;

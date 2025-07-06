import React from "react";
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify'
export const AdminContext = createContext();
const AdminContextProvider = (props) => {
  const [patients, setPatients] = useState([]);
  const [AdminToken, setAdminToken] = useState(localStorage.getItem("AdminToken") ? localStorage.getItem("AdminToken") : "");
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [dashData,setdashData] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        { headers: { atoken: AdminToken } }
      );
      if (data.success) {
        setDoctors(data.doctors)
        console.log(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const changeAvailability = async (docId) => {
  try {
    const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, { headers: { atoken: AdminToken } });
    if (data.success) {
      toast.success(data.message)
      getAllDoctors()
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}

  const getAllAppointments = async () => {
   try {
     const { data } = await axios.get(backendUrl + '/api/admin/appointments-admin', { headers: { atoken: AdminToken } })
     if (data.success) {
       setAppointments(data.appointments)
       console.log(data.appointments)
     } else {
       toast.error(data.message)
     }
   } catch (error) {
    toast.error(error.message)
   }
  }
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancelAppointment', { appointmentId }, { headers: { atoken: AdminToken } })
      if (data.success) {
        toast.success(data.message)
        getAllAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const updateDoctorProfile = async (docId, fields) => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/api/admin/update-doctor-profile`,
      { docId, ...fields },
      { headers: { atoken: AdminToken } }
    );
    if (data.success) {
      toast.success(data.message || 'Doctor profile updated');
      getAllDoctors();
      return data.doctor;
    } else {
      toast.error(data.message);
      return null;
    }
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { atoken: AdminToken } })
      if (data.success) {
        setdashData(data.dashData)
        console.log(data.dashData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const getAllPatients = async () => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/api/admin/all-patients`,
      {},
      { headers: { atoken: AdminToken } }
    );
    if (data.success) {
      setPatients(data.patients);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

const updatePatientProfile = async (patientId, fields) => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/api/admin/update-patient-profile`,
      { patientId, ...fields },
      { headers: { atoken: AdminToken } }
    );
    if (data.success) {
      toast.success(data.message || 'Patient profile updated');
      getAllPatients();
      return data.patient;
    } else {
      toast.error(data.message);
      return null;
    }
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const getPatientAppointments = async (patientId) => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/api/admin/get-patient-appointments`,
      { patientId },
      { headers: { atoken: AdminToken } }
    );
    if (data.success) {
      return data.appointments;
    } else {
      toast.error(data.message);
      return [];
    }
  } catch (error) {
    toast.error(error.message);
    return [];
  }
};

const value = {
    AdminToken,
    setAdminToken,
    backendUrl, doctors, getAllDoctors, changeAvailability,
    appointments, setAppointments, getAllAppointments, cancelAppointment,
    dashData,getDashData,
    updateDoctorProfile,
    patients, getAllPatients, updatePatientProfile,
    getPatientAppointments
  }

  return(
    <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>
  );
};
export default AdminContextProvider;

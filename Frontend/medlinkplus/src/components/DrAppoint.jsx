import React, { useContext , useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useState } from "react";
import PayPalButton from "./PayPalButton";
import axios from "axios";
import { toast } from "react-toastify";

function DrAppoint() {
  const { backendUrl , token ,getDoctorsdata } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = [
    " ","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0]+" " + months[Number(dateArray[1])]+ " "  + dateArray[2]
  }
  const getuserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
        
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }
  const cancelAppointment = async (appointmentId) => {
    try {
      const {data} = await axios.post(backendUrl+'/api/user/cancelappointment',{appointmentId},{headers:{token}})
      if (data.success) {
        toast.success(data.message);
        getuserAppointments();
        getDoctorsdata()
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }
  useEffect(() => {
    if (token) {
      getuserAppointments();
    }
  },[token])
  return (
    <div className="mt-30 px-4 my-8">
      <p className="pb-3 mt-12 text-xl font-semibold text-gray-800 border-b border-gray-300">
        My Appointments
      </p>

      <div className="grid gap-6 mt-8">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow"
          >
            <div className="flex-shrink-0">
              <img
                className="w-32 h-32 object-cover bg-indigo-100 rounded-lg"
                src={item.docData.image}
                alt={item.name}
              />
            </div>

            <div className="flex-1 text-gray-700 space-y-1">
              <p className="text-lg font-bold text-gray-900">
                {item.docData.name}
              </p>
              <p className="text-sm">{item.docData.speciality}</p>

              <p className="mt-2 font-semibold text-gray-600">Address:</p>
              <p className="text-sm">
                {item.docData.address.line1}, {item.docData.address.line2}
              </p>

              <p className="mt-2 text-sm">
                <span className="font-medium text-gray-800">Date & Time:</span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            <div className="flex flex-col justify-center gap-2 mt-4 sm:mt-0">
              {!item.cancel && !item.payment && (
                <>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-all duration-300 cursor-pointer"
                    onClick={() => setAppointments(prev => prev.map((appt, idx) => idx === index ? { ...appt, showPayPal: true } : appt))}
                  >
                    Pay Here
                  </button>
                  {item.showPayPal && (
                    <div className="mt-2">
                      <PayPalButton
                        amount={item.docData.fees}
                        clientId={import.meta.env.VITE_REACT_APP_PAYPAL_CLIENT_ID || import.meta.env.REACT_APP_PAYPAL_CLIENT_ID || "AY1lMX0A6TrxMraoWCKaaFW7NCxTQJ0W-BSYBDCIcAPBMIl4pX7Wc18dLr8EH_04XbS3VBia_2ginmfa"}
                        appointmentId={item._id}
                        backendUrl={backendUrl}
                        token={token}
                        onSuccess={async (details) => {
                          try {
                            await axios.post(backendUrl + '/api/user/markPaid', { appointmentId: item._id }, { headers: { token } });
                            setAppointments(prev => prev.map((appt, idx) => idx === index ? { ...appt, payment: true, showPayPal: false } : appt));
                            toast.success('Payment successful!');
                          } catch (err) {
                            toast.error('Payment update failed!');
                          }
                        }}
                      />
                      <button
                        className="ml-2 px-2 py-1 text-xs bg-gray-300 rounded"
                        onClick={() => setAppointments(prev => prev.map((appt, idx) => idx === index ? { ...appt, showPayPal: false } : appt))}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              )}
              {item.payment && (
                <span className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md">Paid</span>
              )}
              {!item.cancel && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-all duration-300 cursor-pointer"
                >
                  Cancel Appointment
                </button>
              )}
              {item.cancel && (
                <p className="text-sm text-red-500 font-medium">Cancelled</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DrAppoint;

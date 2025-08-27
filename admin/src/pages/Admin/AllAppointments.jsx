import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets_admin/assets'
import '../../styles/custom-scrollbar.css'

const AllAppointments = () => {
  const { AdminToken, appointments, getAllAppointments , cancelAppointment } = useContext(AdminContext)
  const {calculateAge,slotDateFormat , currency} = useContext(AppContext)
  useEffect(() => {
    if (AdminToken) {
      getAllAppointments()
    }
  }, [AdminToken])
  return (
    <div className="w-full max-w-[96vw] xl:max-w-[1500px] mx-auto my-4 px-1 sm:px-6 md:px-12">
      <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-gray-800">All Appointments</h2>
      <div className="relative bg-white shadow-2xl rounded-2xl overflow-x-auto border max-h-[90vh] min-h-[65vh] sm:max-h-[95vh] sm:min-h-[75vh] p-4 sm:p-8 md:p-12 custom-scrollbar">
        {/* Desktop Table */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr] bg-gray-100 text-gray-700 text-lg font-bold py-6 px-8 border-b sticky top-0 z-20">
          <span>#</span>
          <span>Patient</span>
          <span>Age</span>
          <span>Date & Time</span>
          <span>Doctor</span>
          <span>Actions</span>
          <span>Fees</span>
        </div>
        {appointments.length === 0 && (
          <div className="py-20 text-center text-gray-400 text-lg">No appointments found.</div>
        )}
        {appointments.map((item, index) => (
          <div
            key={index}
            className={`fade-in transition-all duration-300 sm:grid sm:grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr] items-center text-gray-800 text-sm py-4 px-8 border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:scale-[1.015] hover:shadow-lg hover:z-10 hover:bg-blue-50 flex flex-wrap sm:flex-none justify-between gap-y-3 rounded-lg sm:rounded-none mobile-appointment-card`}
            style={{ boxShadow: '0 1px 2px rgba(16,30,54,0.03)' }}
          >
            <p className="max-sm:hidden font-semibold text-gray-500 text-lg">{index + 1}</p>
            {/* Patient Info */}
            <div className="flex items-center gap-5">
              <img className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-md" src={item.userData?.image || assets.default_user_icon} alt="Patient" />
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-gray-900">{item.userData?.name || "Unknown"}</span>
                <span className="text-sm text-gray-400">{item.userData?.email || "No Email"}</span>
              </div>
            </div>
            {/* Age */}
            <p className="max-sm:hidden text-center font-bold text-base">{item.userData?.dateOfBirth ? calculateAge(item.userData.dateOfBirth) : <span className="text-gray-300">-</span>}</p>
            {/* Date & Time */}
            <div className="flex flex-col">
              <span className="font-semibold text-base">{slotDateFormat(item.slotDate)}</span>
              <span className="text-sm text-gray-400">{item.slotTime}</span>
            </div>
            {/* Doctor Info */}
            <div className="flex items-center gap-5">
              <img className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-md" src={item.docData?.image || assets.default_user_icon} alt="Doctor" />
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-gray-900">{item.docData?.name || "Unknown"}</span>
                <span className="text-sm text-gray-400">{item.docData?.specialization || "Doctor"}</span>
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-3 justify-center">
              {item.cancel ? (
                <span className="px-3 py-2 rounded-full text-sm font-bold bg-red-50 text-red-600 border border-red-200">Cancelled</span>
              ) : (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="flex items-center px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg transition"
                  title="Cancel Appointment"
                >
                  <img src={assets.cancel_icon} alt="Cancel" className="w-5 h-5 mr-2" /> Cancel
                </button>
              )}
            </div>
            {/* Fees */}
            <p className="text-center font-bold text-green-700 text-lg">
              {currency}{item.amount}
            </p>
          </div>
        ))}

      </div>
    </div>
  )
}

export default AllAppointments

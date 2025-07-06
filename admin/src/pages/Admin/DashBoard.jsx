import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets_admin/assets'
import DashboardCharts from '../../components/DashboardCharts'
import AnimatedCounter from '../../components/AnimatedCounter'

const DashBoard = () => {
  const { AdminToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  useEffect(()=>{
    if (AdminToken) {
      getDashData()
    }
  },[AdminToken])
  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-6'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-53 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all '>
          {/* Modern Doctor SVG Icon with animation */}
<svg className='w-16 h-16 text-[#1c7856] drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <circle cx='24' cy='16' r='8' fill='#E6F4EA'/>
  <rect x='10' y='28' width='28' height='12' rx='6' fill='#1c7856' fillOpacity='0.15'/>
  <circle cx='24' cy='16' r='6' fill='#1c7856'/>
  <rect x='18' y='32' width='12' height='4' rx='2' fill='#1c7856'/>
  <rect x='22' y='36' width='4' height='4' rx='2' fill='#1c7856'/>
</svg>
          <div className='flex items-center gap-2 bg-white p-4 min-w-53 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all '>
            <p className='text-2xl font-bold text-black-700 drop-shadow-sm'>
              <AnimatedCounter value={dashData.doctors}/>
            </p>
            <p className='text-lg font-semibold text-black-200'>
              Doctors
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-53 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all '>
          {/* Modern Appointment SVG Icon with animation */}
<svg className='w-16 h-16 text-[#1c7856] drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <rect x='8' y='12' width='32' height='28' rx='6' fill='#E6F4EA'/>
  <rect x='8' y='12' width='32' height='8' rx='4' fill='#1c7856' fillOpacity='0.15'/>
  <rect x='16' y='24' width='16' height='2.5' rx='1.25' fill='#1c7856'/>
  <rect x='16' y='30' width='10' height='2.5' rx='1.25' fill='#1c7856'/>
  <circle cx='36' cy='20' r='2' fill='#1c7856'/>
</svg>
          <div>
            <p className='text-2xl font-bold text-black-700 drop-shadow-sm'>
              <AnimatedCounter value={dashData.appointments}/>
            </p>
            <p className='text-lg font-semibold text-black-200'>
              Appointments
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-53 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all '>
          {/* Modern Patient SVG Icon with animation */}
<svg className='w-16 h-16 text-[#1c7856] drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <circle cx='24' cy='18' r='8' fill='#E6F4EA'/>
  <circle cx='24' cy='18' r='6' fill='#1c7856'/>
  <ellipse cx='24' cy='36' rx='14' ry='8' fill='#1c7856' fillOpacity='0.15'/>
  <ellipse cx='24' cy='36' rx='10' ry='5' fill='#1c7856' fillOpacity='0.3'/>
</svg>
          <div>
            <p className='text-2xl font-bold text-black-700 drop-shadow-sm'>
              <AnimatedCounter value={dashData.patients}/>
            </p>
            <p className='text-lg font-semibold text-black-200'>
              Patients
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <DashboardCharts 
        barData={dashData.appointmentTrends || undefined} 
        pieStats={dashData.userDistribution || undefined} 
      />

      {/* Recent Activity Feed (Rich Cards) */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {(dashData.recentActivity && dashData.recentActivity.length > 0) ? (
            dashData.recentActivity.map((item, idx) => {
              // Format slotDate (e.g., '10_7_2025' => '10 July 2025')
              let formattedDate = item.slotDate;
              if (item.slotDate && item.slotDate.includes('_')) {
                const [day, month, year] = item.slotDate.split('_');
                const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                formattedDate = `${day} ${months[parseInt(month, 10)]} ${year}`;
              }
              return (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50 hover:shadow transition">
                  {/* Doctor Image */}
                  <img src={item.doctorImage || assets.doctor_icon} alt="Doctor" className="w-12 h-12 rounded-full object-cover border-2 border-green-200" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-800">{item.doctorName}</span>
                      <span className="text-xs text-gray-400">(Doctor)</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="font-semibold text-blue-800">{item.patientName}</span>
                      <span className="text-xs text-gray-400">(Patient)</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{formattedDate} {item.slotTime}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${item.status === 'Cancelled' ? 'bg-red-100 text-red-800' : item.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">₹{item.amount}</span>
                    </div>
                  </div>
                  {/* Patient Image */}
                  <img src={item.patientImage || assets.patients_icon} alt="Patient" className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" />
                </div>
              );
            })
          ) : (
            <div className="text-gray-400">No recent activity.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashBoard
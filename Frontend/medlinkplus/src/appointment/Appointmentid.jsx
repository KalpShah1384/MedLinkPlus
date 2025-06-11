import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Appointments from '../components/Appointments'

function Appointmentid() {
    return (<>
      <Navbar/>
    <div className='min-h-screen'>
      <Appointments/>
    </div>
    <Footer/></>
  )
}

export default Appointmentid

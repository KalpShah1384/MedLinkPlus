import React from 'react'
import Myprofile from '../components/Myprofile';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Profile() {
    return (
        <>
            <Navbar/>
            <div className='min-h=screen'>
                <Myprofile/>
            </div>
            <Footer/>
      </>
    );
}

export default Profile

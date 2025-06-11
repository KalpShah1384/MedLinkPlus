import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
//import Myappointments from "../components/Myappointments";
import DrAppoint from "../components/DrAppoint";

function UserAppoint() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <DrAppoint />
      </div>
      <Footer />
    </>
  );
}

export default UserAppoint;


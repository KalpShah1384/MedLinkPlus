import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FindHospital from "../components/FindHospital";

function Hospital() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <FindHospital />
      </div>
      <Footer />
    </>
  );
}

export default Hospital;

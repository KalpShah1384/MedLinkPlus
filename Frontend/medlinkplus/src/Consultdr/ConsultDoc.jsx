import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Topdoctors from "../components/ConsultDr";

function ConsultDoc() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Topdoctors />
      </div>
      <Footer />
    </>
  );
}

export default ConsultDoc;
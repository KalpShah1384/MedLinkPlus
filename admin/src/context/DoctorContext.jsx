import React, { useState } from "react";
import { createContext } from "react";

export const DoctorContext = createContext();
const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setdToken] = useState(localStorage.getItem("dToken") ? localStorage.getItem("dToken") : "");
  
  const value = {
    dToken,
    setdToken,backendUrl
  };
  return(
    <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>
  );
};
export default DoctorContextProvider;

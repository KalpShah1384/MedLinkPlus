import React, { useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AppContext = createContext();
const AppContextProvider = (props) => {
    const currencySymbol = "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])
    const [token, _setToken] = useState(() => localStorage.getItem("token") || false);
const setToken = (newToken) => {
  if (newToken) {
    localStorage.setItem("token", newToken);
    _setToken(newToken);
  } else {
    localStorage.removeItem("token");
    _setToken(false);
  }
};
    const[userData,setuserData] = useState(false)
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        return savedTheme;
    });

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const getDoctorsdata = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/getprofile', { headers: { token } })
            if (data.success) {
                setuserData(data.userData)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
    }

    const value = {
      doctors,getDoctorsdata,
      currencySymbol,
      token,
      setToken,backendUrl,userData,setuserData,loadUserProfileData,
      theme,
      toggleTheme
    };
    useEffect(() => {
        getDoctorsdata()
    },[])
    // On mount, check if token in localStorage and set it if needed
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken && !token) {
            _setToken(storedToken);
        }
        // If no token, clear userData
        if (!storedToken) {
            setuserData(false);
        }
    }, []);

    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setuserData(false);
        }
    }, [token]);
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;
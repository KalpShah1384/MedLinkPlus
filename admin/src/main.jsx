//import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/adminContext.jsx'
import { DoctorContext } from './context/DoctorContext.jsx'
import { AppContext } from './context/appContext.jsx'

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContext>
        <AppContext>
          <App />
        </AppContext>
      </DoctorContext>
    </AdminContextProvider>
  </BrowserRouter>
);

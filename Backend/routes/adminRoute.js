import express from 'express';
import { addDoctor,adminDashboard,allDoctors,appointmentCancel,appointmentsAdmin,loginAdmin } from '../controllers/adminController.js';
import upload from '../middleware/multer.js';
import authAdmin from '../middleware/authAdmin.js';
import { changeAvailability, updateDoctorProfile } from '../controllers/doctorController.js';
//import { patientList, updatePatientProfile, getPatientAppointments } from '../controllers/patientController.js';

const adminrouter = express.Router();

adminrouter.post('/add-doctor', authAdmin ,upload.single('image'), addDoctor);
adminrouter.post("/login", loginAdmin);
adminrouter.post("/all-doctors", authAdmin, allDoctors);
adminrouter.post("/change-availability", authAdmin, changeAvailability)
adminrouter.post("/update-doctor-profile", authAdmin, updateDoctorProfile)
//adminrouter.post("/all-patients", authAdmin, patientList)
//adminrouter.post("/update-patient-profile", authAdmin, updatePatientProfile)
//adminrouter.post("/get-patient-appointments", authAdmin, getPatientAppointments)
adminrouter.get("/appointments-admin", authAdmin, appointmentsAdmin)
adminrouter.post("/cancelAppointment", authAdmin, appointmentCancel)
adminrouter.get("/dashboard",authAdmin,adminDashboard)
export default adminrouter;
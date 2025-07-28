import express from 'express';
import { 
  addDoctor,
  adminDashboard,
  allDoctors,
  appointmentCancel,
  appointmentsAdmin,
  loginAdmin
} from '../controllers/adminController.js';
import orderController from '../controllers/orderController.js';
import upload from '../middleware/multer.js';
import authAdmin from '../middleware/authAdmin.js';
import { changeAvailability, updateDoctorProfile } from '../controllers/doctorController.js';
//import { patientList, updatePatientProfile, getPatientAppointments } from '../controllers/patientController.js';

const adminrouter = express.Router();

// Authentication
adminrouter.post("/login", loginAdmin);

// Doctor Management
adminrouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminrouter.post("/all-doctors", authAdmin, allDoctors);
adminrouter.post("/change-availability", authAdmin, changeAvailability);
adminrouter.post("/update-doctor-profile", authAdmin, updateDoctorProfile);

// Appointment Management
adminrouter.get("/appointments-admin", authAdmin, appointmentsAdmin);
adminrouter.post("/cancelAppointment", authAdmin, appointmentCancel);

// Order Management
adminrouter.get("/orders", authAdmin, orderController.getAllOrders);
adminrouter.put("/orders/update-status", authAdmin, orderController.updateOrderStatus);

// Dashboard
adminrouter.get("/dashboard", authAdmin, adminDashboard);
export default adminrouter;
import express from 'express';
import { doctorList, loginDoctor, getDoctorProfile, getDoctorAppointments, updateDoctorProfile, markAppointmentCompleted, sendAppointmentReminder } from '../controllers/doctorController.js';

const doctorRouter = express.Router();
import authD from '../middleware/authD.js';
doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/profile', authD, getDoctorProfile);
doctorRouter.get('/appointments', authD, getDoctorAppointments);
doctorRouter.post('/update-profile', authD, updateDoctorProfile);
doctorRouter.post('/mark-completed', authD, markAppointmentCompleted);
doctorRouter.post('/send-reminder', authD, sendAppointmentReminder);
export default doctorRouter;

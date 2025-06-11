import express from 'express';
import { addDoctor,allDoctors,loginAdmin } from '../controllers/adminController.js';
import upload from '../middleware/multer.js';
import authAdmin from '../middleware/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';

const adminrouter = express.Router();

adminrouter.post('/add-doctor', authAdmin ,upload.single('image'), addDoctor);
adminrouter.post("/login", loginAdmin);
adminrouter.post("/all-doctors", authAdmin, allDoctors);
adminrouter.post("/change-availability",authAdmin,changeAvailability)
export default adminrouter;
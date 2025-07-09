import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment
} from '../controllers/userController.js';
import { verifyPayPalPayment } from '../controllers/paypalController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import MedicalRecord from '../models/medicalRecordModel.js';
import { v2 as cloudinary } from 'cloudinary';

const userRouter = express.Router();

// Multer memory storage for Cloudinary uploads
const uploadMedicalRecordMulter = multer({ storage: multer.memoryStorage() });

// Utility to determine resource type based on file extension
const getResourceType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const imageExts = ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.webp'];
  const rawExts = ['.pdf', '.docx', '.doc', '.txt', '.zip'];

  if (imageExts.includes(ext)) return 'image';
  if (rawExts.includes(ext)) return 'raw';
  return 'auto';
};

// Medical Record Upload
userRouter.post(
  '/upload-medical-record',
  authUser,
  uploadMedicalRecordMulter.single('record'),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: 'No file uploaded' });
      }

      const resourceType = getResourceType(file.originalname);

      const cloudinaryResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: 'medical-records',
            type: 'upload',
            access_mode: 'public'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      const record = await MedicalRecord.create({
        userId: req.user.id,
        filename: file.originalname,
        url: cloudinaryResult.secure_url
      });

      res.json({ success: true, record });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// Fetch medical records
userRouter.get('/medical-records', authUser, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ userId: req.user.id }).sort({
      createdAt: -1
    });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// User-related routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/getprofile', authUser, getUserProfile);
userRouter.post('/updateprofile', upload.single('image'), authUser, updateUserProfile);

// Appointment routes
userRouter.post('/bookappointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.post('/cancelappointment', authUser, cancelAppointment);

// Payment verification
userRouter.post('/verify-paypal-payment', verifyPayPalPayment);

export default userRouter;

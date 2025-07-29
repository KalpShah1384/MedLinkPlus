import express from 'express';
import multer from 'multer';
import path from 'path';
import authUser from '../middleware/authUser.js';
import MedicalRecord from '../models/medicalRecordModel.js';
import { v2 as cloudinary } from 'cloudinary';
import upload from '../middleware/multer.js'; // Only use for image uploads (e.g., /updateprofile)
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
import { googleLogin } from '../controllers/googleAuthController.js';

const userRouter = express.Router();

// Google Auth
userRouter.post('/google-login', googleLogin);

// Multer memory storage for Cloudinary streaming upload
const uploadMedicalRecordMulter = multer({ storage: multer.memoryStorage() });

// Detect Cloudinary resource type based on file extension
const getResourceType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const imageExts = ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.webp'];
  const rawExts = ['.pdf', '.docx', '.doc', '.txt', '.zip'];

  if (imageExts.includes(ext)) return 'image';
  if (rawExts.includes(ext)) return 'raw';
  return 'auto';
};

// Upload medical record to Cloudinary
userRouter.post(
  '/upload-medical-record',
  authUser,
  uploadMedicalRecordMulter.single('record'),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file || !file.buffer || file.size === 0) {
        return res.status(400).json({ success: false, message: 'Empty file uploaded' });
      }

      const resourceType = getResourceType(file.originalname);

      const cloudinaryResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: 'medical-records',
            access_mode: 'public'
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(file.buffer); // send the buffer directly
      });

      const record = await MedicalRecord.create({
        userId: req.user.id,
        filename: file.originalname,
        url: cloudinaryResult.secure_url
      });

      res.json({ success: true, record });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
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

// Delete medical record
userRouter.delete('/medical-records/:id', authUser, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    if (record.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    // Remove from Cloudinary
    const urlParts = record.url.split('/');
    const publicIdWithExt = urlParts.slice(urlParts.indexOf('medical-records')).join('/').replace(/\.[^.]+$/, '');
    await cloudinary.uploader.destroy(publicIdWithExt, { resource_type: 'raw' });
    await MedicalRecord.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update (rename) medical record filename
userRouter.put('/medical-records/:id', authUser, async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ success: false, message: 'Filename required' });
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    if (record.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    record.filename = filename;
    await record.save();
    res.json({ success: true, record });
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
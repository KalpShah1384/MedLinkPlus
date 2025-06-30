import express from 'express';
import { registerUser , loginUser, getUserProfile, updateUserProfile, bookAppointment } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';
const userRouter = express.Router();
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/getprofile', authUser, getUserProfile)
userRouter.post('/updateprofile', upload.single('image'), authUser, updateUserProfile)
userRouter.post('/bookappointment', authUser, bookAppointment)
export default  userRouter

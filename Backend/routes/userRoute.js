import express from 'express';
import { registerUser , loginUser, getUserProfile } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/getprofile',authUser,getUserProfile)
export default  userRouter

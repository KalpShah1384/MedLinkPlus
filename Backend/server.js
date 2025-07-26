import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminrouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import contactRouter from './routes/contact.js';
import getInTouchRouter from './routes/getintouch.js';
import supportRouter from './routes/supportRoute.js';
import healthAnalyticsRouter from './routes/healthAnalyticsRoute.js';
import messageRoute from './routes/messageRoute.js';
import medicineRoutes from './routes/medicineRoutes.js';

//app configuration
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

//middleware 
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//api endpoints
app.use('/api/admin', adminrouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);
app.use('/api/contact', contactRouter);
app.use('/api/getintouch', getInTouchRouter);
app.use('/api/support', supportRouter);
app.use('/api/health', healthAnalyticsRouter);
app.use('/api/messages', messageRoute);
app.use('/api/medicines', medicineRoutes);

//localhost:4000/api/admin/add-doctor
app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

//start the server
app.listen(port, () => {
    console.log('Server is running on port', port);
});
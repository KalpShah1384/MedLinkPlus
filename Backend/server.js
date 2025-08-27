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
import orderRoutes from './routes/orderRoutes.js';

//app configuration
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

//middleware 
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        process.env.ADMIN_URL || 'http://localhost:5174',
        'https://wondrous-quokka-5bc2b7.netlify.app',
        'https://medlinkplusadmin.netlify.app',
        'https://localhost:3000',
        'https://127.0.0.1:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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
app.use('/api/orders', orderRoutes);
import symptomCheckerRoute from './routes/symptomCheckerRoute.js';
app.use('/api/symptom-checker', symptomCheckerRoute);

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'MedlinkPlus Backend API is running',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api',
            admin: '/api/admin',
            doctor: '/api/doctor',
            user: '/api/user'
        }
    });
});

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API root endpoint
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'MedlinkPlus API is running' });
});

//start the server
app.listen(port, () => {
    console.log('Server is running on port', port);
});
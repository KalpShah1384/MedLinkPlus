import express from 'express';
import { orderController } from '../controllers/orderController.js';
import authUser from '../middleware/authUser.js';
import authAdmin from '../middleware/authAdmin.js';

const router = express.Router();

// User routes
router.post('/', authUser, orderController.createOrder);
router.post('/update-payment-status', authUser, orderController.updatePaymentStatus);
router.get('/my-orders', authUser, orderController.getUserOrders);

// Admin routes
router.get('/all', authUser, authAdmin, orderController.getAllOrders);
router.put('/update-status', authUser, authAdmin, orderController.updateOrderStatus);

export default router;

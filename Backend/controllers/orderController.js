import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

export const orderController = {
  // Create a new order
  async createOrder(req, res) {
    try {
      const { items, totalAmount, paymentMethod, shippingAddress } = req.body;
      const userId = req.user._id;

      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const order = new Order({
        user: userId,
        userName: user.name,
        userEmail: user.email,
        items,
        totalAmount,
        paymentMethod,
        shippingAddress,
        paymentStatus: 'pending' // Will be updated after payment verification
      });

      await order.save();
      
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        orderId: order._id
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
    }
  },

  // Update payment status after successful payment
  async updatePaymentStatus(req, res) {
    try {
      const { orderId, paymentId, status } = req.body;
      
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.paymentStatus = status;
      order.paymentId = paymentId;
      
      if (status === 'completed') {
        order.status = 'processing'; // Update order status when payment is completed
      }

      await order.save();
      
      res.json({ success: true, message: 'Payment status updated successfully' });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ success: false, message: 'Error updating payment status', error: error.message });
    }
  },

  // Get all orders (for admin)
  async getAllOrders(req, res) {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name email');
      
      res.json({ success: true, orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
    }
  },

  // Get orders for a specific user
  async getUserOrders(req, res) {
    try {
      const userId = req.user._id;
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
      
      res.json({ success: true, orders });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ success: false, message: 'Error fetching user orders', error: error.message });
    }
  },

  // Update order status (for admin)
  async updateOrderStatus(req, res) {
    try {
      const { orderId, status } = req.body;
      
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.status = status;
      await order.save();
      
      res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ success: false, message: 'Error updating order status', error: error.message });
    }
  }
};

export default orderController;

import appointmentModel from "../models/appointment.js";
import fetch from "node-fetch";

// POST /api/user/verify-paypal-payment
// Expects: { orderID, appointmentId }
// Verifies payment with PayPal and marks appointment as paid if valid
export const verifyPayPalPayment = async (req, res) => {
  try {
    const { orderID, appointmentId } = req.body;
    if (!orderID || !appointmentId) {
      return res.status(400).json({ success: false, message: "Missing orderID or appointmentId" });
    }

    // Get PayPal credentials from env
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;
    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

    // 1. Get PayPal access token
    const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.status(500).json({ success: false, message: "Failed to get PayPal access token" });
    }

    // 2. Get order details
    const orderRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });
    const orderData = await orderRes.json();
    if (orderData.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    // 3. Mark appointment as paid
    await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
    res.json({ success: true, message: "Payment verified and appointment marked as paid" });
  } catch (err) {
    console.error("PayPal verification error:", err);
    res.status(500).json({ success: false, message: "Server error verifying payment" });
  }
};

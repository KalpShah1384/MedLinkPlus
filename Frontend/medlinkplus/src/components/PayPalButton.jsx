import React, { useEffect } from "react";
import axios from "axios";

const PayPalButton = ({ 
  amount, 
  onSuccess, 
  currency = "USD", 
  clientId, 
  appointmentId, 
  cartItems, 
  backendUrl, 
  token 
}) => {
  useEffect(() => {
    // Dynamically load PayPal SDK script if not already loaded
    const scriptId = "paypal-sdk";
    if (!window.paypal && !document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
      script.id = scriptId;
      script.async = true;
      script.onload = renderButton;
      document.body.appendChild(script);
    } else if (window.paypal) {
      renderButton();
    }
    function renderButton() {
      if (!window.paypal) return;
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount.toString() } }],
          });
        },
        onApprove: async (data, actions) => {
          const details = await actions.order.capture();
          // Backend verification
          try {
            const payload = { 
              orderID: data.orderID,
              amount,
              currency
            };
            
            if (appointmentId) {
              payload.appointmentId = appointmentId;
            } else if (cartItems) {
              payload.cartItems = cartItems;
            }
            
            const verifyRes = await axios.post(
              `${backendUrl}/api/user/verify-paypal-payment`,
              payload,
              { headers: { token } }
            );
            
            if (verifyRes.data && verifyRes.data.success) {
              onSuccess(details);
            } else {
              alert("Payment verification failed: " + (verifyRes.data?.message || "Unknown error"));
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            alert("Payment verification error: " + (err.response?.data?.message || err.message));
          }
        },
        onError: err => {
          alert("Payment failed!");
        }
      }).render("#paypal-button-container");
    }
    return () => {
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = "";
    };
  }, [amount, onSuccess, clientId, currency]);
  return <div id="paypal-button-container" />;
};

export default PayPalButton;

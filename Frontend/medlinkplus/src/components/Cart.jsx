import React, { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { AppContext } from '../context/AppContext';
import PayPalButton from './PayPalButton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [showPayPal, setShowPayPal] = useState(false);
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  // Restrict cart access to logged-in users only
  React.useEffect(() => {
    if (!token) {
      toast.info('Please login to access your cart');
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [token, navigate]);
  if (!token) return null;

  const handleProceedToCheckout = () => {
    if (!token) {
      toast.info('Please login to proceed to checkout');
      navigate('/login', { state: { from: '/medicines' } });
      return;
    }
    setShowPayPal(true);
  };

  const handlePaymentSuccess = async (details) => {
    try {
      // Create order in backend
      const orderData = {
        items: cart.map(item => ({
          medicineId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        totalAmount: cartTotal,
        paymentMethod: 'paypal',
        paymentId: details.id,
        shippingAddress: {
          // Add shipping address from user profile or form
          address: 'User Address', // Replace with actual address
          city: 'User City',
          state: 'User State',
          postalCode: '123456',
          country: 'User Country'
        }
      };

      // Create order
      const orderResponse = await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderResult = await orderResponse.json();
      
      // Update payment status
      await fetch(`${backendUrl}/api/orders/update-payment-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: orderResult.orderId,
          paymentId: details.id,
          status: 'completed'
        })
      });
      
      toast.success('Payment successful! Your order has been placed.');
      clearCart();
      setShowPayPal(false);
      
      // Optionally navigate to order confirmation page
      // navigate('/order-confirmation', { state: { orderId: orderResult.orderId } });
      
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order. Please contact support.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h2>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-gray-500">Start adding some medicines to your cart</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/medicines')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1c7856] hover:bg-[#156349] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c7856]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Cart ({cart.length} items)</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {cart.map((item) => (
            <div key={item._id} className="p-4 flex items-center border-b border-gray-100">
              <div className="flex-shrink-0 h-24 w-24 bg-white border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
                ) : (
                  <span className="text-gray-400 text-xs p-2 text-center">No Image</span>
                )}
              </div>
              
              <div className="ml-4 flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">{item.name}</h3>
                {item.brand && <p className="text-sm text-gray-600">{item.brand}</p>}
                {item.company && item.company !== item.brand && (
                  <p className="text-sm text-gray-500">{item.company}</p>
                )}
                <p className="text-base font-semibold text-[#1c7856] mt-1">
                  ₹{(() => {
                    const price = parseFloat(item.price);
                    return isNaN(price) ? '0.00' : price.toFixed(2);
                  })()}
                </p>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <span className="sr-only">Decrease quantity</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <span className="mx-2 text-gray-700">{item.quantity}</span>
                
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <span className="sr-only">Increase quantity</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <span className="sr-only">Remove</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
            <span className="text-sm text-gray-500">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{(isNaN(cartTotal) ? 0 : cartTotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-[#1c7856]">₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between">
            <button
              onClick={() => navigate('/medicines')}
              className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c7856] transition-colors"
            >
              Continue Shopping
            </button>
            
            {!showPayPal ? (
              <button
                onClick={handleProceedToCheckout}
                className="px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#1c7856] hover:bg-[#156349] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c7856] transition-colors"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="w-64">
                <PayPalButton
                  amount={cartTotal}
                  clientId={import.meta.env.VITE_REACT_APP_PAYPAL_CLIENT_ID || import.meta.env.REACT_APP_PAYPAL_CLIENT_ID || "AY1lMX0A6TrxMraoWCKaaFW7NCxTQJ0W-BSYBDCIcAPBMIl4pX7Wc18dLr8EH_04XbS3VBia_2ginmfa"}
                  onSuccess={handlePaymentSuccess}
                  onError={() => {
                    toast.error('Payment failed. Please try again.');
                    setShowPayPal(false);
                  }}
                />
                <button
                  onClick={() => setShowPayPal(false)}
                  className="mt-2 w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

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
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:4000';

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
      // Here you would typically send the order to your backend
      // await axios.post(`${backendUrl}/api/orders`, { items: cart, total: cartTotal }, { 
      //   headers: { 'Authorization': `Bearer ${token}` } 
      // });
      
      toast.success('Payment successful! Your order has been placed.');
      clearCart();
      setShowPayPal(false);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
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
            <div key={item._id} className="p-4 flex items-center">
              <div className="flex-shrink-0 h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.brand || item.company}</p>
                <p className="text-sm font-medium text-[#1c7856] mt-1">
                  ₹{item.price}
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
        
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between text-lg font-medium text-gray-900 mb-4">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => navigate('/medicines')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c7856]"
            >
              Continue Shopping
            </button>
            
            {!showPayPal ? (
              <button
                onClick={handleProceedToCheckout}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1c7856] hover:bg-[#156349] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c7856]"
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

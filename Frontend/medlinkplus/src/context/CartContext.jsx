import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('medicinesCart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('medicinesCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (medicine) => {
    setCart(prevCart => {
      // Check if medicine already in cart
      const existingItem = prevCart.find(item => item._id === medicine._id);
      
      if (existingItem) {
        // Update quantity if already in cart
        return prevCart.map(item =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Add new item to cart
      return [...prevCart, { ...medicine, quantity: 1 }];
    });
  };

  const removeFromCart = (medicineId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== medicineId));
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(medicineId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === medicineId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    console.log('Processing item:', {
      itemId: item._id,
      price: item.price,
      type: typeof item.price,
      quantity: item.quantity
    });
    
    // Handle different price formats (string with currency symbol, number, etc.)
    let price = item.price;
    if (price === undefined || price === null) {
      console.error('Price is undefined or null for item:', item);
      return total;
    }
    
    if (typeof price === 'string') {
      // Remove any non-numeric characters except decimal point and minus sign
      price = price.replace(/[^0-9.-]/g, '');
    }
    
    // Convert to number and ensure it's a valid number
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      console.error('Failed to parse price for item:', item, 'Parsed value:', price);
      return total;
    }
    
    const itemTotal = numericPrice * (item.quantity || 1);
    console.log('Item total:', itemTotal);
    return total + itemTotal;
  }, 0);
  
  console.log('Final cart total:', cartTotal);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

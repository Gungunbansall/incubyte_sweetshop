import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShoppingBag.css';

const API_URL = 'http://localhost:5001/api';

function ShoppingBag() {
  const [cartData, setCartData] = useState({ items: [], totalAmount: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    deliveryAddress: '',
    paymentMethod: 'cash'
  });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartData(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/cart/update/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadCart();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCart();
      showNotification('Item removed from cart');
    } catch (error) {
      showNotification('Failed to remove item');
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/orders/place`, orderDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Order placed successfully!');
      setShowCheckout(false);
      setOrderDetails({ deliveryAddress: '', paymentMethod: 'cash' });
      loadCart();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to place order');
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="shopping-bag-container">
      {notification && <div className="notification-toast">{notification}</div>}

      <div className="bag-header">
        <h1 className="bag-title">Cart</h1>
        <p className="bag-subtitle">{cartData.items.length} items in your cart</p>
      </div>

      {cartData.items.length === 0 ? (
        <div className="empty-bag">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious sweets to get started!</p>
        </div>
      ) : (
        <div className="bag-content">
          <div className="bag-items">
            {cartData.items.map(item => (
              <div key={item._id} className="bag-item">
                <div className="item-image-section">
                  {item.sweet.imageUrl ? (
                    <img src={item.sweet.imageUrl} alt={item.sweet.name} className="item-image" />
                  ) : (
                    <div className="item-placeholder">🍬</div>
                  )}
                </div>

                <div className="item-info">
                  <h3 className="item-name">{item.sweet.name}</h3>
                  <p className="item-category">{item.sweet.category}</p>
                  <p className="item-price">₹{item.sweet.price} each</p>
                </div>

                <div className="item-actions">
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">₹{item.sweet.price * item.quantity}</div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bag-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartData.totalAmount}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span>₹{cartData.totalAmount}</span>
            </div>

            {!showCheckout ? (
              <button
                className="checkout-btn"
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={placeOrder} className="checkout-form">
                <h3 className="checkout-title">Delivery Details</h3>
                
                <div className="form-group">
                  <label className="form-label">Delivery Address</label>
                  <textarea
                    value={orderDetails.deliveryAddress}
                    onChange={(e) => setOrderDetails({...orderDetails, deliveryAddress: e.target.value})}
                    className="form-textarea"
                    placeholder="Enter your complete address"
                    required
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    value={orderDetails.paymentMethod}
                    onChange={(e) => setOrderDetails({...orderDetails, paymentMethod: e.target.value})}
                    className="form-select"
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="card">Card Payment</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>

                <div className="checkout-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowCheckout(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="place-order-btn">
                    Place Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingBag;

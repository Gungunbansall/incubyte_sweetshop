import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PurchaseHistory.css';

const API_URL = 'http://localhost:5001/api';

function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Order cancelled successfully');
      loadOrders();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to cancel order');
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa500',
      processing: '#4a90e2',
      shipped: '#9b59b6',
      delivered: '#27ae60',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#a8a8a8';
  };

  return (
    <div className="purchase-history-container">
      {notification && <div className="notification-toast">{notification}</div>}

      <div className="history-header">
        <h1 className="history-title">Order History</h1>
        <p className="history-subtitle">Track your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-history">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Your order history will appear here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header-section">
                <div className="order-info-group">
                  <span className="order-label">Order ID</span>
                  <span className="order-id">{order._id.slice(-8)}</span>
                </div>
                <div className="order-info-group">
                  <span className="order-label">Date</span>
                  <span className="order-date">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="order-info-group">
                  <span className="order-label">Status</span>
                  <span 
                    className="order-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-items-section">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <span className="item-detail">{item.name}</span>
                    <span className="item-detail">Qty: {item.quantity}</span>
                    <span className="item-detail">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer-section">
                <div className="order-total-section">
                  <span className="total-label">Total Amount</span>
                  <span className="total-amount">₹{order.totalAmount}</span>
                </div>
                {order.status === 'pending' && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              <div className="order-delivery-info">
                <strong>Delivery Address:</strong> {order.deliveryAddress}
              </div>
              <div className="order-payment-info">
                <strong>Payment:</strong> {order.paymentMethod.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PurchaseHistory;

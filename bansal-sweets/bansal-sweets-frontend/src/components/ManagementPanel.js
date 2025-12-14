import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagementPanel.css';

const API_URL = 'http://localhost:5001/api';

function ManagementPanel() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/sweets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingProduct) {
        await axios.put(`${API_URL}/sweets/${editingProduct._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showNotification('Product updated successfully');
      } else {
        await axios.post(`${API_URL}/sweets`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showNotification('Product added successfully');
      }
      resetForm();
      loadProducts();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Operation failed');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/sweets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Product deleted successfully');
      loadProducts();
    } catch (error) {
      showNotification('Failed to delete product');
    }
  };

  const restockProduct = async (id) => {
    const quantity = prompt('Enter quantity to add:');
    if (!quantity || isNaN(quantity)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/sweets/${id}/restock`, 
        { quantity: parseInt(quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification('Stock updated successfully');
      loadProducts();
    } catch (error) {
      showNotification('Failed to update stock');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification('Order status updated');
      loadOrders();
    } catch (error) {
      showNotification('Failed to update status');
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      description: product.description || '',
      imageUrl: product.imageUrl || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      description: '',
      imageUrl: ''
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="management-container">
      {notification && <div className="notification-toast">{notification}</div>}

      <div className="management-header">
        <h1 className="management-title">Management Panel</h1>
        <p className="management-subtitle">Manage your store</p>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="products-section">
          <div className="section-header">
            <h2>Product Management</h2>
            <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Cancel' : '+ Add Product'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  className="form-input"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              <input
                type="text"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="form-input"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-textarea"
                rows="3"
              />
              <button type="submit" className="submit-btn">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          )}

          <div className="products-table">
            {products.map(product => (
              <div key={product._id} className="product-row">
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-meta">{product.category} | ₹{product.price}</p>
                  <p className="product-stock">Stock: {product.quantity}</p>
                </div>
                <div className="product-actions">
                  <button className="action-btn edit" onClick={() => editProduct(product)}>
                    Edit
                  </button>
                  <button className="action-btn restock" onClick={() => restockProduct(product._id)}>
                    Restock
                  </button>
                  <button className="action-btn delete" onClick={() => deleteProduct(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-section">
          <h2 className="section-title">Order Management</h2>
          <div className="orders-table">
            {orders.map(order => (
              <div key={order._id} className="order-row">
                <div className="order-details">
                  <div className="order-id-section">
                    <strong>Order #{order._id.slice(-8)}</strong>
                    <span className="order-date">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="order-customer">
                    Customer: {order.user?.username || 'N/A'}
                  </div>
                  <div className="order-items-list">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="order-item-tag">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                  <div className="order-amount">Total: ₹{order.totalAmount}</div>
                </div>
                <div className="order-status-section">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagementPanel;

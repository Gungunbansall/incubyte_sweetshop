import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StoreFront.css';

const API_URL = 'http://localhost:5001/api';

function StoreFront({ user }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadProducts();
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

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/cart/add`,
        { sweetId: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification('Added to cart!');
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to add item');
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="storefront-container">
      {notification && (
        <div className="notification-toast">{notification}</div>
      )}

      <div className="storefront-header">
        <h1 className="storefront-title">Our Collection</h1>
        <p className="storefront-subtitle">Discover authentic Indian sweets</p>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search sweets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-image-wrapper">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="product-image" />
              ) : (
                <div className="product-placeholder">🍬</div>
              )}
              {product.quantity === 0 && (
                <div className="out-of-stock-badge">Out of Stock</div>
              )}
            </div>

            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-category">{product.category}</p>
              {product.description && (
                <p className="product-description">{product.description}</p>
              )}
              
              <div className="product-footer">
                <div className="product-price">₹{product.price}</div>
                <div className="product-stock">Stock: {product.quantity}</div>
              </div>

              {user.role !== 'admin' && (
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product._id)}
                  disabled={product.quantity === 0}
                >
                  {product.quantity === 0 ? 'Unavailable' : 'Add to Cart'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <p>No products found</p>
        </div>
      )}
    </div>
  );
}

export default StoreFront;

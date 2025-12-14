import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import StoreFront from './components/StoreFront';
import ManagementPanel from './components/ManagementPanel';
import ShoppingBag from './components/ShoppingBag';
import PurchaseHistory from './components/PurchaseHistory';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [displayRegister, setDisplayRegister] = useState(false);
  const [activeSection, setActiveSection] = useState('store');

  useEffect(() => {
    const authToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (authToken && userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleUserLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.role === 'admin') {
      setActiveSection('management');
    } else {
      setActiveSection('store');
    }
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setActiveSection('store');
  };

  if (!currentUser) {
    return (
      <div className="app-wrapper">
        <div className="auth-section">
          <div className="brand-header">
            <h1 className="brand-title">Bansal Sweets</h1>
            <p className="brand-tagline">Premium Indian Delicacies</p>
          </div>
          {displayRegister ? (
            <div className="auth-content">
              <RegisterPage onRegister={handleUserLogin} />
              <p className="auth-switch">
                Already registered?{' '}
                <span onClick={() => setDisplayRegister(false)} className="switch-link">
                  Sign In
                </span>
              </p>
            </div>
          ) : (
            <div className="auth-content">
              <LoginPage onLogin={handleUserLogin} />
              <p className="auth-switch">
                New customer?{' '}
                <span onClick={() => setDisplayRegister(true)} className="switch-link">
                  Create Account
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <aside className="sidebar-nav">
        <div className="sidebar-header">
          <h2 className="sidebar-brand">Bansal Sweets</h2>
          <div className="user-profile">
            <div className="profile-avatar">{currentUser.username.charAt(0).toUpperCase()}</div>
            <div className="profile-info">
              <span className="profile-name">{currentUser.username}</span>
              {currentUser.role === 'admin' && <span className="profile-badge">Administrator</span>}
            </div>
          </div>
        </div>
        
        <nav className="sidebar-menu">
          {currentUser.role === 'admin' ? (
            <>
              <button 
                className={`menu-item ${activeSection === 'store' ? 'active' : ''}`}
                onClick={() => setActiveSection('store')}
              >
                <span className="menu-icon">🏪</span>
                <span className="menu-label">Store View</span>
              </button>
              <button 
                className={`menu-item ${activeSection === 'management' ? 'active' : ''}`}
                onClick={() => setActiveSection('management')}
              >
                <span className="menu-icon">⚙️</span>
                <span className="menu-label">Management</span>
              </button>
            </>
          ) : (
            <>
              <button 
                className={`menu-item ${activeSection === 'store' ? 'active' : ''}`}
                onClick={() => setActiveSection('store')}
              >
                <span className="menu-icon">🏪</span>
                <span className="menu-label">Browse Store</span>
              </button>
              <button 
                className={`menu-item ${activeSection === 'bag' ? 'active' : ''}`}
                onClick={() => setActiveSection('bag')}
              >
                <span className="menu-icon">🛍️</span>
                <span className="menu-label">Shopping Bag</span>
              </button>
              <button 
                className={`menu-item ${activeSection === 'history' ? 'active' : ''}`}
                onClick={() => setActiveSection('history')}
              >
                <span className="menu-icon">📋</span>
                <span className="menu-label">Order History</span>
              </button>
            </>
          )}
        </nav>

        <button onClick={handleUserLogout} className="logout-button">
          <span className="menu-icon">🚪</span>
          <span className="menu-label">Sign Out</span>
        </button>
      </aside>

      <main className="main-content">
        {currentUser.role === 'admin' ? (
          activeSection === 'management' ? <ManagementPanel /> : <StoreFront user={currentUser} />
        ) : (
          <>
            {activeSection === 'bag' && <ShoppingBag />}
            {activeSection === 'history' && <PurchaseHistory />}
            {activeSection === 'store' && <StoreFront user={currentUser} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;

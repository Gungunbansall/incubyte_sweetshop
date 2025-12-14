import React, { useState } from 'react';
import axios from 'axios';
import './AuthPages.css';

const API_URL = 'http://localhost:5001/api';

function LoginPage({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.user);
    } catch (error) {
      setErrorMsg(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="form-title">Welcome Back</h2>
      <p className="form-subtitle">Sign in to your account</p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your password"
            required
          />
        </div>

        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

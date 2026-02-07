import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '', // This is the email
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Send Email AND Password to Backend
      const result = await axios.post("http://localhost:8080/api/users/login", formData);

      // 2. The Backend now returns: { token: "...", user: {...} }
      const { token, user } = result.data;

      // 3. Save the Token to Browser Storage
      localStorage.setItem("jwtToken", token);

      // 4. Tell Axios to use this Token for ALL future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 5. Login successfully
      onLogin(user);
    } catch (err) {
      setError("Invalid Email or Password!");
      console.error(err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">🔐 Secure Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="username"
              className="form-control"
              placeholder="employee@test.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password..."
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <div className="mt-3 text-center text-muted">
          <small>Use the password you set during Registration.</small>
        </div>
      </div>
    </div>
  );
};

export default Login;
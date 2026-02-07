import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    role: 'ROLE_EMPLOYEE' // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/users/register", formData);
      alert("Registration Successful! Please Login.");
      onSwitchToLogin(); // Go back to login screen
    } catch (error) {
      alert("Registration failed. Email might already exist.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Create Account</h3>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" name="fullName" className="form-control" onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="username" className="form-control" onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select name="role" className="form-select" onChange={handleChange}>
              <option value="ROLE_EMPLOYEE">Employee</option>
              <option value="ROLE_MANAGER">Manager</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100">Sign Up</button>
        </form>

        <div className="mt-3 text-center">
          <button className="btn btn-link" onClick={onSwitchToLogin}>
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
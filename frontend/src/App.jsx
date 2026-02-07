import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyNavbar from './components/MyNavbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  // Check if user is already logged in when the app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    const savedToken = localStorage.getItem("jwtToken");

    if (savedUser && savedToken) {
      // Restore the User
      setUser(JSON.parse(savedUser));

      // Restore the Token so Axios can talk to the Backend
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    // Note: Token is already saved inside Login.jsx
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("jwtToken");

    // Clear the Token from Axios
    delete axios.defaults.headers.common['Authorization'];
  };

  if (user) {
    return (
      <div className="bg-light min-vh-100">
        <MyNavbar user={user} onLogout={handleLogout} />
        <Dashboard user={user} />
      </div>
    );
  }

  if (showRegister) {
    return <Register onSwitchToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
       <Login onLogin={handleLogin} />
       <div className="mt-3">
         <span>New user? </span>
         <button className="btn btn-link p-0" onClick={() => setShowRegister(true)}>
           Create an Account
         </button>
       </div>
    </div>
  );
}

export default App;
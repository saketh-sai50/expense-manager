import React from 'react';

// 1. Accept 'user' and 'onLogout' as tools (props)
const MyNavbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="#">💰 ExpenseManager</a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* Show the User's Name if they are logged in */}
            {user && (
                <li className="nav-item me-3 text-light">
                    <span className="badge bg-secondary">👤 {user.fullName}</span>
                </li>
            )}

            <li className="nav-item">
              <a className="nav-link active" href="#">Dashboard</a>
            </li>

            <li className="nav-item">
              {/* 2. Make the Button actually work! */}
              <button className="btn btn-danger btn-sm ms-2" onClick={onLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;
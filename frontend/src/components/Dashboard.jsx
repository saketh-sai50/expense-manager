import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddExpenseModal from './AddExpenseModal';
import ExpenseChart from './ExpenseChart'; // Import the Chart

const Dashboard = ({ user }) => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  const loadExpenses = async () => {
    try {
      let url = "";
      // Manager sees ALL expenses, Employee sees ONLY theirs
      if (user.role === "ROLE_MANAGER") {
        url = "http://localhost:8080/api/expenses";
      } else {
        url = `http://localhost:8080/api/expenses/user/${user.id}`;
      }

      const result = await axios.get(url);
      setExpenses(result.data);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  };

  // Function for Managers to Approve/Reject
  const handleStatusChange = async (expenseId, newStatus) => {
    try {
      // 1. Call Backend
      await axios.put(`http://localhost:8080/api/expenses/${expenseId}/${newStatus}`);

      // 2. Refresh Data to see the change
      loadExpenses();
      alert(`Expense marked as ${newStatus}`);
    } catch (error) {
      alert("Error updating status");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      {/* --- HEADER SECTION --- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
           {user.role === "ROLE_MANAGER" ? "👨‍💼 Manager Dashboard" : "👷 Employee Dashboard"}
        </h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Expense
        </button>
      </div>

      {/* --- ANALYTICS SECTION (Visible to Everyone) --- */}
      <div className="row mb-4">
          <div className="col-md-6">
              {/* The Pie Chart */}
              <ExpenseChart expenses={expenses} />
          </div>
          <div className="col-md-6">
               {/* The Total Amount Card */}
               <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center bg-light">
                  <div className="text-center">
                      <h3 className="text-success display-4">
                        {/* Calculate Total Sum */}
                        ₹{expenses.reduce((sum, item) => sum + item.amount, 0)}
                      </h3>
                      <p className="text-muted">
                        {user.role === "ROLE_MANAGER" ? "Total Company Expenses" : "My Total Expenses"}
                      </p>
                  </div>
               </div>
          </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="card shadow-sm">
        <div className="card-body">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Status</th>
                  {/* Show Employee Name only if Manager */}
                  {user.role === "ROLE_MANAGER" && <th>Employee</th>}
                  {/* Show Actions only if Manager */}
                  {user.role === "ROLE_MANAGER" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>#{expense.id}</td>
                      <td>{expense.description}</td>
                      <td className="fw-bold">₹{expense.amount}</td>
                      <td><span className="badge bg-secondary">{expense.category.name}</span></td>
                      <td>
                        <span className={`badge ${
                            expense.status === 'APPROVED' ? 'bg-success' :
                            expense.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'
                          }`}>
                          {expense.status}
                        </span>
                      </td>

                      {/* Employee Name Column (Manager Only) */}
                      {user.role === "ROLE_MANAGER" && (
                          <td className="text-muted small">
                            {expense.user ? expense.user.fullName : "Unknown"}
                          </td>
                      )}

                      {/* Action Buttons (Manager Only) */}
                      {user.role === "ROLE_MANAGER" && (
                        <td>
                          {expense.status === "PENDING" ? (
                            <>
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() => handleStatusChange(expense.id, "APPROVED")}>
                                ✅
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleStatusChange(expense.id, "REJECTED")}>
                                ❌
                              </button>
                            </>
                          ) : (
                            <span className="text-muted small">Done</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">No expenses found. Add one!</td>
                  </tr>
                )}
              </tbody>
            </table>
        </div>
      </div>

      {/* The Modal for Adding Expenses */}
      <AddExpenseModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshData={loadExpenses}
        user={user}
      />
    </div>
  );
};

export default Dashboard;
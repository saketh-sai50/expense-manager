import React, { useState } from 'react';
import axios from 'axios';

const AddExpenseModal = ({ show, handleClose, refreshData, user }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [file, setFile] = useState(null); // To store the image
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. We must use FormData to send files
      const formData = new FormData();
      formData.append('description', description);
      formData.append('amount', amount);
      formData.append('categoryName', category);
      formData.append('userId', user.id);

      if (file) {
        formData.append('receipt', file); // Attach the file
      }

      // 2. Send to Backend
      await axios.post('http://localhost:8080/api/expenses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Essential for files
        },
      });

      // 3. Success!
      alert('Expense Added Successfully!');
      refreshData();
      handleClose();

      // Cleanup
      setDescription('');
      setAmount('');
      setFile(null);
    } catch (error) {
      console.error(error);
      alert('Failed to save expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Expense</h5>
            <button className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Amount (₹)</label>
                <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Medical">Medical</option>
                </select>
              </div>

              {/* NEW: File Upload Input */}
              <div className="mb-3">
                <label className="form-label">Receipt Image (Optional)</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Uploading to AWS...' : 'Save Expense'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
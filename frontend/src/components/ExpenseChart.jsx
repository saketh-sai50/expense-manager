import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the chart tools
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  // 1. Calculate Totals by Category
  const categoryTotals = {};

  expenses.forEach(expense => {
    const categoryName = expense.category.name;
    const amount = expense.amount;

    if (categoryTotals[categoryName]) {
      categoryTotals[categoryName] += amount;
    } else {
      categoryTotals[categoryName] = amount;
    }
  });

  // 2. Prepare Data for Chart.js
  const data = {
    labels: Object.keys(categoryTotals), // e.g., ["Food", "Travel"]
    datasets: [
      {
        label: 'Total Expenses (₹)',
        data: Object.values(categoryTotals), // e.g., [500, 2000]
        backgroundColor: [
          '#FF6384', // Red
          '#36A2EB', // Blue
          '#FFCE56', // Yellow
          '#4BC0C0', // Teal
          '#9966FF', // Purple
          '#FF9F40', // Orange
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-white">
        <h5 className="mb-0">📊 Expense Analysis</h5>
      </div>
      <div className="card-body d-flex justify-content-center">
        <div style={{ width: '300px', height: '300px' }}>
            {expenses.length > 0 ? (
                <Pie data={data} />
            ) : (
                <p className="text-muted text-center mt-5">No data to display</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';

const Analytics = () => {
  const { transactions, getTransactions } = useContext(GlobalContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);

  const categoryTotals = transactions.reduce((acc, t) => {
    if (t.amount < 0) {
      const cat = t.category || 'Other';
      acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
    }
    return acc;
  }, {});

  const totalExpense = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="analytics-page">
      <div className="card" style={{ marginBottom: '14px' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Spending Analytics</h2>
        <p className="text-muted" style={{ margin: '8px 0 0' }}>
          Understand category-wise spending distribution with a glass insight board.
        </p>
      </div>

      <div className="analytics-grid">
        <div className="card main-chart">
          <h3 className="card-label">Category Breakdown</h3>
          {Object.entries(categoryTotals).length === 0 ? (
            <div className="no-data-placeholder">No expense data available yet.</div>
          ) : (
            <div className="transaction-list-raw">
              {Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amt]) => {
                  const percent = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
                  return (
                    <div key={cat} className="transaction-item" style={{ display: 'grid', gap: '8px' }}>
                      <div className="budget-info">
                        <span className="font-bold">{cat}</span>
                        <span className="text-primary">{percent}%</span>
                      </div>
                      <div className="progress-track-large">
                        <div className="progress-fill-large" style={{ width: `${Math.min(percent, 100)}%` }} />
                      </div>
                      <span className="text-muted text-sm">Rs {amt.toFixed(2)} spent</span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <div className="card side-chart">
          <h3 className="card-label">Summary</h3>
          <div className="stats-mini-grid">
            <div className="stat-item">
              <p className="text-muted text-sm" style={{ margin: 0 }}>Expense Categories</p>
              <p className="split-metric" style={{ margin: '6px 0 0' }}>{Object.keys(categoryTotals).length}</p>
            </div>
            <div className="stat-item">
              <p className="text-muted text-sm" style={{ margin: 0 }}>Total Spent</p>
              <p className="split-metric text-danger" style={{ margin: '6px 0 0' }}>Rs {totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

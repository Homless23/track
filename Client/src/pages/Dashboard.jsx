import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';

const Dashboard = () => {
  const { transactions, getTransactions, user } = useContext(GlobalContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);

  const amounts = transactions.map((t) => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0);
  const income = amounts.filter((item) => item > 0).reduce((acc, item) => acc + item, 0);
  const expense = amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) * -1;

  const recent = [...transactions].slice(0, 5);

  return (
    <div className="dashboard-wrapper">
      <div className="card" style={{ marginBottom: '18px' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Welcome back, {user?.name || 'User'} 👋</h2>
        <p className="text-muted" style={{ margin: '8px 0 0' }}>
          Track your finances with a clean glass dashboard and instant insights.
        </p>
      </div>

      <section className="stats-container-modern">
        <div className="stat-card primary-gradient">
          <p className="card-label" style={{ color: '#eff4ff' }}>Total Balance</p>
          <div className="main-metric">
            <span className="currency">Rs</span>
            <span className="number">{total.toFixed(2)}</span>
          </div>
          <p className="text-sm" style={{ margin: '10px 0 0', color: '#e7f6ff' }}>
            Real-time net worth based on all transactions.
          </p>
        </div>

        <div className="stats-split">
          <div className="stat-card">
            <p className="card-label">Income</p>
            <p className="split-metric text-success">+ Rs {income.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <p className="card-label">Expenses</p>
            <p className="split-metric text-danger">- Rs {expense.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <section className="dashboard-grid-premium">
        <div className="card main-chart">
          <h3 className="card-label">Cashflow Intelligence</h3>
          <div className="no-data-placeholder" style={{ minHeight: '280px', display: 'grid', placeItems: 'center' }}>
            Interactive trend visualization coming soon.
          </div>
        </div>

        <div className="card side-chart">
          <h3 className="card-label">Recent Activity</h3>
          {recent.length === 0 ? (
            <div className="no-data-placeholder">No recent activity.</div>
          ) : (
            <ul className="transaction-list-raw">
              {recent.map((t) => (
                <li className="transaction-item" key={t._id}>
                  <div className="t-info">
                    <strong>{t.text}</strong>
                    <span className="t-date">{new Date(t.createdAt).toLocaleString()}</span>
                  </div>
                  <div className={`t-amount-group ${t.amount < 0 ? 'text-danger' : 'text-success'}`}>
                    {t.amount < 0 ? '-' : '+'} Rs {Math.abs(t.amount).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';

const History = () => {
  const { transactions, getTransactions, deleteTransaction } = useContext(GlobalContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="transactions-page">
      <div className="card" style={{ marginBottom: '14px' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Transaction History</h2>
        <p className="text-muted" style={{ margin: '8px 0 0' }}>
          Your complete timeline presented in a clean glass ledger.
        </p>
      </div>

      <div className="card table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>{t.text}</td>
                <td><span className="badge">{t.category || 'General'}</span></td>
                <td className={t.amount < 0 ? 'text-danger font-bold' : 'text-success font-bold'}>
                  {t.amount < 0 ? '-' : '+'} Rs {Math.abs(t.amount).toFixed(2)}
                </td>
                <td>
                  <button className="btn-icon" onClick={() => deleteTransaction(t._id)} aria-label="Delete transaction">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;

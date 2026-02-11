import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';

const Notification = () => {
  const { alert, clearAlert } = useContext(GlobalContext);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => clearAlert(), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert, clearAlert]);

  if (!alert) return null;

  return (
    <div className="toast-container">
      <div className="toast-body">
        <span>{alert.type === 'success' ? '✅' : alert.type === 'warning' ? '⚠️' : '❌'}</span>
        <p className="toast-message">{alert.msg}</p>
      </div>
      <div className="toast-progress-bar" />
    </div>
  );
};

export default Notification;

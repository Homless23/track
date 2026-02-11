import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';

const Settings = () => {
  const { user, updateDetails, updatePassword, deleteAccount, logs, getLogs } = useContext(GlobalContext);
  const [details, setDetails] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    getLogs();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setDetails({ name: user?.name || '', email: user?.email || '' });
  }, [user]);

  const onDetailSubmit = (e) => {
    e.preventDefault();
    updateDetails(details);
  };

  const onPasswordSubmit = (e) => {
    e.preventDefault();
    updatePassword(passwords);
    setPasswords({ currentPassword: '', newPassword: '' });
  };

  return (
    <div className="settings-page">
      <div className="card" style={{ marginBottom: '14px' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Account Settings</h2>
        <p className="text-muted" style={{ margin: '8px 0 0' }}>Manage your profile, credentials, and security activity.</p>
      </div>

      <div className="settings-grid-premium">
        <div className="settings-main">
          <div className="card">
            <h3 className="card-label">Identity</h3>
            <form onSubmit={onDetailSubmit} className="settings-form premium-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-primary">Save Changes</button>
            </form>
          </div>

          <div className="card">
            <h3 className="card-label">Password & Security</h3>
            <form onSubmit={onPasswordSubmit} className="settings-form premium-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn-secondary">Update Password</button>
            </form>
          </div>

          <div className="card">
            <h3 className="card-label">Recent Security Activity</h3>
            <div className="log-list">
              {logs?.length ? logs.map((log) => (
                <div key={log._id} className="log-item">
                  <span className={`log-badge ${log.action.includes('FAILURE') ? 'fail' : 'pass'}`}>
                    {log.action.replace('_', ' ')}
                  </span>
                  <span className="log-date">{new Date(log.createdAt).toLocaleString()}</span>
                  <span className="log-ip text-muted">{log.ipAddress}</span>
                </div>
              )) : <div className="no-data-placeholder">No recent security logs.</div>}
            </div>
          </div>
        </div>

        <div className="settings-side">
          <div className="card danger-card">
            <h3 className="card-label text-danger">Danger Zone</h3>
            <p className="text-muted text-sm">This action permanently removes your profile and related financial records.</p>
            <button className="btn-danger-outline" onClick={() => window.confirm('Delete your account permanently?') && deleteAccount()}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

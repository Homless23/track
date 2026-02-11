import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user, toggleTheme } = useContext(GlobalContext);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '💸' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/budget', label: 'Budget', icon: '🎯' },
    { path: '/history', label: 'History', icon: '📝' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-flex">
          <div className="logo-icon">ET</div>
          <span className="logo-text">Expense<span className="text-primary">Pro</span></span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={onClose}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Switch Theme">
          {user?.theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
        <button onClick={logout} className="logout-btn-sidebar">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

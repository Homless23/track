import React, { useContext, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { GlobalContext } from '../context/GlobalState';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useContext(GlobalContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pageMeta = useMemo(() => {
    const map = {
      '/': { title: 'Dashboard', subtitle: 'Your financial overview at a glance' },
      '/transactions': { title: 'Transactions', subtitle: 'Track, search, and organize every movement' },
      '/analytics': { title: 'Analytics', subtitle: 'Insights into spending and category trends' },
      '/budget': { title: 'Budget', subtitle: 'Plan limits and stay within your goals' },
      '/history': { title: 'History', subtitle: 'Review your complete transaction timeline' },
      '/settings': { title: 'Settings', subtitle: 'Manage profile, security, and preferences' }
    };

    return map[location.pathname] || { title: 'Expense Tracker', subtitle: 'Smart finance control center' };
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <button
        className={`mobile-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-label="Close sidebar"
      />

      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button
              className="hamburger-btn"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
            >
              ☰
            </button>
            <div>
              <h1 className="page-title">{pageMeta.title}</h1>
              <p className="text-muted text-sm" style={{ margin: '2px 0 0' }}>{pageMeta.subtitle}</p>
            </div>
          </div>

          <div className="header-actions desktop-only">
            <div className="user-profile-pill">
              <div className="avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
              <span className="username">{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        <main className="content-scrollable">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

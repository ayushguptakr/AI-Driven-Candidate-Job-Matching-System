import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardShell = ({ title, subtitle, actions, navItems, children }) => {
  const location = useLocation();

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-brand">
          <div className="dashboard-sidebar-title">{title}</div>
          <div className="dashboard-sidebar-subtitle">{subtitle}</div>
        </div>

        <nav className="dashboard-nav">
          {navItems.map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(item.activePrefix || item.to);
            return (
              <Link key={item.to} to={item.to} className={`dashboard-nav-item ${active ? 'active' : ''}`}>
                <span className="dashboard-nav-icon">{item.icon}</span>
                <span className="dashboard-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="dashboard-topbar-text">
            <div className="dashboard-topbar-title">{title}</div>
            <div className="dashboard-topbar-subtitle">{subtitle}</div>
          </div>
          <div className="dashboard-topbar-actions">{actions}</div>
        </div>
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardShell;

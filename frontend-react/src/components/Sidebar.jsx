
import { NavLink } from "react-router-dom";

function Sidebar({ sidebarOpen, closeSidebar }) {
  const navigationItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      path: "/projects",
      label: "Projects",
      icon: "▣",
    },
    {
      path: "/tasks",
      label: "Tasks",
      icon: "✓",
    },
    {
      path: "/team",
      label: "Team",
      icon: "♟",
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: "▥",
    },
    {
      path: "/ai-assistant",
      label: "AI Assistant",
      icon: "✦",
    },
    {
      path: "/settings",
      label: "Settings",
      icon: "⚙",
    },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo">D</div>

          <div className="sidebar-brand-text">
            <h2>DevFlow X</h2>
            <p>AI Workspace</p>
          </div>
        </div>

        <button
          className="sidebar-close"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      {/* Navigation */}
      <div className="sidebar-content">
        <p className="sidebar-section-title">
          Workspace
        </p>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={closeSidebar}
            >
              <span className="sidebar-link-icon">
                {item.icon}
              </span>

              <span className="sidebar-link-label">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sidebar Bottom Section */}
      <div className="sidebar-bottom">
        <div className="sidebar-promo">
          <div className="sidebar-promo-icon">
            ✦
          </div>

          <h3>Build smarter</h3>

          <p>
            Organize your development workflow.
          </p>
        </div>

        <div className="sidebar-footer">
          <span className="footer-icon">✦</span>

          <div>
            <strong>DevFlow X</strong>
            <small>v1.0</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

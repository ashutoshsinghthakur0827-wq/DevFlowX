
import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, closeSidebar }) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "⌂",
    },
    {
      name: "Projects",
      path: "/projects",
      icon: "▣",
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: "✓",
    },
    {
      name: "Team",
      path: "/team",
      icon: "♟",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "▥",
    },
    {
      name: "AI Assistant",
      path: "/ai-assistant",
      icon: "✦",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙",
    },
  ];

  return (
    <>
      {/* Overlay */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        {/* Brand */}

        <div className="brand">
          <div className="brand-logo">D</div>

          <div>
            <h2>DevFlow X</h2>
            <p>AI Workspace</p>
          </div>
        </div>

        {/* Navigation */}

        <nav className="sidebar-navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span>✦</span>

            <h3>Build smarter</h3>

            <p>
              Organize your development workflow.
            </p>
          </div>

          <p className="sidebar-footer">
            DevFlow X v1.0
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

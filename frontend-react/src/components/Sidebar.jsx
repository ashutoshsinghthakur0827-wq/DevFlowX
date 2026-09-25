import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, closeSidebar }) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
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
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">D</div>

          <div>
            <h2>DevFlow X</h2>
            <p>AI Workspace</p>
          </div>
        </div>

        <nav className="sidebar-navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span>✦</span>
            <h3>Build smarter</h3>
            <p>Organize your development workflow.</p>
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
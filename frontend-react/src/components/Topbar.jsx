import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

function Topbar({ openSidebar }) {
  const location = useLocation();
  const { theme, setTheme } = useApp();

  const pageTitles = {
    "/": "Dashboard",
    "/projects": "Projects",
    "/tasks": "Tasks",
    "/team": "Team",
    "/analytics": "Analytics",
    "/ai-assistant": "AI Assistant",
    "/settings": "Settings",
  };

  const currentTitle = pageTitles[location.pathname] || "DevFlow X";

  function changeTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header className="topbar">
      {/* Left Section */}
      <div className="topbar-left">
        <button
          className="mobile-menu-button"
          onClick={openSidebar}
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          ☰
        </button>

        <div>
          <p className="breadcrumb">Workspace /</p>
          <h1>{currentTitle}</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="topbar-right">
        {/* Theme Button */}
        <button
          className="icon-button"
          onClick={changeTheme}
          title="Change theme"
          aria-label="Change theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Notification Button */}
        <button
          className="notification-button"
          title="Notifications"
          aria-label="Notifications"
        >
          🔔
          <span className="notification-dot"></span>
        </button>

        {/* User Profile */}
        <div className="user-profile">
          <div className="user-avatar">AS</div>

          <div className="user-details">
            <strong>Ashutosh Singh</strong>
            <small>Developer</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;

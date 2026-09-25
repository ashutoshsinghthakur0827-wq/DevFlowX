import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Tasks from "./pages/Tasks.jsx";
import Team from "./pages/Team.jsx";
import Analytics from "./pages/Analytics.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Open sidebar on mobile
  function openSidebar() {
    setSidebarOpen(true);
  }

  // Close sidebar
  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="app-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        closeSidebar={closeSidebar}
      />

      {/* Main Layout */}
      <div className="main-layout">
        {/* Topbar */}
        <Topbar openSidebar={openSidebar} />

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            {/* Default Route */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* Projects */}
            <Route
              path="/projects"
              element={<Projects />}
            />

            {/* Tasks */}
            <Route
              path="/tasks"
              element={<Tasks />}
            />

            {/* Team */}
            <Route
              path="/team"
              element={<Team />}
            />

            {/* Analytics */}
            <Route
              path="/analytics"
              element={<Analytics />}
            />

            {/* AI Assistant */}
            <Route
              path="/ai-assistant"
              element={<AIAssistant />}
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* Unknown Route */}
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

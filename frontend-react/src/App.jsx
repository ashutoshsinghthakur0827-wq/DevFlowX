
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AppProvider } from "./context/AppContext.jsx";

import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Tasks from "./pages/Tasks.jsx";
import Team from "./pages/Team.jsx";
import Analytics from "./pages/Analytics.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";
import Settings from "./pages/Settings.jsx";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        closeSidebar={closeSidebar}
      />

      {/* Main section */}
      <div className="main-layout">
        <Topbar openSidebar={openSidebar} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/projects"
              element={<Projects />}
            />

            <Route
              path="/tasks"
              element={<Tasks />}
            />

            <Route
              path="/team"
              element={<Team />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/ai-assistant"
              element={<AIAssistant />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

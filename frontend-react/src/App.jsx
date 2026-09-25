
import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useApp } from "./context/AppContext";
import API_URL from "./config/api";

// Layout Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

// Pages
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Team from "./pages/Team";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";
import RAGAssistant from "./pages/RAGAssistant";
import Settings from "./pages/Settings";

function App() {
  const { darkMode } = useApp();

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  // Backend state
  const [backendStatus, setBackendStatus] =
    useState("");

  const [checkingBackend, setCheckingBackend] =
    useState(false);

  // Close sidebar
  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  // Check backend
  async function checkBackend() {
    setCheckingBackend(true);
    setBackendStatus("");

    try {
      const healthURL = `${API_URL}/health`;

      console.log("Checking backend:", healthURL);

      const response = await fetch(healthURL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.detail ||
            data.error ||
            `Backend returned status ${response.status}`
        );
      }

      setBackendStatus(
        `Connected: ${
          data.message || "Backend is working"
        }`
      );
    } catch (error) {
      console.error(
        "Backend connection failed:",
        error
      );

      setBackendStatus(
        `Connection failed: ${error.message}`
      );
    } finally {
      setCheckingBackend(false);
    }
  }

  return (
    <div
      className={
        darkMode
          ? "app dark-theme"
          : "app light-theme"
      }
    >
      {/* Mobile Menu Button */}

      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open navigation menu"
      >
        ☰
      </button>

      {/* Sidebar */}

      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
      />

      {/* Main Area */}

      <div className="main-area">
        <Topbar />

        <main className="page-content">
          {/* Backend Test */}

          <div className="backend-test-container">
            <h3>Backend Connection</h3>

            <button
              type="button"
              onClick={checkBackend}
              disabled={checkingBackend}
            >
              {checkingBackend
                ? "Checking..."
                : "Check Backend"}
            </button>

            {backendStatus && (
              <p>{backendStatus}</p>
            )}
          </div>

          {/* Routes */}

          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

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
              path="/rag-assistant"
              element={<RAGAssistant />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

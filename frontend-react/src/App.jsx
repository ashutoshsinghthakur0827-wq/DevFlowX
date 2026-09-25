
import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useApp } from "./context/AppContext";
import API_URL from "./config/api";

// ==================================================
// LAYOUT COMPONENTS
// ==================================================

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

// ==================================================
// PAGES
// ==================================================

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Team from "./pages/Team";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";
import RAGAssistant from "./pages/RAGAssistant";
import Settings from "./pages/Settings";

// ==================================================
// APP COMPONENT
// ==================================================

function App() {
  const { darkMode } = useApp();

  const [backendStatus, setBackendStatus] =
    useState("");

  const [checkingBackend, setCheckingBackend] =
    useState(false);

  // ==================================================
  // CHECK EXPRESS BACKEND
  // ==================================================

  async function checkBackend() {
    setCheckingBackend(true);
    setBackendStatus("");

    try {
      // General Express backend health endpoint
      const healthURL = `${API_URL}/health`;

      console.log(
        "Checking backend:",
        healthURL
      );

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

      console.log(
        "Backend connected:",
        data
      );

      setBackendStatus(
        `Connected: ${
          data.message ||
          "Backend is working"
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

  // ==================================================
  // RETURN UI
  // ==================================================

  return (
    <div
      className={
        darkMode
          ? "app dark-theme"
          : "app light-theme"
      }
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="main-area">
        {/* Top Navigation */}
        <Topbar />

        {/* Main Content */}
        <main className="page-content">
          {/* Backend Connection Test */}
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

          {/* Application Routes */}
          <Routes>
            {/* Default Route */}
            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
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

            {/* RAG Assistant */}
            <Route
              path="/rag-assistant"
              element={<RAGAssistant />}
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* Unknown Routes */}
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

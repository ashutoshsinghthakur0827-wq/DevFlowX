
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useApp } from "./context/AppContext";

// API URL
const API_URL = import.meta.env.VITE_API_URL;

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

  const [backendStatus, setBackendStatus] = useState("");
  const [checkingBackend, setCheckingBackend] = useState(false);

  async function checkBackend() {
    setCheckingBackend(true);
    setBackendStatus("");

    try {
      if (!API_URL) {
        throw new Error("VITE_API_URL is missing");
      }

      const healthURL = `${API_URL.replace(/\/$/, "")}/health`;

      const response = await fetch(healthURL);

      if (!response.ok) {
        throw new Error(
          `Backend returned status ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Backend connected:", data);

      setBackendStatus(
        `Connected: ${data.message}`
      );
    } catch (error) {
      console.error("Backend connection failed:", error);

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
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="page-content">
          {/* Backend Connection Test */}
          <div className="backend-test-container">
            <h3>Backend Connection</h3>

            <button
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

          <Routes>
            {/* Dashboard */}
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

            {/* Project Management */}
            <Route
              path="/projects"
              element={<Projects />}
            />

            {/* Task Management */}
            <Route
              path="/tasks"
              element={<Tasks />}
            />

            {/* Team Collaboration */}
            <Route
              path="/team"
              element={<Team />}
            />

            {/* Analytics and GitHub */}
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

            {/* Application Settings */}
            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* Unknown Route */}
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

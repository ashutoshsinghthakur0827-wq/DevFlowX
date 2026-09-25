import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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

  const [backendStatus, setBackendStatus] = useState("");
  const [checkingBackend, setCheckingBackend] = useState(false);

  async function checkBackend() {
    setCheckingBackend(true);
    setBackendStatus("");

    try {
      const healthURL = `${API_URL}/health`;

      console.log("Checking backend:", healthURL);

      const response = await fetch(healthURL);

      if (!response.ok) {
        throw new Error(
          `Backend returned status ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Backend connected:", data);

      setBackendStatus(
        `Connected: ${data.message || "Backend is working"}`
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

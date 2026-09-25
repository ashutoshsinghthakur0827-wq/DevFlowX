import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import { useApp } from "./context/AppContext";

const API_URL = import.meta.env.VITE_API_URL;

// Render URL
import RENDER_URL from "./config";

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

  useEffect(() => {
    async function checkBackend() {
      try {
        if (!API_URL) {
          throw new Error("VITE_API_URL is missing");
        }

        const response = await fetch(`${API_URL}/health`);

        if (!response.ok) {
          throw new Error(
            `Backend returned status ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Backend connected:", data);
      } catch (error) {
        console.error("Backend connection failed:", error);
      }
    }

    checkBackend();
  }, []);

  return (
    <div className={darkMode ? "app dark-theme" : "app light-theme"}>
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="page-content">
          {/* Your existing Routes code stays here */}
        </main>
      </div>
    </div>
  );
}

export default App;

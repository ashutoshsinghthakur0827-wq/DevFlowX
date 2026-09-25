
import { Routes, Route, Navigate } from "react-router-dom";

import { useApp } from "./context/AppContext";

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

  return (
    <div className={darkMode ? "app dark-theme" : "app light-theme"}>
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="page-content">
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<Dashboard />} />

            {/* Project Management */}
            <Route path="/projects" element={<Projects />} />

            {/* Task Management */}
            <Route path="/tasks" element={<Tasks />} />

            {/* Team Collaboration */}
            <Route path="/team" element={<Team />} />

            {/* Analytics and GitHub */}
            <Route path="/analytics" element={<Analytics />} />

            {/* AI Assistant */}
            <Route path="/ai-assistant" element={<AIAssistant />} />

            {/* RAG Assistant */}
            <Route path="/rag-assistant" element={<RAGAssistant />} />

            {/* Application Settings */}
            <Route path="/settings" element={<Settings />} />

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
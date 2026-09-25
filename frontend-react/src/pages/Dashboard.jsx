
import { useApp } from "../context/AppContext";

import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";
import TaskItem from "../components/TaskItem";
import BackendTest from "../components/BackendTest";

function Dashboard() {
  const {
    projects,
    tasks,
    completedTasks,
    pendingTasks,
    activeProjects,
    completedProjects
  } = useApp();

  // Show only the first 3 projects
  const recentProjects = projects.slice(0, 3);

  // Show only the first 5 tasks
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="page-container">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <p className="page-label">Overview</p>

          <h1>Dashboard</h1>

          <p className="page-description">
            Welcome back, Ashutosh! Here is your project overview.
          </p>
        </div>

        <div className="dashboard-date">
          <span>DevFlow X</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <StatCard
          title="Total Projects"
          value={projects.length}
          icon="📁"
        />

        <StatCard
          title="Active Projects"
          value={activeProjects}
          icon="🚀"
        />

        <StatCard
          title="Completed Projects"
          value={completedProjects}
          icon="✅"
        />

        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="📋"
        />
      </div>

      {/* Backend Connection Test */}
      <div className="dashboard-section">
        <BackendTest />
      </div>

      {/* Projects Section */}
      <div className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Recent Projects</h2>
            <p>Your latest projects</p>
          </div>
        </div>

        {recentProjects.length === 0 ? (
          <div className="empty-state">
            <h3>No projects found</h3>
            <p>Create your first project to get started.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {recentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Recent Tasks</h2>
            <p>Track your latest tasks</p>
          </div>
        </div>

        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>Create a task to see it here.</p>
          </div>
        ) : (
          <div className="tasks-list">
            {recentTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Summary */}
      <div className="dashboard-section">
        <div className="summary-card">
          <h2>Task Summary</h2>

          <div className="summary-row">
            <span>Completed Tasks</span>
            <strong>{completedTasks}</strong>
          </div>

          <div className="summary-row">
            <span>Pending Tasks</span>
            <strong>{pendingTasks}</strong>
          </div>

          <div className="summary-row">
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
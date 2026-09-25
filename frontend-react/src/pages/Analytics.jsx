
import { useMemo } from "react";
import { useApp } from "../context/AppContext";

function Analytics() {
  const { projects = [], tasks = [] } = useApp();

  const analytics = useMemo(() => {
    const totalProjects = projects.length;

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.completed === true
    ).length;

    const pendingTasks = totalTasks - completedTasks;

    const completionPercentage =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    const highPriorityTasks = tasks.filter(
      (task) => (task.priority || "Medium").toLowerCase() === "high"
    ).length;

    const mediumPriorityTasks = tasks.filter(
      (task) => (task.priority || "Medium").toLowerCase() === "medium"
    ).length;

    const lowPriorityTasks = tasks.filter(
      (task) => (task.priority || "Medium").toLowerCase() === "low"
    ).length;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionPercentage,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
    };
  }, [projects, tasks]);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h1>Analytics</h1>
          <p>Track your project and task performance.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Projects</span>
          <h2>{analytics.totalProjects}</h2>
          <p>All your projects</p>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Tasks</span>
          <h2>{analytics.totalTasks}</h2>
          <p>Created tasks</p>
        </div>

        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <h2>{analytics.completedTasks}</h2>
          <p>Finished tasks</p>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <h2>{analytics.pendingTasks}</h2>
          <p>Tasks remaining</p>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="analytics-card">
          <h2>Task Completion</h2>

          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${analytics.completionPercentage}%`,
              }}
            ></div>
          </div>

          <h3>{analytics.completionPercentage}%</h3>

          <p>
            {analytics.completedTasks} of {analytics.totalTasks} tasks
            completed.
          </p>
        </section>

        <section className="analytics-card">
          <h2>Task Priority</h2>

          <div className="priority-row">
            <span>High Priority</span>
            <strong>{analytics.highPriorityTasks}</strong>
          </div>

          <div className="priority-row">
            <span>Medium Priority</span>
            <strong>{analytics.mediumPriorityTasks}</strong>
          </div>

          <div className="priority-row">
            <span>Low Priority</span>
            <strong>{analytics.lowPriorityTasks}</strong>
          </div>
        </section>
      </div>

      <section className="analytics-card">
        <h2>Project Summary</h2>

        {projects.length === 0 ? (
          <p>No projects available.</p>
        ) : (
          <div className="project-summary-list">
            {projects.map((project) => {
              const projectTasks = tasks.filter(
                (task) =>
                  task.project === project.name ||
                  task.projectId === project.id
              );

              const completedProjectTasks = projectTasks.filter(
                (task) => task.completed === true
              ).length;

              const projectPercentage =
                projectTasks.length === 0
                  ? 0
                  : Math.round(
                      (completedProjectTasks / projectTasks.length) * 100
                    );

              return (
                <div
                  className="project-summary-item"
                  key={project.id}
                >
                  <div>
                    <h3>{project.name || "Unnamed Project"}</h3>

                    <p>
                      {completedProjectTasks} of {projectTasks.length} tasks
                      completed
                    </p>
                  </div>

                  <strong>{projectPercentage}%</strong>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Analytics;
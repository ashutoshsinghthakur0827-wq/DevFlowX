import { useApp } from "../context/AppContext";

function ProjectCard({ project }) {
  const { deleteProject } = useApp();

  return (
    <div className="project-card">
      <div className="project-card-header">
        <span className="project-symbol">◈</span>

        <button
          className="small-delete-button"
          onClick={() => deleteProject(project.id)}
        >
          Delete
        </button>
      </div>

      <h3>{project.name}</h3>
      <p>{project.description}</p>

      <span className="technology-badge">
        {project.technology}
      </span>

      <div className="project-status-row">
        <span>{project.status}</span>
        <strong>{project.progress}%</strong>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${project.progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProjectCard;
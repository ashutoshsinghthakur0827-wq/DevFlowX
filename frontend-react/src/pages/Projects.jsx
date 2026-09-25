import { useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { useApp } from "../context/AppContext";

function Projects() {
  const { projects, addProject } = useApp();

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    technology: "React",
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a project name.");
      return;
    }

    addProject(formData);

    setFormData({
      name: "",
      description: "",
      status: "Planning",
      technology: "React",
    });

    setShowForm(false);
  }

  return (
    <div className="page-container">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">WORKSPACE</span>
          <h2>My Projects</h2>
          <p>Create and manage your development projects.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Project"}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Create New Project</h2>

          <label>Project Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter project name"
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter project description"
          ></textarea>

          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Planning</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <label>Technology</label>
          <input
            name="technology"
            value={formData.technology}
            onChange={handleChange}
            placeholder="React, MERN, AI"
          />

          <button className="primary-button" type="submit">
            Save Project
          </button>
        </form>
      )}

      <section className="project-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </section>
    </div>
  );
}

export default Projects;
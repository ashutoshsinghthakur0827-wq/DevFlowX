import { useState } from "react";
import TaskItem from "../components/TaskItem";
import { useApp } from "../context/AppContext";

function Tasks() {
  const { tasks, projects, addTask } = useApp();

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    project: "",
    priority: "Medium",
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    addTask(formData);

    setFormData({
      title: "",
      project: "",
      priority: "Medium",
    });

    setShowForm(false);
  }

  return (
    <div className="page-container">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">WORK MANAGEMENT</span>
          <h2>Tasks</h2>
          <p>Track your daily development activities.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Task"}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Create New Task</h2>

          <label>Task Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
          />

          <label>Project</label>
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
          >
            <option value="">Select project</option>

            {projects.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>

          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button className="primary-button" type="submit">
            Save Task
          </button>
        </form>
      )}

      <section className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            No tasks available. Create your first task.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </section>
    </div>
  );
}

export default Tasks;
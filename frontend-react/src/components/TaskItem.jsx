import { useApp } from "../context/AppContext";

function TaskItem({ task }) {
  const { toggleTask, deleteTask } = useApp();

  // Default values if old task data is missing
  const taskPriority = task.priority || "Medium";
  const taskProject = task.project || "General Project";
  const taskTitle = task.title || "Untitled Task";

  return (
    <div
      className={`task-item ${
        task.completed ? "task-completed" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={Boolean(task.completed)}
        onChange={() => toggleTask(task.id)}
      />

      <div className="task-content">
        <h3>{taskTitle}</h3>
        <p>{taskProject}</p>
      </div>

      <span
        className={`priority ${taskPriority.toLowerCase()}`}
      >
        {taskPriority}
      </span>

      <button
        className="small-delete-button"
        onClick={() => deleteTask(task.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default TaskItem;
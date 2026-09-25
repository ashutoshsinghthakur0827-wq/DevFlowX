
const tasks = require("../data/tasks");

// GET all tasks
function getTasks(req, res) {
  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks: tasks
  });
}

// GET one task
function getTaskById(req, res) {
  const taskId = Number(req.params.id);

  const task = tasks.find(
    (item) => item.id === taskId
  );

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  res.status(200).json({
    success: true,
    task: task
  });
}

// CREATE task
function createTask(req, res) {
  const {
    title,
    project,
    priority
  } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Task title is required"
    });
  }

  const newTask = {
    id: Date.now(),
    title: title,
    project: project || "General Project",
    priority: priority || "Medium",
    completed: false
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task: newTask
  });
}

// UPDATE task
function updateTask(req, res) {
  const taskId = Number(req.params.id);

  const taskIndex = tasks.findIndex(
    (item) => item.id === taskId
  );

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const oldTask = tasks[taskIndex];

  const updatedTask = {
    ...oldTask,
    ...req.body,
    id: oldTask.id
  };

  tasks[taskIndex] = updatedTask;

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updatedTask
  });
}

// DELETE task
function deleteTask(req, res) {
  const taskId = Number(req.params.id);

  const taskIndex = tasks.findIndex(
    (item) => item.id === taskId
  );

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const deletedTask = tasks.splice(
    taskIndex,
    1
  );

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    task: deletedTask[0]
  });
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
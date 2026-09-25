const API_URL = "https://devflowx-zmlo.onrender.com/api";

// Get all projects
export async function getProjects() {
  const response = await fetch(
    `${API_URL}/projects`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

// Get all tasks
export async function getTasks() {
  const response = await fetch(
    `${API_URL}/tasks`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

// Create a project
export async function createProject(projectData) {
  const response = await fetch(
    `${API_URL}/projects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(projectData)
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
}

// Create a task
export async function createTask(taskData) {
  const response = await fetch(
    `${API_URL}/tasks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskData)
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

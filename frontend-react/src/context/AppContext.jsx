
import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AppContext = createContext();

// Custom Hook
export function useApp() {
  return useContext(AppContext);
}

// Context Provider
export function AppProvider({ children }) {
  // -----------------------------
  // Theme State
  // -----------------------------
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("devflow-theme") || "light";
  });

  // -----------------------------
  // Projects State
  // -----------------------------
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem("devflow-projects");

    const defaultProjects = [
      {
        id: 1,
        name: "AI Finance Platform",
        description: "AI-based financial research platform",
        status: "Active",
        progress: 65,
      },
      {
        id: 2,
        name: "Student Collaboration",
        description: "Platform for student teamwork",
        status: "Active",
        progress: 40,
      },
      {
        id: 3,
        name: "Portfolio Website",
        description: "Personal developer portfolio",
        status: "Completed",
        progress: 100,
      },
    ];

    return savedProjects
      ? JSON.parse(savedProjects)
      : defaultProjects;
  });

  // -----------------------------
  // Tasks State
  // -----------------------------
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("devflow-tasks");

    const defaultTasks = [
      {
        id: 1,
        title: "Create project documentation",
        project: "AI Finance Platform",
        priority: "High",
        completed: false,
      },
      {
        id: 2,
        title: "Design dashboard components",
        project: "Student Collaboration",
        priority: "Medium",
        completed: true,
      },
      {
        id: 3,
        title: "Test API integration",
        project: "AI Finance Platform",
        priority: "High",
        completed: false,
      },
    ];

    const loadedTasks = savedTasks
      ? JSON.parse(savedTasks)
      : defaultTasks;

    // Repair old or incomplete task data
    return loadedTasks.map((task) => ({
      ...task,
      id: task.id || Date.now(),
      title: task.title || "Untitled Task",
      project: task.project || "General Project",
      priority: task.priority || "Medium",
      completed: Boolean(task.completed),
    }));
  });

  // -----------------------------
  // Save Theme in Local Storage
  // -----------------------------
  useEffect(() => {
    localStorage.setItem("devflow-theme", theme);

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  // -----------------------------
  // Save Projects in Local Storage
  // -----------------------------
  useEffect(() => {
    localStorage.setItem(
      "devflow-projects",
      JSON.stringify(projects)
    );
  }, [projects]);

  // -----------------------------
  // Save Tasks in Local Storage
  // -----------------------------
  useEffect(() => {
    localStorage.setItem(
      "devflow-tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  // -----------------------------
  // Toggle Theme
  // -----------------------------
  function toggleTheme() {
    setTheme((previousTheme) =>
      previousTheme === "light" ? "dark" : "light"
    );
  }

  // -----------------------------
  // Add Project
  // -----------------------------
  function addProject(project) {
    const newProject = {
      id: Date.now(),
      name: project.name || "Untitled Project",
      description:
        project.description || "No description available",
      status: project.status || "Active",
      progress: Number(project.progress) || 0,
    };

    setProjects((previousProjects) => [
      ...previousProjects,
      newProject,
    ]);
  }

  // -----------------------------
  // Delete Project
  // -----------------------------
  function deleteProject(projectId) {
    setProjects((previousProjects) =>
      previousProjects.filter(
        (project) => project.id !== projectId
      )
    );
  }

  // -----------------------------
  // Add Task
  // -----------------------------
  function addTask(task) {
    const newTask = {
      id: Date.now(),
      title: task.title || "Untitled Task",
      project: task.project || "General Project",
      priority: task.priority || "Medium",
      completed: false,
    };

    setTasks((previousTasks) => [
      ...previousTasks,
      newTask,
    ]);
  }

  // -----------------------------
  // Toggle Task Completion
  // -----------------------------
  function toggleTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !Boolean(task.completed),
            }
          : task
      )
    );
  }

  // -----------------------------
  // Delete Task
  // -----------------------------
  function deleteTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.filter(
        (task) => task.id !== taskId
      )
    );
  }

  // -----------------------------
  // Calculated Values
  // -----------------------------
  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const activeProjects = projects.filter(
    (project) => project.status === "Active"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  // -----------------------------
  // Context Values
  // -----------------------------
  const contextValue = {
    theme,
    setTheme,
    toggleTheme,

    projects,
    setProjects,
    addProject,
    deleteProject,

    tasks,
    setTasks,
    addTask,
    toggleTask,
    deleteTask,

    completedTasks,
    pendingTasks,
    activeProjects,
    completedProjects,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
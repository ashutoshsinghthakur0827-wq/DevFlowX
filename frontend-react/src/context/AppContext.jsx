
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// =====================================================
// CREATE CONTEXT
// =====================================================

const AppContext = createContext();

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useApp() {
  return useContext(AppContext);
}

// =====================================================
// CONTEXT PROVIDER
// =====================================================

export function AppProvider({ children }) {
  // ===================================================
  // THEME STATE
  // ===================================================

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("devflow-theme") || "light";
  });

  // ===================================================
  // PROJECTS STATE
  // ===================================================

  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem(
      "devflow-projects"
    );

    const defaultProjects = [
      {
        id: 1,
        name: "AI Finance Platform",
        description:
          "AI-based financial research platform",
        status: "Active",
        progress: 65,
      },
      {
        id: 2,
        name: "Student Collaboration",
        description:
          "Platform for student teamwork",
        status: "Active",
        progress: 40,
      },
      {
        id: 3,
        name: "Portfolio Website",
        description:
          "Personal developer portfolio",
        status: "Completed",
        progress: 100,
      },
    ];

    if (savedProjects) {
      try {
        return JSON.parse(savedProjects);
      } catch (error) {
        console.error(
          "Error loading projects:",
          error
        );
      }
    }

    return defaultProjects;
  });

  // ===================================================
  // TASKS STATE
  // ===================================================

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(
      "devflow-tasks"
    );

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

    let loadedTasks = defaultTasks;

    if (savedTasks) {
      try {
        loadedTasks = JSON.parse(savedTasks);
      } catch (error) {
        console.error(
          "Error loading tasks:",
          error
        );
      }
    }

    if (!Array.isArray(loadedTasks)) {
      loadedTasks = defaultTasks;
    }

    // Repair old or incomplete task data
    return loadedTasks.map((task, index) => ({
      ...task,
      id: task.id || Date.now() + index,
      title: task.title || "Untitled Task",
      project:
        task.project || "General Project",
      priority: task.priority || "Medium",
      completed: Boolean(task.completed),
    }));
  });

  // ===================================================
  // APPLY AND SAVE THEME
  // ===================================================

  useEffect(() => {
    localStorage.setItem(
      "devflow-theme",
      theme
    );

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  // ===================================================
  // SAVE PROJECTS
  // ===================================================

  useEffect(() => {
    localStorage.setItem(
      "devflow-projects",
      JSON.stringify(projects)
    );
  }, [projects]);

  // ===================================================
  // SAVE TASKS
  // ===================================================

  useEffect(() => {
    localStorage.setItem(
      "devflow-tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  // ===================================================
  // TOGGLE THEME
  // ===================================================

  function toggleTheme() {
    setTheme((previousTheme) =>
      previousTheme === "light"
        ? "dark"
        : "light"
    );
  }

  // ===================================================
  // ADD PROJECT
  // ===================================================

  function addProject(project) {
    const newProject = {
      id: Date.now(),
      name: project.name || "Untitled Project",
      description:
        project.description ||
        "No description available",
      status: project.status || "Active",
      progress: Math.min(
        100,
        Math.max(0, Number(project.progress) || 0)
      ),
    };

    setProjects((previousProjects) => [
      ...previousProjects,
      newProject,
    ]);
  }

  // ===================================================
  // UPDATE PROJECT
  // ===================================================

  function updateProject(projectId, updatedData) {
    setProjects((previousProjects) =>
      previousProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              ...updatedData,
            }
          : project
      )
    );
  }

  // ===================================================
  // DELETE PROJECT
  // ===================================================

  function deleteProject(projectId) {
    setProjects((previousProjects) =>
      previousProjects.filter(
        (project) => project.id !== projectId
      )
    );
  }

  // ===================================================
  // ADD TASK
  // ===================================================

  function addTask(task) {
    const newTask = {
      id: Date.now(),
      title: task.title || "Untitled Task",
      project:
        task.project || "General Project",
      priority: task.priority || "Medium",
      completed: false,
    };

    setTasks((previousTasks) => [
      ...previousTasks,
      newTask,
    ]);
  }

  // ===================================================
  // UPDATE TASK
  // ===================================================

  function updateTask(taskId, updatedData) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updatedData,
            }
          : task
      )
    );
  }

  // ===================================================
  // TOGGLE TASK COMPLETION
  // ===================================================

  function toggleTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !Boolean(
                task.completed
              ),
            }
          : task
      )
    );
  }

  // ===================================================
  // DELETE TASK
  // ===================================================

  function deleteTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.filter(
        (task) => task.id !== taskId
      )
    );
  }

  // ===================================================
  // CALCULATED VALUES
  // ===================================================

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const totalTasks = tasks.length;

  const activeProjects = projects.filter(
    (project) => project.status === "Active"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const totalProjects = projects.length;

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const contextValue = {
    // Theme
    theme,
    setTheme,
    toggleTheme,

    // Projects
    projects,
    setProjects,
    addProject,
    updateProject,
    deleteProject,

    // Tasks
    tasks,
    setTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,

    // Statistics
    totalTasks,
    completedTasks,
    pendingTasks,

    totalProjects,
    activeProjects,
    completedProjects,
  };

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

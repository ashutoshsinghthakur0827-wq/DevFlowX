"use strict";

/* ================================
   STORAGE
================================ */

const STORAGE_KEYS = {
    theme: "devflowx-theme",
    projects: "devflowx-projects",
    tasks: "devflowx-tasks",
    activity: "devflowx-activity"
};

const defaultProjects = [
    {
        id: 1,
        name: "DevFlow X",
        description: "AI-powered software engineering workspace.",
        status: "In Progress"
    },
    {
        id: 2,
        name: "Verifex AI",
        description: "AI system for analyzing real and fake information.",
        status: "Planning"
    }
];

const defaultTasks = [
    {
        id: 1,
        title: "Create dashboard UI",
        projectId: 1,
        priority: "High",
        completed: true
    },
    {
        id: 2,
        title: "Design project management page",
        projectId: 1,
        priority: "Medium",
        completed: false
    },
    {
        id: 3,
        title: "Prepare AI assistant concept",
        projectId: 2,
        priority: "Medium",
        completed: false
    }
];

let projects = loadData(STORAGE_KEYS.projects, defaultProjects);
let tasks = loadData(STORAGE_KEYS.tasks, defaultTasks);

let activity = loadData(STORAGE_KEYS.activity, [
    "DevFlow X workspace initialized",
    "Dashboard loaded successfully"
]);

let currentTaskFilter = "all";

/* ================================
   HELPER FUNCTIONS
================================ */

function loadData(key, fallback) {
    const savedData = localStorage.getItem(key);

    if (!savedData) {
        return JSON.parse(JSON.stringify(fallback));
    }

    try {
        return JSON.parse(savedData);
    } catch (error) {
        return JSON.parse(JSON.stringify(fallback));
    }
}

function saveData() {
    localStorage.setItem(
        STORAGE_KEYS.projects,
        JSON.stringify(projects)
    );

    localStorage.setItem(
        STORAGE_KEYS.tasks,
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        STORAGE_KEYS.activity,
        JSON.stringify(activity)
    );
}

function createId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}

function addActivity(message) {
    activity.unshift(message);

    if (activity.length > 8) {
        activity = activity.slice(0, 8);
    }

    saveData();
    renderActivity();
}

function getProjectName(projectId) {
    const project = projects.find(function (item) {
        return item.id === Number(projectId);
    });

    return project ? project.name : "Unknown Project";
}

function getStatusClass(status) {
    if (status === "Completed") {
        return "success";
    }

    if (status === "In Progress") {
        return "info";
    }

    return "warning";
}

/* ================================
   THEME
================================ */

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem(STORAGE_KEYS.theme, theme);

    const themeButton = document.getElementById("themeButton");

    if (themeButton) {
        themeButton.textContent = theme === "dark" ? "☀" : "☾";
    }
}

function toggleTheme() {
    const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";

    const newTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(newTheme);
}

function initializeTheme() {
    const savedTheme =
        localStorage.getItem(STORAGE_KEYS.theme) || "light";

    applyTheme(savedTheme);
}

/* ================================
   PAGE NAVIGATION
================================ */

const pageTitles = {
    dashboard: "Dashboard",
    projects: "Projects",
    tasks: "Tasks",
    team: "Team",
    analytics: "Analytics",
    ai: "AI Assistant",
    settings: "Settings"
};

function showPage(pageName) {
    const pages = document.querySelectorAll(".page");
    const navigationButtons = document.querySelectorAll(".nav-item");

    pages.forEach(function (page) {
        page.classList.remove("active-page");
    });

    navigationButtons.forEach(function (button) {
        button.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageName + "-page");

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    const selectedButton = document.querySelector(
        '[data-page="' + pageName + '"]'
    );

    if (selectedButton) {
        selectedButton.classList.add("active");
    }

    document.getElementById("pageTitle").textContent =
        pageTitles[pageName] || "Dashboard";

    if (pageName === "analytics") {
        renderAnalytics();
    }

    if (pageName === "tasks") {
        renderTasks();
    }

    if (pageName === "projects") {
        renderProjects();
    }

    document.getElementById("sidebar").classList.remove("open");
}

/* ================================
   DASHBOARD STATISTICS
================================ */

function renderStatistics() {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const completionRate =
        totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

    document.getElementById("totalProjects").textContent = totalProjects;
    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("completedTasks").textContent = completedTasks;
    document.getElementById("completionRate").textContent =
        completionRate + "%";
}

/* ================================
   PROJECTS
================================ */

function renderProjects() {
    const allProjects = document.getElementById("allProjects");
    const recentProjects = document.getElementById("recentProjects");

    const searchInput = document.getElementById("projectSearch");

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filteredProjects = projects.filter(function (project) {
        return (
            project.name.toLowerCase().includes(searchText) ||
            project.description.toLowerCase().includes(searchText)
        );
    });

    allProjects.innerHTML = "";

    if (filteredProjects.length === 0) {
        allProjects.innerHTML = `
            <div class="content-card">
                <p class="muted">No projects found.</p>
            </div>
        `;
    }

    filteredProjects.forEach(function (project) {
        const projectCard = document.createElement("div");

        projectCard.className = "project-card";

        projectCard.innerHTML = `
            <div class="project-symbol">▣</div>

            <h3>${escapeHTML(project.name)}</h3>

            <p>${escapeHTML(project.description)}</p>

            <div class="project-card-footer">
                <span class="status-badge ${getStatusClass(project.status)}">
                    ${escapeHTML(project.status)}
                </span>

                <button class="delete-button"
                    onclick="deleteProject(${project.id})">
                    Delete
                </button>
            </div>
        `;

        allProjects.appendChild(projectCard);
    });

    recentProjects.innerHTML = "";

    projects.slice(0, 4).forEach(function (project) {
        const row = document.createElement("div");

        row.className = "project-row";

        row.innerHTML = `
            <div class="project-main">
                <div class="project-symbol">▣</div>

                <div>
                    <h4>${escapeHTML(project.name)}</h4>
                    <p>${escapeHTML(project.description)}</p>
                </div>
            </div>

            <span class="status-badge ${getStatusClass(project.status)}">
                ${escapeHTML(project.status)}
            </span>
        `;

        recentProjects.appendChild(row);
    });

    updateTaskProjectOptions();
}

function deleteProject(projectId) {
    const project = projects.find(function (item) {
        return item.id === projectId;
    });

    if (!project) {
        return;
    }

    const confirmed = confirm(
        "Delete project '" + project.name + "'?"
    );

    if (!confirmed) {
        return;
    }

    projects = projects.filter(function (item) {
        return item.id !== projectId;
    });

    tasks = tasks.filter(function (task) {
        return task.projectId !== projectId;
    });

    addActivity("Deleted project: " + project.name);

    saveData();
    renderAll();

    showToast("Project deleted successfully");
}

/* ================================
   TASKS
================================ */

function renderTasks() {
    const allTasks = document.getElementById("allTasks");
    const recentTasks = document.getElementById("recentTasks");

    let filteredTasks = tasks;

    if (currentTaskFilter === "pending") {
        filteredTasks = tasks.filter(function (task) {
            return !task.completed;
        });
    }

    if (currentTaskFilter === "completed") {
        filteredTasks = tasks.filter(function (task) {
            return task.completed;
        });
    }

    allTasks.innerHTML = "";
    recentTasks.innerHTML = "";

    if (filteredTasks.length === 0) {
        allTasks.innerHTML = `
            <div class="content-card">
                <p class="muted">No tasks available.</p>
            </div>
        `;
    }

    filteredTasks.forEach(function (task) {
        allTasks.appendChild(createTaskElement(task));
    });

    tasks.slice(0, 5).forEach(function (task) {
        recentTasks.appendChild(createTaskElement(task));
    });
}

function createTaskElement(task) {
    const row = document.createElement("div");

    row.className = "task-row";

    if (task.completed) {
        row.classList.add("task-completed");
    }

    row.innerHTML = `
        <div class="task-info">
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <div>
                <h4>${escapeHTML(task.title)}</h4>
                <small>${escapeHTML(getProjectName(task.projectId))}</small>
            </div>
        </div>

        <div>
            <span class="priority ${escapeHTML(task.priority)}">
                ${escapeHTML(task.priority)}
            </span>

            <button
                class="delete-button"
                onclick="deleteTask(${task.id})">
                ×
            </button>
        </div>
    `;

    return row;
}

function toggleTask(taskId) {
    const task = tasks.find(function (item) {
        return item.id === taskId;
    });

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    addActivity(
        task.completed
            ? "Completed task: " + task.title
            : "Reopened task: " + task.title
    );

    saveData();
    renderAll();
}

function deleteTask(taskId) {
    const task = tasks.find(function (item) {
        return item.id === taskId;
    });

    if (!task) {
        return;
    }

    tasks = tasks.filter(function (item) {
        return item.id !== taskId;
    });

    addActivity("Deleted task: " + task.title);

    saveData();
    renderAll();

    showToast("Task deleted successfully");
}

function updateTaskProjectOptions() {
    const taskProject = document.getElementById("taskProject");

    taskProject.innerHTML = "";

    projects.forEach(function (project) {
        const option = document.createElement("option");

        option.value = project.id;
        option.textContent = project.name;

        taskProject.appendChild(option);
    });
}

/* ================================
   ACTIVITY
================================ */

function renderActivity() {
    const activityList = document.getElementById("activityList");

    activityList.innerHTML = "";

    activity.slice(0, 5).forEach(function (message, index) {
        const row = document.createElement("div");

        row.className = "activity-row";

        row.innerHTML = `
            <div class="activity-dot"></div>

            <div>
                <p>${escapeHTML(message)}</p>
                <small>${index === 0 ? "Recently" : "Earlier"}</small>
            </div>
        `;

        activityList.appendChild(row);
    });
}

/* ================================
   ANALYTICS
================================ */

function renderAnalytics() {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pendingTasks = totalTasks - completedTasks;

    const percentage =
        totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

    document.getElementById("analyticsProjects").textContent =
        projects.length;

    document.getElementById("analyticsTasks").textContent =
        totalTasks;

    document.getElementById("analyticsCompleted").textContent =
        completedTasks;

    document.getElementById("analyticsPending").textContent =
        pendingTasks;

    document.getElementById("analyticsPercentage").textContent =
        percentage + "%";

    document.getElementById("analyticsCircle").style.background =
        "conic-gradient(var(--primary) " +
        percentage * 3.6 +
        "deg, var(--border) 0deg)";
}

/* ================================
   MODALS
================================ */

function openModal(modalId) {
    document.getElementById(modalId).classList.add("open");
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("open");
}

function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(function (modal) {
        modal.classList.remove("open");
    });
}

/* ================================
   AI DEMO
================================ */

function addChatMessage(message, type) {
    const aiChat = document.getElementById("aiChat");

    const chatMessage = document.createElement("div");

    chatMessage.className =
        "chat-message " +
        (type === "user" ? "user-message" : "assistant-message");

    chatMessage.textContent = message;

    aiChat.appendChild(chatMessage);

    aiChat.scrollTop = aiChat.scrollHeight;
}

function generateAIResponse(question) {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("project")) {
        return "Start by defining your project goal, dividing the work into small tasks, and completing one feature at a time.";
    }

    if (lowerQuestion.includes("task") || lowerQuestion.includes("plan")) {
        return "Create high-priority tasks first, estimate their difficulty, and review your progress at the end of each day.";
    }

    if (lowerQuestion.includes("ai")) {
        return "AI can help developers with code explanations, documentation, bug analysis, task planning, and intelligent project insights.";
    }

    return "This is a frontend AI demonstration. In a later part, we will connect a real FastAPI and LLM-based AI service.";
}

function sendAIMessage() {
    const aiInput = document.getElementById("aiInput");

    const question = aiInput.value.trim();

    if (!question) {
        showToast("Please enter a question");
        return;
    }

    addChatMessage(question, "user");

    const response = generateAIResponse(question);

    setTimeout(function () {
        addChatMessage(response, "assistant");
    }, 400);

    aiInput.value = "";
}

/* ================================
   SECURITY HELPER
================================ */

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ================================
   RENDER ALL
================================ */

function renderAll() {
    renderStatistics();
    renderProjects();
    renderTasks();
    renderActivity();
    renderAnalytics();
}

/* ================================
   EVENT LISTENERS
================================ */

document.addEventListener("DOMContentLoaded", function () {
    initializeTheme();
    renderAll();

    document.querySelectorAll(".nav-item").forEach(function (button) {
        button.addEventListener("click", function () {
            showPage(button.dataset.page);
        });
    });

    document.getElementById("themeButton").addEventListener(
        "click",
        toggleTheme
    );

    document.getElementById("settingsThemeButton").addEventListener(
        "click",
        toggleTheme
    );

    document.getElementById("menuButton").addEventListener(
        "click",
        function () {
            document.getElementById("sidebar").classList.toggle("open");
        }
    );

    document.getElementById("dashboardProjectButton").addEventListener(
        "click",
        function () {
            openModal("projectModal");
        }
    );

    document.getElementById("projectsAddButton").addEventListener(
        "click",
        function () {
            openModal("projectModal");
        }
    );

    document.getElementById("tasksAddButton").addEventListener(
        "click",
        function () {
            updateTaskProjectOptions();

            if (projects.length === 0) {
                showToast("Create a project first");
                return;
            }

            openModal("taskModal");
        }
    );

    document.querySelectorAll("[data-close]").forEach(function (button) {
        button.addEventListener("click", function () {
            closeModal(button.dataset.close);
        });
    });

    document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                overlay.classList.remove("open");
            }
        });
    });

    document.getElementById("projectSearch").addEventListener(
        "input",
        renderProjects
    );

    document.querySelectorAll(".filter-button").forEach(function (button) {
        button.addEventListener("click", function () {
            document.querySelectorAll(".filter-button").forEach(
                function (filterButton) {
                    filterButton.classList.remove("active");
                }
            );

            button.classList.add("active");

            currentTaskFilter = button.dataset.filter;

            renderTasks();
        });
    });

    document.getElementById("projectForm").addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const name = document.getElementById("projectName").value.trim();
            const description = document.getElementById(
                "projectDescription"
            ).value.trim();

            const status = document.getElementById("projectStatus").value;

            const newProject = {
                id: createId(),
                name: name,
                description: description,
                status: status
            };

            projects.unshift(newProject);

            saveData();

            addActivity("Created project: " + name);

            renderAll();

            event.target.reset();

            closeModal("projectModal");

            showToast("Project created successfully");
        }
    );

    document.getElementById("taskForm").addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const title = document.getElementById("taskTitle").value.trim();
            const projectId = Number(
                document.getElementById("taskProject").value
            );

            const priority = document.getElementById("taskPriority").value;

            const newTask = {
                id: createId(),
                title: title,
                projectId: projectId,
                priority: priority,
                completed: false
            };

            tasks.unshift(newTask);

            saveData();

            addActivity("Created task: " + title);

            renderAll();

            event.target.reset();

            closeModal("taskModal");

            showToast("Task created successfully");
        }
    );

    document.getElementById("aiSendButton").addEventListener(
        "click",
        sendAIMessage
    );

    document.getElementById("aiInput").addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Enter") {
                sendAIMessage();
            }
        }
    );

    document.querySelectorAll(".suggestion-button").forEach(
        function (button) {
            button.addEventListener("click", function () {
                const question = button.dataset.question;

                document.getElementById("aiInput").value = question;

                sendAIMessage();
            });
        }
    );

    document.getElementById("resetDataButton").addEventListener(
        "click",
        function () {
            const confirmed = confirm(
                "Are you sure you want to reset all demo data?"
            );

            if (!confirmed) {
                return;
            }

            projects = JSON.parse(JSON.stringify(defaultProjects));
            tasks = JSON.parse(JSON.stringify(defaultTasks));

            activity = [
                "Demo data has been reset"
            ];

            saveData();
            renderAll();

            showToast("Demo data reset successfully");
        }
    );

    document.getElementById("notificationButton").addEventListener(
        "click",
        function () {
            showToast("No new notifications");
        }
    );
});
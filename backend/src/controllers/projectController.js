
const projects = require("../data/projects");

// GET all projects
function getProjects(req, res) {
  res.status(200).json({
    success: true,
    count: projects.length,
    projects: projects
  });
}

// GET one project
function getProjectById(req, res) {
  const projectId = Number(req.params.id);

  const project = projects.find(
    (item) => item.id === projectId
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  res.status(200).json({
    success: true,
    project: project
  });
}

// CREATE project
function createProject(req, res) {
  const {
    name,
    description,
    status,
    progress,
    visibility,
    owner,
    teamMembers
  } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Project name is required"
    });
  }

  const newProject = {
    id: Date.now(),
    name: name,
    description: description || "No description",
    status: status || "Active",
    progress: Number(progress) || 0,
    visibility: visibility || "private",
    owner: owner || "Unknown User",
    teamMembers: Array.isArray(teamMembers)
      ? teamMembers
      : []
  };

  projects.push(newProject);

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    project: newProject
  });
}

// UPDATE project
function updateProject(req, res) {
  const projectId = Number(req.params.id);

  const projectIndex = projects.findIndex(
    (item) => item.id === projectId
  );

  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  const oldProject = projects[projectIndex];

  const updatedProject = {
    ...oldProject,
    ...req.body,
    id: oldProject.id
  };

  projects[projectIndex] = updatedProject;

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project: updatedProject
  });
}

// DELETE project
function deleteProject(req, res) {
  const projectId = Number(req.params.id);

  const projectIndex = projects.findIndex(
    (item) => item.id === projectId
  );

  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  const deletedProject = projects.splice(
    projectIndex,
    1
  );

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
    project: deletedProject[0]
  });
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
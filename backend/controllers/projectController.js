const Project = require("../models/Project");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      github,
      liveDemo,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      technologies,
      github,
      liveDemo,
      createdBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get My Projects
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      createdBy: req.user.id,
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Project deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
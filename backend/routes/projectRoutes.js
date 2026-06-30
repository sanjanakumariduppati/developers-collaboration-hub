const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createProject,
  getProjects,
  getMyProjects,
  deleteProject,
} = require("../controllers/projectController");

router.post("/", auth, createProject);

router.get("/", auth, getProjects);

router.get("/my-projects", auth, getMyProjects);

router.delete("/:id", auth, deleteProject);

module.exports = router;
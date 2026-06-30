const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getAllDevelopers,
  getDeveloperById,
} = require("../controllers/userController");

const auth = require("../middleware/auth");

// Get all developers
router.get("/", auth, getAllDevelopers);

// Logged-in user profile
router.get("/profile", auth, getProfile);

// Update logged-in user
router.put("/profile", auth, updateProfile);

// Get developer by ID (KEEP THIS LAST)
router.get("/:id", auth, getDeveloperById);

module.exports = router;
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getProfile,
  updateProfile,
  getAllDevelopers,
  getDeveloperById,
} = require("../controllers/userController");

// Get all developers
router.get("/", auth, getAllDevelopers);

// Get logged-in user's profile
router.get("/profile", auth, getProfile);

// Update logged-in user's profile
router.put("/profile", auth, updateProfile);

// Get developer by ID (KEEP THIS LAST)
router.get("/:id", auth, getDeveloperById);

module.exports = router;
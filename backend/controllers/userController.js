const User = require("../models/User");

// Get Logged-in User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Update Logged-in User Profile
const updateProfile = async (req, res) => {
  try {

    const {
      name,
      bio,
      skills,
      github,
      linkedin,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        bio,
        skills,
        github,
        linkedin,
      },
      {
        new: true,
      }
    ).select("-password");

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Developers
const getAllDevelopers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get Developer by ID
const getDeveloperById = async (req, res) => {
  try {
    const developer = await User.findById(req.params.id).select("-password");

    if (!developer) {
      return res.status(404).json({
        message: "Developer not found",
      });
    }

    res.json(developer);

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllDevelopers,
  getDeveloperById,
};
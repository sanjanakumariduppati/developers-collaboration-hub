const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  sendConnectionRequest,
} = require("../controllers/connectionController");

// Send connection request
router.post("/send/:id", auth, sendConnectionRequest);

module.exports = router;
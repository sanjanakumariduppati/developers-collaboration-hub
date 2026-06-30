const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  sendConnectionRequest,
  getPendingRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getMyConnections,
} = require("../controllers/connectionController");

// Send connection request
router.post("/send/:id", auth, sendConnectionRequest);
router.get("/pending", auth, getPendingRequests);
router.put("/accept/:id", auth, acceptConnectionRequest);

router.put("/reject/:id", auth, rejectConnectionRequest);
router.get("/my-connections", auth, getMyConnections);
module.exports = router;
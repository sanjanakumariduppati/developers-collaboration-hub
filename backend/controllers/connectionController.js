const Connection = require("../models/Connection");

// Send Connection Request
const sendConnectionRequest = async (req, res) => {
  try {
    const sender = req.user.id;
    const receiver = req.params.id;

    // Prevent sending request to yourself
    if (sender === receiver) {
      return res.status(400).json({
        message: "You cannot send a connection request to yourself.",
      });
    }

    // Check if a request already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({
        message: "Connection request already exists.",
      });
    }

    const connection = await Connection.create({
      sender,
      receiver,
    });

    res.status(201).json({
      message: "Connection request sent successfully.",
      connection,
    });

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
// Get Pending Connection Requests
const getPendingRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      receiver: req.user.id,
      status: "pending",
    }).populate("sender", "name email bio skills");

    res.json(requests);

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const acceptConnectionRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    connection.status = "accepted";

    await connection.save();

    res.json({
      message: "Connection accepted successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const rejectConnectionRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    connection.status = "rejected";

    await connection.save();

    res.json({
      message: "Connection rejected successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get My Connections (Accepted only)
const getMyConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const connections = await Connection.find({
      status: "accepted",
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    })
      .populate("sender", "name email bio skills")
      .populate("receiver", "name email bio skills");

    // Extract only the "other user"
    const formatted = connections.map((conn) => {
      if (conn.sender._id.toString() === userId) {
        return conn.receiver;
      } else {
        return conn.sender;
      }
    });

    res.json(formatted);

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  sendConnectionRequest,
  getPendingRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getMyConnections,
};
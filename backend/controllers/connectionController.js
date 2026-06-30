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

module.exports = {
  sendConnectionRequest,
};
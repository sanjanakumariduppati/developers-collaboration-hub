const Message = require("../models/Message");

// Save message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    const newMsg = new Message({
      sender: req.user.id,
      receiver: receiverId,
      message,
    });

    await newMsg.save();

    res.json(newMsg);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get chat between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
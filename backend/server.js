const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const messageRoutes = require("./routes/messageRoutes");
const projectRoutes = require("./routes/projectRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ---------------- SOCKET.IO ----------------
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 🟢 USER ONLINE
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);

    // broadcast online users list
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });

  // 💬 SEND MESSAGE
 // 💬 SEND MESSAGE
socket.on("sendMessage", ({ sender, receiver, message }) => {
  const receiverSocket = onlineUsers.get(receiver);

  if (receiverSocket) {
    io.to(receiverSocket).emit("receiveMessage", {
      sender,
      receiver,
      message,
    });
  }
});

  // ✍️ TYPING START
  socket.on("typing", ({ sender, receiver }) => {
    const receiverSocket = onlineUsers.get(receiver);

    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", { sender });
    }
  });

  // ✍️ TYPING STOP
  socket.on("stopTyping", ({ sender, receiver }) => {
    const receiverSocket = onlineUsers.get(receiver);

    if (receiverSocket) {
      io.to(receiverSocket).emit("stopTyping", { sender });
    }
  });

  // 🔴 DISCONNECT
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    // broadcast updated online users list
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    console.log("User disconnected:", socket.id);
  });
});

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/projects", projectRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Developers Collaboration Hub API Running...");
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
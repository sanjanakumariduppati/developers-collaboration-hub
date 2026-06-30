const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Developers Collaboration Hub API Running...");
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
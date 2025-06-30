require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const Message = require("./models/Message");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("send_message", async (data) => {
    const newMsg = new Message({
      username: data.username,
      text: data.text,
      timestamp: new Date()
    });

    await newMsg.save();
    io.emit("receive_message", newMsg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// API route
app.use("/api/messages", require("./routes/messages"));

// Health check
app.get("/", (req, res) => {
  res.send("✅ CodTech Chat Server is Running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

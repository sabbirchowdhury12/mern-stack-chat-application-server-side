const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const socket = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const userRoute = require("./routers/userRoute");
const messageRoute = require("./routers/messageRoute");
const jwt = require("jsonwebtoken");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://chat-app-sabbirchowdhury12.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// register route
app.use("/api/auth", userRoute);

// message route
app.use("/api/messages", messageRoute);

app.get("/", async (req, res) => {
  res.send("Home Page");
});

// JWT token route
app.post("/jwt", (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
  };

  try {
    const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Token generation failed" });
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => console.log(err));

// Start the server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on Port ${process.env.PORT || 5000}`);
});

// Socket.IO setup
global.onlineUsers = new Map();

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://chat-app-sabbirchowdhury12.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let users = {};

io.on("connection", (socket) => {
  // Add user to the online users map
  socket.on("add-user", (userId) => {
    users[userId] = socket.id;
  });

  // Handle sending messages
  socket.on("send-msg", (data) => {
    const receiverSocketId = users[data.to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("msg-recived", data.message);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

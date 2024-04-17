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
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(express.urlencoded({ extended: true }));

//register
app.use("/api/auth", userRoute);

//message
app.use("/api/messages", messageRoute);

app.get("/", async (req, res) => {
  res.send("Home Page");
});

// implement jwt----------------
app.use("/jwt", async (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
  };

  const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
    expiresIn: "1hr",
  });

  res.status(200).json({ token: token });
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    // console.log('succedd');
  })
  .catch((err) => console.log(err));

const server = app.listen(5000, () => {
  console.log(`Server running on Port ${process.env.port}`);
});

// const server = http.createServer(app);
// socket.io----------------

const io = socket(server, {
  cors: {
    origin: [
      "https://mern-stack-chat-app.netlify.app",
      "http://localhost:3000",
    ],
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    // console.log(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    // console.log('data', data);
    const sendUserSocket = onlineUsers.get(data.to);
    // console.log("sendUserSocket", sendUserSocket);
    if (sendUserSocket) {
      // console.log(data.message);
      socket.to(sendUserSocket).emit("msg-recived", data.message);
    }
  });
});

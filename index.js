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
app.use(cors());
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

global.onlineUsers = new Map();

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let users = {};

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);

  socket.on("add-user", (userId) => {
    users[userId] = socket.id;
    // console.log(`User added: ${userId}, Socket ID: ${socket.id}`);
  });

  // Handle sending messages
  socket.on("send-msg", (data) => {
    // console.log(`Message received from: ${data.from} to: ${data.to}`);
    // console.log(`Receiver's socket ID: ${users[data.to]}`);

    const receiverSocketId = users[data.to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("msg-recived", data.message);
      // console.log(`Message sent from: ${data.from} to: ${data.to}`);
    } else {
      // console.log(`Receiver's socket ID is undefined for user: ${data.to}`);
    }
  });

  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        // console.log(`User removed: ${userId}`);
        break;
      }
    }
  });
});

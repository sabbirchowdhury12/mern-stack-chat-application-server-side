const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const socket = require('socket.io');
const http = require("http");
const mongoose = require('mongoose');
const userRoute = require('./routers/userRoute');
const messageRoute = require('./routers/messageRoute');


// middleware 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//register
app.use('/api/auth', userRoute);

//message
app.use('/api/messages', messageRoute);

app.get('/', async (req, res) => {
    res.send('Home Page');
});

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    // console.log('succedd');
}).catch(err => console.log(err));


const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on Port ${process.env.port}`);
});



// const server = http.createServer(app);
// socket.io----------------

const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
        // methods: ['GET', 'POST'],
        // allowedHeaders: ["my-custom-header"],
    },
    // allowRequest: (req, callback) => {
    //     const noOriginHeader = req.headers.origin === undefined;
    //     callback(null, noOriginHeader);
    // }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        // console.log(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        console.log('data', data);
        const sendUserSocket = onlineUsers.get(data.to);
        console.log('sendUserSocket', sendUserSocket);
        if (sendUserSocket) {
            console.log(data.message);
            socket.to(sendUserSocket).emit("msg-recived", data.message);
        }
    });
})



const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const socket = require('socket.io');
const mongoose = require('mongoose');
const userRoute = require('./routers/userRoute');
const messageRoute = require('./routers/messageRoute');

// middleware 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));




//register
app.use('/api/auth', userRoute);
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

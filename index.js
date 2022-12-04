const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoute = require('./routers/userRoute');

// middleware 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));




//register
app.use("/api/auth", userRoute);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {

}).catch(err => console.log(err));


const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on Port ${process.env.port}`);
});

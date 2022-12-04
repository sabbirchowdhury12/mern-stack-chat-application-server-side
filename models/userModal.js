const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    isAvartarImageSet: {
        type: Boolean,
        default: false
    },
    avartarImage: {
        type: String,
        default: '',
    }
});

module.exports = mongoose.model("Users", userSchema);
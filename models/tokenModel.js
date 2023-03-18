const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },

    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
},
    {
        versionKey: false,
    });

module.exports = mongoose.model("Token", tokenSchema);
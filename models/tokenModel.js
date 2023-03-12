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
        expires: '2m'
    }
},
    {
        versionKey: false,
        timestamps: true
    });

module.exports = mongoose.model("Token", tokenSchema);
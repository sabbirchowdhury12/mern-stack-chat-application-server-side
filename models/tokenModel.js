const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    expireAt: {
      type: Date,
      default: () => Date.now() + 300000,
    },
  },
  {
    versionKey: false,
  }
);

tokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Token", tokenSchema);

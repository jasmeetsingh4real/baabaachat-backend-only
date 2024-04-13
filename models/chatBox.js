const mongoose = require("mongoose");
const User = require("./user");
const chatBoxSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Types.ObjectId,
      ref: User,
    },
  ],
  chat: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: User,
      },
      message: String,
      createdAt: { type: Date },
    },
    {
      timestamps: true,
    },
  ],
});

module.exports = mongoose.model("ChatBox", chatBoxSchema);

const mongoose = require("mongoose");
const chatRoomSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Types.ObjectId,
      ref: User,
    },
  ],
});
module.exports = mongoose.model("ChatRoom", chatRoomSchema);

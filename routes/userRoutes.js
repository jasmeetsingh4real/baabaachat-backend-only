const express = require("express");
const userRouter = express.Router();

const {
  addUser,
  getUsers,
  login,
  sendMessage,
  getMessages,
  getFriends,
  getChatBoxId,
} = require("../controllers/userController");

userRouter.post("/addUser", addUser);
userRouter.get("/getUsers", getUsers);
userRouter.post("/login", login);
userRouter.post("/sendMessage", sendMessage);
userRouter.get("/getMessages", getMessages);
userRouter.get("/getFriends", getFriends);
userRouter.get("/getChatBoxId", getChatBoxId);

module.exports = userRouter;

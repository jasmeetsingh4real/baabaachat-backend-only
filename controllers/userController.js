const mongoose = require("mongoose");
const User = require("../models/user");
const ChatBox = require("../models/chatBox");
//Create a new user
exports.addUser = async (req, res) => {
  if (!req.body.name) {
    res.status(500).send("invalid input");
    return;
  }
  const existingUser = await User.findOne({
    name: req.body.name,
  });
  if (existingUser) {
    res.status(500).send("Username already exists");
    return;
  }
  const user = new User(req.body);
  const savedUser = await user.save();
  if (!savedUser) {
    res.status(500).send("Could not add users");
    return;
  } else {
    res.status(200).send({ message: "User Added", savedUser });
  }
};

//get all users
exports.getUsers = async (req, res) => {
  const users = await User.find({});
  if (users) {
    // console.log(users);
    res.send(users);
  } else {
    res.send([]);
  }
};

//login user
exports.login = async (req, res) => {
  const user = await User.findOne({
    name: req.body.username,
  });
  if (user) {
    res.status(200).send({ messaage: "user exists", user });
  } else {
    res.status(404).send("Not found");
  }
};

exports.sendMessage = async (req, res) => {
  const filter = {
    $and: [
      {
        users: req.body.users[0],
      },
      {
        users: req.body.users[1],
      },
    ],
  };
  const existingChatBox = await ChatBox.findOne(filter);
  let chatArray = [req.body.chat];
  // console.log(req.body.chat);

  if (existingChatBox) {
    chatArray = [...chatArray, ...existingChatBox.chat];
    const response = await ChatBox.findOneAndUpdate(
      filter,
      {
        chat: chatArray,
      },
      {
        upsert: false,
      }
    );

    return res.status(200).send("message sent");
  }
  const newChatBox = new ChatBox({ users: req.body.users, chat: chatArray });
  await newChatBox.save();
  // console.log(newChatBox);
};

exports.getMessages = async (req, res) => {
  try {
    if (!req?.query?.users.length > 1) {
      return res.status(200).send([]);
    }
    let query = {
      $slice: 15,
    };
    if (req.query.firstMessageDate) {
      query = {
        $elemMatch: {
          createdAt: { $lt: req.query.firstMessageDate },
        },
        $slice: 15,
      };
    }
    const messages = await ChatBox.findOne(
      {
        $and: [
          {
            users: req?.query?.users[0],
          },
          {
            users: req?.query?.users[1],
          },
        ],
      },
      {
        chat: query,
      }
    ).populate("users");

    if (messages) {
      res.status(200).send(messages);
    } else {
      // res.status(404).send("messages not found");
    }
  } catch (error) {
    console.log(error);
  }
  // console.log(req.query.users[1]);
};

exports.getFriends = async (req, res) => {
  let id = req.query.id;
  if (!req.query.id) {
    return res.status(400).send("bad request");
  }
  const friends = await ChatBox.find({
    users: req.query.id,
  });
  if (!friends.length) {
    return res.status(404).send("not found");
  }
  const friendsIds = friends.map((f) => {
    if (f.users[0].toString() === id) {
      return f.users[1].toString();
    } else if (f.users[1].toString() === id) {
      return f.users[0].toString();
    }
  });
  const resultFriendsArray = await User.find({
    _id: {
      $in: friendsIds,
    },
  });
  return res.send(resultFriendsArray);
};

exports.getChatBoxId = async (req, res) => {
  try {
    console.log(req.query);
    if (!req?.query?.users) {
      return res.status(200).send([]);
    }
    const filter = {
      $and: [
        {
          users: req?.query?.users[0],
        },
        {
          users: req?.query?.users[1],
        },
      ],
    };

    let ChatBoxRes = await ChatBox.findOne(filter);

    if (!ChatBoxRes) {
      const newChatBox = new ChatBox({
        users: req.body.users,
        chat: [],
      });
      console.log("new chat box created!");
      ChatBoxRes = await newChatBox.save();
      console.log(res);
    }
    console.log("id  = ", ChatBoxRes._id);
    return res.status(200).send({ chatBoxId: ChatBoxRes._id });
  } catch (error) {
    console.log(error);
  }
};

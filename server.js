const app = require("./app");
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");

const { Server } = require("socket.io");
const http = require("http");

//setting up config file
dotenv.config({ path: "../backend/config/config.env" });

//connecting to database
connectDatabase();

// app.listen(process.env.PORT, () => {
//   console.log(
//     `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
//   );
// });

// ------------------------socket.io code--------------------->

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // front-end url
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);
  socket.on("join_chatBox", (chatBoxId) => {
    console.log("room joined by a user");
    socket.join(chatBoxId);
  });
  socket.on("send_message", (data) => {
    socket.to(data.chatBoxId).emit("recieve_message", data);
  });

  // socket.on("disconnectsocket", () => {
  //   socket.disconnect();
  //   console.log("disconnected");
  // });
});
server.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

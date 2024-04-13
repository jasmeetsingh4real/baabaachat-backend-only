const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const bodyParser = require("body-parser");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//enabling cross origin resource sharing
app.use(cors());

//user routes
app.use("/api/user", userRouter);

module.exports = app;

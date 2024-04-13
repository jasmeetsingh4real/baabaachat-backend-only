const { default: mongoose } = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.MONGODB_CONNECT_URI, {}).then((con) => {
    console.log(`MongoDb Database connected with HOST: ${con.connection.host}`);
  });
};

module.exports = connectDatabase;

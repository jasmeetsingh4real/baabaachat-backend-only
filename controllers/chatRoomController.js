import chatRoom from "../models/chatRoom";
//create a chat room and add two user to it who are involed in the convo
//use mongo uuid as chat room id
exports.createChatRoom = async (users) => {
  try {
    console.log(users);
  } catch (error) {
    console.log(error);
  }
};

/** @format */

const ChatLog = {
  collection: "chatlogs",

  saveChat: async (db, chatData) => {
    return db.collection(ChatLog.collection).insertOne(chatData);
  },

  getUserChats: async (db, userId) => {
    return db.collection(ChatLog.collection).find({ userId }).toArray();
  },
};

export default ChatLog;

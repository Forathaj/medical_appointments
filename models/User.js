/** @format */

const User = {
  collection: "users",
  createUser: async (db, userData) => {
    return db.collection(User.collection).insertOne(userData);
  },
  findUserByEmail: async (db, email) => {
    return db.collection(User.collection).findOne({ email });
  },
};

export default User; //  Default export

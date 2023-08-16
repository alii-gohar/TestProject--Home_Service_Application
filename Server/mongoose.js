const mongoose = require("mongoose");
const DbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL);
    if (connection) {
      console.log("DB connected Successfully");
      return true;
    } else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports = DbConnection;
const mongoose = require("mongoose");


const DbConnection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Db connection successful");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = DbConnection;

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();

const adminRoutes = require("./Routes/adminRoutes");
const passport = require("./PassportAuthentication");

//DB Connection
const DbConnection = require("./mongoose");

//initializing app
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

//Route Setup
app.use("/admin", adminRoutes);

//connecting DataBase
DbConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

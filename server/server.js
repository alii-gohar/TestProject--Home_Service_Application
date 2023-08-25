const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const passport = require("./PassportAuthentication");
//DB Connection
const DbConnection = require("./mongoose");
const router = require("./Routes");
//initializing app
const app = express();
const corsOption = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
};
app.use(cors(corsOption));
// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
    },
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
//Route Setup
app.use(router);
//connecting DataBase
const dbConnection = DbConnection();
if (dbConnection) {
  app.listen(process.env.PORT, () => {
    console.log(
      `Server is running on ${process.env.BASE_URL}`
    );
  });
} else console.log("Couldn't Start Server DB Connection Failed");

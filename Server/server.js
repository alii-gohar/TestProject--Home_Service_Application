const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const adminRoutes = require("./Routes/adminRoutes");
const userRoutes = require("./Routes/userRoutes");
const passport = require("./PassportAuthentication");
const sellerRoutes = require("./Routes/sellerRoutes");
const customerRoutes = require("./Routes/customerRoutes");

//DB Connection
const DbConnection = require("./mongoose");

//initializing app
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookieSecret: "mySecret",
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Route Setup
app.use("/admin", adminRoutes);
app.use("/", userRoutes);
app.use("/seller", sellerRoutes);
app.use("/customer",customerRoutes);

//connecting DataBase
DbConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

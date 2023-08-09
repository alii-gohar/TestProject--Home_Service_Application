const passport = require("../PassportAuthentication");
const validator = require("validator");
const User = require("../Models/userSchema");
const bcrypt = require("bcrypt");

const isUserAuthenticated = (req, res, next) => {
  passport.authenticate("user", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      next();
    });
  })(req, res, next);
};

const shouldSignUp = async (req, res, next) => {
  const { name, email, password, age, gender, role } = req.body;
  if (!validator.isEmail(email))
    return res.status(400).json({ error: "Enter a valid email" });
  if (!validator.isStrongPassword(password))
    return res.status(400).json({ error: "Enter a Strong Password" });
  if (!validator.isLength(name, 3, 100))
    return res.status(400).json({ error: "Enter a valid Name" });
  if (age < 1) return res.status(400).json({ error: "Enter a valid age" });

  const checkIfUserExist = await User.findOne({ email });

  if (checkIfUserExist)
    return res
      .status(400)
      .json({ error: "User Already Exist with this email" });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = new User({ name, email, password: hash, age, gender, role });
  req.user = user;
  next();
};

module.exports = { isUserAuthenticated, shouldSignUp };

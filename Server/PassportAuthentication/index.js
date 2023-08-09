const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../Models/userSchema");
const validator = require("validator");
const bcrypt = require("bcrypt");

// Admin authentication strategy
passport.use(
  "user",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        if (!validator.isEmail(email))
          return done(null, false, { message: "Enter a valid Email." });
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        } else {
          if (user?.verified == false) {
            return done(null, false, { message: "Verify your email first" });
          }
          const checkUser = await bcrypt.compare(password, user.password);
          if (!checkUser) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize and deserialize user data to maintain session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;

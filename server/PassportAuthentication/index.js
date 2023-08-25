const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const validator = require("validator");
const bcrypt = require("bcrypt");

const User = require("../Models/user");
const { currentTime } = require("../Utils/getTime");

const failedLoginAttempts = {}; // Object to track failed login attempts

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
          const userAttempts = failedLoginAttempts[user.email];
          if (!userAttempts) {
            failedLoginAttempts[user.email] = { attempts: 0, timer: null };
          }
          if (userAttempts.attempts >= 5) {
            const time = currentTime();
            console.log("this is variable currentTime", time);
            if (userAttempts.timer && time < userAttempts.timer) {
              const remainingTime = Math.ceil(
                (userAttempts.timer - time) / (60 * 1000)
              );
              return done(null, false, {
                message: `Too many failed attempts. Please try again after ${remainingTime} Minutes.`,
              });
            } else {
              // Reset failed attempts if timer has expired
              failedLoginAttempts[user.email] = { attempts: 0, timer: null };
            }
          }
          if (!user.verified) {
            return done(null, false, { message: "Verify your email first" });
          }
          const checkUser = await bcrypt.compare(password, user.password);
          if (!checkUser) {
            failedLoginAttempts[user.email].attempts++;
            if (failedLoginAttempts[user.email].attempts >= 5) {
              failedLoginAttempts[user.email].timer =
                currentTime() + 5 * 60 * 1000;
            }
            return done(null, false, { message: "Incorrect password." });
          }
          failedLoginAttempts[user.email] = { attempts: 0, timer: null };
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
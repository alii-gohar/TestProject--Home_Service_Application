const passport = require("../PassportAuthentication");

const isUserAuthenticated = (req, res, next) => {
  passport.authenticate("user", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { isUserAuthenticated };

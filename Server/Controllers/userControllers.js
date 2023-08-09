const Category = require("../Models/categorySchema");

const login = (req, res) => {
  return res.status(200).json({ admin: req.user });
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Error logging out." });
    } else {
      return res.status(200).json({ message: "Logout successful." });
    }
  });
};

module.exports = {
  login,
  logout,
};

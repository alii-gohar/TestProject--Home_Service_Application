const { sendVerificationEmail } = require("../EmailVerifier");
const User = require("../Models/userSchema");
const login = (req, res) => {
  return res.status(200).json({ user: req.user });
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
const signUp = async (req, res) => {
  try {
    if (req?.user) {
      const result = await req.user.save();
      if (result) {
        const link = `http://localhost:8000/confirm/${result._id}`;
        const isSent = await sendVerificationEmail(result.email, link);
        if (isSent)
          return res
            .status(200)
            .json({ message: "Email has been sent to you for verification" });
        else
          return res
            .status(400)
            .json({ error: "Something went wrong could not send email" });
      } else
        return res
          .status(400)
          .json({ error: "Something went wrong could not add Seller" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong couldn't SignUp" });
  }
};
const confirmVerification = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "User Updated Successfully", updatedUser });
  } catch (error) {
    return res.status(400).json({ error: "Couldn't update User" });
  }
};
module.exports = {
  login,
  logout,
  signUp,
  confirmVerification,
};

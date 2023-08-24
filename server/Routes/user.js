const router = require("express").Router();
const {
  isUserAuthenticated,
  shouldSignUp,
} = require("../Middleware/userAuthentication");
const { logout, login} = require("../Controllers/user");
const {
  signUp,
  confirmVerification,
} = require("../Controllers/user");
//routes definition
router.post("/signup", shouldSignUp, signUp);
router.post("/login", isUserAuthenticated, login);
router.get("/confirm/:id", confirmVerification);
router.get("/logout", logout);
//exporting router
module.exports = router;
const router = require("express").Router();
const {
  isUserAuthenticated,
  shouldSignUp,
} = require("../Middleware/userAuthentication");
const { logout, login} = require("../Controllers/userControllers");
const {
  signUp,
  confirmVerification,
} = require("../Controllers/userControllers");
//routes definition
router.post("/signup", shouldSignUp, signUp);
router.post("/login", isUserAuthenticated, login);
router.get("/confirm/:id", confirmVerification);
router.get("/logout", logout);
//exporting router
module.exports = router;
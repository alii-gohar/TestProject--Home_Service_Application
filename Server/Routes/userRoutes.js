const express = require("express");
const router = express.Router();
const { isUserAuthenticated ,shouldSignUp} = require("../Middleware/userAuthentication");


const { logout, login} = require("../Controllers/userControllers");

const {
  signUp,
  confirmVerification,
} = require("../Controllers/userControllers");

router.post("/signup", shouldSignUp, signUp);
router.get("/confirm/:id", confirmVerification);
router.post("/login", isUserAuthenticated, login);

router.get("/logout", logout);


module.exports = router;

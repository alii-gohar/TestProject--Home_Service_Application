const express = require("express");
const { isUserAuthenticated } = require("../Middleware/userAuthentication");

const { logout, login } = require("../Controllers/userControllers");

const {
  addCategory,
  deleteCategory,
  approvedService,
  rejectService,
  getServices,
} = require("../Controllers/adminControllers");

const router = express.Router();

router.get("/logout", logout);
router.get("/getServices/:status", getServices);

router.post("/addCategory", addCategory);
router.post("/login", isUserAuthenticated, login);

router.delete("/deleteCategory/:id", deleteCategory);

router.put("/approveService/:id", approvedService);
router.put("/rejectService/:id", rejectService);

module.exports = router;

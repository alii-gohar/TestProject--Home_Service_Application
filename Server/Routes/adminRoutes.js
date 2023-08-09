const express = require("express");

const {
  addCategory,
  deleteCategory,
  approveService,
  rejectService,
  getServices,
} = require("../Controllers/adminControllers");

const router = express.Router();

router.get("/getServices/:status", getServices);

router.post("/addCategory", addCategory);

router.delete("/deleteCategory/:id", deleteCategory);

router.put("/approveService/:id", approveService);
router.put("/rejectService/:id", rejectService);

module.exports = router;

const router = require("express").Router();
const {
  addCategory,
  deleteCategory,
  approveService,
  rejectService,
  getServices,
  getCategories,
} = require("../Controllers/adminControllers");
//routes definition
router.get("/getServices/:status", getServices);
router.get("/getCategories", getCategories);
router.post("/addCategory", addCategory);
router.delete("/deleteCategory/:id", deleteCategory);
router.put("/approveService/:id", approveService);
router.put("/rejectService/:id", rejectService);
//exporting router
module.exports = router;
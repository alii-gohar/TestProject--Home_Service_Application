const router = require("express").Router();
const {
  addCategory,
  deleteCategory,
  approveService,
  rejectService,
  getServices,
  getCategories,
} = require("../Controllers/admin");
//routes definition
router.get("/services/:status", getServices);
router.get("/categories", getCategories);
router.post("/category", addCategory);
router.delete("/category/:id", deleteCategory);
router.put("/approveService/:id", approveService);
router.put("/rejectService/:id", rejectService);
//exporting router
module.exports = router;
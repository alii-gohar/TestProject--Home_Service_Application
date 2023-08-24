const router = require("express").Router();
const {
  newService,
  services,
  updateService,
  serviceReviews,
  bookedServices,
  completeService,
} = require("../Controllers/seller");
//routes definition
router.post("/service", newService);
router.get("/services", services);
router.get("/serviceReviews/:id", serviceReviews);
router.get("/bookedServices/:status", bookedServices);
router.put("/completeService/:id", completeService);
router.put("/service/:id", updateService);
//exporting router
module.exports = router;  